"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save } from "lucide-react";
import { GlassButton } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { saveLokasi } from "@/app/admin/(protected)/lokasi/actions";

const categories = [
  ["ibadah", "Ibadah"], ["kesehatan", "Kesehatan"], ["pendidikan", "Pendidikan"],
  ["pemerintahan", "Pemerintahan"], ["keamanan", "Keamanan"], ["fasilitas_umum", "Fasilitas umum"], ["lainnya", "Lainnya"],
] as const;
type Location = { id?: string; nama?: string; kategori?: string; alamat?: string; deskripsi?: string | null; telepon?: string | null; jam_operasional?: string | null; lat?: number; lng?: number; urutan?: number; aktif?: boolean };

export function LocationForm({ initial }: { initial?: Location }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  async function submit(form: FormData) {
    setSaving(true);
    form.set("aktif", String(form.get("aktif") === "on"));
    const result = await saveLokasi(form);
    setSaving(false);
    if (result.error) glassToast(result.error);
    else { glassToast(result.success ?? "Tersimpan."); router.push("/admin/lokasi"); router.refresh(); }
  }
  return <form action={submit} className="glass-strong max-w-3xl space-y-5 rounded-[28px] p-5 sm:p-8">
    <input type="hidden" name="id" value={initial?.id ?? ""} />
    <div className="grid gap-5 md:grid-cols-2">
      <label className="font-bold md:col-span-2">Nama lokasi<input required name="nama" defaultValue={initial?.nama ?? ""} className="form-input" /></label>
      <label className="font-bold">Kategori<select name="kategori" defaultValue={initial?.kategori ?? "lainnya"} className="form-input">{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="font-bold">Urutan<input type="number" min="0" name="urutan" defaultValue={initial?.urutan ?? 0} className="form-input" /></label>
    </div>
    <label className="block font-bold">Alamat<textarea required name="alamat" rows={2} defaultValue={initial?.alamat ?? ""} className="form-input" /></label>
    <label className="block font-bold">Deskripsi<textarea name="deskripsi" rows={3} defaultValue={initial?.deskripsi ?? ""} className="form-input" /></label>
    <div className="grid gap-5 md:grid-cols-2">
      <label className="font-bold">Telepon<input name="telepon" type="tel" defaultValue={initial?.telepon ?? ""} className="form-input" /></label>
      <label className="font-bold">Jam operasional<input name="jam_operasional" defaultValue={initial?.jam_operasional ?? ""} placeholder="Senin-Jumat, 08.00-16.00" className="form-input" /></label>
      <label className="font-bold">Latitude<input required name="lat" type="number" step="any" defaultValue={initial?.lat ?? ""} className="form-input" /></label>
      <label className="font-bold">Longitude<input required name="lng" type="number" step="any" defaultValue={initial?.lng ?? ""} className="form-input" /></label>
    </div>
    <p className="rounded-2xl border border-[var(--line)] bg-[var(--primary-soft)]/60 p-3 text-sm text-muted">Petunjuk koordinat: buka Google Maps, klik kanan pada titik lokasi, lalu salin angka latitude dan longitude yang muncul.</p>
    <label className="flex min-h-11 items-center gap-3 font-bold"><input type="checkbox" name="aktif" defaultChecked={initial?.aktif ?? true} /> Aktif dan tampil untuk warga</label>
    <div className="flex justify-end"><GlassButton type="submit" disabled={saving}>{saving ? "Menyimpan..." : <><Save size={17} />Simpan lokasi</>}</GlassButton></div>
  </form>;
}
