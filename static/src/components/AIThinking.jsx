function AIThinking({ lines = [], visible = false }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9998] bg-slate-900/90 flex items-center justify-center">
      <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          <span className="ml-2 text-purple-400 font-semibold">AI Processing...</span>
        </div>
        <div className="font-mono text-sm space-y-1 max-h-[300px] overflow-y-auto">
          {lines.map((line, i) => (
            <div key={i} className="text-slate-300 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
