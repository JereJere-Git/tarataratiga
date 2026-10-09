"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GlassCard } from "@/components/shared/glass";

type GalleryItem = { id: string; judul: string; gambar_url: string; deskripsi?: string };

export function GalleryClient({ items }: { items: GalleryItem[] }) {
  const [selected, setSelected] = useState(-1);
  const touchStart = useRef<number | null>(null);
  const active = items[selected];

  useEffect(() => {
    if (!active) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(-1);
      if (event.key === "ArrowLeft") setSelected((value) => (value - 1 + items.length) % items.length);
      if (event.key === "ArrowRight") setSelected((value) => (value + 1) % items.length);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, items.length]);

  return <div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">{items.map((item, index) => <button key={item.id} className="focus-ring group block min-w-0 rounded-3xl text-left transition-transform duration-300 hover:-translate-y-1" onClick={() => setSelected(index)} aria-label={`Lihat foto: ${item.judul}`}><GlassCard className="h-full overflow-hidden transition-shadow duration-300 group-hover:shadow-xl"><div className="aspect-[4/3] overflow-hidden bg-[var(--primary-soft)]"><Image src={item.gambar_url} alt={item.judul} width={800} height={600} loading="lazy" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-hover:saturate-110" /></div><div className="min-h-[88px] p-3"><p className="line-clamp-1 text-xs font-extrabold leading-5 transition-colors group-hover:text-[var(--primary)] sm:text-sm">{item.judul}</p>{item.deskripsi && <p className="text-muted mt-1 line-clamp-2 text-[11px] leading-4 sm:text-xs">{item.deskripsi}</p>}</div></GlassCard></button>)}</div>
    {active && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-5" role="dialog" aria-modal="true" onClick={() => setSelected(-1)}>
      <div className="glass-strong relative max-w-4xl rounded-[28px] p-3" onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { if (touchStart.current === null) return; const distance = event.changedTouches[0]?.clientX - touchStart.current; if (Math.abs(distance) > 40) setSelected((value) => (value + (distance < 0 ? 1 : -1) + items.length) % items.length); touchStart.current = null; }} onClick={(event) => event.stopPropagation()}>
        <button className="focus-ring absolute right-4 top-4 rounded-full bg-white/80 p-2 text-slate-900" onClick={() => setSelected(-1)} aria-label="Tutup"><X size={20} /></button>
        <Image src={active.gambar_url} alt={active.judul} width={1200} height={800} className="max-h-[80vh] w-auto rounded-2xl object-contain" />
        <button className="absolute left-4 top-1/2 rounded-full bg-white/80 p-2 text-slate-900" onClick={() => setSelected((value) => (value - 1 + items.length) % items.length)} aria-label="Gambar sebelumnya"><ChevronLeft /></button>
        <button className="absolute right-4 top-1/2 rounded-full bg-white/80 p-2 text-slate-900" onClick={() => setSelected((value) => (value + 1) % items.length)} aria-label="Gambar berikutnya"><ChevronRight /></button>
      </div>
    </div>}
  </div>;
}
