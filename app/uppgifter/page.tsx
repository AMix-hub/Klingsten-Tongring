import TaskList from "../components/TaskList";

export default function UppgifterPage() {
  return (
    <div className="p-6 space-y-6 min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          ✅{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Uppgifter
          </span>
        </h1>
        <p className="text-slate-400 mt-1">
          Dagens och veckans uppgifter för hela familjen.
        </p>
      </header>

      <TaskList />
    </div>
  );
}
