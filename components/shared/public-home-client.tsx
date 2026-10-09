"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, CalendarDays, ChevronRight, MapPin, MessageCircle, Phone, ShieldCheck, History, Sprout, RotateCcw, ListChecks, Play, Video } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { GlassButton, GlassCard, GlassChip } from "@/components/shared/glass";
import { Reveal } from "@/components/shared/reveal";
import { Container, SectionHeading } from "@/components/shared/layout";
import { FasilitasSection } from "@/components/shared/fasilitas-section";
import { waLink } from "@/lib/whatsapp";
import { HARI, jamTampilanPublik } from "@/lib/jam";
import { GalleryClient } from "@/app/(public)/galeri/gallery-client";
import { PotentialChart } from "@/components/shared/potential-chart";
import { PROFIL_2024 } from "@/lib/profil-2024";
import { NOMOR_KONTAK_SEMENTARA } from "@/lib/contact";

type Profile = {
  sambutan: string | null; alamat: string | null; telepon: string | null; whatsapp: string | null; email: string | null;
  jam_pelayanan: Record<string, { buka?: string; tutup?: string }>; zona_waktu: string; lingkungan: number; jumlah_penduduk: number;
};
export type PublicHomeData = {
  profile: Profile | null;
  layanan: { id: string; nama: string; slug: string; ringkasan: string | null; syarat: unknown; alur: unknown; urutan: number }[];
  gallery: { id: string; judul: string; gambar_url: string; urutan?: number; deskripsi?: string }[];
};

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  if (typeof value !== "string" || !value.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  } catch {
    // Some older rows store a single plain-text value instead of a JSON array.
  }
  return [value.trim()];
}

function ServiceFlipCard({ item }: { item: PublicHomeData["layanan"][number] }) {
  const [flipped, setFlipped] = useState(false);
  const requirements = stringList(item.syarat);
  const steps = stringList(item.alur);

  return <div className="[perspective:1200px]">
    <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: .65, type: "spring", stiffness: 180, damping: 22 }} style={{ transformStyle: "preserve-3d" }} className="relative min-h-[310px]">
      <section aria-hidden={flipped} inert={flipped} className="absolute inset-0 [backface-visibility:hidden]">
        <GlassCard className="flex h-full min-h-[310px] flex-col p-5">
          <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><ShieldCheck size={20} /></span>
          <h3 className="text-lg font-extrabold">{item.nama}</h3>
          <p className="text-muted mt-2 flex-1 text-sm leading-6">{item.ringkasan}</p>
          <button type="button" onClick={() => setFlipped(true)} className="focus-ring mt-4 inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-[var(--primary)] px-4 text-sm font-bold text-white transition-colors hover:bg-emerald-800"><ListChecks size={16} />Lihat syarat<RotateCcw size={14} /></button>
        </GlassCard>
      </section>
      <section aria-hidden={!flipped} inert={!flipped} className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
        <GlassCard className="flex h-full min-h-[310px] flex-col p-5">
          <div className="flex items-start justify-between gap-2"><div><p className="text-[10px] font-bold uppercase tracking-[.13em] text-[var(--primary)]">Panduan singkat</p><h3 className="mt-1 line-clamp-2 text-base font-extrabold">{item.nama}</h3></div><button type="button" onClick={() => setFlipped(false)} className="focus-ring rounded-full p-2 text-[var(--primary)]" aria-label="Kembali ke ringkasan"><RotateCcw size={17} /></button></div>
          <div className="mt-3 grid flex-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2">
            <div><h4 className="text-xs font-extrabold">Persyaratan</h4>{requirements.length ? <ul className="text-muted mt-1.5 list-inside list-disc space-y-1 text-xs leading-5">{requirements.slice(0, 5).map((requirement, index) => <li key={`${requirement}-${index}`}>{requirement}</li>)}</ul> : <p className="text-muted mt-1.5 text-xs leading-5">Persyaratan belum dicantumkan.</p>}</div>
            <div><h4 className="text-xs font-extrabold">Langkah pengurusan</h4>{steps.length ? <ol className="text-muted mt-1.5 list-inside list-decimal space-y-1 text-xs leading-5">{steps.slice(0, 4).map((step, index) => <li key={`${step}-${index}`}>{step}</li>)}</ol> : <p className="text-muted mt-1.5 text-xs leading-5">Langkah pengurusan belum dicantumkan.</p>}</div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--line)] pt-3"><span className="text-muted text-[10px]">Detail lengkap</span><Link href={`/layanan/${item.slug}`} className="focus-ring inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-xs font-bold text-[var(--primary)]">Buka<ChevronRight size={14} /></Link></div>
        </GlassCard>
      </section>
    </motion.div>
  </div>;
}

