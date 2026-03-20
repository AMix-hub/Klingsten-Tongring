"use client";

import { useState } from "react";
import {
  familyMembers,
  rewardItems,
  type RewardItem,
} from "../lib/mockData";
import { Gift, Star, Trophy, X, CheckCircle } from "lucide-react";

const categoryLabels: Record<RewardItem["category"], string> = {
  activity: "Aktivitet",
  treat: "Godis & Nöje",
  privilege: "Privilegium",
  other: "Övrigt",
};

const categoryColors: Record<RewardItem["category"], string> = {
  activity: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  treat: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  privilege: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  other: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

export default function RewardShop() {
  const humanMembers = familyMembers.filter((m) => m.role !== "pet");

  const [points, setPoints] = useState<Record<string, number>>(
    Object.fromEntries(humanMembers.map((m) => [m.id, m.points]))
  );
  const [selectedMember, setSelectedMember] = useState(humanMembers[0]?.id ?? "");
  const [confirmItem, setConfirmItem] = useState<RewardItem | null>(null);
  const [redeemed, setRedeemed] = useState<string | null>(null);

  const currentPoints = points[selectedMember] ?? 0;
  const member = humanMembers.find((m) => m.id === selectedMember);

  const handleRedeem = (item: RewardItem) => {
    if (currentPoints < item.cost) return;
    setConfirmItem(item);
  };

  const confirmRedeem = () => {
    if (!confirmItem) return;
    setPoints((prev) => ({
      ...prev,
      [selectedMember]: (prev[selectedMember] ?? 0) - confirmItem.cost,
    }));
    setRedeemed(confirmItem.title);
    setConfirmItem(null);
    setTimeout(() => setRedeemed(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Success toast */}
      {redeemed && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-3 bg-emerald-950 border border-emerald-500/40 rounded-2xl px-4 py-3 shadow-xl">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <p className="text-sm text-emerald-300 font-medium">
            <span className="text-white">{redeemed}</span> har lösts in! 🎉
          </p>
        </div>
      )}

      {/* Member selector & points overview */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-slate-900/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold text-white">Välj familjemedlem</h3>
        </div>

        {/* Member buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {humanMembers.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMember(m.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                selectedMember === m.id
                  ? "bg-indigo-500/20 border-indigo-500/40 text-white"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <span>{m.emoji}</span>
              <span>{m.name}</span>
              <span
                className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                  selectedMember === m.id
                    ? "bg-indigo-500/30 text-indigo-200"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {points[m.id] ?? m.points} ⭐
              </span>
            </button>
          ))}
        </div>

        {/* Selected member's points */}
        {member && (
          <div className="flex items-center gap-4 rounded-xl bg-slate-800/50 border border-slate-700/50 p-4">
            <span className="text-4xl">{member.emoji}</span>
            <div className="flex-1">
              <p className="text-lg font-bold text-white">{member.name}</p>
              <p className="text-sm text-slate-400">Tillgängliga poäng</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-indigo-300">{currentPoints}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 justify-end">
                <Star className="w-3 h-3" />
                poäng
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-950/20 to-slate-900/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="font-semibold text-white">Topplista</h3>
        </div>
        <div className="space-y-2">
          {[...humanMembers]
            .sort((a, b) => (points[b.id] ?? b.points) - (points[a.id] ?? a.points))
            .map((m, i) => (
              <div
                key={m.id}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border ${
                  m.id === selectedMember
                    ? "bg-indigo-500/10 border-indigo-500/30"
                    : "bg-slate-800/30 border-slate-700/30"
                }`}
              >
                <span className="text-lg font-bold text-slate-500 w-6 text-center">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                </span>
                <span className="text-lg">{m.emoji}</span>
                <span className="flex-1 text-sm font-medium text-slate-200">{m.name}</span>
                <span className="text-sm font-bold text-yellow-300">
                  {points[m.id] ?? m.points} ⭐
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Reward shop */}
      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-slate-900/60 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-purple-400" />
          <h3 className="font-semibold text-white">Belöningsbutik</h3>
          <span className="ml-auto text-xs text-slate-500">
            Du har <span className="text-indigo-300 font-bold">{currentPoints}</span> poäng
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {rewardItems.map((item) => {
            const canAfford = currentPoints >= item.cost;
            return (
              <div
                key={item.id}
                className={`rounded-xl border p-4 flex flex-col gap-3 transition-all ${
                  canAfford
                    ? "bg-slate-800/50 border-slate-700/50 hover:border-purple-500/30"
                    : "bg-slate-900/40 border-slate-800/40 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      categoryColors[item.category]
                    }`}
                  >
                    {categoryLabels[item.category]}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <button
                  onClick={() => handleRedeem(item)}
                  disabled={!canAfford}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    canAfford
                      ? "bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 hover:border-purple-500/50"
                      : "bg-slate-800/50 text-slate-600 border border-slate-700/30 cursor-not-allowed"
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  {item.cost} poäng
                  {!canAfford && (
                    <span className="text-xs text-slate-600 ml-1">
                      (behöver {item.cost - currentPoints} till)
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirm modal */}
      {confirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-sm border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white text-lg">Lös in belöning</h3>
              <button
                onClick={() => setConfirmItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                aria-label="Stäng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center mb-6">
              <span className="text-5xl">{confirmItem.emoji}</span>
              <h4 className="text-xl font-bold text-white mt-3">{confirmItem.title}</h4>
              <p className="text-sm text-slate-400 mt-2">{confirmItem.description}</p>
              <div className="mt-4 rounded-xl bg-slate-800 border border-slate-700 p-3">
                <p className="text-xs text-slate-500">Kostnad</p>
                <p className="text-2xl font-bold text-indigo-300">
                  {confirmItem.cost} ⭐
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Kvar efter:{" "}
                  <span className="text-white font-medium">
                    {currentPoints - confirmItem.cost} poäng
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmItem(null)}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-sm font-medium transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={confirmRedeem}
                className="flex-1 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
              >
                Lös in! 🎉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
