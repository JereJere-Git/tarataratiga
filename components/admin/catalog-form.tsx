"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save } from "lucide-react";
import { saveUmkm } from "@/app/admin/(protected)/umkm/actions";
import { savePotensi } from "@/app/admin/(protected)/potensi/actions";
import { GlassButton } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";

type Umkm = { id?: string; nama?: string; kategori?: string; deskripsi?: string | null; alamat?: string; telepon?: string | null; whatsapp?: string | null; jam_operasional?: string | null; urutan?: number; aktif?: boolean };
type Potensi = { id?: string; nama?: string; kategori?: string; deskripsi?: string; lokasi?: string | null; urutan?: number; aktif?: boolean };

export function CatalogForm({ kind, initial }: { kind: "umkm" | "potensi"; initial?: Umkm | Potensi }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  async function submit(form: FormData) {
    setSaving(true);
    form.set("aktif", String(form.get("aktif") === "on"));
    const result = kind === "umkm" ? await saveUmkm(form) : await savePotensi(form);
    setSaving(false);
    if (result.error) glassToast(result.error);
    else { glassToast(result.success ?? "Tersimpan."); router.push(`/admin/${kind}`); router.refresh(); }
  }
  const isUmkm = kind === "umkm";
  const value = initial as (Umkm & Potensi) | undefined;
  return <form action={submit} className="glass-strong space-y-6 rounded-[28px] p-5 sm:p-8">
    <input type="hidden" name="id" value={value?.id ?? ""} />
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="font-bold">Nama<input required name="nama" defaultValue={value?.nama ?? ""} className="form-input" /></label>
      <label className="font-bold">Kategori<input required name="kategori" placeholder={isUmkm ? "Kuliner, kerajinan, jasa..." : "Pertanian, wisata, budaya..."} defaultValue={value?.kategori ?? ""} className="form-input" /></label>
      <label className="font-bold sm:col-span-2">Deskripsi<textarea required={!isUmkm} name="deskripsi" rows={5} defaultValue={value?.deskripsi ?? ""} className="form-input" /></label>
      <label className="font-bold">{isUmkm ? "Alamat" : "Lokasi"}<input required={isUmkm} name={isUmkm ? "alamat" : "lokasi"} defaultValue={isUmkm ? (value as Umkm)?.alamat ?? "" : (value as Potensi)?.lokasi ?? ""} className="form-input" /></label>
      {isUmkm && <><label className="font-bold">Telepon<input name="telepon" defaultValue={(value as Umkm)?.telepon ?? ""} className="form-input" /></label><label className="font-bold">WhatsApp<input name="whatsapp" defaultValue={(value as Umkm)?.whatsapp ?? ""} className="form-input" /></label><label className="font-bold">Jam operasional<input name="jam_operasional" defaultValue={(value as Umkm)?.jam_operasional ?? ""} className="form-input" /></label></>}
      <label className="font-bold">Urutan<input type="number" min="0" name="urutan" defaultValue={value?.urutan ?? 0} className="form-input" /></label>
    </div>
    <label className="flex min-h-11 items-center gap-3 font-bold"><input type="checkbox" name="aktif" defaultChecked={value?.aktif ?? true} /> Aktif dan tampil untuk warga</label>
    <div className="flex justify-end"><GlassButton type="submit" disabled={saving}>{saving ? "Menyimpan..." : <><Save size={17} />Simpan {isUmkm ? "UMKM" : "potensi"}</>}</GlassButton></div>
  </form>;
}
