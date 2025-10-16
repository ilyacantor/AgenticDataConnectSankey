function ConnectionDetails() {
  const [connection, setConnection] = React.useState(null);
  const [logs, setLogs] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Extract connection ID from hash
  const path = window.location.hash.slice(1); // Remove #
  const connectionId = path.split('/')[2]; // /connections/:id

  React.useEffect(() => {
    if (connectionId) {
      fetchConnectionDetails();
      fetchLogs();
    }
  }, [connectionId]);

  const fetchConnectionDetails = async () => {
    try {
      const response = await fetch('/api/connections');
      const data = await response.json();
      const conn = data.connections.find(c => c.id === parseInt(connectionId));
      setConnection(conn);
    } catch (error) {
      console.error('Failed to fetch connection details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch(`/api/connections/${connectionId}/logs`);
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="inline-block w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Connection Not Found</h2>
            <a href="#/connections" className="text-cyan-500 hover:underline">
              ← Back to Connections
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <a href="#/connections" className="text-slate-400 hover:text-white mb-4 inline-flex items-center gap-2 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Connections
          </a>
          
          <div className="flex items-center gap-4 mt-4">
            <h1 className="text-3xl font-bold">{connection.connection_name}</h1>
            <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-sm">
              {connection.connection_type}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
              Connected
            </span>
          </div>
        </div>

        {/* Connection Details Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Connection Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-slate-400 mb-1">Host</div>
              <div className="font-medium">{connection.host}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Port</div>
              <div className="font-medium">{connection.port}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Database</div>
              <div className="font-medium">{connection.database_name}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">User</div>
              <div className="font-medium">{connection.db_user}</div>
            </div>
          </div>
        </div>

        {/* Log Viewer */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Connection Logs</h2>
            <button 
              onClick={fetchLogs}
              className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
          
          <div className="bg-black/40 p-6 font-mono text-sm overflow-auto max-h-96">
            {logs.length === 0 ? (
              <div className="text-slate-500">No logs available</div>
            ) : (
              logs.map((log, index) => (
                <div 
                  key={index} 
                  className="text-slate-300 py-0.5 hover:bg-slate-800/30 px-2 -mx-2 rounded"
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
