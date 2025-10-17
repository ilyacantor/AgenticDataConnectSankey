import { Activity, Zap, Database, AlertCircle, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import type { AgentNode, DCLStats, MappingReview, SchemaChange } from '../types';
import LiveSankeyGraph from './LiveSankeyGraph';

interface DCLGraphContainerProps {
  agents: AgentNode[];
  stats: DCLStats;
  mappings: MappingReview[];
  schemaChanges: SchemaChange[];
}

export default function DCLGraphContainer({ agents, stats, mappings, schemaChanges }: DCLGraphContainerProps) {
  const [activeTab, setActiveTab] = useState<'review' | 'schema'>('review');

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Data Connection Layer (DCL)</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_150px_300px] gap-6">
        <div className="flex flex-col">
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

          <div className="flex-1 w-full aspect-square min-h-[400px]">
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

        <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 flex flex-col h-full">
          <h3 className="text-sm font-semibold text-white mb-3">Intelligence Review & Schema Drift</h3>

          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setActiveTab('review')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'review'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:text-gray-200'
              }`}
            >
              Review Required
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'schema'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400 hover:text-gray-200'
              }`}
            >
              Schema Log
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            {activeTab === 'review' ? (
              <div className="space-y-2">
                {mappings.slice(0, 3).map((mapping) => (
                  <div
                    key={mapping.id}
                    className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-orange-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <Clock className="w-2.5 h-2.5 text-gray-500" />
                          <span className="text-[10px] text-gray-500">
                            {new Date(mapping.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300 mb-1 truncate">
                          <span className="text-blue-400">Source:</span> {mapping.sourceField}
                        </div>
                        <div className="text-xs text-gray-300 flex items-center gap-1 truncate">
                          <TrendingUp className="w-2.5 h-2.5 text-green-400" />
                          <span className="text-green-400">Unified:</span> {mapping.unifiedField}
                        </div>
                      </div>
                      <div
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          mapping.confidence >= 75
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {mapping.confidence}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {schemaChanges.slice(0, 3).map((change) => (
                  <div
                    key={change.id}
                    className="bg-gray-800 rounded-lg p-3 border border-gray-700"
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center ${
                          change.changeType === 'added'
                            ? 'bg-green-500/20'
                            : change.changeType === 'modified'
                            ? 'bg-yellow-500/20'
                            : 'bg-red-500/20'
                        }`}
                      >
                        <AlertTriangle
                          className={`w-3 h-3 ${
                            change.changeType === 'added'
                              ? 'text-green-400'
                              : change.changeType === 'modified'
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs font-medium text-white truncate">{change.source}</span>
                          <span
                            className={`px-1 py-0.5 rounded text-[9px] font-semibold uppercase ${
                              change.changeType === 'added'
                                ? 'bg-green-500/20 text-green-400'
                                : change.changeType === 'modified'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {change.changeType}
                          </span>
                        </div>
                        <div className="text-xs text-blue-400 mb-1 truncate">{change.field}</div>
                        <div className="text-[10px] text-gray-500 truncate">{change.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
