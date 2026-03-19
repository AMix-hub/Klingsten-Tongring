"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  UtensilsCrossed,
  Bell,
  ChevronLeft,
  ChevronRight,
  Cat,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#dashboard" },
  { icon: Users, label: "Familjen", href: "#members" },
  { icon: CheckSquare, label: "Uppgifter", href: "#tasks" },
  { icon: UtensilsCrossed, label: "Matlista", href: "#meals" },
  { icon: Bell, label: "Påminnelser", href: "#reminders" },
  { icon: Cat, label: "Luna", href: "#luna" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-56"
      } flex-shrink-0 flex flex-col min-h-screen bg-slate-950/80 border-r border-slate-800/60 backdrop-blur-md transition-all duration-300`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800/60">
        <span className="text-2xl flex-shrink-0">🏠</span>
        {!collapsed && (
          <div>
            <p className="font-bold text-white text-sm leading-tight">
              Klingsten
            </p>
            <p className="font-bold text-indigo-400 text-sm leading-tight">
              Tongring
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 mt-2">
        {navItems.map(({ icon: Icon, label, href }) => (
          <a
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-500/10 hover:border-indigo-500/20 border border-transparent transition-all duration-200 group"
          >
            <Icon className="w-5 h-5 flex-shrink-0 group-hover:text-indigo-400 transition-colors" />
            {!collapsed && (
              <span className="text-sm font-medium whitespace-nowrap">
                {label}
              </span>
            )}
          </a>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t border-slate-800/60">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs">Dölj</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
