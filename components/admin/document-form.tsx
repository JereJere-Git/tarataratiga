"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUp } from "lucide-react";
import { GlassButton } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { createClient } from "@/lib/supabase/client";
import { saveDokumen } from "@/app/admin/(protected)/dokumen/actions";

type Row = { id?: string; judul?: string; kategori?: string; file_url?: string; file_size?: number | null; tanggal?: string };

export function DocumentForm({ initial }: { initial?: Row }) {
  const router = useRouter();
  const [url, setUrl] = useState(initial?.file_url ?? "");
  const [size, setSize] = useState(initial?.file_size ?? 0);
  const [loading, setLoading] = useState(false);
  async function upload(file: File) {
    if (file.size > 10 * 1024 * 1024) { glassToast("Ukuran file maksimal 10 MB."); return; }
    setLoading(true);
    setSize(file.size);
    const path = `dokumen/${crypto.randomUUID()}-${file.name}`;
    const { error } = await createClient().storage.from("media").upload(path, file);
    if (error) glassToast("Upload gagal."); else setUrl(createClient().storage.from("media").getPublicUrl(path).data.publicUrl);
    setLoading(false);
  }
  async function submit(form: FormData) {
    form.set("file_url", url);
    form.set("file_size", String(size));
    const result = await saveDokumen(form);
    if (result.error) glassToast(result.error); else { glassToast(result.success ?? "Tersimpan."); router.push("/admin/dokumen"); router.refresh(); }
  }
  return <form action={submit} className="glass-strong max-w-2xl rounded-[28px] p-6">
    <input type="hidden" name="id" value={initial?.id ?? ""} />
    <label className="block font-bold">Judul<input required name="judul" defaultValue={initial?.judul ?? ""} className="form-input" /></label>
    <label className="mt-4 block font-bold">Kategori<input required name="kategori" defaultValue={initial?.kategori ?? ""} className="form-input" /></label>
    <label className="mt-4 block font-bold">Tanggal<input type="date" name="tanggal" defaultValue={initial?.tanggal ?? new Date().toISOString().slice(0, 10)} className="form-input" /></label>
    <input type="file" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} className="mt-5 block w-full" />
    <p className="mt-2 text-xs text-muted">{loading ? "Mengunggah..." : url ? `File siap disimpan${size ? ` (${(size / 1024 / 1024).toFixed(2)} MB)` : ""}.` : "Pilih file untuk diunggah."}</p>
    <GlassButton type="submit" disabled={loading} className="mt-6"><FileUp size={16} />Simpan dokumen</GlassButton>
  </form>;
}
