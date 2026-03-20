"use client";

import { useState } from "react";
import {
  weeklyMealPlan as initialMealPlan,
  familyMembers,
  DAYS_SV,
  getTodayName,
  type MealPlan,
} from "../lib/mockData";
import { useLocalStorage } from "../lib/useLocalStorage";
import { ChefHat, Pencil, X } from "lucide-react";

function getMemberName(id: string): string {
  const m = familyMembers.find((m) => m.id === id);
  return m ? m.name : id;
}

export default function MealPlanner() {
  const todayName = getTodayName();
  const [meals, setMeals] = useLocalStorage<MealPlan[]>("mealPlan", initialMealPlan);
  const [mealModal, setMealModal] = useState<MealPlan | null>(null);
  const [mealForm, setMealForm] = useState<MealPlan | null>(null);

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

  const todayMeal = meals.find((m) => m.day === todayName);

  return (
    <>
      {/* Today's meal summary */}
      {todayMeal && (
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 to-slate-900/60 backdrop-blur-sm p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ChefHat className="w-5 h-5 text-emerald-400" />
            <h3 className="font-semibold text-white flex-1">Meny idag – {todayName}</h3>
            <button
              onClick={() => openEditMeal(todayMeal)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-slate-800 transition-all"
              aria-label="Redigera dagens meny"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-3">
              <p className="text-xs text-slate-500 mb-1">Frukost</p>
              <p className="text-sm text-slate-200">{todayMeal.breakfast}</p>
            </div>
            <div className="rounded-xl bg-slate-800/50 border border-slate-700/50 p-3">
              <p className="text-xs text-slate-500 mb-1">Lunch</p>
              <p className="text-sm text-slate-200">{todayMeal.lunch}</p>
            </div>
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
              <p className="text-xs text-emerald-500 mb-1">Middag</p>
              <p className="text-sm text-emerald-300 font-medium">{todayMeal.dinner}</p>
              <p className="text-xs text-slate-500 mt-1">
                Lagar: {getMemberName(todayMeal.cook)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weekly meal plan table */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-sm p-5">
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
                      meal.day === todayName ? "text-indigo-300" : "text-slate-300"
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
    </>
  );
}
