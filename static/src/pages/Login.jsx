function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [showSetup, setShowSetup] = React.useState(false);
  const [setupInProgress, setSetupInProgress] = React.useState(false);
  const { signIn, signUp, roleError } = useAuth();

  // Show setup button if there's a role error about user_profiles
  React.useEffect(() => {
    if (roleError && roleError.includes('user_profiles')) {
      setShowSetup(true);
      setError('Database not set up. Click "Open Setup Guide" below.');
    }
  }, [roleError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          // Check if it's a table not found error
          if (error.message && error.message.includes('user_profiles')) {
            setShowSetup(true);
            setError('Database not set up. Click "Setup Database" button below.');
          } else {
            setError(error.message || 'Failed to sign up');
          }
        } else {
          window.location.hash = '#/dcl';
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message || 'Failed to sign in');
        } else {
          window.location.hash = '#/dcl';
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSetupDatabase = async () => {
    setSetupInProgress(true);
    setError('');
    
    try {
      const response = await fetch('/api/setup-database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowSetup(false);
        alert('✅ ' + data.message);
      } else {
        setError(data.error || 'Setup failed');
        if (data.suggestion) {
          setError(data.error + '\n\n' + data.suggestion);
        }
      }
    } catch (err) {
      setError('Failed to setup database: ' + err.message);
    } finally {
      setSetupInProgress(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/static/logo.png" alt="autonomOS" className="w-16 h-16 mx-auto mb-4" style={{filter: 'invert(69%) sepia(60%) saturate(3500%) hue-rotate(160deg) brightness(100%) contrast(101%)'}}/>
          <h1 className="text-3xl font-bold">
            autonom<span className="text-cyan-500">OS</span>
          </h1>
          <p className="text-slate-400 mt-2">Data Connection Layer</p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6">{isSignUp ? 'Create Account' : 'Sign In'}</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-700/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-cyan-500 hover:text-cyan-400 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </button>
          </div>
        </div>

        {!isSignUp && (
          <p className="text-center text-sm text-slate-500 mt-6">
            First time here? Click "Sign up" to create an account
          </p>
        )}

        {showSetup && (
          <div className="card mt-6 border-yellow-600/30 bg-yellow-900/10">
            <h3 className="text-lg font-semibold text-yellow-500 mb-3">Database Setup Required</h3>
            <p className="text-slate-400 text-sm mb-4">
              The authentication database needs to be set up. Follow the simple setup guide.
            </p>
            <a
              href="/database-setup.html"
              target="_blank"
              className="block w-full py-2.5 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors text-center"
            >
              🔧 Open Setup Guide
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
