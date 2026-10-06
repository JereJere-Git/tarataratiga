"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type DataColumn<T> = { key: keyof T; label: string; render?: (value: T[keyof T], row: T) => React.ReactNode };

export function DataTable<T extends Record<string, unknown>>({ columns, rows, empty = "Belum ada data." }: { columns: DataColumn<T>[]; rows: T[]; empty?: string }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [descending, setDescending] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const filtered = useMemo(() => rows.filter((row) => Object.values(row).join(" ").toLowerCase().includes(query.toLowerCase())), [rows, query]);
  const sorted = useMemo(() => [...filtered].sort((a, b) => sortKey ? String(a[sortKey]).localeCompare(String(b[sortKey]), "id", { numeric: true }) * (descending ? -1 : 1) : 0), [filtered, sortKey, descending]);
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const visible = sorted.slice((page - 1) * pageSize, page * pageSize);
  function sort(key: keyof T) { setPage(1); setDescending(sortKey === key ? !descending : false); setSortKey(key); }
  return <div className="glass-strong overflow-hidden rounded-[28px]"><div className="flex flex-col gap-3 border-b border-white/40 p-4 sm:flex-row sm:items-center sm:justify-between"><label className="relative block w-full max-w-sm"><Search className="absolute left-3 top-3.5 text-muted" size={17} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Cari data..." className="focus-ring h-11 w-full rounded-2xl border border-white/60 bg-white/70 pl-10 pr-4 text-sm outline-none dark:bg-slate-950/40" /></label><span className="text-xs font-semibold text-muted">{filtered.length} data</span></div><div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-white/35 text-xs uppercase tracking-wide text-muted dark:bg-white/5"><tr>{columns.map((column) => <th key={String(column.key)} className="px-5 py-4"><button className="inline-flex items-center gap-1 font-bold" onClick={() => sort(column.key)}>{column.label}<ChevronDown size={14} className={cn(sortKey === column.key && descending && "rotate-180")} /></button></th>)}</tr></thead><tbody className="divide-y divide-white/35">{visible.map((row, index) => <tr key={String(row.id ?? index)} className="transition hover:bg-white/35 dark:hover:bg-white/5">{columns.map((column) => <td key={String(column.key)} className="px-5 py-4">{column.render ? column.render(row[column.key], row) : String(row[column.key] ?? "-")}</td>)}</tr>)}</tbody></table>{visible.length === 0 && <p className="px-5 py-12 text-center text-sm text-muted">{empty}</p>}</div><div className="flex items-center justify-between border-t border-white/40 p-4 text-sm"><span className="text-xs font-semibold text-muted">Halaman {page} dari {pages}</span><div className="flex gap-2"><button disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="focus-ring glass-pill flex h-10 w-10 items-center justify-center disabled:opacity-40" aria-label="Halaman sebelumnya"><ChevronLeft size={17} /></button><button disabled={page === pages} onClick={() => setPage((value) => value + 1)} className="focus-ring glass-pill flex h-10 w-10 items-center justify-center disabled:opacity-40" aria-label="Halaman berikutnya"><ChevronRight size={17} /></button></div></div></div>;
}
