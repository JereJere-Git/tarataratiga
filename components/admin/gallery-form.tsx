"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./image-uploader";
import { GlassButton } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";
import { createClient } from "@/lib/supabase/client";
import { saveGaleri } from "@/app/admin/(protected)/galeri/actions";

type Row = { id?: string; judul?: string; album?: string | null; gambar_url?: string };

export function GalleryForm({ initial }: { initial?: Row }) {
  const router = useRouter();
  const [url, setUrl] = useState(initial?.gambar_url ?? "");
  const [urls, setUrls] = useState<string[]>(initial?.gambar_url ? [initial.gambar_url] : []);
  const [uploading, setUploading] = useState(false);

  async function uploadMany(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
        glassToast(`${file.name}: JPG, PNG, atau WebP maksimal 5 MB.`);
        continue;
      }
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `galeri/${crypto.randomUUID()}.${extension}`;
      const { error } = await createClient().storage.from("media").upload(path, file, { contentType: file.type });
      if (error) {
        glassToast(`Upload ${file.name} gagal.`);
        continue;
      }
      uploaded.push(createClient().storage.from("media").getPublicUrl(path).data.publicUrl);
    }
    setUrls((current) => [...current, ...uploaded]);
    setUploading(false);
  }

  async function submit(formData: FormData) {
    const targets = initial ? [url] : urls;
    if (!targets.length || targets.some((item) => !item)) {
      glassToast("Unggah setidaknya satu foto.");
      return;
    }
    for (const target of targets) {
      const item = new FormData();
      item.set("id", initial?.id ?? "");
      item.set("judul", String(formData.get("judul") ?? ""));
      item.set("album", String(formData.get("album") ?? ""));
      item.set("gambar_url", target);
      const result = await saveGaleri(item);
      if (result.error) {
        glassToast(result.error);
        return;
      }
    }
    glassToast(initial ? "Foto tersimpan." : `${targets.length} foto tersimpan.`);
    router.push("/admin/galeri");
    router.refresh();
  }

  return <form action={submit} className="glass-strong max-w-2xl rounded-[28px] p-6">
    <input type="hidden" name="id" value={initial?.id ?? ""} />
    <label className="block font-bold">Judul<input required name="judul" defaultValue={initial?.judul ?? ""} className="form-input" /></label>
    <label className="mt-4 block font-bold">Album<input name="album" defaultValue={initial?.album ?? ""} className="form-input" /></label>
    {initial ? <div className="mt-4"><ImageUploader value={url} onUploaded={setUrl} /></div> : <div className="mt-5">
      <label className="block rounded-3xl border-2 border-dashed border-[var(--accent)]/70 bg-white/45 p-6 text-center font-bold dark:bg-slate-950/30">
        <span>Pilih beberapa foto sekaligus</span>
        <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="mt-3 block w-full text-sm" onChange={(event) => void uploadMany(event.target.files)} />
      </label>
      <p className="mt-2 text-xs text-muted">{uploading ? "Mengunggah foto..." : `${urls.length} foto siap disimpan.`}</p>
    </div>}
    <GlassButton type="submit" disabled={uploading} className="mt-6">Simpan foto</GlassButton>
  </form>;
}
