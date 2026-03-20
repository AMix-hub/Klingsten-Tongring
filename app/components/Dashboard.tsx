"use client";

import { useState } from "react";
import {
  weeklyMealPlan as initialMealPlan,
  reminders as initialReminders,
  lunaFeeder as initialLunaFeeder,
  familyMembers,
  type MealPlan,
  type Reminder,
} from "../lib/mockData";
import { useCloudData } from "../lib/useCloudData";
import { Bell, ChefHat, Cat, Calendar, Plus, Pencil, Trash2, X } from "lucide-react";

const DAYS_SV = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
];

function getTodayName(): string {
  return DAYS_SV[new Date().getDay()];
}

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

export default function Dashboard() {
  const todayName = getTodayName();

  const [meals, setMeals] = useCloudData<MealPlan[]>("mealPlan", initialMealPlan);
  const [reminders, setReminders] = useCloudData<Reminder[]>("reminders", initialReminders);
  const [lunaFeeder, setLunaFeeder] = useCloudData<Record<string, string>>("lunaFeeder", initialLunaFeeder);

  // Reminder modal state
  const [reminderModal, setReminderModal] = useState<string | "new" | null>(null);
  const [reminderForm, setReminderForm] = useState<ReminderForm>(emptyReminder());

  // Meal modal state
  const [mealModal, setMealModal] = useState<MealPlan | null>(null);
  const [mealForm, setMealForm] = useState<MealPlan | null>(null);

  // Luna feeder modal state
  const [lunaModal, setLunaModal] = useState(false);
  const [lunaForm, setLunaForm] = useState<Record<string, string>>(initialLunaFeeder);

  const todayMeal = meals.find((m) => m.day === todayName);
  const lunaFeederToday = lunaFeeder[todayName] ?? "Okänd";

  // Reminder CRUD
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

  // Meal CRUD
  const openEditMeal = (meal: MealPlan) => {
    setMealForm({ ...meal });
    setMealModal(meal);
  };
  const saveMeal = () => {
    if (!mealForm) return;
    setMeals((prev) => prev.map((m) => (m.day === mealForm.day ? mealForm : m)));
    setMealModal(null);
    setMealForm(null);
  };

  // Luna feeder edit
  const openLunaEdit = () => {
    setLunaForm({ ...lunaFeeder });
    setLunaModal(true);
  };
  const saveLuna = () => {
    setLunaFeeder(lunaForm);
    setLunaModal(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* Today's overview card */}
      <div className="md:col-span-2 xl:col-span-1 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-slate-900/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-white">Idag – {todayName}</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Datum</span>
            <span className="text-white font-medium">
              {new Date().toLocaleDateString("sv-SE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Veckodag</span>
            <span className="text-indigo-300 font-medium">{todayName}</span>
          </div>
          <hr className="border-slate-700/50" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Uppgifter kvar</span>
            <span className="text-amber-300 font-semibold">
              Öppna checklistan ↓
            </span>
          </div>
        </div>
      </div>

      {/* Luna feeding card */}
      <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-950/40 to-slate-900/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Cat className="w-5 h-5 text-orange-400" />
          <h3 className="font-semibold text-white flex-1">Luna 🐱 idag</h3>
          <button
            onClick={openLunaEdit}
            className="p-1.5 rounded-lg text-slate-500 hover:text-orange-400 hover:bg-slate-800 transition-all"
            aria-label="Redigera Lunas schema"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Matar Luna</span>
            <span className="font-bold text-orange-300 text-lg">
              {lunaFeederToday}
            </span>
          </div>
          <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-3 text-sm text-orange-200">
            🐾 Morgonfodring kl. 07:30 & kvällsfodring kl. 18:00
          </div>
        </div>
      </div>

      {/* Today's meals card */}
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 to-slate-900/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <ChefHat className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-white flex-1">Meny idag</h3>
          {todayMeal && (
            <button
              onClick={() => openEditMeal(todayMeal)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-slate-800 transition-all"
              aria-label="Redigera dagens meny"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {todayMeal ? (
          <div className="space-y-2">
            <div className="flex items-start justify-between text-sm">
              <span className="text-slate-400">Frukost</span>
              <span className="text-slate-200 text-right max-w-[60%]">
                {todayMeal.breakfast}
              </span>
            </div>
            <div className="flex items-start justify-between text-sm">
              <span className="text-slate-400">Lunch</span>
              <span className="text-slate-200 text-right max-w-[60%]">
                {todayMeal.lunch}
              </span>
            </div>
            <div className="flex items-start justify-between text-sm">
              <span className="text-slate-400">Middag</span>
              <span className="text-emerald-300 font-medium text-right max-w-[60%]">
                {todayMeal.dinner}
              </span>
            </div>
            <hr className="border-slate-700/50" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Lagar mat</span>
              <span className="text-emerald-400 font-medium capitalize">
                {getMemberName(todayMeal.cook)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-sm">Ingen meny planerad idag.</p>
        )}
      </div>

      {/* Reminders */}
      <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-950/30 to-slate-900/60 backdrop-blur-sm p-5">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
      </div>

      {/* Weekly meal plan */}
      <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <ChefHat className="w-5 h-5 text-slate-400" />
          <h3 className="font-semibold text-white">Veckans Matlista</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 text-xs uppercase tracking-wider">
                <th className="pb-3 pr-4 font-medium">Dag</th>
                <th className="pb-3 pr-4 font-medium">Frukost</th>
                <th className="pb-3 pr-4 font-medium">Lunch</th>
                <th className="pb-3 pr-4 font-medium">Middag</th>
                <th className="pb-3 pr-4 font-medium">Lagar</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {meals.map((meal) => (
                <tr
                  key={meal.day}
                  className={`${
                    meal.day === todayName
                      ? "bg-indigo-500/10"
                      : "hover:bg-slate-800/30"
                  } transition-colors group`}
                >
                  <td
                    className={`py-2.5 pr-4 font-medium ${
                      meal.day === todayName
                        ? "text-indigo-300"
                        : "text-slate-300"
                    }`}
                  >
                    {meal.day}
                    {meal.day === todayName && (
                      <span className="ml-1.5 text-xs bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded-full">
                        Idag
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4 text-slate-400">{meal.breakfast}</td>
                  <td className="py-2.5 pr-4 text-slate-400">{meal.lunch}</td>
                  <td className="py-2.5 pr-4 text-slate-200">{meal.dinner}</td>
                  <td className="py-2.5 pr-4 text-emerald-400 capitalize">
                    {getMemberName(meal.cook)}
                  </td>
                  <td className="py-2.5">
                    <button
                      onClick={() => openEditMeal(meal)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-400 hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100"
                      aria-label={`Redigera ${meal.day}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

      {/* Meal edit modal */}
      {mealModal !== null && mealForm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white text-lg">
                Redigera {mealForm.day}
              </h3>
              <button
                onClick={() => { setMealModal(null); setMealForm(null); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                aria-label="Stäng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Frukost</label>
                <input
                  type="text"
                  value={mealForm.breakfast}
                  onChange={(e) => setMealForm({ ...mealForm, breakfast: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Lunch</label>
                <input
                  type="text"
                  value={mealForm.lunch}
                  onChange={(e) => setMealForm({ ...mealForm, lunch: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Middag</label>
                <input
                  type="text"
                  value={mealForm.dinner}
                  onChange={(e) => setMealForm({ ...mealForm, dinner: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Lagar mat</label>
                <select
                  value={mealForm.cook}
                  onChange={(e) => setMealForm({ ...mealForm, cook: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  {familyMembers.filter((m) => m.role !== "pet").map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                  <option value="hela familjen">hela familjen</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setMealModal(null); setMealForm(null); }}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-sm font-medium transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={saveMeal}
                className="flex-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
              >
                Spara
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Luna feeder modal */}
      {lunaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white text-lg">Lunas matarschema</h3>
              <button
                onClick={() => setLunaModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                aria-label="Stäng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {DAYS_SV.slice(1).concat(DAYS_SV.slice(0, 1)).map((day) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-sm text-slate-400 w-20 flex-shrink-0">{day}</span>
                  <input
                    type="text"
                    value={lunaForm[day] ?? ""}
                    onChange={(e) => setLunaForm({ ...lunaForm, [day]: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-orange-500"
                    placeholder="Vem matar Luna?"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setLunaModal(false)}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-sm font-medium transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={saveLuna}
                className="flex-1 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-colors"
              >
                Spara
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
