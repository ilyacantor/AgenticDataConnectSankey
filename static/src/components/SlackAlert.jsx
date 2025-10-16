function SlackAlert({ message, visible = false }) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[9997] animate-slide-in-right">
      <div className="bg-white border-l-4 border-red-500 rounded-lg shadow-2xl p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
              <span className="text-white text-lg">🚨</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-slate-900">Slack</span>
              <span className="text-xs text-slate-500">just now</span>
            </div>
            <p className="text-sm text-slate-700">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
