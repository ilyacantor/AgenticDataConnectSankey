function TitleCard({ text, visible = false }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9998] bg-slate-900/95 flex items-center justify-center animate-fade-in">
      <h1 className="text-5xl font-bold text-white text-center px-8 animate-pulse-slow">
        {text}
      </h1>
    </div>
  );
}
