"use client";

import {
  familyMembers,
  colorMap,
  badgeColorMap,
  type FamilyMember,
} from "@/lib/mockData";

function MemberCard({ member }: { member: FamilyMember }) {
  const colorClasses = colorMap[member.color] ?? colorMap["indigo"];
  const badgeClasses = badgeColorMap[member.color] ?? badgeColorMap["indigo"];

  return (
    <div
      className={`relative rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${colorClasses} bg-slate-900/60`}
    >
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
        <div className="ml-auto flex items-center gap-1.5">
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
  return (
    <section>
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span>👨‍👩‍👧‍👦</span> Familjemedlemmar
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {familyMembers.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}
