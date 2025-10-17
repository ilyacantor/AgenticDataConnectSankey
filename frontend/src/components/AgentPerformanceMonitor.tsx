import type { AgentPerformance } from '../types';

interface AgentPerformanceMonitorProps {
  agents: AgentPerformance[];
}

export default function AgentPerformanceMonitor({ agents }: AgentPerformanceMonitorProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-white mb-4">Active Agent Performance</h2>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                Agent
              </th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                Status
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                Exec/hr
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                CPU
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3">
                Memory
              </th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr
                key={agent.id}
                className="border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
              >
                <td className="py-3">
                  <div className="text-sm font-medium text-white">{agent.name}</div>
                </td>
                <td className="py-3">
                  <div className="flex justify-center">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} ${
                        agent.status === 'running' ? 'animate-pulse' : ''
                      }`}
                    />
                  </div>
                </td>
                <td className="py-3 text-right">
                  <span className="text-sm text-gray-300">{agent.executionsPerHour}</span>
                </td>
                <td className="py-3 text-right">
                  <span
                    className={`text-sm font-medium ${
                      agent.cpuPercent > 40
                        ? 'text-red-400'
                        : agent.cpuPercent > 25
                        ? 'text-yellow-400'
                        : 'text-green-400'
                    }`}
                  >
                    {agent.cpuPercent}%
                  </span>
                </td>
                <td className="py-3 text-right">
                  <span className="text-sm text-gray-300">{agent.memoryMB} MB</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
