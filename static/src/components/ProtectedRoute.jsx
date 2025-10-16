function ProtectedRoute({ children, requireRole }) {
  const { user, userRole, loading, roleError, authEnabled } = useAuth();

  // If auth is disabled, always allow access
  if (!authEnabled) {
    return children;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    window.location.hash = '#/login';
    return null;
  }

  // If there's a role error and no role at all, show error state with retry
  if (roleError && !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="card max-w-md text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Unable to Load User Role</h2>
          <p className="text-slate-400 mb-4">{roleError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (requireRole && userRole !== requireRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="card max-w-md text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-slate-400">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-slate-500 mt-4">
            Required role: {requireRole} (You have: {userRole || 'none'})
          </p>
          <a 
            href="#/dcl" 
            className="mt-6 inline-block px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}
