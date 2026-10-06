"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, ImagePlus, Loader2, Upload, X } from "lucide-react";
import NextImage from "next/image";
import { useRef, useState } from "react";
import { submitComplaint } from "./actions";
import { GlassButton, GlassCard } from "@/components/shared/glass";
import { glassToast } from "@/components/shared/toast";

const categories = ["Administrasi", "Infrastruktur", "Sosial", "Kebersihan", "Lainnya"];
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_COMPRESSED_SIZE = 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

async function compressImage(source: File) {
  const objectUrl = URL.createObjectURL(source);
  try {
    const image = new window.Image();
    image.src = objectUrl;
    await image.decode();
    let scale = Math.min(1, 1600 / Math.max(image.width, image.height));

    for (let attempt = 0; attempt < 6; attempt += 1) {
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas tidak tersedia.");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const quality = Math.max(0.45, 0.8 - attempt * 0.07);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
      if (!blob) throw new Error("Foto tidak dapat diproses.");
      if (blob.size <= MAX_COMPRESSED_SIZE || scale <= 0.5) {
        return new File([blob], `${source.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
      }
      scale *= 0.8;
    }
    throw new Error("Foto masih terlalu besar.");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function ComplaintForm() {
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState({
    nama: "",
    kontak: "",
    anonim: false,
    kategori: "",
    isi: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [token, setToken] = useState("");
  const [ticket, setTicket] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.set("nama", formValues.nama);
    formData.set("kontak", formValues.kontak);
    formData.set("anonim", String(formValues.anonim));
    formData.set("kategori", formValues.kategori);
    formData.set("isi", formValues.isi);
    formData.set("turnstileToken", token);
    formData.set("website", "");
    if (file) formData.set("lampiran", file);
    const result = await submitComplaint(formData);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      glassToast(result.error);
      return;
    }
    setTicket(result.nomorTiket);
  }

  if (ticket) {
    return <GlassCard className="mx-auto max-w-2xl p-6 text-center sm:p-10"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check /></div><h2 className="mt-5 text-2xl font-extrabold">Pengaduan berhasil dikirim</h2><p className="text-muted mt-2">Simpan nomor tiket berikut untuk memeriksa perkembangan laporan.</p><div className="mt-6 flex items-center justify-center gap-3 rounded-2xl bg-[var(--primary-soft)] p-4 text-xl font-extrabold tracking-wide text-[var(--primary)] dark:bg-[var(--primary-soft)]">{ticket}<button type="button" className="focus-ring rounded-full p-2" onClick={() => { void navigator.clipboard.writeText(ticket); glassToast("Nomor tiket disalin."); }} aria-label="Salin nomor tiket"><Copy size={18} /></button></div><a href={`/pengaduan/status?nomor=${encodeURIComponent(ticket)}`} className="glass-pill mt-6 inline-flex min-h-11 items-center px-5 font-bold">Cek status pengaduan</a></GlassCard>;
  }

  function updateField(field: "nama" | "kontak" | "kategori" | "isi", value: string) {
    setFormValues((current) => ({ ...current, [field]: value }));
  }

  function continueTo(stepNumber: 2 | 3) {
    const message = stepNumber === 2 && !formValues.anonim && (!formValues.nama.trim() || !formValues.kontak.trim())
      ? "Nama dan kontak wajib diisi jika tidak anonim."
      : stepNumber === 3 && (!formValues.kategori || formValues.isi.trim().length < 10)
        ? !formValues.kategori ? "Pilih kategori." : "Isi pengaduan minimal 10 karakter."
        : "";
    setError(message);
    if (!message) setStep(stepNumber);
  }

  return <form onSubmit={submit} className="glass-strong mx-auto max-w-2xl rounded-[30px] p-5 sm:p-8">
    <input name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-px w-px opacity-0" aria-hidden="true" />
    <div className="mb-8"><div className="flex justify-between text-xs font-bold text-muted"><span>Langkah {step} dari 3</span><span>{Math.round((step / 3) * 100)}%</span></div><div className="mt-3 h-2 rounded-full bg-[var(--primary-soft)] dark:bg-[var(--primary-soft)]"><motion.div className="h-full rounded-full bg-[var(--primary)]" animate={{ width: `${(step / 3) * 100}%` }} /></div></div>
    <AnimatePresence mode="wait">
      {step === 1 && <motion.div key="one" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><h2 className="text-xl font-extrabold">Data pelapor</h2><label className="mt-5 flex min-h-12 items-center gap-3 font-semibold"><input type="checkbox" checked={formValues.anonim} onChange={(event) => setFormValues((current) => ({ ...current, anonim: event.target.checked }))} className="h-5 w-5 accent-[var(--primary)]" />Kirim secara anonim</label>{!formValues.anonim && <div className="mt-4 grid gap-4 sm:grid-cols-2"><label>Nama<input value={formValues.nama} onChange={(event) => updateField("nama", event.target.value)} className="form-input" placeholder="Nama lengkap" /></label><label>Kontak<input value={formValues.kontak} onChange={(event) => updateField("kontak", event.target.value)} className="form-input" placeholder="No. WhatsApp / email" /></label></div>}{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}<div className="mt-6 flex justify-end"><GlassButton type="button" onClick={() => continueTo(2)}>Lanjut</GlassButton></div></motion.div>}
      {step === 2 && <motion.div key="two" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><h2 className="text-xl font-extrabold">Isi pengaduan</h2><label className="mt-5 block">Kategori<select value={formValues.kategori} onChange={(event) => updateField("kategori", event.target.value)} className="form-input"><option value="" disabled>Pilih kategori</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label className="mt-4 block">Ceritakan pengaduan<textarea value={formValues.isi} onChange={(event) => updateField("isi", event.target.value)} rows={6} className="form-input" placeholder="Tuliskan laporan secara jelas..." /></label>{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}<div className="mt-6 flex justify-between"><GlassButton type="button" variant="secondary" onClick={() => { setError(""); setStep(1); }}>Kembali</GlassButton><GlassButton type="button" onClick={() => continueTo(3)}>Lanjut</GlassButton></div></motion.div>}
      {step === 3 && <motion.div key="three" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}><h2 className="text-xl font-extrabold">Lampiran & kirim</h2><div role="button" tabIndex={0} onClick={() => fileInput.current?.click()} onKeyDown={(event) => event.key === "Enter" && fileInput.current?.click()} className="focus-ring mt-5 cursor-pointer rounded-2xl border-2 border-dashed border-[var(--accent)] p-6 text-center dark:border-[var(--primary)]"><input ref={fileInput} type="file" name="lampiran" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={async (event) => { const selected = event.target.files?.[0]; if (!selected) return; if (!ALLOWED_FILE_TYPES.has(selected.type) || selected.size > MAX_FILE_SIZE) { setError("Foto harus JPG, PNG, atau WebP dengan ukuran maksimal 5 MB."); setFile(null); setPreviewUrl(""); return; } setCompressing(true); setError(""); try { const compressed = await compressImage(selected); if (compressed.size > MAX_FILE_SIZE) throw new Error("Foto masih terlalu besar."); setFile(compressed); setPreviewUrl(URL.createObjectURL(compressed)); } catch { setFile(null); setPreviewUrl(""); setError("Foto terlalu besar, coba foto lain"); } finally { setCompressing(false); } }} />{compressing ? <p className="font-semibold">Memproses foto...</p> : file ? <div className="flex flex-col items-center gap-3 font-semibold">{previewUrl &&       <NextImage src={previewUrl} alt="Pratinjau foto terkompresi" width={640} height={480} unoptimized className="max-h-48 w-auto rounded-2xl object-contain" />}<span className="flex items-center gap-2"><ImagePlus size={18} />{file.name}<button type="button" onClick={(event) => { event.stopPropagation(); setFile(null); setPreviewUrl(""); if (fileInput.current) fileInput.current.value = ""; }} aria-label="Hapus lampiran"><X size={16} /></button></span></div> : <><Upload className="mx-auto text-[var(--primary)]" /><p className="mt-2 font-bold">Pilih atau tarik foto ke sini</p><p className="text-muted mt-1 text-xs">JPG, PNG, WebP · maksimal 5 MB</p></>}</div>{turnstileSiteKey && <div className="mt-6 rounded-2xl bg-[var(--primary-soft)] p-4 text-sm dark:bg-[var(--primary-soft)]"><p className="font-bold">Verifikasi keamanan</p><Turnstile siteKey={turnstileSiteKey} onSuccess={setToken} onExpire={() => setToken("")} options={{ appearance: "interaction-only" }} /><input type="hidden" name="turnstileToken" value={token} /></div>}{error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}<div className="mt-6 flex justify-between"><GlassButton type="button" variant="secondary" onClick={() => setStep(2)}>Kembali</GlassButton><GlassButton type="submit" disabled={loading || compressing || Boolean(turnstileSiteKey && !token)}>{loading ? <><Loader2 className="animate-spin" size={18} />Mengirim...</> : "Kirim pengaduan"}</GlassButton></div></motion.div>}
    </AnimatePresence>
  </form>;
}
