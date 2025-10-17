import { Activity, Zap, AlertCircle, Clock, TrendingUp, AlertTriangle, ChevronDown, Play, X, CheckCircle, RotateCcw } from 'lucide-react';
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
  const [showRunDropdown, setShowRunDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<MappingReview | null>(null);
  const { state: dclState } = useDCLState();
  const [typingEvents, setTypingEvents] = useState<Array<{ text: string; isTyping: boolean; key: string }>>([]);

  // All data sources (default selection - matches legacy)
  const allSources = 'dynamics,salesforce,hubspot,sap,netsuite,legacy_sql,snowflake,supabase,mongodb';
  // All agents (default selection - matches legacy)
  const allAgents = 'revops_pilot,finops_pilot';

  // Sync prod mode from backend state (dev_mode in backend, but shown as Prod Mode in UI)
  useEffect(() => {
    if (dclState) {
      setProdMode(dclState.dev_mode || false);
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

  // Toggle Prod Mode using existing backend endpoint
  const handleProdModeToggle = async () => {
    try {
      await fetch('/toggle_dev_mode', {
        method: 'GET',
      });
      // State will update via useDCLState hook
    } catch (error) {
      console.error('Error toggling prod mode:', error);
    }
  };

  // Run - calls /connect with all sources and agents (uses current backend prod mode state)
  const handleRun = async () => {
    setShowRunDropdown(false);
    setIsProcessing(true);
    
    try {
      const response = await fetch(`/connect?sources=${allSources}&agents=${allAgents}`);
      await response.json();
    } catch (error) {
      console.error('Error running:', error);
    } finally {
      setTimeout(() => setIsProcessing(false), 1500);
    }
  };

  // Reset - calls /reset endpoint (matches legacy)
  const handleReset = async () => {
    setShowRunDropdown(false);
    
    try {
      await fetch('/reset');
    } catch (error) {
      console.error('Error resetting:', error);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-3 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Data Connection Layer (DCL)</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs sm:text-sm text-gray-400">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 lg:gap-6">
        <div className="flex flex-col">
          <div className="relative w-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/30 p-2 sm:p-3 backdrop-blur-sm mb-4">
            <div className="absolute inset-0 bg-blue-500/5 rounded-lg animate-pulse" />

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50 flex-shrink-0">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-pulse" />
              </div>

              <div className="flex-1 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2 mb-2 sm:mb-1">
                  <h3 className="text-xs sm:text-sm font-semibold text-white">
                    Intelligent Mapping & Ontology Engine
                  </h3>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Prod Mode Toggle (matches legacy behavior) */}
                    <button
                      onClick={handleProdModeToggle}
                      className={`flex items-center gap-1.5 px-3 sm:px-2 py-2 sm:py-1 rounded-md text-xs sm:text-[10px] font-semibold transition-all flex-1 sm:flex-none justify-center ${
                        prodMode
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                      title={prodMode ? 'Prod Mode ON (AI/RAG)' : 'Prod Mode OFF (Heuristic)'}
                    >
                      <Zap className="w-3 h-3 sm:w-3 sm:h-3" />
                      <span className="whitespace-nowrap">Prod Mode {prodMode ? 'ON' : 'OFF'}</span>
                    </button>

                    {/* Run/Reset Dropdown */}
                    <div className="relative flex-1 sm:flex-none">
                      <button
                        onClick={() => setShowRunDropdown(!showRunDropdown)}
                        disabled={isProcessing}
                        className="flex items-center gap-1.5 px-3 sm:px-2 py-2 sm:py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-md text-xs sm:text-[10px] font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50 w-full sm:w-auto justify-center"
                      >
                        {isProcessing ? (
                          <>
                            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" />
                            Actions
                            <ChevronDown className="w-3 h-3" />
                          </>
                        )}
                      </button>

                      {showRunDropdown && !isProcessing && (
                        <div className="absolute top-full right-0 mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg overflow-hidden z-10 w-full sm:w-auto sm:min-w-[120px]">
                          <button
                            onClick={handleRun}
                            className="w-full px-3 sm:px-3 py-3 sm:py-2 text-left text-xs sm:text-[11px] text-white hover:bg-emerald-600 transition-colors flex items-center gap-2"
                          >
                            <Play className="w-4 h-4 sm:w-3 sm:h-3" />
                            Run
                          </button>
                          <button
                            onClick={handleReset}
                            className="w-full px-3 sm:px-3 py-3 sm:py-2 text-left text-xs sm:text-[11px] text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                          >
                            <RotateCcw className="w-4 h-4 sm:w-3 sm:h-3" />
                            Reset
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-[10px] text-blue-300">
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${prodMode ? 'bg-purple-400 animate-pulse' : 'bg-gray-500'}`} />
                    <span>{prodMode ? 'AI/RAG Active' : 'Heuristic Mode'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-blue-400" />
                    <span className="whitespace-nowrap">9 sources → 2 agents</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <LiveSankeyGraph />
        </div>

        <div className="flex flex-col gap-4">
          {/* Intelligence Review Panel */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold">
                🤖
              </div>
              <span className="text-white font-bold text-sm">Intelligence Review</span>
            </div>

            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setActiveTab('review')}
                className={`flex-1 px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                  activeTab === 'review'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                Review ({mappings.length})
              </button>
              <button
                onClick={() => setActiveTab('schema')}
                className={`flex-1 px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                  activeTab === 'schema'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                Schema Log ({schemaChanges.length})
              </button>
            </div>

            <div className="text-xs space-y-2 max-h-[200px] overflow-y-auto">
              {activeTab === 'review' ? (
                <div className="space-y-2">
                  {mappings.slice(0, 3).map((mapping) => (
                    <div key={mapping.id} className="p-2 bg-gray-900 rounded border border-gray-700">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1 min-w-0">
                          <div className="text-blue-400 font-mono text-[10px] truncate">
                            {mapping.sourceField}
                          </div>
                          <div className="text-green-400 font-mono text-[10px] mt-1 truncate">
                            → {mapping.unifiedField}
                          </div>
                        </div>
                        <div
                          className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0 ${
                            mapping.confidence >= 80
                              ? 'bg-green-500/20 text-green-400'
                              : mapping.confidence >= 60
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {mapping.confidence}%
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedMapping(mapping)}
                        className="mt-2 w-full px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium rounded transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {schemaChanges.slice(0, 3).map((change) => (
                    <div key={change.id} className="p-2 bg-gray-900 rounded border border-gray-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            change.changeType === 'added'
                              ? 'bg-green-500/20 text-green-400'
                              : change.changeType === 'modified'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {change.changeType.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-[10px] font-mono">{change.entity}</span>
                      </div>
                      <div className="text-[10px] text-gray-300">{change.field}</div>
                      <div className="text-[9px] text-gray-500 mt-1">
                        {new Date(change.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RAG Learning Engine - EXACT LEGACY LAYOUT */}
          <div className="rounded-lg p-4 bg-gradient-to-br from-teal-950 to-cyan-950 border border-teal-700/30">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white text-xs font-bold">
                🧠
              </div>
              <span className="text-white font-bold text-sm">RAG Learning Engine</span>
              <span className="ml-auto text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">
                {dclState?.rag?.total_mappings || 0} stored
              </span>
            </div>
            <div className="text-xs space-y-2 max-h-[280px] overflow-y-auto">
              {!dclState?.rag?.retrievals || dclState.rag.retrievals.length === 0 ? (
                <div className="text-teal-300/70 italic text-[11px]">
                  No context retrieved yet. Connect a source to see RAG retrieve historical mappings.
                </div>
              ) : (
                <>
                  <div className="text-white font-semibold mb-2 text-[11px]">
                    Retrieved {dclState.rag.last_retrieval_count} similar mappings:
                  </div>
                  {dclState.rag.retrievals.map((ret: any, i: number) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-white font-semibold text-[11px]">{ret.source_field}</div>
                        <div className="text-[10px] text-white font-bold">
                          {(ret.similarity * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="text-teal-300 text-[10px] mb-1">→ {ret.ontology_entity}</div>
                      <div className="w-full bg-slate-900/50 rounded-sm h-1.5 overflow-hidden mb-1">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all"
                          style={{ width: `${(ret.similarity * 100).toFixed(0)}%` }}
                        />
                      </div>
                      <div className="text-[9px] text-teal-400/70">{ret.context}</div>
                    </div>
                  ))}
                </>
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

      {/* Review Mapping Modal - Mobile Friendly */}
      {selectedMapping && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 sm:p-6 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-white">Review Mapping</h3>
              <button
                onClick={() => setSelectedMapping(null)}
                className="p-2 sm:p-2 hover:bg-gray-800 rounded-lg transition-colors min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2 sm:mb-3 uppercase tracking-wider">
                    Source Data Snippet
                  </h4>
                  <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
                    <pre className="text-xs text-green-400 font-mono overflow-x-auto">
                      {selectedMapping.sourceSample}
                    </pre>
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <div className="text-xs sm:text-sm text-gray-400 mb-1">Source Field</div>
                    <div className="text-sm sm:text-base text-blue-400 font-mono break-all">
                      {selectedMapping.sourceField}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2 sm:mb-3 uppercase tracking-wider">
                    Proposed Unified Mapping
                  </h4>
                  <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 mb-3 sm:mb-4">
                    <div className="text-xs sm:text-sm text-gray-400 mb-2">Unified Entity & Field</div>
                    <div className="text-base sm:text-lg text-green-400 font-mono break-all">
                      {selectedMapping.unifiedField}
                    </div>
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                      <div className="text-xs sm:text-sm text-gray-400 mb-1">Confidence Score</div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                            style={{ width: `${selectedMapping.confidence}%` }}
                          />
                        </div>
                        <span className="text-orange-400 font-semibold">{selectedMapping.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2 sm:mb-3 uppercase tracking-wider">
                  LLM Reasoning
                </h4>
                <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {selectedMapping.reasoning}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    console.log('Approved:', selectedMapping.id);
                    setSelectedMapping(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-medium rounded-lg transition-colors min-h-[48px] sm:min-h-0"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm sm:text-base">Approve</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Editing:', selectedMapping.id);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition-colors min-h-[48px] sm:min-h-0"
                >
                  <span className="text-sm sm:text-base">Edit Mapping</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Ignored:', selectedMapping.id);
                    setSelectedMapping(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 text-white font-medium rounded-lg transition-colors min-h-[48px] sm:min-h-0"
                >
                  <X className="w-5 h-5" />
                  <span className="text-sm sm:text-base">Ignore & Flag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
