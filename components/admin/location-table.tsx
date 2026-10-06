"use client";

import Link from "next/link";
import { Edit3, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "./confirm-dialog";
import { GlassButton, GlassChip } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { deleteLokasi } from "@/app/admin/(protected)/lokasi/actions";

type Row = { id: string; nama: string; kategori: string; alamat: string; lat: number; lng: number; aktif: boolean };
export function LocationTable({ rows }: { rows: Row[] }) {
  const [selected, setSelected] = useState<Row | null>(null);
  const [loading, setLoading] = useState(false);
  async function remove() {
    if (!selected) return;
    setLoading(true);
    const result = await deleteLokasi(selected.id);
    setLoading(false);
    setSelected(null);
    glassToast(result.error ?? result.success ?? "Selesai.");
  }
  return <><div className="mb-4 flex justify-end"><Link href="/admin/lokasi/tambah"><GlassButton><Plus size={17} />Tambah lokasi</GlassButton></Link></div><div className="overflow-x-auto rounded-[28px] border border-[var(--line)] bg-white shadow-sm dark:bg-[#102b1a]"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-[var(--line)] text-muted"><tr><th className="p-4">Lokasi</th><th className="p-4">Kategori</th><th className="p-4">Koordinat</th><th className="p-4">Status</th><th className="p-4 text-right">Aksi</th></tr></thead><tbody className="divide-y divide-[var(--line)]">{rows.map((row) => <tr key={row.id}><td className="p-4"><p className="font-extrabold">{row.nama}</p><p className="mt-1 max-w-sm truncate text-xs text-muted">{row.alamat}</p></td><td className="p-4"><GlassChip>{row.kategori.replace("_", " ")}</GlassChip></td><td className="p-4 text-xs text-muted">{row.lat}, {row.lng}</td><td className="p-4">{row.aktif ? <span className="font-bold text-[var(--primary)]">Aktif</span> : <span className="text-muted">Nonaktif</span>}</td><td className="p-4"><div className="flex justify-end gap-1"><Link href={`/admin/lokasi/${row.id}`} className="glass-pill p-2" aria-label={`Ubah ${row.nama}`}><Edit3 size={15} /></Link><button className="glass-pill p-2 text-red-600" onClick={() => setSelected(row)} aria-label={`Hapus ${row.nama}`}><Trash2 size={15} /></button><a href={`https://www.google.com/maps/search/?api=1&query=${row.lat},${row.lng}`} target="_blank" rel="noreferrer" className="glass-pill p-2" aria-label={`Buka ${row.nama} di Google Maps`}><MapPin size={15} /></a></div></td></tr>)}</tbody></table></div><ConfirmDialog open={Boolean(selected)} onClose={() => setSelected(null)} onConfirm={() => void remove()} loading={loading} title="Hapus lokasi?" description="Lokasi ini akan dihapus dari daftar penting." confirmLabel="Hapus" /></>;
}
