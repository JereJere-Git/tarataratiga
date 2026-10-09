"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  Building2,
  Church,
  Cross,
  Store,
  GraduationCap,
  House,
  Landmark,
  MapPin,
  MapPinned,
  Navigation,
  Search,
  Shield,
  X,
  ExternalLink,
  Clock3,
  Phone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { GlassButton } from "@/components/shared/glass";

export const categoryMeta = {
  ibadah: ["Ibadah", Church, "#7C3AED"],
  kesehatan: ["Kesehatan", Cross, "#DC2626"],
  ekonomi: ["Ekonomi", Store, "#047857"],
  pendidikan: ["Pendidikan", GraduationCap, "#0369A1"],
  pemerintahan: ["Pemerintahan", Landmark, "#1D4ED8"],
  keamanan: ["Keamanan", Shield, "#B45309"],
  fasilitas_umum: ["Fasilitas umum", House, "#0F766E"],
  lainnya: ["Lainnya", Building2, "#475569"],
} as const;

export type Category = keyof typeof categoryMeta;
export type MapLocation = {
  id: string;
  nama: string;
  kategori: Category;
  alamat: string;
  deskripsi: string | null;
  telepon: string | null;
  jam_operasional: string | null;
  lat: number;
  lng: number;
  urutan: number;
};
export type MapFacility = {
  id: string;
  nama: string;
  kategori: Category;
  alamat: string;
  deskripsi: string;
  maps_url: string | null;
};
export type OfficeLocation = {
  nama: string;
  alamat: string | null;
  telepon: string | null;
  lat: number;
  lng: number;
};

const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => <div className="h-[55dvh] min-h-[360px] w-full animate-pulse bg-slate-200/80 md:h-[70dvh]" aria-label="Memuat peta" />,
});

