"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Building2, Church, GraduationCap, HeartPulse, Landmark, MapPin, Store } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/layout";
import { KATEGORI, fasilitas, mapsUrl, type Fasilitas, type Kategori } from "@/lib/fasilitas";

const ICONS: Record<Kategori, ReactNode> = {
  pemerintahan: <Landmark size={30} />,
  kesehatan: <HeartPulse size={30} />,
  ekonomi: <Store size={30} />,
  ibadah: <Church size={30} />,
  pendidikan: <GraduationCap size={30} />,
  lainnya: <Building2 size={30} />,
};

const FILTERS: ("semua" | Kategori)[] = ["semua", ...(Object.keys(KATEGORI) as Kategori[])];
const LIMIT = 8;

function FasilitasCard({ item }: { item: Fasilitas }) {
  const [failed, setFailed] = useState(false);
  const url = mapsUrl(item);
  return (
    <article className="flex flex-col overflow-hidden rounded-[24px] border border-[var(--line)] bg-white/80 shadow-sm dark:bg-[#0a2d26]/80">
      <div className="relative aspect-[4/3] w-full bg-[var(--primary-soft)]">
        {item.foto && !failed ? (
          <Image
            src={item.foto}
            alt={item.nama}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--primary)] opacity-70">{ICONS[item.kategori]}</div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-emerald-800 shadow-sm">
          {KATEGORI[item.kategori]}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-extrabold leading-snug sm:text-base">{item.nama}</h3>
        <p className="text-muted mt-1 flex-1 text-xs leading-5">{item.deskripsi}</p>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring mt-3 inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-[var(--primary)] px-4 text-xs font-bold text-white transition-transform hover:scale-[1.03] active:scale-95"
          >
            <MapPin size={14} />Lihat lokasi
          </a>
        ) : (
          <span aria-disabled="true" className="mt-3 inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--line)] px-4 text-xs font-semibold text-muted">
            Lokasi segera hadir
          </span>
        )}
      </div>
    </article>
  );
}

export function FasilitasSection() {
  const [filter, setFilter] = useState<"semua" | Kategori>("semua");
  const [expanded, setExpanded] = useState(false);

  const list = filter === "semua" ? fasilitas : fasilitas.filter((item) => item.kategori === filter);
  const collapsible = filter === "semua" && list.length > LIMIT;
  const visible = collapsible && !expanded ? list.slice(0, LIMIT) : list;

  return (
    <Reveal id="fasilitas" className="py-10">
      <SectionHeading eyebrow="Infrastruktur" title="Fasilitas Kelurahan" description="Fasilitas umum yang tersedia untuk mendukung kegiatan warga." />

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter kategori fasilitas">
        {FILTERS.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
            className={`focus-ring min-h-11 shrink-0 rounded-full border px-4 text-sm font-bold ${
              filter === key ? "border-transparent bg-[var(--primary)] text-white" : "border-[var(--line)] bg-white/70 dark:bg-white/10"
            }`}
          >
            {key === "semua" ? "Semua" : KATEGORI[key]}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {visible.map((item) => <FasilitasCard key={item.nama} item={item} />)}
      </div>

      {collapsible && (
        <div className="mt-6 text-center">
          <button type="button" onClick={() => setExpanded((value) => !value)} className="focus-ring min-h-11 rounded-full border border-[var(--line)] bg-white/70 px-6 text-sm font-bold text-[var(--primary)] dark:bg-white/10">
            {expanded ? "Tampilkan lebih sedikit" : `Tampilkan semua (${list.length})`}
          </button>
        </div>
      )}
    </Reveal>
  );
}
