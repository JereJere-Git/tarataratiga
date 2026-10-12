"use client";

import { useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, CircleDot } from "lucide-react";
import type { JadwalPelayanan } from "@/lib/jam";

const TIME_ZONE = "Asia/Makassar";
const DAY_KEYS = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"] as const;
const DAY_LABELS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const DAY_LONG = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

function todayInTomohon(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "0";
  return { year: Number(part("year")), month: Number(part("month")) - 1, day: Number(part("day")) };
}

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function shiftMonth(year: number, month: number, delta: number) {
  const next = new Date(Date.UTC(year, month + delta, 1));
  return { year: next.getUTCFullYear(), month: next.getUTCMonth() };
}

function formatTime(value: string) {
  return value.replace(":", ".");
}

export function OfficeCalendar({ schedule }: { schedule: JadwalPelayanan }) {
  const initial = todayInTomohon();
  const [display, setDisplay] = useState({ year: initial.year, month: initial.month });
  const [selectedDate, setSelectedDate] = useState(dateKey(initial.year, initial.month, initial.day));
  const [todayKey, setTodayKey] = useState(dateKey(initial.year, initial.month, initial.day));

  useEffect(() => {
    const updateToday = () => {
      const current = todayInTomohon();
      setTodayKey(dateKey(current.year, current.month, current.day));
    };
    const timer = window.setInterval(updateToday, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const firstWeekday = new Date(Date.UTC(display.year, display.month, 1)).getUTCDay();
  const dayCount = new Date(Date.UTC(display.year, display.month + 1, 0)).getUTCDate();
  const cells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: dayCount }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedParts = selectedDate.split("-").map(Number);
  const selectedYear = selectedParts[0] ?? display.year;
  const selectedMonth = (selectedParts[1] ?? display.month + 1) - 1;
  const selectedDay = selectedParts[2] ?? 1;
  const selected = new Date(Date.UTC(selectedYear, selectedMonth, selectedDay));
  const selectedHours = schedule[DAY_KEYS[selected.getUTCDay()]];
  const monthLabel = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(display.year, display.month, 1)));
  const selectedLabel = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(selected);
  const selectedIsOpen = Boolean(selectedHours?.buka && selectedHours?.tutup);

  function changeMonth(delta: number) {
    const next = shiftMonth(display.year, display.month, delta);
    setDisplay(next);
    setSelectedDate(dateKey(next.year, next.month, 1));
  }

  return <section aria-label="Kalender jam pelayanan" className="rounded-2xl border border-[var(--line)] bg-white/40 p-3 dark:bg-white/[.03] sm:p-4">
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]"><CalendarDays size={17} /></span>
        <div className="min-w-0"><p className="truncate text-sm font-extrabold capitalize">{monthLabel}</p><span className="text-muted text-[10px]">Kalender jam pelayanan</span></div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <span className="mr-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300"><CircleDot size={11} />Live</span>
        <button type="button" onClick={() => changeMonth(-1)} aria-label="Bulan sebelumnya" className="focus-ring flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--primary-soft)]"><ChevronLeft size={17} /></button>
        <button type="button" onClick={() => changeMonth(1)} aria-label="Bulan berikutnya" className="focus-ring flex h-9 w-9 items-center justify-center rounded-full hover:bg-[var(--primary-soft)]"><ChevronRight size={17} /></button>
      </div>
    </div>

    <div className="mt-3 grid grid-cols-7 gap-1 text-center" role="grid" aria-label={monthLabel}>
      {DAY_LABELS.map((day) => <span key={day} role="columnheader" className="py-1 text-[10px] font-bold text-muted">{day}</span>)}
      {cells.map((day, index) => {
        if (day === null) return <span key={`blank-${index}`} aria-hidden="true" />;
        const key = dateKey(display.year, display.month, day);
        const weekday = new Date(Date.UTC(display.year, display.month, day)).getUTCDay();
        const hours = schedule[DAY_KEYS[weekday]];
        const isOpen = Boolean(hours?.buka && hours?.tutup);
        const isSelected = selectedDate === key;
        const isToday = todayKey === key;
        return <button key={key} type="button" role="gridcell" aria-pressed={isSelected} aria-current={isToday ? "date" : undefined} aria-label={`${DAY_LONG[weekday]} ${day}, ${isOpen ? `buka ${formatTime(hours.buka!)} sampai ${formatTime(hours.tutup!)}` : "tutup"}`} onClick={() => setSelectedDate(key)} className={`relative flex h-9 items-center justify-center rounded-xl text-xs font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)] ${isSelected ? "bg-[var(--primary)] text-white" : "hover:bg-[var(--primary-soft)]"} ${isToday && !isSelected ? "ring-1 ring-[var(--primary)]" : ""}`}>
          {day}<span className={`absolute bottom-1 h-1 w-1 rounded-full ${isOpen ? isSelected ? "bg-white" : "bg-emerald-500" : "bg-slate-300 dark:bg-white/20"}`} />
        </button>;
      })}
    </div>

    <div aria-live="polite" className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[var(--primary-soft)]/50 px-3 py-2.5">
      <span className="text-xs font-bold capitalize">{selectedLabel}</span>
      <span className={`text-xs font-bold ${selectedIsOpen ? "text-[var(--primary)]" : "text-muted"}`}>{selectedIsOpen ? `${formatTime(selectedHours.buka!)}–${formatTime(selectedHours.tutup!)}` : "Kantor tutup"}</span>
    </div>
  </section>;
}
