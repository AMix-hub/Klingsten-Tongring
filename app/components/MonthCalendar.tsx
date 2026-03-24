"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import { familyMembers, type CalendarEvent, parseDateStr } from "../lib/mockData";
import { useCloudData } from "../lib/useCloudData";

const MONTHS_SV = [
  "Januari",
  "Februari",
  "Mars",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "Augusti",
  "September",
  "Oktober",
  "November",
  "December",
];

const WEEKDAYS_SHORT = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];

/** Format a local Date as "YYYY-MM-DD" without UTC conversion issues. */
function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Returns an array of Date-or-null representing the calendar grid for the
 *  given month. The grid starts on Monday (Swedish week convention). */
function getCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Monday-indexed day of week (Mon=0 … Sun=6)
  const startDow = (firstDay.getDay() + 6) % 7;
  const days: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++)
    days.push(new Date(year, month, d));
  const trailing = (7 - (days.length % 7)) % 7;
  for (let i = 0; i < trailing; i++) days.push(null);
  return days;
}

const humanMembers = familyMembers.filter((m) => m.role !== "pet");

type EventForm = {
  title: string;
  assignedTo: string;
  description: string;
};

function emptyForm(): EventForm {
  return { title: "", assignedTo: "", description: "" };
}

export default function MonthCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const [events, setEvents] = useCloudData<CalendarEvent[]>(
    "calendarEvents",
    []
  );

  // Modal state: null = closed, string = date selected for new event
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm());

  const days = getCalendarDays(viewYear, viewMonth);
  const todayStr = toLocalDateStr(today);

  const eventsForDate = (dateStr: string) =>
    events.filter((e) => e.date === dateStr);

  // Month navigation
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };
  const goToToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  // Open modal for adding a new event on a given date
  const openAdd = (dateStr: string) => {
    setEditEvent(null);
    setForm(emptyForm());
    setSelectedDate(dateStr);
  };

  // Open modal for editing an existing event
  const openEdit = (ev: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditEvent(ev);
    setForm({
      title: ev.title,
      assignedTo: ev.assignedTo ?? "",
      description: ev.description ?? "",
    });
    setSelectedDate(ev.date);
  };

  const closeModal = () => {
    setSelectedDate(null);
    setEditEvent(null);
    setForm(emptyForm());
  };

  const saveEvent = () => {
    if (!form.title.trim() || !selectedDate) return;
    if (editEvent) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editEvent.id
            ? {
                ...e,
                title: form.title,
                assignedTo: form.assignedTo || undefined,
                description: form.description || undefined,
              }
            : e
        )
      );
    } else {
      const newEvent: CalendarEvent = {
        id: `ev${Date.now()}`,
        date: selectedDate,
        title: form.title,
        assignedTo: form.assignedTo || undefined,
        description: form.description || undefined,
      };
      setEvents((prev) => [...prev, newEvent]);
    }
    closeModal();
  };

  const deleteEvent = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const getMemberName = (id: string) => {
    const m = humanMembers.find((m) => m.id === id);
    return m ? m.name : id;
  };

  return (
    <div className="space-y-4">
      {/* Month navigation header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          {MONTHS_SV[viewMonth]} {viewYear}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            aria-label="Föregående månad"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-all border border-slate-700/50"
          >
            Idag
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            aria-label="Nästa månad"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 to-slate-900/60 backdrop-blur-sm overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-slate-800/60">
          {WEEKDAYS_SHORT.map((d) => (
            <div
              key={d}
              className="py-2.5 text-center text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            if (!day) {
              return (
                <div
                  key={`empty-${i}`}
                  className="min-h-[80px] border-b border-r border-slate-800/30 bg-slate-900/20"
                />
              );
            }
            const dateStr = toLocalDateStr(day);
            const dayEvents = eventsForDate(dateStr);
            const isToday = dateStr === todayStr;
            const isPast = dateStr < todayStr;

            return (
              <div
                key={dateStr}
                onClick={() => openAdd(dateStr)}
                className={`min-h-[80px] p-1.5 border-b border-r border-slate-800/30 group cursor-pointer transition-colors ${
                  isToday
                    ? "bg-indigo-500/15"
                    : isPast
                    ? "opacity-50 hover:opacity-80 hover:bg-slate-800/20"
                    : "hover:bg-slate-800/30"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                      isToday
                        ? "bg-indigo-500 text-white"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openAdd(dateStr);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-600 hover:text-indigo-400 transition-all"
                    aria-label="Lägg till händelse"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => openEdit(ev, e)}
                      className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 truncate hover:bg-indigo-500/40 transition-colors cursor-pointer"
                      title={ev.title}
                    >
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-slate-500 pl-1">
                      +{dayEvents.length - 3} till
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit event modal */}
      {selectedDate !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-white text-lg">
                  {editEvent ? "Redigera händelse" : "Ny händelse"}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 capitalize">
                  {parseDateStr(selectedDate).toLocaleDateString(
                    "sv-SE",
                    { weekday: "long", day: "numeric", month: "long" }
                  )}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                aria-label="Stäng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Existing events on this day (when adding a new one) */}
            {!editEvent && eventsForDate(selectedDate).length > 0 && (
              <div className="mb-5 space-y-2">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Händelser denna dag
                </p>
                {eventsForDate(selectedDate).map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center gap-2 rounded-xl bg-slate-800/50 border border-slate-700/50 px-3 py-2"
                  >
                    <span className="flex-1 text-sm text-slate-200 truncate">
                      {ev.title}
                    </span>
                    {ev.assignedTo && (
                      <span className="text-xs text-slate-500">
                        {getMemberName(ev.assignedTo)}
                      </span>
                    )}
                    <button
                      onClick={(e) => openEdit(ev, e)}
                      className="p-1 rounded text-slate-500 hover:text-indigo-400 transition-all"
                      aria-label="Redigera"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => deleteEvent(ev.id, e)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-all"
                      aria-label="Ta bort"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <hr className="border-slate-700/50 mt-3" />
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium pt-1">
                  Lägg till ny händelse
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Titel *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && saveEvent()}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="T.ex. Fotbollsmatch, Födelsedag..."
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Ansvarig
                </label>
                <select
                  value={form.assignedTo}
                  onChange={(e) =>
                    setForm({ ...form, assignedTo: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="">— Hela familjen —</option>
                  {humanMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Anteckning (valfritt)
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && saveEvent()}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
                  placeholder="Extra information..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white text-sm font-medium transition-colors"
              >
                Avbryt
              </button>
              {editEvent && (
                <button
                  onClick={() => {
                    deleteEvent(editEvent.id);
                    closeModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 text-sm font-medium transition-colors"
                >
                  Ta bort
                </button>
              )}
              <button
                onClick={saveEvent}
                disabled={!form.title.trim()}
                className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                {editEvent ? "Spara" : "Lägg till"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
