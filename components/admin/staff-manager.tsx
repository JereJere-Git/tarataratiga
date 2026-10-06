"use client";

import { useState } from "react";
import { ShieldCheck, UserMinus, UserPlus } from "lucide-react";
import { GlassButton, GlassChip } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { ConfirmDialog } from "./confirm-dialog";
import { createStaff, deactivateStaff, updateStaffRole } from "@/app/admin/(protected)/pengguna/actions";

type Staff = { user_id: string; nama: string; email: string; peran: "admin" | "editor"; created_at: string };
export function StaffManager({ rows }: { rows: Staff[] }) {
  const [selected, setSelected] = useState<Staff | null>(null);
  const [saving, setSaving] = useState(false);
  async function add(form: FormData) { setSaving(true); const result = await createStaff(form); setSaving(false); glassToast(result.error ?? result.success ?? "Selesai."); }
  async function changeRole(row: Staff, peran: "admin" | "editor") { const form = new FormData(); form.set("user_id", row.user_id); form.set("peran", peran); const result = await updateStaffRole(form); glassToast(result.error ?? result.success ?? "Selesai."); }
  async function deactivate() { if (!selected) return; setSaving(true); const result = await deactivateStaff(selected.user_id); setSaving(false); setSelected(null); glassToast(result.error ?? result.success ?? "Selesai."); }
  return <div className="space-y-6">
    <form action={add} className="glass-strong grid gap-4 rounded-[28px] p-5 sm:grid-cols-2 sm:p-6"><h2 className="text-lg font-extrabold sm:col-span-2">Tambah staf</h2><label className="font-bold">Nama<input required name="nama" className="form-input" /></label><label className="font-bold">Email<input required type="email" name="email" className="form-input" /></label><label className="font-bold">Kata sandi sementara<input required minLength={8} type="password" name="password" className="form-input" /></label><label className="font-bold">Peran<select name="peran" defaultValue="editor" className="form-input"><option value="editor">Editor</option><option value="admin">Admin</option></select></label><div className="sm:col-span-2"><GlassButton type="submit" disabled={saving}><UserPlus size={17} />{saving ? "Membuat..." : "Tambah staf"}</GlassButton></div></form>
    <div className="glass-strong overflow-hidden rounded-[28px]"><div className="border-b border-white/30 p-5"><h2 className="text-lg font-extrabold">Akun staf aktif</h2><p className="text-sm text-muted">Menonaktifkan akses akan menghapus profil admin, tanpa menghapus akun Auth.</p></div>{rows.map((row) => <div key={row.user_id} className="flex flex-col gap-3 border-b border-white/25 p-5 last:border-0 sm:flex-row sm:items-center"><div className="glass-pill flex h-11 w-11 shrink-0 items-center justify-center text-[var(--primary)]"><ShieldCheck size={18} /></div><div className="min-w-0 flex-1"><p className="font-extrabold">{row.nama}</p><p className="truncate text-sm text-muted">{row.email}</p></div><GlassChip>{row.peran === "admin" ? "Admin" : "Editor"}</GlassChip><select value={row.peran} onChange={(event) => void changeRole(row, event.target.value as "admin" | "editor")} className="form-input min-h-10 w-auto py-1 text-sm"><option value="editor">Editor</option><option value="admin">Admin</option></select><button type="button" className="focus-ring glass-pill inline-flex min-h-10 items-center justify-center gap-2 px-3 text-sm font-bold text-red-600" onClick={() => setSelected(row)}><UserMinus size={16} />Nonaktifkan</button></div>)}{!rows.length && <p className="p-6 text-center text-muted">Belum ada staf aktif.</p>}</div>
    <ConfirmDialog open={Boolean(selected)} onClose={() => setSelected(null)} onConfirm={() => void deactivate()} loading={saving} title="Nonaktifkan staf?" description={`Akses ${selected?.nama ?? ""} ke panel admin akan dihentikan.`} confirmLabel="Nonaktifkan" />
  </div>;
}
