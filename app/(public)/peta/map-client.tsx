"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import {
  Building2,
  Church,
  Cross,
  GraduationCap,
  House,
  Landmark,
  MapPin,
  Navigation,
  Search,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { GlassButton, GlassChip } from "@/components/shared/glass";

export const categoryMeta = {
  ibadah: ["Ibadah", Church, "#7C3AED"],
  kesehatan: ["Kesehatan", Cross, "#DC2626"],
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
  office,
  missingCount,
}: {
  locations: MapLocation[];
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
          location.nama.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [category, locations, query],
  );
  const center = office ? [office.lat, office.lng] : [locations[0]?.lat ?? 1.322, locations[0]?.lng ?? 124.838];

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-bold">{filtered.length} lokasi tampil</p>
          {office && (
            <GlassButton type="button" variant="secondary" onClick={() => setFocusedId("office")}>
              <Navigation size={16} /> Pusatkan ke kantor kelurahan
            </GlassButton>
          )}
        </div>
        <div className="h-[55dvh] min-h-[360px] overflow-hidden rounded-[28px] bg-white/85 shadow-lg md:h-[70dvh]">
          <LeafletMap locations={filtered} office={office} center={center} focusedId={focusedId} onFocus={setFocusedId} />
        </div>
        {missingCount > 0 && (
          <p className="mt-3 text-sm text-muted">
            {missingCount} lokasi belum memiliki koordinat dan tidak ditampilkan di peta.
          </p>
        )}
      </div>

      <aside className="min-w-0">
        <div className="rounded-[28px] bg-white/85 p-4 shadow-lg">
          <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4">
            <Search size={18} className="text-slate-600" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama lokasi..."
              className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-500"
              aria-label="Cari nama lokasi"
            />
          </label>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filter kategori">
            {(["semua", ...Object.keys(categoryMeta)] as Array<"semua" | Category>).map((key) => {
              const label: string = key === "semua" ? "Semua" : categoryMeta[key][0];
              const Icon: LucideIcon = key === "semua" ? MapPin : categoryMeta[key][1];
              return (
                <button key={key} type="button" onClick={() => setCategory(key)} className="shrink-0">
                  <GlassChip className={category === key ? "bg-[var(--primary)] text-white" : "text-slate-900"}>
                    <span className="flex items-center gap-2 whitespace-nowrap"><Icon size={15} />{label}</span>
                  </GlassChip>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {filtered.length ? (
            filtered.map((location) => {
              const [label, Icon, color] = categoryMeta[location.kategori];
              return (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => setFocusedId(location.id)}
                  className="focus-ring flex min-h-20 w-full items-start gap-3 rounded-3xl border border-slate-200 bg-white/90 p-4 text-left shadow-sm transition-transform hover:-translate-y-1"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: color }}>
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="text-xs font-bold" style={{ color }}>{label}</span>
                    <span className="mt-1 block truncate font-extrabold text-slate-950">{location.nama}</span>
                    <span className="mt-1 block truncate text-sm text-slate-700">{location.alamat}</span>
                  </span>
                </button>
              );
            })
          ) : (
            <EmptyState title="Lokasi tidak ditemukan" description="Coba kata kunci atau kategori lain." />
          )}
        </div>
      </aside>
    </div>
  );
}