const DAY_KEYS = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
const EN_DAY: Record<string, number> = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };

function officeStatus(profile: Profile | null) {
  if (!profile) return { open: false, label: "Informasi jam pelayanan belum tersedia" };
  const now = new Date();
  let today = 1;
  let time = "00:00";
  try {
    const timeZone = profile.zona_waktu || "Asia/Makassar";
    today = EN_DAY[new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone }).format(now).toLowerCase()] ?? 1;
    time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }).format(now);
  } catch {
    const fallbackTimeZone = "Asia/Makassar";
    today = EN_DAY[new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: fallbackTimeZone }).format(now).toLowerCase()] ?? 1;
    time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: fallbackTimeZone }).format(now);
  }
  const hoursOf = (index: number) => {
    const entry = jamTampilanPublik(profile.jam_pelayanan)[DAY_KEYS[index % 7]];
    return entry?.buka && entry?.tutup ? entry : null;
  };
  const todayHours = hoursOf(today);
  if (todayHours && time >= todayHours.buka! && time < todayHours.tutup!) return { open: true, label: `Buka hingga ${todayHours.tutup}` };
  if (todayHours && time < todayHours.buka!) return { open: false, label: `Buka hari ini ${todayHours.buka}` };
  for (let step = 1; step <= 7; step++) {
    const next = hoursOf(today + step);
    if (next) {
      const name = step === 1 ? "besok" : DAY_KEYS[(today + step) % 7].replace(/^./, (c) => c.toUpperCase());
      return { open: false, label: `Buka ${name} ${next.buka}` };
    }
  }
  return { open: false, label: "Tutup" };
}

