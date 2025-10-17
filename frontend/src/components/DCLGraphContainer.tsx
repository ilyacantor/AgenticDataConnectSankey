import { Activity, Zap, Database, AlertCircle } from 'lucide-react';
import type { AgentNode, DCLStats } from '../types';
import LiveSankeyGraph from './LiveSankeyGraph';

interface DCLGraphContainerProps {
  agents: AgentNode[];
  stats: DCLStats;
}

export default function DCLGraphContainer({ agents, stats }: DCLGraphContainerProps) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Live DCL Connectivity</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_200px] gap-6">
        <div className="flex flex-col items-center">
          <div className="relative w-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/30 p-2 backdrop-blur-sm mb-4">
            <div className="absolute inset-0 bg-blue-500/5 rounded-lg animate-pulse" />

            <div className="relative z-10 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50 flex-shrink-0">
                <Activity className="w-4 h-4 text-white animate-pulse" />
              </div>

              <div className="flex-1">
                <h3 className="text-xs font-semibold text-white mb-1">
                  Intelligent Mapping & Ontology Engine
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Zap className="w-2 h-2 text-yellow-400" />
                    <span className="text-[9px] text-gray-400">LLM:</span>
                    <span className="text-[10px] font-semibold text-white">{stats.llmCallsPerMin}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-gray-400">Tokens:</span>
                    <span className="text-[10px] font-semibold text-white">{stats.avgTokenUsage}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-gray-400">RAG:</span>
                    <span className="text-[10px] font-semibold text-white">{stats.ragIndexSize}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-2 h-2 text-orange-400" />
                    <span className="text-[10px] font-semibold text-orange-400">{stats.mappingsInReview}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-0 left-1/2 w-px h-4 bg-gradient-to-b from-transparent via-blue-500 to-transparent -translate-x-1/2 -translate-y-4 opacity-50" />
            <div className="absolute bottom-0 left-1/2 w-px h-4 bg-gradient-to-t from-transparent via-blue-500 to-transparent -translate-x-1/2 translate-y-4 opacity-50" />
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
