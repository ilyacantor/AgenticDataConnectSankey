function Connections() {
  const mockConnections = [
    { id: 1, name: 'Production DB', type: 'PostgreSQL', status: 'Connected', lastRefreshed: '2 minutes ago' },
    { id: 2, name: 'Salesforce CRM', type: 'Salesforce', status: 'Connected', lastRefreshed: '1 hour ago' },
    { id: 3, name: 'Analytics Warehouse', type: 'Snowflake', status: 'Failed', lastRefreshed: '3 hours ago' },
    { id: 4, name: 'Marketing Data', type: 'MongoDB', status: 'Connected', lastRefreshed: '30 minutes ago' },
    { id: 5, name: 'Legacy System', type: 'SQL Server', status: 'Failed', lastRefreshed: '5 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Data Connections</h1>
          <button className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
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
              {mockConnections.map((connection) => (
                <tr key={connection.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6 font-medium">{connection.name}</td>
                  <td className="py-4 px-6 text-slate-400">{connection.type}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        connection.status === 'Connected'
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}
                    >
                      {connection.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400">{connection.lastRefreshed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
