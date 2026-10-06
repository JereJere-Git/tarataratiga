"use client";

import { useMemo, useState } from "react";
import { Building2, GraduationCap, HeartPulse, Landmark, MapPin, Phone, Search, Shield, Church, House } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { GlassButton, GlassCard, GlassChip } from "@/components/shared/glass";

const categoryMeta = {
  ibadah: ["Ibadah", Church], kesehatan: ["Kesehatan", HeartPulse], pendidikan: ["Pendidikan", GraduationCap],
  pemerintahan: ["Pemerintahan", Landmark], keamanan: ["Keamanan", Shield], fasilitas_umum: ["Fasilitas umum", House], lainnya: ["Lainnya", Building2],
} as const;
type Category = keyof typeof categoryMeta;
type Item = { id: string; nama: string; kategori: Category; alamat: string; deskripsi: string | null; telepon: string | null; jam_operasional: string | null; lat: number; lng: number; urutan: number };
export function LocationClient({ items }: { items: Item[] }) {
  const [category, setCategory] = useState<"semua" | Category>("semua");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => items.filter((item) => (category === "semua" || item.kategori === category) && item.nama.toLowerCase().includes(query.toLowerCase())), [items, category, query]);
  const filterOptions: Array<"semua" | Category> = ["semua", ...Object.keys(categoryMeta) as Category[]];
  return <div><div className="glass-strong rounded-[28px] p-4"><label className="flex min-h-12 items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/60 px-4 dark:bg-black/10"><Search size={18} className="text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama lokasi..." className="w-full bg-transparent outline-none" aria-label="Cari lokasi penting" /></label><div className="mt-4 flex gap-2 overflow-x-auto pb-1">{filterOptions.map((key) => { const Icon = key === "semua" ? MapPin : categoryMeta[key][1]; const label = key === "semua" ? "Semua" : categoryMeta[key][0]; return <button key={key} onClick={() => setCategory(key)}><GlassChip className={`inline-flex items-center gap-2 whitespace-nowrap ${category === key ? "bg-[var(--primary)] text-white" : ""}`}><Icon size={15} />{label}</GlassChip></button>; })}</div></div><div className="mt-6 grid gap-4 md:grid-cols-2">{filtered.length ? filtered.map((item) => <GlassCard key={item.id} className="p-5"><div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><MapPin size={20} /></span><div className="min-w-0"><GlassChip>{categoryMeta[item.kategori][0]}</GlassChip><h2 className="mt-3 text-lg font-extrabold">{item.nama}</h2><p className="text-muted mt-2 text-sm">{item.alamat}</p>{item.jam_operasional && <p className="mt-2 text-sm font-semibold">{item.jam_operasional}</p>}{item.deskripsi && <p className="text-muted mt-2 line-clamp-2 text-sm leading-6">{item.deskripsi}</p>}</div></div><div className="mt-5 flex flex-wrap gap-2">{item.telepon && <a href={`tel:${item.telepon}`}><GlassButton type="button" variant="secondary"><Phone size={16} />Telepon</GlassButton></a>}<a href={`https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`} target="_blank" rel="noreferrer"><GlassButton type="button"><MapPin size={16} />Buka di Google Maps</GlassButton></a></div></GlassCard>) : <div className="md:col-span-2"><EmptyState title="Lokasi belum ditemukan" description="Coba kata kunci atau kategori lain." /></div>}</div></div>;
}
