"use client";
import Link from "next/link";
import Image from "next/image";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "./confirm-dialog";
import { DataTable, type DataColumn } from "./data-table";
import { GlassButton } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { deletePejabat } from "@/app/admin/(protected)/pejabat/actions";
type Row = { id: string; nama: string; jabatan: string; foto_url: string | null; urutan: number };
export function PejabatTable({ rows }: { rows: Row[] }) {
  const [selected, setSelected] = useState<Row | null>(null); const [loading, setLoading] = useState(false);
  async function remove() { if (!selected) return; setLoading(true); const result = await deletePejabat(selected.id); setLoading(false); setSelected(null); glassToast(result.error ?? result.success ?? "Selesai."); }
  const columns: DataColumn<Row>[] = [
    { key: "foto_url", label: "Foto", render: (value, row) => value ? <Image src={String(value)} alt={`Foto ${row.nama}`} width={44} height={44} unoptimized className="h-11 w-11 rounded-xl object-cover" /> : <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] font-bold text-[var(--primary)]">{row.nama.charAt(0)}</span> },
    { key: "nama", label: "Nama" }, { key: "jabatan", label: "Jabatan" }, { key: "urutan", label: "Urutan" },
    { key: "id", label: "Aksi", render: (_, row) => <div className="flex gap-2"><Link href={`/admin/pejabat/${row.id}`} className="focus-ring glass-pill flex h-10 w-10 items-center justify-center text-[var(--primary)]" aria-label={`Edit ${row.nama}`}><Edit3 size={16} /></Link><button className="focus-ring glass-pill flex h-10 w-10 items-center justify-center text-red-600" onClick={() => setSelected(row)} aria-label={`Hapus ${row.nama}`}><Trash2 size={16} /></button></div> },
  ];
  return <><div className="mb-4 flex justify-end"><Link href="/admin/pejabat/tambah"><GlassButton><Plus size={17} />Tambah pejabat</GlassButton></Link></div><DataTable columns={columns} rows={rows} empty="Belum ada pejabat." /><ConfirmDialog open={Boolean(selected)} onClose={() => setSelected(null)} onConfirm={() => void remove()} loading={loading} title="Hapus pejabat?" description={`Data ${selected?.nama ?? ""} akan dihapus.`} confirmLabel="Hapus" /></>;
}
