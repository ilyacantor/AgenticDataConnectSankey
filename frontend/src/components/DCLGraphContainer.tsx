import { Activity, Zap, AlertCircle, Clock, TrendingUp, AlertTriangle, ChevronDown, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { AgentNode, DCLStats, MappingReview, SchemaChange } from '../types';
import LiveSankeyGraph from './LiveSankeyGraph';
import { useDCLState } from '../hooks/useDCLState';
import TypingText from './TypingText';

interface DCLGraphContainerProps {
  agents: AgentNode[];
  stats: DCLStats;
  mappings: MappingReview[];
  schemaChanges: SchemaChange[];
}

export default function DCLGraphContainer({ stats, mappings, schemaChanges }: DCLGraphContainerProps) {
  const [activeTab, setActiveTab] = useState<'review' | 'schema'>('review');
  const [prodMode, setProdMode] = useState(false);
  const [showRunAllDropdown, setShowRunAllDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { state: dclState } = useDCLState();
  const [typingEvents, setTypingEvents] = useState<Array<{ text: string; isTyping: boolean; key: string }>>([]);

  // Sync prod mode from backend state
  useEffect(() => {
    if (dclState) {
      setProdMode(!dclState.dev_mode);
    }
  }, [dclState?.dev_mode]);

  // Track new events and animate them with typing effect
  useEffect(() => {
    if (!dclState) return;
    
    const eventsChanged = dclState.events.length !== typingEvents.length || 
      dclState.events.some((event, idx) => typingEvents[idx]?.text !== event);
    
    if (eventsChanged) {
      if (dclState.events.length === 0) {
        setTypingEvents([]);
      } else {
        setTypingEvents(dclState.events.map((event, idx) => ({
          text: event,
          isTyping: idx === dclState.events.length - 1,
          key: `${idx}-${event.substring(0, 20)}-${Date.now()}`
        })));
      }
    }
  }, [dclState?.events, typingEvents]);

  const handleProdModeToggle = async () => {
    const newProdMode = !prodMode;
    setProdMode(newProdMode);
    
    try {
      await fetch('/toggle_dev_mode', {
        method: 'GET',
      });
    } catch (error) {
      console.error('Error toggling dev mode:', error);
      setProdMode(!newProdMode);
    }
  };

  const handleRunAll = async (devMode: boolean) => {
    setShowRunAllDropdown(false);
    setIsProcessing(true);
    
    try {
      const allSources = 'dynamics,salesforce,supabase,mongodb,hubspot,snowflake,sap,netsuite,legacy_sql';
      const allAgents = 'finops_pilot,revops_pilot';
      const response = await fetch(`/connect?sources=${allSources}&agents=${allAgents}&dev_mode=${devMode}`);
      await response.json();
    } catch (error) {
      console.error('Error running all:', error);
    } finally {
      setTimeout(() => setIsProcessing(false), 1500);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Data Connection Layer (DCL)</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowRunAllDropdown(!showRunAllDropdown)}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-lg text-sm font-medium text-white shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run All
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
            
            {showRunAllDropdown && !isProcessing && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <button
                  onClick={() => handleRunAll(false)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors rounded-t-lg"
                >
                  <div className="text-sm font-medium text-white">Run All in Production Mode</div>
                  <div className="text-xs text-gray-400 mt-1">Uses AI/RAG for intelligent mapping</div>
                </button>
                <button
                  onClick={() => handleRunAll(true)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors rounded-b-lg border-t border-gray-700"
                >
                  <div className="text-sm font-medium text-white">Run All in Heuristic Mode</div>
                  <div className="text-xs text-gray-400 mt-1">Uses heuristic-only mapping</div>
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Live</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col">
          <div className="relative w-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/30 p-2 backdrop-blur-sm mb-4">
            <div className="absolute inset-0 bg-blue-500/5 rounded-lg animate-pulse" />

            <div className="relative z-10 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50 flex-shrink-0">
                <Activity className="w-4 h-4 text-white animate-pulse" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-semibold text-white">
                    Intelligent Mapping & Ontology Engine
                  </h3>
                  <button
                    onClick={handleProdModeToggle}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all ${
                      prodMode
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${prodMode ? 'bg-green-400' : 'bg-orange-400'}`} />
                    <span className="text-[10px] font-semibold">
                      {prodMode ? 'PROD MODE' : 'DEV MODE'}
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Zap className="w-2 h-2 text-yellow-400" />
                    <span className="text-[9px] text-gray-400">LLM:</span>
                    <span className="text-[10px] font-semibold text-white">
                      {dclState?.llm.calls || stats.llmCallsPerMin}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-gray-400">Tokens:</span>
                    <span className="text-[10px] font-semibold text-white">
                      ~{dclState?.llm.tokens || stats.avgTokenUsage}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-gray-400">RAG:</span>
                    <span className="text-[10px] font-semibold text-white">
                      {dclState?.rag.total_mappings || stats.ragIndexSize}
                    </span>
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

          <div className="flex-1 w-full min-h-[400px]">
            <LiveSankeyGraph />
          </div>
        </div>

        <div className="space-y-4 flex flex-col">
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 flex flex-col">
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

            <div className="flex-1 overflow-auto max-h-[200px]">
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

          {/* RAG Learning Engine Panel */}
          <div className="bg-gradient-to-br from-teal-950 to-cyan-950 border border-teal-700/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold">
                🧠
              </div>
              <span className="text-white font-bold text-sm">RAG Learning Engine</span>
              <span className="ml-auto text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">
                {dclState?.rag.total_mappings || 0} stored
              </span>
            </div>
            <div className="text-xs space-y-2 max-h-[200px] overflow-y-auto">
              {!dclState?.rag.retrievals || dclState.rag.retrievals.length === 0 ? (
                <div className="text-teal-300/70 italic text-[11px]">
                  No similar mappings retrieved yet. Map a source to see learned patterns.
                </div>
              ) : (
                dclState.rag.retrievals.map((r, idx) => {
                  const similarity = Math.round(r.similarity * 100);
                  return (
                    <div key={idx} className="bg-cyan-900/30 rounded p-2 border border-cyan-700/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-cyan-200 font-medium text-[11px]">
                          {r.source_field} → {r.ontology_entity}
                        </span>
                        <span className="text-teal-300 font-bold text-[10px]">{similarity}%</span>
                      </div>
                      <div className="w-full bg-cyan-950 rounded-sm h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all"
                          style={{ width: `${similarity}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Narration Panel with Typing Animation */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                📝
              </div>
              <span className="text-white font-bold text-sm">Narration</span>
              <span className="ml-auto text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">
                {dclState?.events.length || 0} events
              </span>
            </div>
            <div className="text-xs space-y-1 max-h-[250px] overflow-y-auto">
              {typingEvents.length === 0 ? (
                <div className="text-gray-500 italic text-[11px]">
                  No events yet. Start mapping to see the narration.
                </div>
              ) : (
                typingEvents.map((event, idx) => (
                  <div key={event.key} className="text-gray-300 leading-relaxed">
                    <span className="text-purple-400 font-bold mr-1">[{idx + 1}]</span>
                    {event.isTyping ? <TypingText text={event.text} speed={30} /> : event.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
