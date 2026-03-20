"use client";

import { useState } from "react";
import { lunaFeeder as initialLunaFeeder } from "../lib/mockData";
import { Cat, Pencil, X } from "lucide-react";

const DAYS_SV = [
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
  "Söndag",
];

function getTodayName(): string {
  const allDays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
  return allDays[new Date().getDay()];
}

export default function LunaSchedule() {
  const todayName = getTodayName();
  const [lunaFeeder, setLunaFeeder] = useState<Record<string, string>>(initialLunaFeeder);
  const [lunaModal, setLunaModal] = useState(false);
  const [lunaForm, setLunaForm] = useState<Record<string, string>>(initialLunaFeeder);

  const openLunaEdit = () => {
    setLunaForm({ ...lunaFeeder });
    setLunaModal(true);
  };

  const saveLuna = () => {
    setLunaFeeder(lunaForm);
    setLunaModal(false);
  };

  const lunaFeederToday = lunaFeeder[todayName] ?? "Okänd";

  return (
    <>
      <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-950/40 to-slate-900/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Cat className="w-5 h-5 text-orange-400" />
          <h3 className="font-semibold text-white flex-1">Luna 🐱 – Matarschema</h3>
          <button
            onClick={openLunaEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-sm font-medium transition-colors border border-orange-500/30"
            aria-label="Redigera Lunas schema"
          >
            <Pencil className="w-3.5 h-3.5" />
            Redigera
          </button>
        </div>

        <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-3 text-sm text-orange-200 mb-4">
          🐾 Morgonfodring kl. 07:30 &amp; kvällsfodring kl. 18:00
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DAYS_SV.map((day) => (
            <div
              key={day}
              className={`rounded-xl p-3 border ${
                day === todayName
                  ? "bg-orange-500/20 border-orange-500/40"
                  : "bg-slate-800/50 border-slate-700/50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p
                  className={`text-xs font-medium uppercase tracking-wider ${
                    day === todayName ? "text-orange-300" : "text-slate-500"
                  }`}
                >
                  {day}
                </p>
                {day === todayName && (
                  <span className="text-xs bg-orange-500/30 text-orange-300 px-1.5 py-0.5 rounded-full">
                    Idag
                  </span>
                )}
              </div>
              <p
                className={`text-sm font-semibold ${
                  day === todayName ? "text-orange-200" : "text-slate-300"
                }`}
              >
                {lunaFeeder[day] ?? "—"}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
          <span className="text-3xl">🐱</span>
          <div>
            <p className="text-sm text-slate-400">Matar Luna idag</p>
            <p className="text-lg font-bold text-orange-300">{lunaFeederToday}</p>
          </div>
        </div>
      </div>

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
              {DAYS_SV.map((day) => (
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
    </>
  );
}
