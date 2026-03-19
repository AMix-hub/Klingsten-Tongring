"use client";

import {
  weeklyMealPlan,
  reminders,
  lunaFeeder,
  familyMembers,
} from "@/lib/mockData";
import { Bell, ChefHat, Cat, Calendar } from "lucide-react";

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

export default function Dashboard() {
  const todayName = getTodayName();
  const todayMeal = weeklyMealPlan.find((m) => m.day === todayName);
  const lunaFeederToday = lunaFeeder[todayName] ?? "Okänd";

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
          <h3 className="font-semibold text-white">Luna 🐱 idag</h3>
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
          <h3 className="font-semibold text-white">Meny idag</h3>
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
          <h3 className="font-semibold text-white">Påminnelser</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {reminders.map((r) => (
            <div
              key={r.id}
              className={`flex items-start gap-3 rounded-xl p-3 border ${
                r.urgent
                  ? "bg-rose-500/10 border-rose-500/30"
                  : "bg-slate-800/50 border-slate-700/50"
              }`}
            >
              <span className="text-lg">{r.urgent ? "🔴" : "🔵"}</span>
              <div>
                <p className="text-sm font-medium text-slate-200">{r.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {getMemberName(r.assignedTo)} · {r.time}
                </p>
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
                <th className="pb-3 font-medium">Lagar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {weeklyMealPlan.map((meal) => (
                <tr
                  key={meal.day}
                  className={`${
                    meal.day === todayName
                      ? "bg-indigo-500/10"
                      : "hover:bg-slate-800/30"
                  } transition-colors`}
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
                  <td className="py-2.5 text-emerald-400 capitalize">
                    {getMemberName(meal.cook)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
