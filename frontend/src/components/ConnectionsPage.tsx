import { useState } from 'react';
import { Play, Pause, Settings, FileText, Plus } from 'lucide-react';
import type { Connection } from '../types';
import { mockConnections } from '../mocks/data';

function getConnectionIcon(type: string) {
  const iconMap: Record<string, string> = {
    salesforce: '☁️',
    snowflake: '❄️',
    netsuite: '🏢',
    aws: '📦',
    other: '🔗',
  };
  return iconMap[type] || '🔗';
}

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>(mockConnections);

  const togglePause = (id: string) => {
    setConnections((prev) =>
      prev.map((conn) =>
        conn.id === id ? { ...conn, isPaused: !conn.isPaused } : conn
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'syncing':
        return 'bg-blue-500 animate-pulse';
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Connections</h1>
        <p className="text-gray-400">
          Manage data source connections and synchronization settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-blue-500/50 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{getConnectionIcon(connection.type)}</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{connection.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(connection.status)}`} />
                    <span className="text-xs text-gray-500 capitalize">{connection.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4 pb-4 border-b border-gray-800">
              <div className="text-xs text-gray-500 mb-1">Last Sync</div>
              <div className="text-sm text-gray-300">{connection.lastSync}</div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                Configure
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors">
                <FileText className="w-4 h-4" />
                Logs
              </button>
            </div>

            <button
              onClick={() => togglePause(connection.id)}
              className={`w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 ${
                connection.isPaused
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-orange-600 hover:bg-orange-700'
              } text-white text-sm font-medium rounded-lg transition-colors`}
            >
              {connection.isPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  Resume Sync
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  Pause Sync
                </>
              )}
            </button>
          </div>
        ))}

        <button className="bg-gray-900 rounded-xl border-2 border-dashed border-gray-700 hover:border-blue-500 p-6 flex flex-col items-center justify-center gap-4 transition-all min-h-[280px] group">
          <div className="w-16 h-16 bg-gray-800 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center transition-colors">
            <Plus className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" />
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-white mb-1">Add New Connection</div>
            <div className="text-sm text-gray-500">Connect a new data source</div>
          </div>
        </button>
      </div>
    </div>
  );
}
