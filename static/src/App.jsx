function AppContent(){
  const [path, setPath] = React.useState(Router.current());
  const { user, loading, roleError, authEnabled } = useAuth();
  const [demoState, setDemoState] = React.useState({
    cursorPosition: { x: 0, y: 0 },
    annotationText: '',
    isRunning: false,
    slackAlert: null,
    titleCard: null,
    systemNotification: null,
    aiThinking: { visible: false, lines: [] },
    finOpsDashboard: { visible: false, showHubSpot: false, totalRevenue: '245M' }
  });

  React.useEffect(()=>{
    const onHash = ()=> setPath(Router.current());
    window.addEventListener('hashchange', onHash);
    return ()=> window.removeEventListener('hashchange', onHash);
  },[]);

  React.useEffect(() => {
    if (window.demoController) {
      const unsubscribe = window.demoController.subscribe(setDemoState);
      return unsubscribe;
    }
  }, []);

  React.useEffect(() => {
    const demoMode = sessionStorage.getItem('demoMode');
    if (demoMode && window.demoController) {
      // Engineer and Business demos start from connections, Autonomy starts from dashboard
      const shouldRun = (demoMode === 'autonomy' && path === '/dashboard') || 
                        ((demoMode === 'engineer' || demoMode === 'business') && path === '/connections');
      
      if (shouldRun) {
        // Wait longer for DOM to be fully ready
        setTimeout(() => {
          if (demoMode === 'engineer') {
            window.demoController.runEngineerDemo();
          } else if (demoMode === 'business') {
            window.demoController.runBusinessDemo();
          } else if (demoMode === 'autonomy') {
            window.demoController.runAutonomyDemo();
          }
          sessionStorage.removeItem('demoMode');
        }, 1500);
      }
    }
  }, [path]);

  // Redirect to login if not authenticated (except on login page) - only if auth is enabled
  React.useEffect(() => {
    if (authEnabled && !loading && !user && path !== '/login') {
      window.location.hash = '#/login';
    }
    // Also redirect to login if there's a role error (database not set up)
    if (authEnabled && !loading && user && roleError && roleError.includes('user_profiles') && path !== '/login') {
      window.location.hash = '#/login';
    }
  }, [user, loading, path, roleError, authEnabled]);

  // Show login page without protection (only if auth is enabled)
  if (authEnabled && path === '/login') {
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
  // Check for dynamic routes first
  if (path.startsWith('/connections/') && path.split('/').length === 3) {
    Page = <ProtectedRoute><ConnectionDetails/></ProtectedRoute>;
  } else {
    switch(path){
      case '/':
      case '/dcl': Page = <ProtectedRoute><DCLDashboard/></ProtectedRoute>; break;
      case '/demo': Page = <DemoHome/>; break;
      case '/autonomy-demo': Page = <AutonomyDemo onComplete={() => window.location.hash = '#/demo'} />; break;
      case '/connections': Page = <ProtectedRoute><Connections/></ProtectedRoute>; break;
      case '/ontology': Page = <ProtectedRoute><OntologyMapping/></ProtectedRoute>; break;
      case '/uncertain': Page = <ProtectedRoute><UncertainUnifications/></ProtectedRoute>; break;
      case '/agents': Page = <ProtectedRoute><Agents/></ProtectedRoute>; break;
      case '/pipeline': Page = <ProtectedRoute><Pipeline/></ProtectedRoute>; break;
      case '/command': Page = <ProtectedRoute requireRole="admin"><CommandCenter/></ProtectedRoute>; break;
      case '/faq': Page = <ProtectedRoute><FAQ/></ProtectedRoute>; break;
      default: Page = <ProtectedRoute><DCLDashboard/></ProtectedRoute>;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar/>
      <main className="flex-1">{Page}</main>
      {demoState.isRunning && (
        <>
          <DemoCursor position={demoState.cursorPosition} visible={true} />
          <DemoAnnotation text={demoState.annotationText} visible={!!demoState.annotationText} />
          <SlackAlert message={demoState.slackAlert} visible={!!demoState.slackAlert} />
          <TitleCard text={demoState.titleCard} visible={!!demoState.titleCard} />
          <SystemNotification message={demoState.systemNotification} visible={!!demoState.systemNotification} />
          <AIThinking lines={demoState.aiThinking.lines} visible={demoState.aiThinking.visible} />
          <FinOpsAgentDashboard 
            visible={demoState.finOpsDashboard.visible} 
            showHubSpot={demoState.finOpsDashboard.showHubSpot}
            totalRevenue={demoState.finOpsDashboard.totalRevenue}
          />
        </>
      )}
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
