"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Clipboard, Printer, Search, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { GlassButton, GlassCard, GlassChip } from "@/components/shared/glass";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { glassToast } from "@/components/shared/toast";

export function ServiceSearch({ services }: { services: { id: string; nama: string; slug: string; ringkasan: string | null }[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => services.filter((item) => `${item.nama} ${item.ringkasan ?? ""}`.toLowerCase().includes(query.toLowerCase())), [services, query]);
  return <div><label className="relative block max-w-xl"><Search className="absolute left-4 top-3.5 text-muted" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari layanan..." className="form-input glass-pill pl-11" /></label><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((item) => <GlassCard key={item.id} className="p-5"><GlassChip>Layanan publik</GlassChip><h2 className="mt-4 font-extrabold">{item.nama}</h2><p className="text-muted mt-2 text-sm leading-6">{item.ringkasan}</p><a href={`/layanan/${item.slug}`} className="mt-4 inline-flex min-h-11 items-center font-bold text-[var(--primary)]">Lihat detail <span aria-hidden> →</span></a></GlassCard>)}{!filtered.length && <p className="text-muted sm:col-span-2 lg:col-span-3">Layanan tidak ditemukan.</p>}</div></div>;
}

export function ServiceChecklist({ slug, items }: { slug: string; items: string[] }) {
  const key = `layanan-checklist-${slug}`;
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) return;
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === items.length && parsed.every((value) => typeof value === "boolean")) {
        // Restore a browser-only preference after hydration to keep server markup deterministic.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setChecked(parsed);
      }
    } catch {
      // Storage may be unavailable; the checklist still works for this visit.
    }
  }, [items.length, key]);
  function toggle(index: number) {
    const next = checked.map((value, itemIndex) => itemIndex === index ? !value : value);
    setChecked(next);
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Keep the current selection usable if storage is disabled or full.
    }
  }
  const complete = checked.filter(Boolean).length;
  return <div className="glass-strong rounded-[28px] p-6"><div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-extrabold">Checklist berkas</h2><p className="text-muted mt-1 text-sm">Tersimpan otomatis di perangkat ini.</p></div><span className="font-extrabold text-[var(--primary)]">{complete}/{items.length}</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--primary-soft)] dark:bg-[var(--primary-soft)]"><motion.div className="h-full rounded-full bg-[var(--primary)]" animate={{ width: `${items.length ? (complete / items.length) * 100 : 0}%` }} /></div><p className="mt-2 text-xs font-semibold text-muted">Berkas siap {complete} dari {items.length}</p><div className="mt-5 space-y-2">{items.map((item, index) => <label key={`${item}-${index}`} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl px-3 transition hover:bg-white/40"><input type="checkbox" checked={checked[index] ?? false} onChange={() => toggle(index)} className="peer sr-only" /><span className={`flex h-6 w-6 items-center justify-center rounded-lg border peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--primary)] ${checked[index] ? "border-[var(--primary)] bg-[var(--primary)] text-white" : "border-[var(--accent)]"}`}>{checked[index] && <Check size={15} />}</span><span className={checked[index] ? "text-muted line-through" : "font-semibold"}>{item}</span></label>)}</div><button type="button" onClick={() => window.print()} className="focus-ring glass-pill mt-5 inline-flex min-h-11 items-center gap-2 px-4 text-sm font-bold"><Printer size={16} />Cetak daftar syarat</button></div>;
}

export function ShareButtons({ title }: { title: string }) {
  async function copy() { await navigator.clipboard.writeText(window.location.href); glassToast("Tautan berhasil disalin."); }
  return <div className="flex flex-wrap gap-2"><GlassButton variant="secondary" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${window.location.href}`)}`, "_blank", "noopener,noreferrer")}><Share2 size={16} />WhatsApp</GlassButton><GlassButton variant="secondary" onClick={() => void copy()}><Clipboard size={16} />Salin tautan</GlassButton></div>;
}

export function ProfileTabs({ sejarah, visi, misi }: { sejarah: string | null; visi: string | null; misi: string | null }) {
  const [tab, setTab] = useState<"sejarah" | "visi" | "struktur">("sejarah");
  return <><SegmentedControl options={[{ label: "Sejarah", value: "sejarah" }, { label: "Visi & Misi", value: "visi" }, { label: "Struktur Organisasi", value: "struktur" }]} value={tab} onChange={setTab} /><div className="glass-strong mt-6 min-h-40 rounded-[28px] p-6">{tab === "sejarah" && <p className="leading-8">{sejarah ?? "Informasi sejarah belum tersedia."}</p>}{tab === "visi" && <div className="space-y-5"><div><h3 className="font-extrabold">Visi</h3><p className="text-muted mt-2 leading-7">{visi ?? "-"}</p></div><div><h3 className="font-extrabold">Misi</h3><p className="text-muted mt-2 leading-7">{misi ?? "-"}</p></div></div>}{tab === "struktur" && <p className="text-muted leading-7">Struktur organisasi ditampilkan pada kartu pejabat di bawah.</p>}</div></>;
}
