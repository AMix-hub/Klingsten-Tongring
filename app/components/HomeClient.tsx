"use client";

import { useState } from "react";
import { Heart, ChefHat, Dumbbell, Cat } from "lucide-react";
import Dashboard from "./Dashboard";
import { familyConfig } from "../../data/familyData";
import { weeklyMealPlan, familyMembers } from "../lib/mockData";

const DAYS_SV = ["Söndag","Måndag","Tisdag","Onsdag","Torsdag","Fredag","Lördag"];

function getTodayName() {
  return DAYS_SV[new Date().getDay()];
}

function getMemberName(id: string) {
  const m = familyMembers.find((m) => m.id === id);
  return m ? m.name : id;
}

export default function HomeClient() {
  const [lunaFed, setLunaFed] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const todayName = getTodayName();
  const todayMeal = weeklyMealPlan.find((m) => m.day === todayName);
  const children = familyConfig.members.filter((m) => m.role === "child");

  const getNextActivity = (childId: string) => {
    const todayIdx = DAYS_SV.indexOf(todayName);
    const remaining = familyConfig.schedule
      .filter((s) => s.childId === childId)
      .sort((a, b) => {
        const ai = DAYS_SV.indexOf(a.day);
        const bi = DAYS_SV.indexOf(b.day);
        const ad = (ai - todayIdx + 7) % 7;
        const bd = (bi - todayIdx + 7) % 7;
        return ad - bd;
      });
    return remaining[0] ?? null;
  };

  const handleLunaToggle = () => {
    setLunaFed((prev) => !prev);
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#020617] to-indigo-950/30 p-6 space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tighter">
          Välkommen,{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Familjen Klingsten/Tongring
          </span>{" "}
          👋
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Din smarta vardagsplanerare – håll koll på allt som händer idag.
        </p>
      </header>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Luna-Status */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Cat className="w-5 h-5 text-orange-400" />
            <h2 className="text-white font-semibold tracking-tighter">Luna – Status</h2>
          </div>
          <button
            onClick={handleLunaToggle}
            className={`relative w-full py-4 rounded-2xl font-bold text-lg tracking-tighter transition-all duration-300 shadow-lg flex items-center justify-center gap-3 ${
              lunaFed
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                : "bg-rose-500/20 border border-rose-500/40 text-rose-300"
            }`}
          >
            <Heart
              className={`w-6 h-6 transition-transform duration-300 ${
                heartAnim ? "scale-150" : "scale-100"
              } ${lunaFed ? "fill-emerald-400 text-emerald-400" : "text-rose-400"}`}
            />
            {lunaFed ? "Matad 🐾" : "Hungrig 😿"}
          </button>
          <p className="text-slate-400 text-xs text-center">
            Tryck för att växla Lunas matstatus
          </p>
        </div>

        {/* Vem gör vad? */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <ChefHat className="w-5 h-5 text-indigo-400" />
            <h2 className="text-white font-semibold tracking-tighter">Vem gör vad?</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-4 py-3">
              <span className="text-slate-400 text-sm">Middagsansvarig</span>
              <span className="text-indigo-300 font-bold text-sm">
                {todayMeal ? getMemberName(todayMeal.cook) : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-orange-500/10 border border-orange-500/20 px-4 py-3">
              <span className="text-slate-400 text-sm">Matar Luna</span>
              <span className="text-orange-300 font-bold text-sm">
                {familyConfig.members.find((m) => m.id === "mats")?.name ?? "—"}
              </span>
            </div>
            {todayMeal && (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
                <p className="text-slate-400 text-xs mb-1">Middag idag</p>
                <p className="text-emerald-300 font-semibold text-sm">{todayMeal.dinner}</p>
              </div>
            )}
          </div>
        </div>

        {/* Barnens aktiviteter */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Dumbbell className="w-5 h-5 text-purple-400" />
            <h2 className="text-white font-semibold tracking-tighter">Barnens aktiviteter</h2>
          </div>
          <div className="space-y-2">
            {children.map((child) => {
              const next = getNextActivity(child.id);
              return (
                <div
                  key={child.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 bg-slate-800/40 border border-white/5"
                >
                  <span className="text-lg">{child.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{child.name}</p>
                    {next ? (
                      <p className="text-slate-400 text-xs truncate">
                        {next.activity} · {next.day} {next.time}
                      </p>
                    ) : (
                      <p className="text-slate-600 text-xs">Inga aktiviteter</p>
                    )}
                  </div>
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: child.color }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <Dashboard />
    </div>
  );
}
