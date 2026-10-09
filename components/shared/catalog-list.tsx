"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink, MapPin, Phone, Search, Store, Sprout } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { GlassCard, GlassChip } from "@/components/shared/glass";

type Umkm = { id: string; nama: string; kategori: string; deskripsi: string | null; alamat: string; telepon: string | null; whatsapp: string | null; jam_operasional: string | null; urutan: number };
type Potensi = { id: string; nama: string; kategori: string; deskripsi: string; lokasi: string | null; urutan: number };

export function CatalogList({ kind, items }: { kind: "umkm" | "potensi"; items: Array<Umkm | Potensi> }) {
  const [query, setQuery] = useState("");
  const isUmkm = kind === "umkm";
  const categories = useMemo(() => [...new Set(items.map((item) => item.kategori))], [items]);
  const [category, setCategory] = useState("semua");
  const filtered = useMemo(() => items.filter((item) => (category === "semua" || item.kategori === category) && `${item.nama} ${item.kategori} ${"alamat" in item ? item.alamat : item.lokasi ?? ""} ${item.deskripsi ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())), [category, items, query]);
  return <div>
    <section className="glass-strong rounded-[28px] p-4 shadow-sm sm:p-5" aria-label={`Pencarian ${isUmkm ? "UMKM" : "potensi"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-bold">{filtered.length} {isUmkm ? "usaha" : "potensi"} ditemukan</p><span className="text-xs text-muted">{isUmkm ? "Dukung usaha warga lokal" : "Data potensi kelurahan"}</span></div>
      <label className="mt-3 flex min-h-12 items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/60 px-4 dark:bg-black/10"><Search size={18} className="shrink-0 text-[var(--primary)]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Cari ${isUmkm ? "nama, kategori, atau alamat UMKM" : "nama atau kategori potensi"}...`} className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted" aria-label={`Cari ${isUmkm ? "UMKM" : "potensi"}`} /></label>
      {isUmkm && <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filter kategori UMKM"><button type="button" aria-pressed={category === "semua"} onClick={() => setCategory("semua")} className={`focus-ring min-h-10 shrink-0 rounded-full px-4 text-xs font-bold ${category === "semua" ? "bg-[var(--primary)] text-white" : "border border-[var(--line)] bg-white/50"}`}>Semua · {items.length}</button>{categories.map((itemCategory) => <button key={itemCategory} type="button" aria-pressed={category === itemCategory} onClick={() => setCategory(itemCategory)} className={`focus-ring min-h-10 shrink-0 rounded-full px-4 text-xs font-bold ${category === itemCategory ? "bg-[var(--primary)] text-white" : "border border-[var(--line)] bg-white/50"}`}>{itemCategory} · {items.filter((item) => item.kategori === itemCategory).length}</button>)}</div>}
    </section>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {filtered.length ? filtered.map((item) => {
        const umkm = item as Umkm;
        const potensi = item as Potensi;
        const address = isUmkm ? umkm.alamat : potensi.lokasi ?? "Lokasi belum dicantumkan";
        const mapsSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.nama}, ${address}, Taratara Tiga, Tomohon`)}`;
        return <GlassCard key={item.id} className="flex h-full flex-col p-5 transition-colors duration-200 hover:bg-white/75 dark:hover:bg-white/10 sm:p-6">
          <div className="flex items-start gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">{isUmkm ? <Store size={21} /> : <Sprout size={21} />}</span><div className="min-w-0 flex-1"><GlassChip>{item.kategori}</GlassChip><h2 className="mt-3 text-lg font-extrabold leading-snug sm:text-xl">{item.nama}</h2></div></div>
          <p className="text-muted mt-3 flex-1 text-sm leading-6">{item.deskripsi || (isUmkm ? "Usaha warga Kelurahan Taratara Tiga." : "Potensi lokal Kelurahan Taratara Tiga.")}</p>
          <p className="text-muted mt-4 flex items-start gap-2 text-sm"><MapPin size={16} className="mt-0.5 shrink-0 text-[var(--primary)]" /><span>{address}</span></p>
          {isUmkm && umkm.jam_operasional && <p className="text-muted mt-2 flex items-center gap-2 text-sm"><span aria-hidden>◷</span>{umkm.jam_operasional}</p>}
          <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
            {isUmkm && (umkm.telepon || umkm.whatsapp) && <a href={`tel:${umkm.telepon || umkm.whatsapp}`} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] px-4 text-sm font-bold"><Phone size={16} />Hubungi</a>}
            {isUmkm && umkm.whatsapp && <a href={`https://wa.me/${umkm.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--primary)] px-4 text-sm font-bold text-white"><ArrowUpRight size={16} />WhatsApp</a>}
            {isUmkm && <a href={mapsSearch} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] px-4 text-sm font-bold text-[var(--primary)]"><MapPin size={16} />Google Maps<ExternalLink size={13} /></a>}
          </div>
        </GlassCard>;
      }) : <div className="sm:col-span-2"><EmptyState title={`${isUmkm ? "UMKM" : "Potensi"} tidak ditemukan`} description="Coba kata kunci lain atau hapus filter kategori." /></div>}
    </div>
  </div>;
}