export function PublicHomeClient({ data }: { data: PublicHomeData }) {
  const [status, setStatus] = useState<{ open: boolean; label: string } | null>(null);
  useEffect(() => {
    const updateStatus = () => setStatus(officeStatus(data.profile));
    updateStatus();
    const interval = window.setInterval(updateStatus, 60_000);
    return () => window.clearInterval(interval);
  }, [data.profile]);
  const wa = waLink(data.profile?.whatsapp || NOMOR_KONTAK_SEMENTARA, "Halo Kelurahan Taratara Tiga, saya ingin bertanya/menyampaikan: ");
  const aspirationTemplate = "ASPIRASI WARGA — KELURAHAN TARATARA TIGA\n\nNama: [Nama lengkap]\nLingkungan: [I–VII]\nTopik: [Topik aspirasi]\n\nIsi aspirasi: [Tuliskan saran, kebutuhan, atau masukan Anda]\nHarapan: [Hasil yang diharapkan]";
  const aspirationWa = waLink(data.profile?.whatsapp || NOMOR_KONTAK_SEMENTARA, aspirationTemplate);
  const introVideoUrl = process.env.NEXT_PUBLIC_VIDEO_PENGENALAN_URL?.trim();
  const youtubeId = introVideoUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)?.[1];

  return <main className="pb-28 pt-20 md:pb-10">
    <Container>
      <section id="beranda" className="grid items-center gap-10 py-14 md:grid-cols-[1.08fr_.92fr] md:py-24">
        <Reveal>
          <GlassChip className={status?.open ? "text-emerald-700 dark:text-emerald-300" : "text-slate-600 dark:text-slate-300"}>
            <span className={`mr-2 inline-block h-2 w-2 rounded-full ${status?.open ? "status-live-dot bg-emerald-500" : "bg-slate-400"}`} />
            {status ? `${status.open ? "Buka sekarang" : "Tutup"} · ${status.label}` : "Jam pelayanan kelurahan"}
          </GlassChip>
          <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-[-.06em] sm:text-[60px]">Melayani warga, <span className="text-[var(--primary)]">dengan hati.</span></h1>
          <p className="text-muted mt-6 max-w-xl text-base leading-8 sm:text-lg">{data.profile?.sambutan ?? "Portal resmi Kelurahan Taratara Tiga, Kecamatan Tomohon Barat."}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#layanan"><GlassButton>Lihat Layanan <ArrowRight size={17} /></GlassButton></Link>
            {wa
              ? <a href={wa} target="_blank" rel="noopener noreferrer"><GlassButton variant="secondary">Hubungi via WhatsApp</GlassButton></a>
              : <Link href="/kontak"><GlassButton variant="secondary">Hubungi Kami</GlassButton></Link>}
          </div>
        </Reveal>
        <Reveal delay={.1} className="group relative min-h-[360px] overflow-hidden rounded-[32px] shadow-2xl shadow-[var(--primary)]/20 transition-shadow duration-500 hover:shadow-[0_32px_70px_rgba(15,75,53,.3)]">
          <Image src="/bg/hero.jpeg" alt="Pemandangan alam dan persawahan di sekitar Tomohon" fill priority sizes="(max-width: 768px) 100vw, 42vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f17]/85 via-[#0f1f17]/15 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[var(--accent)]"><MapPin size={14} /> Tomohon Barat</p>
            <p className="max-w-sm text-2xl font-bold drop-shadow-md">Informasi kelurahan yang dekat dengan warga.</p>
          </div>
        </Reveal>
      </section>

      <Reveal id="video-pengenalan" className="scroll-mt-28 pb-10">
        <section aria-labelledby="video-pengenalan-title" className="relative isolate overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-emerald-100/80 via-white/75 to-cyan-100/80 p-5 shadow-[0_24px_70px_rgba(15,75,53,.12)] dark:border-white/10 dark:from-emerald-950/60 dark:via-[#0a2d26]/80 dark:to-cyan-950/40 sm:p-8 lg:p-10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 -z-10 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
          <div className="grid items-center gap-7 lg:grid-cols-[.78fr_1.22fr] lg:gap-10">
            <div className="max-w-lg">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/65 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[var(--primary)] dark:bg-white/5"><Video size={14} /> Cerita dari Taratara Tiga</span>
              <h2 id="video-pengenalan-title" className="mt-4 text-3xl font-extrabold leading-tight tracking-[-.04em] sm:text-4xl">Kenali Taratara Tiga, lebih dekat.</h2>
              <p className="text-muted mt-3 text-sm leading-7 sm:text-base">Lihat kehidupan warga, potensi wilayah, dan semangat kebersamaan yang membuat Taratara Tiga istimewa.</p>
              <p className="text-muted mt-5 flex items-center gap-2 text-xs font-semibold"><span className="h-2 w-2 rounded-full bg-[var(--primary)]" /> Video pengenalan kelurahan</p>
            </div>
            <div className="group relative aspect-video min-h-[200px] overflow-hidden rounded-[24px] border border-white/60 bg-[#092c25] shadow-[0_18px_50px_rgba(4,60,43,.2)] sm:rounded-[28px]">
              {youtubeId ? <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${youtubeId}`} title="Video pengenalan Kelurahan Taratara Tiga" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : introVideoUrl ? <video className="absolute inset-0 h-full w-full object-cover" controls playsInline preload="metadata" poster="/bg/hero.jpeg"><source src={introVideoUrl} type={/\.webm(?:\?|$)/i.test(introVideoUrl) ? "video/webm" : "video/mp4"} />Browser Anda tidak mendukung pemutar video.</video> : <>
                <Image src="/bg/hero.jpeg" alt="Pemandangan alam di sekitar Taratara Tiga" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover opacity-75 transition duration-700 group-hover:scale-[1.025] group-hover:opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#06291f]/75 via-[#06291f]/25 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5 text-center text-white">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/20 shadow-[0_0_0_10px_rgba(255,255,255,.1)] backdrop-blur-md sm:h-[76px] sm:w-[76px]"><Play size={27} fill="currentColor" className="ml-1" /></span>
                  <span className="rounded-full border border-white/25 bg-black/20 px-3 py-1 text-xs font-bold tracking-wide backdrop-blur-md">RUANG VIDEO PENGENALAN</span>
                  <span className="text-xs text-white/85">Tambahkan tautan video melalui <code className="rounded bg-black/25 px-1.5 py-0.5">NEXT_PUBLIC_VIDEO_PENGENALAN_URL</code></span>
                </div>
              </>}
            </div>
          </div>
        </section>
      </Reveal>

      <section aria-labelledby="jadwal-kantor" className="-mt-5 mb-8 scroll-mt-28">
        <GlassCard className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><CalendarDays size={19} /></span><div><p className="text-xs font-bold uppercase tracking-[.14em] text-[var(--accent)]">Informasi pelayanan</p><h2 id="jadwal-kantor" className="text-lg font-extrabold sm:text-xl">Jadwal buka kantor</h2></div></div>
            <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {HARI.map(([key, label]) => {
                const hours = jamTampilanPublik(data.profile?.jam_pelayanan)[key];
                return <div key={key} className="rounded-xl border border-[var(--line)] bg-white/45 px-3 py-2 dark:bg-white/[.04]"><dt className="text-xs font-semibold">{label}</dt><dd className="text-muted mt-0.5 text-xs">{hours?.buka && hours?.tutup ? `${hours.buka}–${hours.tutup}` : "Tutup"}</dd></div>;
              })}
            </dl>
          </div>
          <Link href="/kontak" className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-white/60 px-4 text-sm font-bold text-[var(--primary)] transition-colors hover:bg-[var(--primary-soft)] lg:self-center">Kontak kami<ArrowRight size={16} /></Link>
        </GlassCard>
      </section>

      <Reveal id="profil" className="scroll-mt-28 py-12">
        <div className="relative overflow-hidden rounded-[32px] border border-[var(--line)] bg-gradient-to-br from-emerald-100/90 via-white/80 to-cyan-100/80 p-5 shadow-[0_24px_70px_rgba(15,75,53,.1)] dark:from-emerald-950/70 dark:via-[#0a2d26]/90 dark:to-cyan-950/50 sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]"><Sprout size={14} /> Kelurahan di kaki gunung</p>
              <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-.04em] sm:text-5xl">Mengenal Taratara Tiga</h2>
              <p className="text-muted mt-4 text-base leading-7 sm:text-lg sm:leading-8">Di Kecamatan Tomohon Barat, kehidupan warga tumbuh bersama sawah, kebun, dan semangat <em>mapalus</em>. Taratara Tiga merupakan bagian dari kawasan Taratara yang dikelilingi Gunung Lokon, Kasehe, dan Tatawiran.</p>
              <div className="mt-6 max-w-md rounded-2xl border border-[var(--line)] bg-white/55 p-4 dark:bg-white/5"><p className="text-sm font-bold uppercase tracking-[.12em] text-[var(--primary)]">Lurah saat ini</p><p className="mt-1 text-lg font-extrabold sm:text-xl">Rommy N. Loho, SH</p><p className="text-muted mt-1 text-sm leading-6">Menjabat sejak 2021</p></div>
              <div className="mt-7 flex flex-wrap gap-5 text-sm font-bold">
                <Link href="/profil" className="group inline-flex min-h-11 items-center gap-1 text-[var(--primary)]">Baca profil lengkap <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
                <Link href="/peta" className="group inline-flex min-h-11 items-center gap-1 text-[var(--primary)]">Lihat peta <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 self-start">
              <div className="min-h-[124px] rounded-3xl border border-[var(--line)] bg-white/60 p-4 text-[var(--foreground)] dark:bg-white/5 sm:p-5"><p className="text-sm font-semibold text-muted">Penduduk · 2024</p><p className="mt-2 text-2xl font-extrabold sm:text-3xl">{PROFIL_2024.penduduk.total.toLocaleString("id-ID")}</p><p className="text-sm text-muted">jiwa</p></div>
              <div className="min-h-[124px] rounded-3xl border border-[var(--line)] bg-white/60 p-4 dark:bg-white/5 sm:p-5"><p className="text-sm font-semibold text-muted">Luas wilayah</p><p className="mt-2 text-2xl font-extrabold">{PROFIL_2024.wilayah.luasHa.toLocaleString("id-ID")}</p><p className="text-sm text-muted">hektare</p></div>
              <div className="min-h-[124px] rounded-3xl border border-[var(--line)] bg-white/60 p-4 dark:bg-white/5 sm:p-5"><p className="text-sm font-semibold text-muted">Lingkungan</p><p className="mt-2 text-2xl font-extrabold">{PROFIL_2024.wilayah.lingkungan}</p><p className="text-sm text-muted">lingkungan</p></div>
              <div className="min-h-[124px] rounded-3xl border border-[var(--line)] bg-white/60 p-4 dark:bg-white/5 sm:p-5"><p className="text-sm font-semibold text-muted">Kepala keluarga</p><p className="mt-2 text-2xl font-extrabold">{PROFIL_2024.penduduk.keluarga.toLocaleString("id-ID")}</p><p className="text-sm text-muted">KK</p></div>
            </div>
          </div>

          <div id="sejarah" className="relative mt-10 scroll-mt-28 border-t border-[var(--line)] pt-7">
            <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]"><History size={20} /></span><div><p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--accent)]">Jejak waktu</p><h3 className="text-xl font-extrabold sm:text-2xl">Sejarah yang membentuk Taratara</h3></div></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["1303", "Awal kisah Taratara", "Tonaas dari Sarongsong-Toumuung singgah di mata air Kemer dalam perjalanan ke pantai Tambala."],
                ["1916–1946", "Masa onder district", "Taratara menjadi bagian Onder District Tombariri, lalu masuk wilayah District Tomohon."],
                ["1978", "Taratara dimekarkan", "Wilayah Taratara dibagi menjadi Taratara Satu dan Taratara Dua."],
                ["2004", "Menjadi kelurahan", "Seiring pembentukan Kota Tomohon, desa Taratara Satu dan Dua beralih menjadi kelurahan."],
                ["7 Sep 2009", "Taratara Tiga berdiri", "Kelurahan Taratara Tiga dimekarkan dari Kelurahan Taratara Dua berdasarkan Perda Kota Tomohon No. 12 Tahun 2009."],
              ].map(([year, title, description]) => <article key={year} className="group relative rounded-2xl border border-[var(--line)] bg-white/55 p-4 transition-[border-color,background-color,box-shadow] duration-300 hover:border-[var(--primary)]/30 hover:bg-white/85 hover:shadow-lg dark:bg-white/5 dark:hover:bg-white/10">
                <p className="text-sm font-extrabold text-[var(--primary)]">{year}</p><h4 className="mt-1 text-base font-extrabold">{title}</h4><p className="text-muted mt-2 text-sm leading-6">{description}</p>
              </article>)}
            </div>
          </div>
        </div>
        <p className="text-muted mt-3 px-1 text-xs italic leading-5">Sumber: <em>Daftar Isian Potensi Desa dan Kelurahan Taratara Tiga</em> (Desember 2024) untuk data wilayah dan kependudukan; <em>Sejarah Taratara.docx</em> untuk kronologi dan riwayat kepemimpinan.</p>
      </Reveal>

      <Reveal id="potensi" className="scroll-mt-28 py-10">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Potensi wilayah" title="Alam dan hasil bumi Taratara Tiga" description="Jelajahi penggunaan lahan dan tanaman pangan Taratara Tiga." />
          <Link href="/statistik" className="focus-ring inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-[var(--line)] bg-white/60 px-4 text-sm font-bold text-[var(--primary)] transition-colors hover:bg-[var(--primary-soft)] sm:shrink-0 sm:self-end">Lihat selengkapnya<ArrowRight size={16} /></Link>
        </div>
        <div className="mt-6"><PotentialChart /></div>
      </Reveal>

      <Reveal id="galeri" className="scroll-mt-28 py-10">
        <div className="mb-6 flex items-end justify-between gap-3"><SectionHeading eyebrow="Dokumentasi" title="Galeri" description="Momen pelayanan dan kegiatan warga." /><Link href="/galeri" className="shrink-0 text-sm font-bold text-[var(--primary)]">Semua foto <ArrowRight size={15} className="inline" /></Link></div>
        {data.gallery.length ? <GalleryClient items={data.gallery.slice(0, 9)} /> : <EmptyState title="Galeri segera hadir" description="Dokumentasi kegiatan warga akan ditampilkan di sini." />}
      </Reveal>

      <FasilitasSection />

      <Reveal id="layanan" className="py-10">
        <SectionHeading eyebrow="Layanan publik" title="Ada yang bisa kami bantu?" description="Pilih layanan yang Anda perlukan." />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.layanan.length ? data.layanan.map((item) => <ServiceFlipCard key={item.id} item={item} />) : (
            <div className="sm:col-span-2 lg:col-span-3"><EmptyState title="Layanan segera hadir" description="Informasi layanan sedang disiapkan oleh kelurahan." /></div>
          )}
        </div>
      </Reveal>

      <Reveal id="aspirasi" className="scroll-mt-28 py-10">
        <div className="mb-6"><SectionHeading eyebrow="Suara warga" title="Aspirasi untuk Taratara Tiga" description="Sampaikan ide, kebutuhan, dan masukan Anda langsung kepada pemerintah kelurahan." /></div>
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard id="hubungi" className="scroll-mt-28 p-6 sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><MessageCircle size={22} /></span>
            <h3 className="mt-5 text-xl font-extrabold">Cara menyampaikan aspirasi</h3>
            <p className="text-muted mt-2 text-sm leading-6">Gunakan WhatsApp resmi kelurahan agar pesan Anda diterima oleh petugas.</p>
            <ol className="mt-5 space-y-4">
              {[["01", "Lengkapi format", "Isi nama, lingkungan, topik, dan aspirasi dengan jelas."], ["02", "Periksa pesan", "Tombol WhatsApp akan membuka pesan template yang bisa Anda lengkapi."], ["03", "Kirim ke kelurahan", "Tekan tombol kirim di WhatsApp. Petugas akan menindaklanjuti pada jam pelayanan."]].map(([number, title, detail]) => <li key={number} className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10 text-xs font-extrabold text-[var(--primary)]">{number}</span><span><strong className="text-sm">{title}</strong><span className="text-muted mt-0.5 block text-sm leading-5">{detail}</span></span></li>)}
            </ol>
          </GlassCard>
          <GlassCard className="p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--primary)]">Template pesan</p>
            <h3 className="mt-2 text-xl font-extrabold">Format aspirasi warga</h3>
            <p className="text-muted mt-2 text-sm leading-6">Template ini akan disiapkan otomatis. Lengkapi bagian di dalam tanda kurung sebelum mengirim.</p>
            <pre className="mt-5 whitespace-pre-wrap rounded-2xl border border-[var(--line)] bg-white/55 p-4 font-sans text-xs leading-6 dark:bg-black/10 sm:text-sm">{aspirationTemplate}</pre>
            {aspirationWa ? <a href={aspirationWa} target="_blank" rel="noopener noreferrer" className="focus-ring mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-5 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/20 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto"><MessageCircle size={17} />Kirim aspirasi via WhatsApp<ArrowRight size={16} /></a> : <p className="text-muted mt-5 rounded-2xl bg-[var(--primary-soft)]/60 p-4 text-sm">Nomor WhatsApp resmi kelurahan belum tersedia. Silakan hubungi kelurahan melalui halaman kontak.</p>}
          </GlassCard>
        </div>
      </Reveal>
    </Container>
  </main>;
}

export function Footer({ profile }: { profile: Pick<Profile, "alamat" | "telepon"> | null }) {
  const phone = profile?.telepon || NOMOR_KONTAK_SEMENTARA;
  return <footer id="kontak" className="scroll-mt-28 px-4 pb-24 sm:px-8 md:pb-8"><div className="glass-strong mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-5 rounded-[24px] p-5 sm:p-6"><div className="min-w-[180px]"><p className="font-extrabold">Kelurahan Taratara Tiga</p><p className="text-muted mt-1 flex items-center gap-2 text-xs"><MapPin size={13} className="shrink-0" /><span>{profile?.alamat ?? "Tomohon Barat, Kota Tomohon"}</span></p></div><div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-semibold"><a className="text-muted inline-flex items-center gap-1.5" href={`tel:${phone.replace(/[^\d+]/g, "")}`}><Phone size={13} />{phone}</a><Link href="/kontak" className="font-bold text-[var(--primary)]">Informasi kontak<ArrowRight className="ml-1 inline" size={13} /></Link><nav aria-label="Navigasi footer" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[var(--primary)]"><Link href="/#profil">Profil</Link><Link href="/#layanan">Layanan</Link><Link href="/#potensi">Potensi</Link><Link href="/#galeri">Galeri</Link><Link href="/umkm">UMKM</Link><Link href="/kontak">Kontak</Link></nav></div></div></footer>;
}
