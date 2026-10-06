"use client";

import { useMemo, useState } from "react";
import { Download, List, CalendarRange } from "lucide-react";
import { GlassButton, GlassCard, GlassChip } from "@/components/shared/glass";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { EmptyState } from "@/components/shared/empty-state";

type Agenda = { id: string; judul: string; deskripsi: string | null; lokasi: string | null; mulai: string; selesai: string | null };

function toIcsDate(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function downloadIcs(item: Agenda) {
  const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Taratara Tiga//Agenda//ID", "BEGIN:VEVENT", `UID:${item.id}@taratara3`, `DTSTAMP:${toIcsDate(new Date().toISOString())}`, `DTSTART:${toIcsDate(item.mulai)}`, item.selesai && `DTEND:${toIcsDate(item.selesai)}`, `SUMMARY:${item.judul}`, item.lokasi && `LOCATION:${item.lokasi}`, "END:VEVENT", "END:VCALENDAR"].filter(Boolean).join("\r\n");
  const url = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${item.judul.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.ics`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AgendaClient({ items }: { items: Agenda[] }) {
  const [phase, setPhase] = useState<"mendatang" | "selesai">("mendatang");
  const [view, setView] = useState<"list" | "calendar">("list");
  const visible = useMemo(() => { const now = new Date(); return items.filter((item) => phase === "mendatang" ? new Date(item.mulai) >= now : new Date(item.mulai) < now); }, [items, phase]);
  const grouped = useMemo(() => visible.reduce<Record<string, Agenda[]>>((result, item) => { const key = new Date(item.mulai).toLocaleDateString("id-ID", { month: "long", year: "numeric" }); (result[key] ??= []).push(item); return result; }, {}), [visible]);
  return <div><div className="flex flex-wrap items-center justify-between gap-3"><SegmentedControl options={[{ label: "Mendatang", value: "mendatang" }, { label: "Selesai", value: "selesai" }]} value={phase} onChange={setPhase} /><div className="glass-pill flex gap-1 p-1"><button className={`rounded-full p-2 ${view === "list" ? "bg-[var(--primary)] text-white" : ""}`} onClick={() => setView("list")} aria-label="Tampilan daftar"><List size={17} /></button><button className={`rounded-full p-2 ${view === "calendar" ? "bg-[var(--primary)] text-white" : ""}`} onClick={() => setView("calendar")} aria-label="Tampilan kalender"><CalendarRange size={17} /></button></div></div>{view === "calendar" ? <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(grouped).map(([month, monthItems]) => <GlassCard variant="strong" className="p-5" key={month}><h2 className="font-extrabold capitalize">{month}</h2><div className="mt-4 space-y-3">{monthItems.map((item) => <p key={item.id} className="text-sm"><b>{new Date(item.mulai).toLocaleDateString("id-ID", { day: "numeric" })}</b> · {item.judul}</p>)}</div></GlassCard>)}</div> : <div className="mt-6 space-y-4">{visible.map((item) => <GlassCard key={item.id} variant="strong" className="p-5 sm:flex sm:items-center sm:justify-between"><div><GlassChip>{new Date(item.mulai).toLocaleDateString("id-ID", { dateStyle: "medium" })}</GlassChip><h2 className="mt-3 text-xl font-extrabold">{item.judul}</h2><p className="text-muted mt-2 text-sm">{item.lokasi ?? "Lokasi belum ditentukan"} · {new Date(item.mulai).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</p>{item.deskripsi && <p className="mt-3 leading-7">{item.deskripsi}</p>}</div>{phase === "mendatang" && <GlassButton variant="secondary" className="mt-4 sm:mt-0" onClick={() => downloadIcs(item)}><Download size={16} />Tambah ke kalender</GlassButton>}</GlassCard>)}{!visible.length && <EmptyState title="Belum ada agenda" description="Agenda pada kategori ini belum tersedia." />}</div>}</div>;
}
