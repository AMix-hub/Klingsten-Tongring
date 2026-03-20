"use client";

import { useState } from "react";
import {
  reminders as initialReminders,
  familyMembers,
  type Reminder,
} from "../lib/mockData";
import { useLocalStorage } from "../lib/useLocalStorage";
import { Bell, Plus, Pencil, Trash2, X } from "lucide-react";

function getMemberName(id: string): string {
  const m = familyMembers.find((m) => m.id === id);
  return m ? m.name : id;
}

type ReminderForm = Omit<Reminder, "id">;

function emptyReminder(): ReminderForm {
  return {
    title: "",
    assignedTo: familyMembers.filter((m) => m.role !== "pet")[0]?.id ?? "",
    time: "",
    urgent: false,
  };
}

export default function RemindersPanel() {
  const [reminders, setReminders] = useLocalStorage<Reminder[]>("reminders", initialReminders);
  const [reminderModal, setReminderModal] = useState<string | "new" | null>(null);
  const [reminderForm, setReminderForm] = useState<ReminderForm>(emptyReminder());

  const openAddReminder = () => {
    setReminderForm(emptyReminder());
    setReminderModal("new");
  };

  const openEditReminder = (r: Reminder) => {
    setReminderForm({ title: r.title, assignedTo: r.assignedTo, time: r.time, urgent: r.urgent });
    setReminderModal(r.id);
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const saveReminder = () => {
    if (!reminderForm.title.trim()) return;
    if (reminderModal === "new") {
      setReminders((prev) => [...prev, { ...reminderForm, id: `r${Date.now()}` }]);
    } else if (reminderModal) {
      setReminders((prev) =>
        prev.map((r) => (r.id === reminderModal ? { ...reminderForm, id: r.id } : r))
      );
    }
    setReminderModal(null);
  };

  return (
    <>
      <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-950/30 to-slate-900/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-yellow-400" />
          <h3 className="font-semibold text-white flex-1">Påminnelser</h3>
          <button
            onClick={openAddReminder}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 text-sm font-medium transition-colors border border-yellow-500/30"
          >
            <Plus className="w-3.5 h-3.5" />
            Lägg till
          </button>
        </div>

        {reminders.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-8">
            Inga påminnelser. Lägg till en ovan!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reminders.map((r) => (
              <div
                key={r.id}
                className={`flex items-start gap-3 rounded-xl p-3 border group ${
                  r.urgent
                    ? "bg-rose-500/10 border-rose-500/30"
                    : "bg-slate-800/50 border-slate-700/50"
                }`}
              >
                <span className="text-lg">{r.urgent ? "🔴" : "🔵"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200">{r.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {getMemberName(r.assignedTo)} · {r.time}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditReminder(r)}
                    className="p-1 rounded-lg text-slate-500 hover:text-yellow-400 hover:bg-slate-700 transition-all"
                    aria-label="Redigera påminnelse"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => deleteReminder(r.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-700 transition-all"
                    aria-label="Ta bort påminnelse"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reminder modal */}
      {reminderModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white text-lg">
                {reminderModal === "new" ? "Ny påminnelse" : "Redigera påminnelse"}
              </h3>
              <button
                onClick={() => setReminderModal(null)}
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
                  value={reminderForm.title}
                  onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                  placeholder="Påminnelsens titel..."
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Ansvarig</label>
                <select
                  value={reminderForm.assignedTo}
                  onChange={(e) => setReminderForm({ ...reminderForm, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                >
                  {familyMembers.filter((m) => m.role !== "pet").map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Tid</label>
                <input
                  type="text"
                  value={reminderForm.time}
                  onChange={(e) => setReminderForm({ ...reminderForm, time: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-yellow-500"
                  placeholder="t.ex. 17:00 eller Fredag"
                />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminderForm.urgent}
                  onChange={(e) => setReminderForm({ ...reminderForm, urgent: e.target.checked })}
                  className="w-4 h-4 rounded accent-rose-500"
                />
                <span className="text-sm text-slate-300">Brådskande 🔴</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setReminderModal(null)}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-sm font-medium transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={saveReminder}
                disabled={!reminderForm.title.trim()}
                className="flex-1 px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 text-sm font-medium transition-colors"
              >
                Spara
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
