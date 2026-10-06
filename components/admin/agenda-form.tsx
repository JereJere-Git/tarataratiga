"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GlassButton } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { saveAgenda } from "@/app/admin/(protected)/agenda/actions";
type Agenda = { id?: string; judul?: string; deskripsi?: string | null; lokasi?: string | null; mulai?: string; selesai?: string | null };
function localDate(value?: string) { return value ? new Date(value).toISOString().slice(0, 16) : ""; }
export function AgendaForm({ initial }: { initial?: Agenda }) { const router = useRouter(); const [saving, setSaving] = useState(false);
  async function submit(form: FormData) { setSaving(true); const result = await saveAgenda(form); setSaving(false); if (result.error) glassToast(result.error); else { glassToast(result.success ?? "Tersimpan."); router.push("/admin/agenda"); router.refresh(); } }
  return <form action={submit} className="glass-strong max-w-3xl rounded-[28px] p-6"><input type="hidden" name="id" value={initial?.id ?? ""} /><label className="block font-bold">Judul<input name="judul" required defaultValue={initial?.judul ?? ""} className="form-input" /></label><label className="mt-4 block font-bold">Deskripsi<textarea name="deskripsi" rows={5} defaultValue={initial?.deskripsi ?? ""} className="form-input" /></label><label className="mt-4 block font-bold">Lokasi<input name="lokasi" defaultValue={initial?.lokasi ?? ""} className="form-input" /></label><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="font-bold">Mulai<input name="mulai" type="datetime-local" required defaultValue={localDate(initial?.mulai)} className="form-input" /></label><label className="font-bold">Selesai<input name="selesai" type="datetime-local" defaultValue={localDate(initial?.selesai ?? undefined)} className="form-input" /></label></div><GlassButton type="submit" disabled={saving} className="mt-6">{saving ? "Menyimpan..." : "Simpan agenda"}</GlassButton></form>; }
