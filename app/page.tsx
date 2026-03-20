import Dashboard from "./components/Dashboard";

export default function Home() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Välkommen,{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Familjen Klingsten/Tongring
          </span>{" "}
          👋
        </h1>
        <p className="text-slate-400 mt-1">
          Din smarta vardagsplanerare – håll koll på allt som händer idag.
        </p>
      </header>

      <Dashboard />
    </div>
  );
}
