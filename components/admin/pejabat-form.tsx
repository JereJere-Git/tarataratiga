"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { GlassButton } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { savePejabat } from "@/app/admin/(protected)/pejabat/actions";
type Official = { id?: string; nama?: string; jabatan?: string; foto_url?: string | null; urutan?: number };
export function PejabatForm({ initial }: { initial?: Official }) {
  const router = useRouter(); const [foto, setFoto] = useState(initial?.foto_url ?? ""); const [saving, setSaving] = useState(false);
  async function submit(form: FormData) { setSaving(true); form.set("foto_url", foto); const result = await savePejabat(form); setSaving(false); if (result.error) glassToast(result.error); else { glassToast(result.success ?? "Tersimpan."); router.push("/admin/pejabat"); router.refresh(); } }
  return <form action={submit} className="glass-strong max-w-2xl space-y-5 rounded-[28px] p-6"><input type="hidden" name="id" value={initial?.id ?? ""} /><label className="block font-bold">Nama<input required name="nama" defaultValue={initial?.nama ?? ""} className="form-input" /></label><label className="block font-bold">Jabatan<input required name="jabatan" defaultValue={initial?.jabatan ?? ""} className="form-input" /></label><label className="block font-bold">Urutan<input type="number" min="0" name="urutan" defaultValue={initial?.urutan ?? 0} className="form-input" /></label><div><p className="mb-2 font-bold">Foto</p><ImageUploader folder="pejabat" value={foto} onUploaded={setFoto} /></div><div className="flex justify-end"><GlassButton type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan pejabat"}</GlassButton></div></form>;
}
