import React, { useState, useEffect } from 'react';

export default function AutonomyDemo({ onComplete }) {
  const [step, setStep] = useState(0);
  const [showThinking, setShowThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState('');
  const [chartBars, setChartBars] = useState([
    { name: 'Salesforce', value: 450, color: 'bg-blue-500' },
    { name: 'Dynamics', value: 380, color: 'bg-purple-500' }
  ]);
  const [totalRevenue, setTotalRevenue] = useState(830);

  useEffect(() => {
    runDemo();
  }, []);

  const runDemo = async () => {
    // Step 1: System notification
    await wait(1000);
    setStep(1);
    await wait(4000);

    // Step 2: Show graph with HubSpot node
    setStep(2);
    await wait(2000);

    // Step 3: AI Thinking animation
    setShowThinking(true);
    await animateThinking();
    setShowThinking(false);
    await wait(1000);

    // Step 4: Draw connection line
    setStep(3);
    await wait(2000);

    // Step 5: Show FinOps dashboard
    setStep(4);
    await wait(1500);

    // Step 6: Add HubSpot bar to chart
    setChartBars(prev => [...prev, { name: 'HubSpot', value: 290, color: 'bg-orange-500' }]);
    setTotalRevenue(1120);
    await wait(3000);

    // Step 7: Final annotation
    setStep(5);
    await wait(5000);

    // Step 8: Fade out
    setStep(6);
    await wait(2000);
    
    if (onComplete) onComplete();
  };

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const animateThinking = async () => {
    const messages = [
      'Analyzing HubSpot objects...',
      'Semantic match: HubSpot.Deals → UnifiedOntology.RevenueOpportunity',
      'Mapping fields: deal_name → opportunity_name',
      'Mapping fields: deal_value → opportunity_amount',
      'Validation passed. Publishing schema...'
    ];

    for (const msg of messages) {
      setThinkingText(msg);
      await wait(800);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-900">
      {/* Step 1: System Notification Banner */}
      {step >= 1 && (
        <div className={`absolute top-0 left-0 right-0 bg-gradient-to-r from-cyan-600 to-blue-600 p-4 transform transition-transform duration-700 ${step >= 1 ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">System Event Detected: New 'HubSpot' application provisioned in enterprise service catalog</h3>
                <p className="text-sm text-cyan-100 mt-1">Following a company acquisition, IT integrates a new CRM. autonomOS doesn't need to be told; it senses the change in the enterprise landscape.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2-3: Graph Canvas with HubSpot Node */}
      {step >= 2 && step < 4 && (
        <div className="flex items-center justify-center h-full">
          <div className="relative">
            {/* Existing nodes */}
            <div className="flex items-center gap-32">
              <div className="flex flex-col gap-8">
                <NodeBox label="Salesforce" color="blue" />
                <NodeBox label="Dynamics" color="purple" />
                <NodeBox label="HubSpot" color="orange" glowing={true} newNode={true} />
              </div>
              
              <NodeBox label="Unified Ontology" color="cyan" large={true} />
              
              <NodeBox label="FinOps Agent" color="green" />
            </div>

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
              <line x1="20%" y1="25%" x2="50%" y2="50%" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
              <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="#a855f7" strokeWidth="2" opacity="0.5" />
              {step >= 3 && (
                <line x1="20%" y1="75%" x2="50%" y2="50%" stroke="#f97316" strokeWidth="3" opacity="1" className="animate-pulse">
                  <animate attributeName="opacity" values="0;1" dur="0.5s" fill="freeze" />
                </line>
              )}
              <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="#10b981" strokeWidth="2" opacity="0.5" />
            </svg>
          </div>
        </div>
      )}

      {/* AI Thinking Overlay */}
      {showThinking && (
        <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
          <div className="bg-slate-800 border border-cyan-500 rounded-xl p-8 max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">AI Processing</h3>
            </div>
            <div className="font-mono text-sm text-cyan-300 min-h-[60px]">
              {thinkingText}
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: FinOps Dashboard */}
      {step >= 4 && (
        <div className="flex items-center justify-center h-full p-8">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 max-w-4xl w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">FinOps Agent Dashboard</h2>
              <div className="text-4xl font-bold text-green-400">${totalRevenue}K</div>
              <p className="text-sm text-slate-400">Total Revenue Forecast</p>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-4">Revenue Forecast by Source</h3>
            <div className="flex items-end gap-8 h-64">
              {chartBars.map((bar, idx) => (
                <div key={bar.name} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className={`w-full ${bar.color} rounded-t-lg transition-all duration-1000 flex items-end justify-center pb-2`}
                    style={{ 
                      height: `${(bar.value / 450) * 100}%`,
                      animation: idx === 2 ? 'growBar 1s ease-out' : 'none'
                    }}
                  >
                    <span className="text-white font-bold">${bar.value}K</span>
                  </div>
                  <span className="text-sm text-slate-300 font-medium">{bar.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Final Annotation */}
      {step >= 5 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-12">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <p className="text-2xl text-white font-light leading-relaxed">
              autonomOS didn't just connect the data; it <span className="font-bold text-cyan-400">understood it</span> and made it immediately useful to the business.
            </p>
            <p className="text-lg text-slate-300 mt-4">
              Time from system integration to business insight: <span className="font-bold text-green-400">minutes, not months</span>.
            </p>
          </div>
        </div>
      )}

      {/* Step 6: Fade to black */}
      {step >= 6 && (
        <div className="absolute inset-0 bg-black animate-fade-in flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">autonomOS</h1>
            <p className="text-xl text-slate-400">Intelligence Beyond Integration</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes growBar {
          from { height: 0%; }
          to { height: var(--final-height); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-in;
        }
      `}</style>
    </div>
  );
}

function NodeBox({ label, color, large, glowing, newNode }) {
  const colors = {
    blue: 'border-blue-500 bg-blue-500/10',
    purple: 'border-purple-500 bg-purple-500/10',
    orange: 'border-orange-500 bg-orange-500/10',
    cyan: 'border-cyan-500 bg-cyan-500/10',
    green: 'border-green-500 bg-green-500/10'
  };

  return (
    <div 
      className={`
        ${large ? 'px-8 py-6' : 'px-6 py-4'} 
        rounded-lg border-2 
        ${colors[color]} 
        ${glowing ? 'animate-pulse shadow-lg shadow-orange-500/50' : ''}
        ${newNode ? 'animate-fade-in' : ''}
      `}
    >
      <span className={`text-${color}-400 font-semibold ${large ? 'text-xl' : 'text-base'}`}>
        {label}
      </span>
    </div>
  );
}
