function Connections() {
  const [connections, setConnections] = React.useState([]);
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchConnections = async () => {
    try {
      const response = await fetch('/api/connections');
      const data = await response.json();
      setConnections(data.connections || []);
    } catch (error) {
      console.error('Failed to fetch connections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchConnections();
  }, []);

  const handleWizardSuccess = () => {
    fetchConnections();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Data Connections</h1>
          <button 
            onClick={() => setIsWizardOpen(true)}
            className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Add New Connection
          </button>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-400">Connection Name</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-400">Type</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-400">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-400">Last Refreshed</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500">
                    <div className="inline-block w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : connections.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500">
                    No connections yet. Click "+ Add New Connection" to get started.
                  </td>
                </tr>
              ) : (
                connections.map((connection) => (
                  <tr 
                    key={connection.id} 
                    onClick={() => window.location.hash = `#/connections/${connection.id}`}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-6 font-medium">{connection.connection_name}</td>
                    <td className="py-4 px-6 text-slate-400">{connection.connection_type}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                        Connected
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(connection.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AddConnectionWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onSuccess={handleWizardSuccess}
        />
      </div>
    </div>
  );
}
