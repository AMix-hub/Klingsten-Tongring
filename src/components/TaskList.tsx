"use client";

import { useState } from "react";
import { todayTasks, familyMembers, type Task } from "@/lib/mockData";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";

const categoryEmoji: Record<Task["category"], string> = {
  chores: "🧹",
  school: "📚",
  pet: "🐱",
  cooking: "🍳",
  other: "📌",
};

const priorityConfig: Record<
  Task["priority"],
  { label: string; color: string }
> = {
  high: { label: "Hög", color: "text-rose-400" },
  medium: { label: "Medium", color: "text-amber-400" },
  low: { label: "Låg", color: "text-slate-400" },
};

function getMemberName(id: string): string {
  return familyMembers.find((m) => m.id === id)?.name ?? id;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(todayTasks);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const filtered = tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <span>✅</span> Dagens Uppgifter
        </h2>
        <span className="text-sm text-slate-400">
          {completedCount}/{tasks.length} klara
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-5 bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(["all", "pending", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-indigo-500 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {f === "all" ? "Alla" : f === "pending" ? "Väntande" : "Klara"}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.map((task) => {
          const priority = priorityConfig[task.priority];
          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                task.completed
                  ? "bg-slate-900/40 border-slate-800 opacity-60"
                  : "bg-slate-900/70 border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/70"
              }`}
            >
              {/* Checkbox */}
              <span className="flex-shrink-0">
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500" />
                )}
              </span>

              {/* Category emoji */}
              <span className="text-base">{categoryEmoji[task.category]}</span>

              {/* Task info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium leading-tight ${
                    task.completed
                      ? "line-through text-slate-500"
                      : "text-slate-200"
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {getMemberName(task.assignedTo)}
                </p>
              </div>

              {/* Right side: time + priority */}
              <div className="flex flex-col items-end gap-1">
                {task.dueTime && (
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {task.dueTime}
                  </span>
                )}
                {task.priority === "high" && !task.completed && (
                  <AlertCircle className={`w-4 h-4 ${priority.color}`} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
