import MonthCalendar from "../components/MonthCalendar";
import { CalendarDays } from "lucide-react";

export default function KalenderPage() {
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
          <CalendarDays className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Kalender</h1>
          <p className="text-sm text-slate-400">
            Planera framåt – händelser den aktuella veckan visas på dashboarden.
          </p>
        </div>
      </div>
      <MonthCalendar />
    </div>
  );
}
