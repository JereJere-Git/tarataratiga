"use client";
import Link from "next/link";
import { Edit3, FileText, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "./confirm-dialog";
import { GlassButton } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { deleteDokumen } from "@/app/admin/(protected)/dokumen/actions";
type Row = { id: string; judul: string; kategori: string; file_url: string; file_size?: number | null; tanggal: string };
export function DocumentTable({ rows }: { rows: Row[] }) {
  const [selected, setSelected] = useState<Row | null>(null); const [loading, setLoading] = useState(false);
  async function remove() { if (!selected) return; setLoading(true); const result = await deleteDokumen(selected.id); setLoading(false); setSelected(null); glassToast(result.error ?? result.success ?? "Selesai."); }
  return <><div className="mb-4 flex justify-end"><Link href="/admin/dokumen/tambah"><GlassButton><Plus size={17} />Tambah dokumen</GlassButton></Link></div><div className="glass-strong overflow-hidden rounded-[28px] divide-y divide-white/35">{rows.map((row) => <div className="flex items-center gap-4 p-4" key={row.id}><FileText className="text-[var(--primary)]" /><div className="min-w-0 flex-1"><p className="truncate font-extrabold">{row.judul}</p><p className="text-xs text-muted">{row.kategori} · {new Date(row.tanggal).toLocaleDateString("id-ID")}{row.file_size ? ` · ${(row.file_size / 1024 / 1024).toFixed(2)} MB` : ""}</p></div><a href={row.file_url} target="_blank" rel="noreferrer" className="text-sm font-bold text-[var(--primary)]">Unduh</a><Link href={`/admin/dokumen/${row.id}`} className="glass-pill p-2"><Edit3 size={15} /></Link><button className="glass-pill p-2 text-red-600" onClick={() => setSelected(row)}><Trash2 size={15} /></button></div>)}</div><ConfirmDialog open={Boolean(selected)} onClose={() => setSelected(null)} onConfirm={() => void remove()} loading={loading} title="Hapus dokumen?" description="Dokumen akan dihapus dari daftar publik." confirmLabel="Hapus" /></>;
}
