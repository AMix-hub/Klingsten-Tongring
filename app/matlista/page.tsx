import MealPlanner from "../components/MealPlanner";

export const dynamic = "force-dynamic";

export default function MatlistaPage() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          🍽️{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Matlista
          </span>
        </h1>
        <p className="text-slate-400 mt-1">
          Veckans måltider och matsedel för familjen.
        </p>
      </header>

      <MealPlanner />
    </div>
  );
}
