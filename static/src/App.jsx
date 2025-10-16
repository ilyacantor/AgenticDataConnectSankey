function AppContent(){
  const [path, setPath] = React.useState(Router.current());
  const { user, loading } = useAuth();

  React.useEffect(()=>{
    const onHash = ()=> setPath(Router.current());
    window.addEventListener('hashchange', onHash);
    return ()=> window.removeEventListener('hashchange', onHash);
  },[]);

  // Redirect to login if not authenticated (except on login page)
  React.useEffect(() => {
    if (!loading && !user && path !== '/login') {
      window.location.hash = '#/login';
    }
  }, [user, loading, path]);

  // Show login page without protection
  if (path === '/login') {
    return <Login />;
  }

  // Show loading state
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

  let Page = null;
  switch(path){
    case '/':
    case '/dcl': Page = <ProtectedRoute><DCLDashboard/></ProtectedRoute>; break;
    case '/ontology': Page = <ProtectedRoute><OntologyMapping/></ProtectedRoute>; break;
    case '/uncertain': Page = <ProtectedRoute><UncertainUnifications/></ProtectedRoute>; break;
    case '/agents': Page = <ProtectedRoute><Agents/></ProtectedRoute>; break;
    case '/pipeline': Page = <ProtectedRoute><Pipeline/></ProtectedRoute>; break;
    case '/command': Page = <ProtectedRoute requireRole="admin"><CommandCenter/></ProtectedRoute>; break;
    case '/faq': Page = <ProtectedRoute><FAQ/></ProtectedRoute>; break;
    default: Page = <ProtectedRoute><DCLDashboard/></ProtectedRoute>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar/>
      <main className="flex-1">{Page}</main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

Router.mount(<App/>);
