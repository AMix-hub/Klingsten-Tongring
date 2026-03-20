import RemindersPanel from "../components/RemindersPanel";

export default function PaminnelserPage() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          🔔{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
            Påminnelser
          </span>
        </h1>
        <p className="text-slate-400 mt-1">
          Viktiga påminnelser och händelser för familjen.
        </p>
      </header>

      <RemindersPanel />
    </div>
  );
}
