import { Activity, Zap, Database, AlertCircle } from 'lucide-react';
import type { SourceNode, AgentNode, DCLStats } from '../types';
import LiveSankeyGraph from './LiveSankeyGraph';

interface DCLGraphContainerProps {
  sources: SourceNode[];
  agents: AgentNode[];
  stats: DCLStats;
}

function getSourceIcon(type: string) {
  const iconMap: Record<string, string> = {
    salesforce: '☁️',
    snowflake: '❄️',
    netsuite: '🏢',
    aws: '📦',
    dynamics: '📱',
    sap: '🏭',
    mongodb: '🍃',
    supabase: '🗄️',
  };
  return iconMap[type] || '📊';
}

function getStatusColor(status: string) {
  if (status === 'online') return 'bg-green-500';
  if (status === 'warning') return 'bg-yellow-500';
  return 'bg-red-500';
}

export default function DCLGraphContainer({ sources, agents, stats }: DCLGraphContainerProps) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Live DCL Connectivity</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-[200px_1fr_200px] gap-6">
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Data Sources
          </h3>
          {sources.map((source) => (
            <div
              key={source.id}
              className="bg-gray-800/50 rounded-lg p-2 border border-gray-700 hover:border-blue-500/50 transition-colors h-12 flex items-center gap-2"
            >
              <span className="text-2xl flex-shrink-0">{getSourceIcon(source.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate">{source.name}</div>
              </div>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(source.status)}`} />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl border-2 border-blue-500/30 p-4 backdrop-blur-sm mb-4">
            <div className="absolute inset-0 bg-blue-500/5 rounded-2xl animate-pulse" />

            <div className="relative z-10 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 flex-shrink-0">
                <Activity className="w-8 h-8 text-white animate-pulse" />
              </div>

              <div className="flex-1">
                <h3 className="text-base font-bold text-white mb-2">
                  Intelligent Mapping & Ontology Engine
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-gray-900/60 rounded-lg p-2 backdrop-blur-sm">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Zap className="w-2.5 h-2.5 text-yellow-400" />
                      <span className="text-[10px] text-gray-400">LLM/min</span>
                    </div>
                    <div className="text-sm font-bold text-white">{stats.llmCallsPerMin}</div>
                  </div>
                  <div className="bg-gray-900/60 rounded-lg p-2 backdrop-blur-sm">
                    <div className="text-[10px] text-gray-400 mb-0.5">Tokens</div>
                    <div className="text-sm font-bold text-white">{stats.avgTokenUsage}</div>
                  </div>
                  <div className="bg-gray-900/60 rounded-lg p-2 backdrop-blur-sm">
                    <div className="text-[10px] text-gray-400 mb-0.5">RAG</div>
                    <div className="text-sm font-bold text-white">{stats.ragIndexSize}</div>
                  </div>
                  <div className="bg-gray-900/60 rounded-lg p-2 backdrop-blur-sm">
                    <div className="flex items-center gap-1 mb-0.5">
                      <AlertCircle className="w-2.5 h-2.5 text-orange-400" />
                      <span className="text-[10px] text-gray-400">Review</span>
                    </div>
                    <div className="text-sm font-bold text-orange-400">{stats.mappingsInReview}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-0 left-1/2 w-px h-6 bg-gradient-to-b from-transparent via-blue-500 to-transparent -translate-x-1/2 -translate-y-6 opacity-50" />
            <div className="absolute bottom-0 left-1/2 w-px h-6 bg-gradient-to-t from-transparent via-blue-500 to-transparent -translate-x-1/2 translate-y-6 opacity-50" />
          </div>

          <div className="flex-1 w-full">
            <LiveSankeyGraph />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Agent Consumers
          </h3>
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-gray-800/50 rounded-lg p-2 border border-gray-700 hover:border-purple-500/50 transition-colors h-12 flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate">{agent.name}</div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
