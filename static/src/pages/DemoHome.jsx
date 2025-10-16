function DemoHome() {
  const startEngineerDemo = () => {
    sessionStorage.setItem('demoMode', 'engineer');
    window.location.hash = '#/connections';
  };

  const startBusinessDemo = () => {
    sessionStorage.setItem('demoMode', 'business');
    window.location.hash = '#/connections';
  };

  const startAutonomyDemo = () => {
    sessionStorage.setItem('demoMode', 'autonomy');
    window.location.hash = '#/dashboard';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            autonomOS: The Intelligent Data Layer
          </h1>
          <p className="text-xl text-slate-400">
            Choose your journey to see how autonomOS transforms data operations
          </p>
        </div>

        {/* Persona Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Data Engineer Card */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-8 hover:border-cyan-500/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">For the Data Engineer</h2>
            </div>
            
            <p className="text-slate-300 mb-8 text-lg leading-relaxed">
              See how autonomOS automates data integration, provides deep visibility, 
              and speeds up troubleshooting.
            </p>

            <button
              onClick={startEngineerDemo}
              className="w-full px-6 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg shadow-cyan-500/25"
            >
              Start Engineer Demo →
            </button>
          </div>

          {/* Business User Card */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">For the Business User</h2>
            </div>
            
            <p className="text-slate-300 mb-8 text-lg leading-relaxed">
              See how autonomOS empowers teams like Marketing and Sales to connect 
              their own tools and access fresh data without filing IT tickets.
            </p>

            <button
              onClick={startBusinessDemo}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg shadow-purple-500/25"
            >
              Start Business User Demo →
            </button>
          </div>

          {/* Full Autonomy Card */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Full Autonomy</h2>
            </div>
            
            <p className="text-slate-300 mb-8 text-lg leading-relaxed">
              Watch autonomOS sense enterprise changes, intelligently map data, 
              and deliver business insights—all without human intervention.
            </p>

            <button
              onClick={startAutonomyDemo}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg shadow-green-500/25"
            >
              Start Autonomy Demo →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-slate-500">
            These are automated demos. Sit back and watch the story unfold.
          </p>
        </div>
      </div>
    </div>
  );
}
