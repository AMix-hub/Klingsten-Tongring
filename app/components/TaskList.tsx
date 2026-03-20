"use client";

import { useState } from "react";
import { todayTasks, familyMembers, type Task } from "../lib/mockData";
import { useCloudData } from "../lib/useCloudData";
import { CheckCircle2, Circle, Clock, AlertCircle, Plus, Pencil, Trash2, X } from "lucide-react";

type TaskForm = Omit<Task, "id">;

function emptyForm(): TaskForm {
  return {
    title: "",
    assignedTo: familyMembers.filter((m) => m.role !== "pet")[0]?.id ?? "",
    completed: false,
    priority: "medium",
    category: "other",
    dueTime: undefined,
  };
}

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
  const [tasks, setTasks] = useCloudData<Task[]>("tasks", todayTasks);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<TaskForm>(emptyForm());

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const openAdd = () => {
    setForm(emptyForm());
    setEditingId("new");
  };

  const openEdit = (task: Task) => {
    setForm({ ...task });
    setEditingId(task.id);
  };

  const closeModal = () => setEditingId(null);

  const saveTask = () => {
    if (!form.title.trim()) return;
    if (editingId === "new") {
      const newTask: Task = { ...form, id: `t${Date.now()}` };
      setTasks((prev) => [...prev, newTask]);
    } else if (editingId) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingId ? { ...form, id: t.id } : t))
      );
    }
    closeModal();
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
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">
            {completedCount}/{tasks.length} klara
          </span>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Lägg till
          </button>
        </div>
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
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 ${
                task.completed
                  ? "bg-slate-900/40 border-slate-800 opacity-60"
                  : "bg-slate-900/70 border-slate-700/50 hover:border-indigo-500/30"
              }`}
            >
              {/* Checkbox toggle */}
              <button
                onClick={() => toggleTask(task.id)}
                className="flex-shrink-0"
                aria-label={task.completed ? "Markera som ej klar" : "Markera som klar"}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500 hover:text-slate-300 transition-colors" />
                )}
              </button>

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

              {/* Right side: time + priority + actions */}
              <div className="flex items-center gap-1">
                <div className="flex flex-col items-end gap-1 mr-1">
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
                <button
                  onClick={() => openEdit(task)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-slate-800 transition-all"
                  aria-label="Redigera uppgift"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all"
                  aria-label="Ta bort uppgift"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit modal */}
      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white text-lg">
                {editingId === "new" ? "Lägg till uppgift" : "Redigera uppgift"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                aria-label="Stäng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Titel</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Uppgiftens titel..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Ansvarig</label>
                <select
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  {familyMembers.filter((m) => m.role !== "pet").map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Prioritet</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as Task["priority"] })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="high">Hög</option>
                    <option value="medium">Medium</option>
                    <option value="low">Låg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Kategori</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as Task["category"] })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="chores">🧹 Hushåll</option>
                    <option value="school">📚 Skola</option>
                    <option value="pet">🐱 Husdjur</option>
                    <option value="cooking">🍳 Matlagning</option>
                    <option value="other">📌 Övrigt</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Tid (valfritt)</label>
                <input
                  type="time"
                  value={form.dueTime ?? ""}
                  onChange={(e) => setForm({ ...form, dueTime: e.target.value || undefined })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-sm font-medium transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={saveTask}
                disabled={!form.title.trim()}
                className="flex-1 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                Spara
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
