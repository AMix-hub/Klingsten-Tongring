"use client";

import { useState } from "react";
import {
  familyMembers as initialMembers,
  colorMap,
  badgeColorMap,
  type FamilyMember,
} from "../lib/mockData";
import { useLocalStorage } from "../lib/useLocalStorage";
import { Pencil, X, Plus, Trash2 } from "lucide-react";

type MemberForm = Pick<FamilyMember, "name" | "emoji" | "status" | "responsibilities">;

function memberToForm(m: FamilyMember): MemberForm {
  return { name: m.name, emoji: m.emoji, status: m.status, responsibilities: [...m.responsibilities] };
}

function MemberCard({
  member,
  onEdit,
}: {
  member: FamilyMember;
  onEdit: (m: FamilyMember) => void;
}) {
  const colorClasses = colorMap[member.color] ?? colorMap["indigo"];
  const badgeClasses = badgeColorMap[member.color] ?? badgeColorMap["indigo"];

  return (
    <div
      className={`relative rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${colorClasses} bg-slate-900/60`}
    >
      {/* Edit button */}
      <button
        onClick={() => onEdit(member)}
        className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-all"
        aria-label={`Redigera ${member.name}`}
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{member.emoji}</span>
        <div>
          <h3 className="font-semibold text-white text-lg leading-tight">
            {member.name}
          </h3>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClasses}`}
          >
            {member.role === "parent"
              ? "Förälder"
              : member.role === "pet"
              ? "Husdjur"
              : "Barn"}
          </span>
        </div>

        {/* Status dot */}
        <div className="ml-auto flex items-center gap-1.5 pr-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-xs text-slate-400">{member.status}</span>
        </div>
      </div>

      {/* Responsibilities */}
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
          Ansvarsområden
        </p>
        <ul className="space-y-1">
          {member.responsibilities.map((resp, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 opacity-60"></span>
              {resp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function MemberCards() {
  const [members, setMembers] = useLocalStorage<FamilyMember[]>("familyMembers", initialMembers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MemberForm>({ name: "", emoji: "", status: "", responsibilities: [] });

  const openEdit = (m: FamilyMember) => {
    setForm(memberToForm(m));
    setEditingId(m.id);
  };

  const closeModal = () => setEditingId(null);

  const saveEdit = () => {
    if (!form.name.trim()) return;
    setMembers((prev) =>
      prev.map((m) => (m.id === editingId ? { ...m, ...form } : m))
    );
    closeModal();
  };

  const updateResponsibility = (index: number, value: string) => {
    const updated = [...form.responsibilities];
    updated[index] = value;
    setForm({ ...form, responsibilities: updated });
  };

  const addResponsibility = () => {
    setForm({ ...form, responsibilities: [...form.responsibilities, ""] });
  };

  const removeResponsibility = (index: number) => {
    setForm({
      ...form,
      responsibilities: form.responsibilities.filter((_, i) => i !== index),
    });
  };

  return (
    <section>
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span>👨‍👩‍👧‍👦</span> Familjemedlemmar
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} onEdit={openEdit} />
        ))}
      </div>

      {/* Edit member modal */}
      {editingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white text-lg">Redigera person</h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                aria-label="Stäng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Emoji</label>
                  <input
                    type="text"
                    value={form.emoji}
                    onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-lg text-center focus:outline-none focus:border-indigo-500"
                    maxLength={4}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Namn</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                    placeholder="Namn..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
                <input
                  type="text"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="t.ex. På jobbet, Hemma..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-400">Ansvarsområden</label>
                  <button
                    onClick={addResponsibility}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Lägg till
                  </button>
                </div>
                <div className="space-y-2">
                  {form.responsibilities.map((resp, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) => updateResponsibility(i, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                        placeholder="Ansvarsområde..."
                      />
                      <button
                        onClick={() => removeResponsibility(i)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-all flex-shrink-0"
                        aria-label="Ta bort"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
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
                onClick={saveEdit}
                disabled={!form.name.trim()}
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