export function MapClient({
  locations,
  facilities,
  office,
  missingCount,
}: {
  locations: MapLocation[];
  facilities: MapFacility[];
  office: OfficeLocation | null;
  missingCount: number;
}) {
  const [category, setCategory] = useState<"semua" | Category>("semua");
  const [query, setQuery] = useState("");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const filtered = useMemo(
    () =>
      locations.filter(
        (location) =>
          (category === "semua" || location.kategori === category) &&
          `${location.nama} ${location.alamat}`.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [category, locations, query],
  );
  const filteredFacilities = useMemo(
    () => facilities.filter((facility) =>
      (category === "semua" || facility.kategori === category) &&
      `${facility.nama} ${facility.alamat} ${facility.deskripsi}`.toLowerCase().includes(query.trim().toLowerCase()),
    ),
    [category, facilities, query],
  );
  const center = office ? [office.lat, office.lng] : [locations[0]?.lat ?? 1.322, locations[0]?.lng ?? 124.838];
  const selectedLocation = filtered.find((location) => location.id === focusedId) ?? null;
  const activeCategoryCount = new Set([...locations.map((location) => location.kategori), ...facilities.map((facility) => facility.kategori)]).size;
  const totalPlaces = locations.length + facilities.length;

  return (
    <div className="space-y-5">
      <section className="glass-strong rounded-[28px] p-4 shadow-lg sm:p-5" aria-label="Cari dan filter lokasi">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--primary)]">Jelajahi sekitar</p><h2 className="mt-1 text-lg font-extrabold">Temukan tempat yang Anda perlukan</h2></div>
          <span className="glass-pill inline-flex min-h-9 items-center gap-2 px-3 text-xs font-bold"><MapPinned size={15} className="text-[var(--primary)]" />{totalPlaces + (office ? 1 : 0)} tempat · {activeCategoryCount} kategori</span>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(240px,.7fr)_minmax(0,1.3fr)] lg:items-center">
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-[var(--line)] bg-white/75 px-4 dark:bg-black/15">
            <Search size={18} className="shrink-0 text-[var(--primary)]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama atau alamat..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted" aria-label="Cari nama atau alamat lokasi" />
            {query && <button type="button" onClick={() => setQuery("")} className="focus-ring rounded-full p-1 text-muted" aria-label="Hapus pencarian"><X size={16} /></button>}
          </label>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" aria-label="Filter kategori">
            {(["semua", ...Object.keys(categoryMeta)] as Array<"semua" | Category>).map((key) => {
              const label: string = key === "semua" ? "Semua" : categoryMeta[key][0];
              const Icon: LucideIcon = key === "semua" ? MapPin : categoryMeta[key][1];
              const count = key === "semua" ? totalPlaces : locations.filter((location) => location.kategori === key).length + facilities.filter((facility) => facility.kategori === key).length;
              return <button key={key} type="button" onClick={() => setCategory(key)} aria-pressed={category === key} className={`focus-ring inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition ${category === key ? "border-[var(--primary)] bg-[var(--primary)] text-white shadow-md" : "border-[var(--line)] bg-white/55 text-[var(--foreground)] hover:bg-white/90 dark:bg-white/5"}`}><Icon size={14} />{label}<span className={category === key ? "text-white/75" : "text-muted"}>{count}</span></button>;
            })}
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(310px,.85fr)]">
        <section className="min-w-0" aria-label="Peta interaktif">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold"><span className="text-[var(--primary)]">{filtered.length + filteredFacilities.length}</span> lokasi cocok{query || category !== "semua" ? " dengan filter" : ""}</p>
            {office && <div className="flex flex-wrap gap-2">
              <GlassButton type="button" variant="secondary" onClick={() => setFocusedId("office")}><Navigation size={15} /> Kantor kelurahan</GlassButton>
              <a className="focus-ring glass-pill inline-flex min-h-11 items-center gap-2 px-4 text-xs font-bold" href={`https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}`} target="_blank" rel="noopener noreferrer"><MapPin size={15} />Rute Google</a>
            </div>}
          </div>
          <div className="relative z-0 isolate h-[48dvh] min-h-[320px] overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-xl shadow-emerald-950/10 sm:h-[55dvh] lg:h-[68dvh]">
            <LeafletMap locations={filtered} office={office} center={center} focusedId={focusedId} onFocus={setFocusedId} />
            <span className="pointer-events-none absolute bottom-3 left-3 z-[400] rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-slate-700 shadow-sm backdrop-blur">Peta © OpenStreetMap</span>
          </div>
          {missingCount > 0 && <p className="text-muted mt-3 text-xs leading-5">{missingCount} lokasi belum memiliki koordinat dan belum bisa ditampilkan.</p>}
          {selectedLocation && <div className="mt-4 rounded-3xl border border-[var(--primary)]/20 bg-[var(--primary-soft)]/70 p-4 dark:bg-[var(--primary-soft)]/30"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">Titik terpilih</p><h3 className="mt-1 font-extrabold">{selectedLocation.nama}</h3><p className="text-muted mt-1 text-sm">{selectedLocation.alamat}</p></div><button type="button" onClick={() => setFocusedId(null)} className="focus-ring rounded-full p-2" aria-label="Tutup detail lokasi"><X size={17} /></button></div><div className="mt-3 flex flex-wrap gap-2">{selectedLocation.telepon && <a href={`tel:${selectedLocation.telepon}`} className="focus-ring glass-pill inline-flex min-h-10 items-center gap-2 px-3 text-xs font-bold"><Phone size={14} />Telepon</a>}{selectedLocation.jam_operasional && <span className="glass-pill inline-flex min-h-10 items-center gap-2 px-3 text-xs font-semibold"><Clock3 size={14} />{selectedLocation.jam_operasional}</span>}<a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--primary)] px-4 text-xs font-bold text-white"><Navigation size={14} />Mulai rute<ExternalLink size={13} /></a></div>{selectedLocation.deskripsi && <p className="text-muted mt-3 text-sm leading-6">{selectedLocation.deskripsi}</p>}</div>}
        </section>

        <aside className="min-w-0">
          <div className="mb-3 flex items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--accent)]">Direktori</p><h2 className="mt-1 text-xl font-extrabold">Lokasi sekitar</h2></div><span className="text-xs font-semibold text-muted">{filtered.length + filteredFacilities.length} hasil</span></div>
          <div className="space-y-3 lg:max-h-[68dvh] lg:overflow-y-auto lg:pr-1">
            {office && <article className={`rounded-3xl border p-4 shadow-sm transition ${focusedId === "office" ? "border-[var(--primary)] bg-[var(--primary-soft)]/60 shadow-md" : "border-[var(--line)] bg-white/75 hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5"}`}><button type="button" onClick={() => setFocusedId("office")} className="focus-ring flex w-full items-start gap-3 rounded-2xl text-left"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white"><Landmark size={18} /></span><span className="min-w-0"><span className="text-xs font-bold text-[var(--primary)]">Kantor kelurahan</span><span className="mt-1 block font-extrabold">{office.nama}</span><span className="text-muted mt-1 block truncate text-sm">{office.alamat ?? "Taratara Tiga, Tomohon Barat"}</span></span></button><a className="focus-ring mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--primary)] px-4 text-xs font-bold text-white" href={`https://www.google.com/maps/dir/?api=1&destination=${office.lat},${office.lng}`} target="_blank" rel="noopener noreferrer"><Navigation size={14} />Petunjuk arah</a></article>}
            {filtered.length ? filtered.map((location) => {
              const [label, Icon, color] = categoryMeta[location.kategori];
              return <article key={location.id} className={`rounded-3xl border p-4 shadow-sm transition ${focusedId === location.id ? "border-[var(--primary)] bg-[var(--primary-soft)]/60 shadow-md" : "border-[var(--line)] bg-white/75 hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5"}`}><button type="button" onClick={() => setFocusedId(location.id)} aria-pressed={focusedId === location.id} className="focus-ring flex min-h-14 w-full items-start gap-3 rounded-2xl text-left"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm" style={{ backgroundColor: color }}><Icon size={17} /></span><span className="min-w-0 flex-1"><span className="text-xs font-bold" style={{ color }}>{label}</span><span className="mt-1 block font-extrabold">{location.nama}</span><span className="text-muted mt-1 block text-sm leading-5">{location.alamat}</span></span><Navigation size={16} className="mt-1 shrink-0 text-[var(--primary)]" /></button><div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--line)] pt-3">{location.jam_operasional ? <span className="text-muted flex min-w-0 items-center gap-1.5 truncate text-[11px]"><Clock3 size={13} className="shrink-0" />{location.jam_operasional}</span> : <span className="text-muted text-[11px]">Pilih untuk menandai di peta</span>}<a className="focus-ring inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-blue-50 px-3 text-[11px] font-bold text-blue-800 hover:bg-blue-100" href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer">Rute<ExternalLink size={12} /></a></div></article>;
            }) : !filteredFacilities.length && <EmptyState title="Lokasi tidak ditemukan" description="Ubah kata kunci atau pilih kategori lain." />}
            {filteredFacilities.length > 0 && <div className="pt-2"><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted"><Store size={14} />Dari daftar fasilitas</p><div className="space-y-3">{filteredFacilities.map((facility) => {
              const [label, Icon, color] = categoryMeta[facility.kategori];
              return <article key={facility.id} className={`rounded-3xl border p-4 shadow-sm transition ${focusedId === facility.id ? "border-[var(--primary)] bg-[var(--primary-soft)]/60 shadow-md" : "border-[var(--line)] bg-white/75 hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5"}`}><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm" style={{ backgroundColor: color }}><Icon size={17} /></span><div className="min-w-0 flex-1"><span className="text-xs font-bold" style={{ color }}>{label} · Fasilitas</span><h3 className="mt-1 font-extrabold">{facility.nama}</h3><p className="text-muted mt-1 text-sm leading-5">{facility.alamat}</p><p className="text-muted mt-2 line-clamp-2 text-xs leading-5">{facility.deskripsi}</p></div></div>{facility.maps_url ? <a className="focus-ring mt-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-blue-50 px-4 text-xs font-bold text-blue-800 hover:bg-blue-100" href={facility.maps_url} target="_blank" rel="noopener noreferrer"><Navigation size={14} />Lihat lokasi di Google Maps<ExternalLink size={12} /></a> : <span className="text-muted mt-3 block text-xs">Tautan lokasi belum tersedia.</span>}</article>;
            })}</div></div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
