"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassButton } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { saveProfil } from "@/app/admin/(protected)/profil/actions";

type Day = { libur: boolean; buka: string; tutup: string };
type Profile = { id: string; sambutan: string | null; sejarah: string | null; visi: string | null; misi: string | null; alamat: string | null; telepon: string | null; whatsapp: string | null; email: string | null; jam_pelayanan: Record<string, Partial<Day>>; zona_waktu: string; lat: number | null; lng: number | null; jumlah_rt: number; jumlah_rw: number; jumlah_penduduk: number };
const days = [["senin", "Senin"], ["selasa", "Selasa"], ["rabu", "Rabu"], ["kamis", "Kamis"], ["jumat", "Jumat"], ["sabtu", "Sabtu"], ["minggu", "Minggu"]] as const;
const emptyDay = (): Day => ({ libur: false, buka: "08:00", tutup: "16:00" });

export function ProfileForm({ initial }: { initial?: Profile }) {
  const router = useRouter();
  const [schedule, setSchedule] = useState<Record<string, Day>>(() => Object.fromEntries(days.map(([key]) => [key, { ...emptyDay(), ...(initial?.jam_pelayanan?.[key] ?? {}) }])) as Record<string, Day>);
  const [saving, setSaving] = useState(false);
  async function submit(form: FormData) { setSaving(true); form.set("jam_pelayanan", JSON.stringify(schedule)); const result = await saveProfil(form); setSaving(false); if (result.error) glassToast(result.error); else { glassToast(result.success ?? "Tersimpan."); router.refresh(); } }
  return <form action={submit} className="glass-strong space-y-6 rounded-[28px] p-5 sm:p-8">
    <input type="hidden" name="id" value={initial?.id ?? ""} />
    <div className="grid gap-5 md:grid-cols-2"><label className="font-bold md:col-span-2">Sambutan<textarea name="sambutan" rows={4} defaultValue={initial?.sambutan ?? ""} className="form-input" /></label><label className="font-bold">Sejarah<textarea name="sejarah" rows={6} defaultValue={initial?.sejarah ?? ""} className="form-input" /></label><label className="font-bold">Visi<textarea name="visi" rows={6} defaultValue={initial?.visi ?? ""} className="form-input" /></label><label className="font-bold md:col-span-2">Misi<textarea name="misi" rows={5} defaultValue={initial?.misi ?? ""} className="form-input" /></label></div>
    <div className="grid gap-5 sm:grid-cols-2"><label className="font-bold">Alamat<input name="alamat" defaultValue={initial?.alamat ?? ""} className="form-input" /></label><label className="font-bold">Email<input type="email" name="email" defaultValue={initial?.email ?? ""} className="form-input" /></label><label className="font-bold">Telepon<input name="telepon" defaultValue={initial?.telepon ?? ""} className="form-input" /></label><label className="font-bold">WhatsApp<input name="whatsapp" defaultValue={initial?.whatsapp ?? ""} className="form-input" /></label></div>
    <div><h2 className="text-lg font-extrabold">Jam pelayanan</h2><div className="mt-3 space-y-2">{days.map(([key, label]) => <div key={key} className="grid items-center gap-2 rounded-2xl border border-white/30 p-3 sm:grid-cols-[100px_1fr_1fr_auto]"><span className="font-bold">{label}</span><input type="time" disabled={schedule[key].libur} value={schedule[key].buka} onChange={(e) => setSchedule((value) => ({ ...value, [key]: { ...value[key], buka: e.target.value } }))} className="form-input" /><input type="time" disabled={schedule[key].libur} value={schedule[key].tutup} onChange={(e) => setSchedule((value) => ({ ...value, [key]: { ...value[key], tutup: e.target.value } }))} className="form-input" /><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={schedule[key].libur} onChange={(e) => setSchedule((value) => ({ ...value, [key]: { ...value[key], libur: e.target.checked } }))} /> Libur</label></div>)}</div></div>
    <div className="grid gap-5 sm:grid-cols-2"><label className="font-bold">Zona waktu<input name="zona_waktu" defaultValue={initial?.zona_waktu ?? "Asia/Makassar"} className="form-input" /></label><label className="font-bold">Latitude<input type="number" step="any" name="lat" defaultValue={initial?.lat ?? ""} className="form-input" /></label><label className="font-bold">Longitude<input type="number" step="any" name="lng" defaultValue={initial?.lng ?? ""} className="form-input" /></label><div className="grid grid-cols-3 gap-3 sm:col-span-2"><label className="font-bold">Lingkungan<input type="number" min="0" name="jumlah_rt" defaultValue={initial?.jumlah_rt ?? 0} className="form-input" /></label><label className="font-bold">Lingkungan<input type="number" min="0" name="jumlah_rw" defaultValue={initial?.jumlah_rw ?? 0} className="form-input" /></label><label className="font-bold">Penduduk<input type="number" min="0" name="jumlah_penduduk" defaultValue={initial?.jumlah_penduduk ?? 0} className="form-input" /></label></div></div>
    <div className="flex justify-end"><GlassButton type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan profil"}</GlassButton></div>
  </form>;
}
