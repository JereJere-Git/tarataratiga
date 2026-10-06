"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, MapPin, Phone, Search, Store, Sprout } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { GlassButton, GlassCard, GlassChip } from "@/components/shared/glass";

type Umkm = { id: string; nama: string; kategori: string; deskripsi: string | null; alamat: string; telepon: string | null; whatsapp: string | null; jam_operasional: string | null; urutan: number };
type Potensi = { id: string; nama: string; kategori: string; deskripsi: string; lokasi: string | null; urutan: number };

export function CatalogList({ kind, items }: { kind: "umkm" | "potensi"; items: Array<Umkm | Potensi> }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => items.filter((item) => `${item.nama} ${item.kategori} ${"alamat" in item ? item.alamat : item.lokasi ?? ""}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  const isUmkm = kind === "umkm";
  return <div><div className="glass-strong rounded-[28px] p-4"><label className="flex min-h-12 items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/60 px-4 dark:bg-black/10"><Search size={18} className="text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Cari ${isUmkm ? "UMKM" : "potensi"}...`} className="w-full bg-transparent outline-none" aria-label={`Cari ${isUmkm ? "UMKM" : "potensi"}`} /></label></div><div className="mt-6 grid gap-4 md:grid-cols-2">{filtered.length ? filtered.map((item) => { const umkm = item as Umkm; const potensi = item as Potensi; return <GlassCard key={item.id} className="p-5"><div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">{isUmkm ? <Store size={20} /> : <Sprout size={20} />}</span><div className="min-w-0"><GlassChip>{item.kategori}</GlassChip><h2 className="mt-3 text-lg font-extrabold">{item.nama}</h2><p className="text-muted mt-2 text-sm leading-6">{item.deskripsi}</p><p className="text-muted mt-3 flex items-center gap-2 text-sm"><MapPin size={15} />{isUmkm ? umkm.alamat : potensi.lokasi ?? "Lokasi belum dicantumkan"}</p>{isUmkm && umkm.jam_operasional && <p className="mt-2 text-sm font-semibold">{umkm.jam_operasional}</p>}</div></div>{isUmkm && <div className="mt-5 flex flex-wrap gap-2">{(umkm.telepon || umkm.whatsapp) && <a href={`tel:${umkm.telepon || umkm.whatsapp}`}><GlassButton type="button" variant="secondary"><Phone size={16} />Hubungi</GlassButton></a>}{umkm.whatsapp && <a href={`https://wa.me/${umkm.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"><GlassButton type="button"><ArrowUpRight size={16} />WhatsApp</GlassButton></a>}</div>}</GlassCard>; }) : <div className="md:col-span-2"><EmptyState title={`${isUmkm ? "UMKM" : "Potensi"} tidak ditemukan`} description="Coba kata kunci lain atau hapus pencarian." /></div>}</div></div>;
}
