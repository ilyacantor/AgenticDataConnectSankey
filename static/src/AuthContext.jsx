const AuthContext = React.createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [userRole, setUserRole] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [supabase, setSupabase] = React.useState(null);
  const [roleError, setRoleError] = React.useState(null);

  // Helper to persist role in localStorage
  const persistRole = (userId, role) => {
    if (userId && role) {
      localStorage.setItem(`user_role_${userId}`, role);
    }
  };

  const getPersistedRole = (userId) => {
    if (userId) {
      return localStorage.getItem(`user_role_${userId}`);
    }
    return null;
  };

  const clearPersistedRole = (userId) => {
    if (userId) {
      localStorage.removeItem(`user_role_${userId}`);
    }
  };

  React.useEffect(() => {
    async function initialize() {
      const client = await initializeSupabase();
      if (client) {
        setSupabase(client);
        
        // Get initial session
        const { data: { session } } = await client.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchUserRole(client, session.user.id);
        }

        // Listen for auth changes
        const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            setUser(session.user);
            await fetchUserRole(client, session.user.id);
          } else {
            setUser(null);
            setUserRole(null);
          }
        });

        setLoading(false);

        return () => subscription.unsubscribe();
      } else {
        // Supabase initialization failed - show error state
        console.error('Supabase failed to initialize. Check configuration.');
        setLoading(false);
      }
    }

    initialize();
  }, []);

  async function fetchUserRole(client, userId, retryCount = 0) {
    const MAX_RETRIES = 3;
    setRoleError(null);
    
    // Try to get persisted role first - use it while we fetch fresh data
    const persistedRole = getPersistedRole(userId);
    if (persistedRole) {
      setUserRole(persistedRole);
      // Continue fetching to update if needed
    }
    
    try {
      const { data, error } = await client
        .from('user_profiles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        // Check if it's a table not found error
        if (error.code === 'PGRST205' || (error.message && error.message.includes('user_profiles'))) {
          setRoleError('Table user_profiles not found. Database setup required.');
          return;
        }
        
        if (error.code === 'PGRST116') {
          // No profile found - wait for trigger to create it
          if (retryCount < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
            return fetchUserRole(client, userId, retryCount + 1);
          } else {
            // Profile creation failed - this is critical
            if (!persistedRole) {
              setRoleError('Unable to create user profile. Please contact support.');
              // Don't set any role - let ProtectedRoute handle this
            } else {
              setRoleError('Using cached role. Profile sync failed.');
            }
          }
        } else {
          console.error('Error fetching user role:', error);
          // Network/database error
          if (persistedRole) {
            setRoleError('Using cached role due to connection error.');
            // Persisted role already set above
          } else {
            setRoleError('Unable to load user role due to connection error. Please refresh.');
            // Don't set a role - force user to retry
          }
        }
      } else if (data) {
        setUserRole(data.role);
        persistRole(userId, data.role);
        setRoleError(null);
      }
    } catch (error) {
      console.error('Unexpected error fetching user role:', error);
      if (persistedRole) {
        setRoleError('Using cached role. Connection failed.');
        // Persisted role already set above
      } else {
        setRoleError('Connection error. Please refresh the page to retry.');
        // Don't set any role
      }
    }
  }

  async function signUp(email, password) {
    if (!supabase) return { error: { message: 'Supabase not initialized' } };
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data?.user) {
      setUser(data.user);
      await fetchUserRole(supabase, data.user.id);
    }

    return { data, error };
  }

  async function signIn(email, password) {
    if (!supabase) return { error: { message: 'Supabase not initialized' } };
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data?.user) {
      setUser(data.user);
      await fetchUserRole(supabase, data.user.id);
    }

    return { data, error };
  }

  async function signOut() {
    if (!supabase) return;
    
    if (user?.id) {
      clearPersistedRole(user.id);
    }
    
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
    setRoleError(null);
  }

  const value = {
    user,
    userRole,
    loading,
    roleError,
    signUp,
    signIn,
    signOut,
    supabase
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
