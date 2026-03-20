import LunaSchedule from "../components/LunaSchedule";

export default function LunaPage() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          🐱{" "}
          <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
            Luna
          </span>
        </h1>
        <p className="text-slate-400 mt-1">
          Lunas matarschema och vård för hela veckan.
        </p>
      </header>

      <LunaSchedule />
    </div>
  );
}
