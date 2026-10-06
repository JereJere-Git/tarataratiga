"use client";

import { useState } from "react";
import { GlassButton, GlassCard } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { updateComplaint } from "@/app/admin/(protected)/pengaduan/actions";

type Complaint = { id: string; nomor_tiket: string; nama: string | null; kontak: string | null; kategori: string; isi: string; status: "baru" | "diproses" | "selesai"; balasan: string | null; anonim: boolean; created_at: string; attachmentUrl: string | null };

export function ComplaintEditor({ complaint }: { complaint: Complaint }) {
  const [status, setStatus] = useState(complaint.status);
  const [reply, setReply] = useState(complaint.balasan ?? "");
  const [saving, setSaving] = useState(false);
  async function save() {
    setSaving(true);
    const result = await updateComplaint({ id: complaint.id, status, balasan: reply });
    setSaving(false);
    if (result.success) glassToast("Pengaduan diperbarui."); else glassToast(result.error);
  }
  return <div className="grid gap-6 lg:grid-cols-[1fr_360px]"><GlassCard variant="strong" className="p-6"><dl className="grid gap-4 sm:grid-cols-2"><div><dt className="text-xs font-bold uppercase text-muted">Pelapor</dt><dd className="mt-1 font-semibold">{complaint.anonim ? "Anonim" : complaint.nama ?? "-"}</dd></div><div><dt className="text-xs font-bold uppercase text-muted">Kontak</dt><dd className="mt-1 font-semibold">{complaint.anonim ? "-" : complaint.kontak ?? "-"}</dd></div><div><dt className="text-xs font-bold uppercase text-muted">Kategori</dt><dd className="mt-1 font-semibold">{complaint.kategori}</dd></div><div><dt className="text-xs font-bold uppercase text-muted">Diterima</dt><dd className="mt-1 font-semibold">{new Date(complaint.created_at).toLocaleString("id-ID")}</dd></div></dl><div className="mt-6 border-t border-white/40 pt-6"><h2 className="font-extrabold">Isi pengaduan</h2><p className="mt-3 whitespace-pre-wrap leading-7">{complaint.isi}</p>{complaint.attachmentUrl && <a href={complaint.attachmentUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center font-bold text-[var(--primary)]">Buka lampiran ↗</a>}</div></GlassCard><GlassCard variant="strong" className="p-6"><label className="block font-bold">Status<select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="form-input"><option value="baru">Baru</option><option value="diproses">Diproses</option><option value="selesai">Selesai</option></select></label><label className="mt-5 block font-bold">Balasan<textarea value={reply} onChange={(event) => setReply(event.target.value)} rows={7} className="form-input" placeholder="Tulis balasan untuk warga..." /></label><GlassButton type="button" className="mt-5 w-full justify-center" disabled={saving} onClick={() => void save()}>{saving ? "Menyimpan..." : "Simpan perubahan"}</GlassButton></GlassCard></div>;
}
