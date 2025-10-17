import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import AOAFunctionsPanel from './AOAFunctionsPanel';
import type { xAOMetric } from '../types';
import aoaMetricsData from '../data/aoaMetrics.json';

export default function XAOPage() {
  const [activeTab, setActiveTab] = useState<'functions' | 'xao' | 'plans'>('functions');
  const [xaoMetrics] = useState<xAOMetric[]>(aoaMetricsData.xaoFunctions as xAOMetric[]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Cross-Agentic Orchestration (xAO)</h1>
        <p className="text-gray-400">
          Real-time orchestration metrics, functions, and cross-agent coordination details
        </p>
      </div>

      <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-6">
        <div className="flex gap-2 mb-6 border-b border-slate-700 pb-4">
          <button
            onClick={() => setActiveTab('functions')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === 'functions'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            AOA Functions
          </button>
          <button
            onClick={() => setActiveTab('xao')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === 'xao'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            xAO Metrics
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === 'plans'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Live Plans
          </button>
        </div>

        {activeTab === 'functions' && (
          <div>
            <AOAFunctionsPanel />
          </div>
        )}

        {activeTab === 'xao' && (
          <div className="space-y-3">
            {xaoMetrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-slate-800/60 rounded-xl p-4 border border-slate-700 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-slate-200">{metric.name}</h3>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <p className="text-sm text-slate-500 mb-2">{metric.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">{metric.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-xl border-2 border-dashed border-slate-700 p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
            <Info className="w-16 h-16 text-cyan-400 mb-4" />
            <h3 className="text-2xl font-bold text-slate-200 mb-3">Live Plans Visualization</h3>
            <p className="text-slate-400 max-w-2xl">
              This area is reserved for your Sankey diagram or other visualization showing
              real-time orchestration plans, agent execution flows, and resource allocation
              decisions.
            </p>
            <div className="mt-6 px-6 py-3 bg-slate-800 rounded-lg border border-slate-700">
              <span className="text-sm text-slate-500">
                Integration point for existing visualization component
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
