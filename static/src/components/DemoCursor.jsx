function DemoCursor({ position, visible = true }) {
  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-all duration-500 ease-in-out"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-12px, -12px)'
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
          fill="#06b6d4"
          stroke="#0e7490"
          strokeWidth="1"
          className="drop-shadow-lg"
        />
      </svg>
      <div className="absolute top-6 left-6 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
    </div>
  );
}
