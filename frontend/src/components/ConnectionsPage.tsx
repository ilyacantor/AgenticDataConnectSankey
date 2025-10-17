import { Database, Server, Warehouse, Users, Settings2 } from 'lucide-react';

interface Connection {
  id: string;
  name: string;
  value: string;
  type: 'CRM' | 'ERP' | 'Database' | 'Warehouse';
  status: 'connected';
  description: string;
}

const connections: Connection[] = [
  { id: '1', name: 'Dynamics CRM', value: 'dynamics', type: 'CRM', status: 'connected', description: 'Customer relationship management' },
  { id: '2', name: 'Salesforce', value: 'salesforce', type: 'CRM', status: 'connected', description: 'Cloud-based CRM platform' },
  { id: '3', name: 'HubSpot', value: 'hubspot', type: 'CRM', status: 'connected', description: 'Marketing and sales platform' },
  { id: '4', name: 'SAP ERP', value: 'sap', type: 'ERP', status: 'connected', description: 'Enterprise resource planning' },
  { id: '5', name: 'NetSuite', value: 'netsuite', type: 'ERP', status: 'connected', description: 'Cloud ERP system' },
  { id: '6', name: 'Legacy SQL', value: 'legacy_sql', type: 'Database', status: 'connected', description: 'On-premise SQL database' },
  { id: '7', name: 'Snowflake', value: 'snowflake', type: 'Warehouse', status: 'connected', description: 'Cloud data warehouse' },
  { id: '8', name: 'Supabase', value: 'supabase', type: 'Database', status: 'connected', description: 'Open source database platform' },
  { id: '9', name: 'MongoDB', value: 'mongodb', type: 'Database', status: 'connected', description: 'NoSQL document database' },
];

function getIcon(type: string) {
  switch (type) {
    case 'CRM':
      return <Users className="w-6 h-6 text-blue-400" />;
    case 'ERP':
      return <Settings2 className="w-6 h-6 text-green-400" />;
    case 'Database':
      return <Database className="w-6 h-6 text-red-400" />;
    case 'Warehouse':
      return <Warehouse className="w-6 h-6 text-cyan-400" />;
    default:
      return <Server className="w-6 h-6 text-gray-400" />;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'CRM':
      return 'bg-blue-900/30 border-blue-700/50 hover:border-blue-600';
    case 'ERP':
      return 'bg-green-900/30 border-green-700/50 hover:border-green-600';
    case 'Database':
      return 'bg-red-900/30 border-red-700/50 hover:border-red-600';
    case 'Warehouse':
      return 'bg-cyan-900/30 border-cyan-700/50 hover:border-cyan-600';
    default:
      return 'bg-gray-900/30 border-gray-700/50 hover:border-gray-600';
  }
}

export default function ConnectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Data Connections</h1>
        <p className="text-gray-400">
          Manage your enterprise data source connections
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((connection) => (
          <div
            key={connection.id}
            className={`rounded-lg border p-4 transition-all cursor-pointer ${getTypeColor(
              connection.type
            )}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getIcon(connection.type)}
                <div>
                  <h3 className="text-base font-semibold text-white">{connection.name}</h3>
                  <p className="text-xs text-gray-500 uppercase font-semibold">{connection.type}</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                {connection.status}
              </span>
            </div>
            <p className="text-sm text-gray-400">{connection.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
