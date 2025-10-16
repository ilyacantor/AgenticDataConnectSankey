function SystemNotification({ message, visible = false }) {
  if (!visible) return null;

  return (
    <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9997] animate-slide-in-down">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-2xl p-4 min-w-[500px]">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl">⚡</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm mb-1">System Event Detected</div>
            <p className="text-sm text-white/90">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
