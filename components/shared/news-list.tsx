"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { GlassCard, GlassChip } from "@/components/shared/glass";

type News = { id: string; judul: string; slug: string; ringkasan: string | null; gambar_url: string | null; kategori: string | null; terbit_pada: string | null };
export function NewsList({ news }: { news: News[] }) {
  const categories = ["Semua", ...Array.from(new Set(news.map((item) => item.kategori).filter(Boolean) as string[]))];
  const [category, setCategory] = useState("Semua");
  const [limit, setLimit] = useState(6);
  const filtered = useMemo(() => news.filter((item) => category === "Semua" || item.kategori === category), [news, category]);
  return <><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} onClick={() => { setCategory(item); setLimit(6); }}><GlassChip className={category === item ? "bg-[var(--primary)] text-white" : ""}>{item}</GlassChip></button>)}</div><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.slice(0, limit).map((item) => <Link key={item.id} href={`/berita/${item.slug}`}><GlassCard className="h-full overflow-hidden p-3 transition hover:-translate-y-1"><div className="aspect-[16/9] rounded-2xl bg-[var(--primary-soft)] bg-cover bg-center dark:bg-[var(--primary-soft)]" style={item.gambar_url ? { backgroundImage: `url(${item.gambar_url})` } : undefined} /><div className="p-3"><GlassChip>{item.kategori ?? "Informasi"}</GlassChip><h2 className="mt-3 font-extrabold">{item.judul}</h2><p className="text-muted mt-2 line-clamp-3 text-sm leading-6">{item.ringkasan}</p><time className="text-muted mt-4 block text-xs">{item.terbit_pada ? new Date(item.terbit_pada).toLocaleDateString("id-ID", { dateStyle: "medium" }) : ""}</time></div></GlassCard></Link>)}</div>{limit < filtered.length && <button onClick={() => setLimit((value) => value + 6)} className="focus-ring glass-pill mx-auto mt-8 flex min-h-11 items-center px-5 text-sm font-bold">Muat lebih banyak</button>}</>;
}
