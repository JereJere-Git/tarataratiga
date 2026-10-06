"use client";

import Link from "next/link";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteUmkm } from "@/app/admin/(protected)/umkm/actions";
import { deletePotensi } from "@/app/admin/(protected)/potensi/actions";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable, type DataColumn } from "@/components/admin/data-table";
import { GlassButton, GlassChip } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";

type Row = { id: string; nama: string; kategori: string; deskripsi: string | null; urutan: number; aktif: boolean };
export function CatalogTable({ kind, rows }: { kind: "umkm" | "potensi"; rows: Row[] }) {
  const [selected, setSelected] = useState<Row | null>(null);
  const [loading, setLoading] = useState(false);
  async function remove() {
    if (!selected) return;
    setLoading(true);
    const result = kind === "umkm" ? await deleteUmkm(selected.id) : await deletePotensi(selected.id);
    setLoading(false); setSelected(null); glassToast(result.error ?? result.success ?? "Selesai.");
  }
  const columns: DataColumn<Row>[] = [
    { key: "nama", label: "Nama", render: (value, row) => <div><p className="font-bold">{String(value)}</p><p className="text-xs text-muted">{row.deskripsi ?? "Belum ada deskripsi"}</p></div> },
    { key: "kategori", label: "Kategori", render: (value) => <GlassChip>{String(value)}</GlassChip> },
    { key: "aktif", label: "Status", render: (value) => <GlassChip className={value ? "text-[var(--primary)]" : "text-muted"}>{value ? "Aktif" : "Nonaktif"}</GlassChip> },
    { key: "urutan", label: "Urutan" },
    { key: "id", label: "Aksi", render: (_, row) => <div className="flex gap-2"><Link href={`/admin/${kind}/${row.id}`} className="glass-pill p-2 text-[var(--primary)]" aria-label={`Edit ${row.nama}`}><Edit3 size={16} /></Link><button className="glass-pill p-2 text-red-600" onClick={() => setSelected(row)} aria-label={`Hapus ${row.nama}`}><Trash2 size={16} /></button></div> },
  ];
  return <><div className="mb-4 flex justify-end"><Link href={`/admin/${kind}/tambah`}><GlassButton><Plus size={17} />Tambah {kind === "umkm" ? "UMKM" : "potensi"}</GlassButton></Link></div><DataTable columns={columns} rows={rows} empty={`Belum ada data ${kind}.`} /><ConfirmDialog open={Boolean(selected)} onClose={() => setSelected(null)} onConfirm={() => void remove()} loading={loading} title={`Hapus ${kind}?`} description={`${selected?.nama ?? "Data ini"} akan dihapus.`} confirmLabel="Hapus" /></>;
}
