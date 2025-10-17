function NavBar({onSearch}){
  const [devMode, setDevMode] = React.useState(true);
  const [authEnabled, setAuthEnabled] = React.useState(true);
  const { user, userRole, roleError, signOut } = useAuth ? useAuth() : { user: null, userRole: null, roleError: null, signOut: () => {} };

  const toggleDevMode = async () => {
    const res = await fetch('/toggle_dev_mode');
    const data = await res.json();
    setDevMode(data.dev_mode);
  };

  React.useEffect(() => {
    fetch('/state')
      .then(r => r.json())
      .then(d => {
        setDevMode(d.dev_mode);
        setAuthEnabled(d.auth_enabled);
      });
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.hash = '#/login';
  };

  const navItems = [
    { href:'#/dcl', label:'DCL' },
    { href:'#/connections', label:'Connections' },
    { href:'#/ontology', label:'Ontology' },
    { href:'#/uncertain', label:'Edge Cases' },
    { href:'#/agents', label:'Agents' },
    { href:'#/faq', label:'FAQ' },
  ];

  return (
    <div className="h-14 w-full border-b border-slate-800 bg-slate-900/70 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/static/logo.png" alt="autonomOS" className="w-7 h-7" style={{filter: 'invert(69%) sepia(60%) saturate(3500%) hue-rotate(160deg) brightness(100%) contrast(101%)'}}/>
            <a href="#/" className="text-lg font-semibold">autonom<span className="text-cyan-500">OS</span></a>
          </div>
          {(user || !authEnabled) && (
            <nav className="flex items-center gap-1">
              {navItems.map(item => (
                <a 
                  key={item.href}
                  href={item.href}
                  className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400">Prod Mode</span>
            <button 
              onClick={toggleDevMode}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${devMode ? 'bg-green-600' : 'bg-slate-600'}`}
            >
              <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${devMode ? 'translate-x-5' : 'translate-x-1'}`}/>
            </button>
            <span className="text-xs font-medium" style={{color: devMode ? '#10b981' : '#94a3b8'}}>
              {devMode ? 'ON' : 'OFF'}
            </span>
          </div>
          
          {authEnabled && user && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-xs">
                <div className="text-slate-300">{user.email}</div>
                {userRole && (
                  <div className={roleError ? "text-yellow-500" : "text-slate-500"} title={roleError || ''}>
                    {userRole}
                    {roleError && <span className="ml-1">⚠️</span>}
                  </div>
                )}
              </div>
              <button 
                onClick={handleSignOut}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 hover:bg-slate-700/50 rounded transition-colors"
                title="Sign out"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
