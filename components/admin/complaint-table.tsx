"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { DataTable, type DataColumn } from "./data-table";
import { GlassChip } from "@/components/shared/glass";

export type ComplaintTableRow = { id: string; nomor_tiket: string; kategori: string; status: string; anonim: boolean; created_at: string };

const columns: DataColumn<ComplaintTableRow>[] = [
  { key: "nomor_tiket", label: "Tiket", render: (value, row) => <Link className="font-bold text-[var(--primary)] hover:underline" href={`/admin/pengaduan/${row.id}`}>{String(value)}</Link> },
  { key: "kategori", label: "Kategori" },
  { key: "status", label: "Status", render: (value) => <GlassChip>{String(value)}</GlassChip> },
  { key: "anonim", label: "Pelapor", render: (value) => value ? "Anonim" : "Teridentifikasi" },
  { key: "created_at", label: "Diterima", render: (value) => new Date(String(value)).toLocaleDateString("id-ID") },
  { key: "id", label: "Aksi", render: (_, row) => <Link href={`/admin/pengaduan/${row.id}`} className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-3 font-bold text-[var(--primary)]"><Eye size={16} />Detail</Link> },
];

export function ComplaintTable({ rows }: { rows: ComplaintTableRow[] }) {
  const [status, setStatus] = useState("semua");
  const filtered = useMemo(() => status === "semua" ? rows : rows.filter((row) => row.status === status), [rows, status]);
  return <div><label className="mb-4 flex items-center gap-3 text-sm font-bold">Filter status<select value={status} onChange={(event) => setStatus(event.target.value)} className="form-input mt-0 w-auto min-w-36 py-2"><option value="semua">Semua</option><option value="baru">Baru</option><option value="diproses">Diproses</option><option value="selesai">Selesai</option></select></label><DataTable columns={columns} rows={filtered} empty="Belum ada pengaduan masuk." /></div>;
}
