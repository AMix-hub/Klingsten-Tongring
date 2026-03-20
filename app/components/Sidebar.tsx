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
  Menu,
  X,
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
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 flex items-center px-4 bg-slate-950/90 border-b border-slate-800/60 backdrop-blur-md">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          aria-label="Öppna meny"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="ml-3 flex items-center gap-2">
          <span className="text-xl">🏠</span>
          <div>
            <p className="font-bold text-white text-sm leading-tight">
              Klingsten
            </p>
            <p className="font-bold text-indigo-400 text-xs leading-tight">
              Tongring
            </p>
          </div>
        </div>
      </div>

      {/* Mobile backdrop overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          // Mobile: fixed overlay drawer, slides in from left
          "fixed inset-y-0 left-0 z-50",
          "w-56",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: static in document flow, collapsible
          "md:relative md:inset-auto md:z-auto",
          "md:flex-shrink-0",
          collapsed ? "md:w-16" : "md:w-56",
          "md:translate-x-0",
          // Shared styles
          "flex flex-col min-h-screen",
          "bg-slate-950 md:bg-slate-950/80",
          "border-r border-slate-800/60",
          "backdrop-blur-md",
          "transition-transform md:transition-all duration-300",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800/60">
          <span className="text-2xl flex-shrink-0">🏠</span>
          {!collapsed && (
            <div className="flex-1">
              <p className="font-bold text-white text-sm leading-tight">
                Klingsten
              </p>
              <p className="font-bold text-indigo-400 text-sm leading-tight">
                Tongring
              </p>
            </div>
          )}
          {/* Close button – mobile only */}
          <button
            onClick={closeMobile}
            className="md:hidden ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            aria-label="Stäng meny"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 mt-2 overflow-y-auto" aria-label="Huvudnavigering">
          {navItems.map(({ icon: Icon, label, href }) => (
            <a
              key={href}
              href={href}
              onClick={closeMobile}
              title={collapsed ? label : undefined}
              aria-label={label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-indigo-500/10 hover:border-indigo-500/20 border border-transparent transition-all duration-200 group ${collapsed ? "justify-center" : ""}`}
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

        {/* Collapse toggle – desktop only */}
        <div className="hidden md:block p-2 border-t border-slate-800/60">
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
    </>
  );
}
