import { Activity, Zap, Database, AlertCircle } from 'lucide-react';
import type { SourceNode, AgentNode, DCLStats } from '../types';
import DCLSankeyPlaceholder from './DCLSankeyPlaceholder';

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
  };
  return iconMap[type] || '📊';
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

      <div className="grid grid-cols-[1fr_2fr_1fr] gap-8">
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Data Sources
          </h3>
          {sources.map((source) => (
            <div
              key={source.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{getSourceIcon(source.type)}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{source.name}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        source.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                    <span className="text-xs text-gray-500 capitalize">{source.status}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-xs text-gray-500">Records/min</div>
                <div className="text-lg font-semibold text-blue-400">
                  {source.recordsPerMin.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-2xl border-2 border-blue-500/30 p-4 backdrop-blur-sm">
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

          <div className="mt-4 flex-1">
            <DCLSankeyPlaceholder />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Agent Consumers
          </h3>
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{agent.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{agent.lastSuccessfulRun}</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="text-xs text-gray-500">Data Requests/min</div>
                <div className="text-lg font-semibold text-purple-400">
                  {agent.dataRequestsPerMin}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
