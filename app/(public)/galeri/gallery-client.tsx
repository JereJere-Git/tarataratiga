"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GlassCard, GlassChip } from "@/components/shared/glass";

type GalleryItem = { id: string; judul: string; album: string | null; gambar_url: string; urutan: number };

export function GalleryClient({ items }: { items: GalleryItem[] }) {
  const albums = ["Semua", ...Array.from(new Set(items.map((item) => item.album).filter(Boolean) as string[]))];
  const [album, setAlbum] = useState("Semua");
  const [selected, setSelected] = useState(-1);
  const touchStart = useRef<number | null>(null);
  const filtered = items.filter((item) => album === "Semua" || item.album === album);
  const active = filtered[selected];

  useEffect(() => {
    if (!active) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(-1);
      if (event.key === "ArrowLeft") setSelected((value) => (value - 1 + filtered.length) % filtered.length);
      if (event.key === "ArrowRight") setSelected((value) => (value + 1) % filtered.length);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, filtered.length]);

  return <div>
    <div className="flex flex-wrap gap-2">{albums.map((name) => <button key={name} onClick={() => { setAlbum(name); setSelected(-1); }}><GlassChip className={album === name ? "bg-[var(--primary)] text-white" : ""}>{name}</GlassChip></button>)}</div>
    <div className="mt-6 columns-2 gap-4 space-y-4 md:columns-3">{filtered.map((item, index) => <button key={item.id} className="group block w-full break-inside-avoid text-left" onClick={() => setSelected(index)}><GlassCard className="overflow-hidden"><Image src={item.gambar_url} alt={item.judul} width={800} height={600} loading="lazy" className="h-auto w-full object-cover transition duration-500 group-hover:scale-105" /><p className="p-3 text-sm font-bold">{item.judul}</p></GlassCard></button>)}</div>
    {active && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/80 p-5" role="dialog" aria-modal="true" onClick={() => setSelected(-1)}>
      <div className="glass-strong relative max-w-4xl rounded-[28px] p-3" onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => { if (touchStart.current === null) return; const distance = event.changedTouches[0]?.clientX - touchStart.current; if (Math.abs(distance) > 40) setSelected((value) => (value + (distance < 0 ? 1 : -1) + filtered.length) % filtered.length); touchStart.current = null; }} onClick={(event) => event.stopPropagation()}>
        <button className="focus-ring absolute right-4 top-4 rounded-full bg-white/80 p-2 text-slate-900" onClick={() => setSelected(-1)} aria-label="Tutup"><X size={20} /></button>
        <Image src={active.gambar_url} alt={active.judul} width={1200} height={800} className="max-h-[80vh] w-auto rounded-2xl object-contain" />
        <button className="absolute left-4 top-1/2 rounded-full bg-white/80 p-2 text-slate-900" onClick={() => setSelected((value) => (value - 1 + filtered.length) % filtered.length)} aria-label="Gambar sebelumnya"><ChevronLeft /></button>
        <button className="absolute right-4 top-1/2 rounded-full bg-white/80 p-2 text-slate-900" onClick={() => setSelected((value) => (value + 1) % filtered.length)} aria-label="Gambar berikutnya"><ChevronRight /></button>
      </div>
    </div>}
  </div>;
}
