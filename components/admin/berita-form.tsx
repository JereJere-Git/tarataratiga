"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";
import { GlassButton } from "@/components/shared/glass";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { glassToast } from "@/components/shared/toast";
import { saveBerita } from "@/app/admin/(protected)/berita/actions";

type BeritaValue = { id?: string; judul?: string; slug?: string; ringkasan?: string | null; isi?: string; gambar_url?: string | null; kategori?: string | null; status?: "draf" | "terbit"; terbit_pada?: string | null };

function toSlug(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-");
}

export function BeritaForm({ initial }: { initial?: BeritaValue }) {
  const router = useRouter();
  const [judul, setJudul] = useState(initial?.judul ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(initial?.slug));
  const [ringkasan, setRingkasan] = useState(initial?.ringkasan ?? "");
  const [kategori, setKategori] = useState(initial?.kategori ?? "");
  const [isi, setIsi] = useState(initial?.isi ?? "<p>Tulis berita di sini...</p>");
  const [gambarUrl, setGambarUrl] = useState(initial?.gambar_url ?? "");
  const [status, setStatus] = useState<"draf" | "terbit">(initial?.status ?? "draf");
  const [terbitPada, setTerbitPada] = useState(initial?.terbit_pada ? new Date(initial.terbit_pada).toISOString().slice(0, 16) : "");
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.set("isi", isi);
    formData.set("gambar_url", gambarUrl);
    const result = await saveBerita(formData);
    setLoading(false);
    if (result.error) { glassToast(result.error); return; }
    glassToast(result.success ?? "Tersimpan.");
    router.push("/admin/berita");
    router.refresh();
  }
  return <form onSubmit={submit} className="glass-strong space-y-6 rounded-[28px] p-5 sm:p-8"><input type="hidden" name="id" value={initial?.id ?? ""} /><div className="grid gap-5 md:grid-cols-2"><label className="block text-sm font-bold md:col-span-2">Judul<input name="judul" required value={judul} onChange={(event) => { setJudul(event.target.value); if (!slugEdited) setSlug(toSlug(event.target.value)); }} className="form-input" /></label><label className="block text-sm font-bold">Slug<input name="slug" required value={slug} onChange={(event) => { setSlugEdited(true); setSlug(toSlug(event.target.value)); }} className="form-input" /><span className="mt-1 block text-xs font-normal text-muted">URL: /berita/{slug || "judul-berita"}</span></label><label className="block text-sm font-bold">Kategori<input name="kategori" value={kategori} onChange={(event) => setKategori(event.target.value)} placeholder="Pemerintahan" className="form-input" /></label></div><label className="block text-sm font-bold">Ringkasan<textarea name="ringkasan" value={ringkasan} onChange={(event) => setRingkasan(event.target.value)} rows={3} className="form-input resize-y" /></label><div><p className="mb-2 text-sm font-bold">Gambar utama</p><ImageUploader folder="berita" value={gambarUrl} onUploaded={setGambarUrl} /></div><div><p className="mb-2 text-sm font-bold">Isi berita</p><RichTextEditor value={isi} onChange={setIsi} /></div><div className="grid gap-5 md:grid-cols-2"><label className="block text-sm font-bold">Status<select name="status" value={status} onChange={(event) => setStatus(event.target.value as "draf" | "terbit")} className="form-input"><option value="draf">Draf</option><option value="terbit">Terbit</option></select></label><label className="block text-sm font-bold">Jadwal terbit<input name="terbit_pada" type="datetime-local" value={terbitPada} onChange={(event) => setTerbitPada(event.target.value)} className="form-input" /></label></div><div className="flex justify-end gap-3"><GlassButton type="button" variant="secondary" onClick={() => router.push("/admin/berita")}>Batal</GlassButton><GlassButton type="submit" disabled={loading}>{loading ? "Menyimpan..." : <><Save size={17} />Simpan berita</>}</GlassButton></div></form>;
}
