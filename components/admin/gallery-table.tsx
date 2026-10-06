"use client";
import Link from "next/link";
import Image from "next/image";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "./confirm-dialog";
import { GlassButton } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { deleteGaleri } from "@/app/admin/(protected)/galeri/actions";
type Row = { id: string; judul: string; album: string | null; gambar_url: string; urutan: number };
export function GalleryTable({ rows }: { rows: Row[] }) { const [selected, setSelected] = useState<Row | null>(null); const [loading, setLoading] = useState(false); async function remove() { if (!selected) return; setLoading(true); const result = await deleteGaleri(selected.id); setLoading(false); setSelected(null); glassToast(result.error ?? result.success ?? "Selesai."); } return <><div className="mb-4 flex justify-end"><Link href="/admin/galeri/tambah"><GlassButton><Plus size={17} />Tambah foto</GlassButton></Link></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{rows.map((row) => <div className="glass-strong overflow-hidden rounded-[28px]" key={row.id}><Image src={row.gambar_url} alt={row.judul} width={700} height={450} className="h-44 w-full object-cover" /><div className="flex items-center justify-between gap-2 p-4"><div><p className="font-extrabold">{row.judul}</p><p className="text-xs text-muted">{row.album ?? "Tanpa album"}</p></div><div className="flex gap-1"><Link href={`/admin/galeri/${row.id}`} className="glass-pill p-2"><Edit3 size={15} /></Link><button className="glass-pill p-2 text-red-600" onClick={() => setSelected(row)}><Trash2 size={15} /></button></div></div></div>)}</div><ConfirmDialog open={Boolean(selected)} onClose={() => setSelected(null)} onConfirm={() => void remove()} loading={loading} title="Hapus foto?" description="Foto akan dihapus dari galeri." confirmLabel="Hapus" /></>; }
