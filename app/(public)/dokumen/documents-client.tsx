"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Search } from "lucide-react";
import { GlassCard, GlassChip } from "@/components/shared/glass";
type DocumentItem = { id: string; judul: string; kategori: string; file_url: string; file_size?: number | null; tanggal: string };
export function DocumentsClient({ items }: { items: DocumentItem[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => items.filter((item) => `${item.judul} ${item.kategori}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  return <div><label className="relative block max-w-xl"><Search size={18} className="absolute left-4 top-3.5 text-muted" /><input className="form-input glass-pill pl-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari dokumen..." /></label><div className="mt-6 space-y-3">{filtered.map((item) => <GlassCard variant="strong" className="flex items-center gap-4 p-4" key={item.id}><div className="glass-pill flex h-12 w-12 shrink-0 items-center justify-center text-[var(--primary)]"><FileText /></div><div className="min-w-0 flex-1"><GlassChip>{item.kategori}</GlassChip><h2 className="mt-2 truncate font-extrabold">{item.judul}</h2><p className="text-muted text-xs">{new Date(item.tanggal).toLocaleDateString("id-ID")}{item.file_size ? ` · ${(item.file_size / 1024 / 1024).toFixed(2)} MB` : ""}</p></div><a className="focus-ring glass-pill flex min-h-11 items-center gap-2 px-4 font-bold text-[var(--primary)]" href={item.file_url} target="_blank" rel="noreferrer"><Download size={16} /><span className="hidden sm:inline">Unduh</span></a></GlassCard>)}{!filtered.length && <p className="text-muted py-12 text-center">Dokumen tidak ditemukan.</p>}</div></div>;
}
