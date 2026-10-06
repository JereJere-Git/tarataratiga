"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, LoaderCircle, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { glassToast } from "@/components/shared/toast";

export function ImageUploader({ bucket = "media", folder = "uploads", value, onUploaded }: { bucket?: "media" | "lampiran"; folder?: string; value?: string; onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);
  const [loading, setLoading] = useState(false);
  async function upload(file: File) {
    if (!file.type.startsWith("image/")) { glassToast("Pilih file gambar yang valid."); return; }
    if (file.size > 5 * 1024 * 1024) { glassToast("Ukuran gambar maksimal 5 MB."); return; }
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${extension}`;
    const { error } = await createClient().storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type });
    if (error) { setLoading(false); glassToast("Upload gagal. Periksa policy Storage."); return; }
    const url = bucket === "media" ? createClient().storage.from(bucket).getPublicUrl(path).data.publicUrl : path;
    setLoading(false);
    onUploaded(url);
  }
  return <div className="space-y-3"><button type="button" className="focus-ring group relative flex min-h-40 w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-[var(--accent)]/70 bg-white/45 p-3 dark:bg-slate-950/30" onClick={() => inputRef.current?.click()}>{preview ? <Image src={preview} alt="Pratinjau gambar" fill unoptimized className="rounded-2xl object-cover" /> : <span className="flex flex-col items-center gap-2 text-sm font-bold text-muted"><ImagePlus size={28} />Pilih gambar</span>}{loading && <span className="absolute inset-0 flex items-center justify-center bg-slate-950/45 text-white"><LoaderCircle className="animate-spin" /></span>}<span className="absolute bottom-3 right-3 rounded-full bg-[var(--primary)] p-2 text-white opacity-0 transition group-hover:opacity-100"><UploadCloud size={16} /></span></button><input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} /><p className="text-xs text-muted">PNG, JPG, atau WebP. Maksimal 5 MB.</p></div>;
}
