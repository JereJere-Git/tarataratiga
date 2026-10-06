"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { DataTable, type DataColumn } from "@/components/admin/data-table";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { GlassButton, GlassChip } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { deleteBerita } from "@/app/admin/(protected)/berita/actions";

type BeritaRow = { id: string; judul: string; slug: string; kategori: string | null; status: "draf" | "terbit"; terbit_pada: string | null };

export function BeritaTable({ rows }: { rows: BeritaRow[] }) {
  const [status, setStatus] = useState<"semua" | "draf" | "terbit">("semua");
  const [selected, setSelected] = useState<BeritaRow | null>(null);
  const [loading, setLoading] = useState(false);
  const filtered = status === "semua" ? rows : rows.filter((row) => row.status === status);
  async function confirmDelete() {
    if (!selected) return;
    setLoading(true);
    const result = await deleteBerita(selected.id);
    setLoading(false);
    setSelected(null);
    glassToast(result.error ?? result.success ?? "Selesai.");
  }
  const columns: DataColumn<BeritaRow>[] = [
    { key: "judul", label: "Judul", render: (value, row) => <div><p className="max-w-xs truncate font-bold">{String(value)}</p><p className="text-xs text-muted">/{row.slug}</p></div> },
    { key: "kategori", label: "Kategori" },
    { key: "status", label: "Status", render: (value) => <GlassChip className={value === "terbit" ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}>{value === "terbit" ? "Terbit" : "Draf"}</GlassChip> },
    { key: "terbit_pada", label: "Jadwal", render: (value) => value ? new Date(String(value)).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) : "-" },
    { key: "id", label: "Aksi", render: (_, row) => <div className="flex gap-2"><Link href={`/admin/berita/${row.id}`} className="focus-ring glass-pill flex h-10 w-10 items-center justify-center text-[var(--primary)]" aria-label={`Edit ${row.judul}`}><Edit3 size={16} /></Link><button className="focus-ring glass-pill flex h-10 w-10 items-center justify-center text-red-600" onClick={() => setSelected(row)} aria-label={`Hapus ${row.judul}`}><Trash2 size={16} /></button></div> },
  ];
  return <><div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-2 rounded-full bg-white/30 p-1 dark:bg-white/5">{(["semua", "draf", "terbit"] as const).map((option) => <button key={option} onClick={() => setStatus(option)} className={`min-h-10 rounded-full px-4 text-xs font-bold capitalize transition ${status === option ? "bg-[var(--primary)] text-white" : "text-muted hover:bg-white/50"}`}>{option === "semua" ? "Semua" : option === "draf" ? "Draf" : "Terbit"}</button>)}</div><Link href="/admin/berita/tambah"><GlassButton><Plus size={17} />Tambah berita</GlassButton></Link></div><DataTable columns={columns} rows={filtered} empty="Belum ada berita pada filter ini." /><ConfirmDialog open={Boolean(selected)} onClose={() => setSelected(null)} onConfirm={() => void confirmDelete()} loading={loading} title="Hapus berita?" description={`Berita “${selected?.judul ?? ""}” akan dihapus permanen dan tidak tampil di portal publik.`} confirmLabel="Hapus permanen" /></>;
}
