function DemoAnnotation({ text, visible = true }) {
  if (!visible || !text) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[9998] animate-fade-in">
      <div className="bg-slate-900/95 backdrop-blur-sm border border-cyan-500/50 rounded-2xl px-8 py-4 shadow-2xl shadow-cyan-500/20 max-w-3xl">
        <p className="text-lg text-slate-100 leading-relaxed text-center">
          {text}
        </p>
      </div>
    </div>
  );
}
