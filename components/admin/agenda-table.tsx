"use client";
import Link from "next/link";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { DataTable, type DataColumn } from "./data-table";
import { ConfirmDialog } from "./confirm-dialog";
import { GlassButton } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { deleteAgenda } from "@/app/admin/(protected)/agenda/actions";
type AgendaRow = { id: string; judul: string; lokasi: string | null; mulai: string; selesai: string | null };
export function AgendaTable({ rows }: { rows: AgendaRow[] }) {
  const [selected, setSelected] = useState<AgendaRow | null>(null); const [loading, setLoading] = useState(false);
  async function remove() { if (!selected) return; setLoading(true); const result = await deleteAgenda(selected.id); setLoading(false); setSelected(null); glassToast(result.error ?? result.success ?? "Selesai."); }
  const columns: DataColumn<AgendaRow>[] = [
    { key: "judul", label: "Judul", render: (value) => <span className="font-bold">{String(value)}</span> },
    { key: "lokasi", label: "Lokasi" },
    { key: "mulai", label: "Mulai", render: (value) => new Date(String(value)).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" }) },
    { key: "id", label: "Aksi", render: (_, row) => <div className="flex gap-2"><Link href={`/admin/agenda/${row.id}`} className="glass-pill flex h-10 w-10 items-center justify-center text-[var(--primary)]" aria-label={`Edit ${row.judul}`}><Edit3 size={16} /></Link><button className="glass-pill flex h-10 w-10 items-center justify-center text-red-600" onClick={() => setSelected(row)} aria-label={`Hapus ${row.judul}`}><Trash2 size={16} /></button></div> },
  ];
  return <><div className="mb-4 flex justify-end"><Link href="/admin/agenda/tambah"><GlassButton><Plus size={17} />Tambah agenda</GlassButton></Link></div><DataTable columns={columns} rows={rows} empty="Belum ada agenda." /><ConfirmDialog open={Boolean(selected)} onClose={() => setSelected(null)} onConfirm={() => void remove()} loading={loading} title="Hapus agenda?" description={`Agenda “${selected?.judul ?? ""}” akan dihapus permanen.`} confirmLabel="Hapus permanen" /></>;
}
