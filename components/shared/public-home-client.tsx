"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight, Clock3, MapPin, MessageCircle, Phone, ShieldCheck, Images, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { GlassButton, GlassCard, GlassChip } from "@/components/shared/glass";
import { Reveal } from "@/components/shared/reveal";
import { Container, SectionHeading } from "@/components/shared/layout";
import { FasilitasSection } from "@/components/shared/fasilitas-section";
import { waLink } from "@/lib/whatsapp";

type Profile = {
  sambutan: string | null; alamat: string | null; telepon: string | null; whatsapp: string | null; email: string | null;
  jam_pelayanan: Record<string, { buka?: string; tutup?: string }>; zona_waktu: string; lingkungan: number; jumlah_penduduk: number;
};
export type PublicHomeData = {
  profile: Profile | null;
  layanan: { id: string; nama: string; slug: string; ringkasan: string | null; urutan: number }[];
};

function officeStatus(profile: Profile | null) {
  if (!profile) return { open: false, label: "Informasi jam pelayanan belum tersedia" };
  const now = new Date();
  const englishDay = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: profile.zona_waktu }).format(now).toLowerCase();
  const day = ({ sunday: "minggu", monday: "senin", tuesday: "selasa", wednesday: "rabu", thursday: "kamis", friday: "jumat", saturday: "sabtu" } as Record<string, string>)[englishDay] ?? "senin";
  const schedule = profile.jam_pelayanan?.[day];
  if (!schedule?.buka || !schedule?.tutup) return { open: false, label: "Tutup hari ini" };
  const time = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: profile.zona_waktu }).format(now);
  const open = time >= schedule.buka && time < schedule.tutup;
  return { open, label: open ? `Buka hingga ${schedule.tutup}` : `Buka ${schedule.buka} besok` };
}

export function PublicHomeClient({ data }: { data: PublicHomeData }) {
  const status = officeStatus(data.profile);
  const wa = waLink(data.profile?.whatsapp, "Halo Kelurahan Taratara Tiga, saya ingin bertanya/menyampaikan: ");
  const phone = data.profile?.telepon?.replace(/[^\d+]/g, "") ?? "";

  return <main className="pb-28 pt-20 md:pb-10">
    <Container>
      <section id="beranda" className="grid items-center gap-10 py-14 md:grid-cols-[1.08fr_.92fr] md:py-24">
        <Reveal>
          <GlassChip className={status.open ? "text-emerald-700 dark:text-emerald-300" : "text-slate-600 dark:text-slate-300"}>
            <span className={`mr-2 inline-block h-2 w-2 rounded-full ${status.open ? "bg-emerald-500" : "bg-slate-400"}`} />
            {status.open ? "Buka sekarang" : "Tutup"} · {status.label}
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
        <Reveal delay={.1} className="relative min-h-[360px] overflow-hidden rounded-[32px] shadow-2xl shadow-[var(--primary)]/20">
          <Image src="/bg/hero.jpeg" alt="Pemandangan alam dan persawahan di sekitar Tomohon" fill priority sizes="(max-width: 768px) 100vw, 42vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f17]/85 via-[#0f1f17]/15 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[var(--accent)]"><MapPin size={14} /> Tomohon Barat</p>
            <p className="max-w-sm text-2xl font-bold drop-shadow-md">Informasi kelurahan yang dekat dengan warga.</p>
          </div>
        </Reveal>
      </section>

      <Reveal id="profil" className="py-12">
        <div className="glass-strong rounded-3xl p-8 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Mengenal Taratara Tiga</h2>
              <div className="mt-6 space-y-4 text-[var(--foreground)]/80 leading-7">
                <p>
                  Taratara Tiga adalah kelurahan di Kecamatan Tomohon Barat, Kota Tomohon, Sulawesi Utara. Permukimannya berada di kelilingi keindahan alam, bertetangga dengan Taratara Satu dan Taratara Dua, serta dikelilingi oleh pemandangan sawah dan perkebunan warga.
                </p>
                <p>
                  Kehidupan warga bertumpu pada kebersamaan dan kerja keras. Seperti daerah Minahasa lainnya, semangat mapalus atau gotong royong masih terasa kental dalam keseharian warga Taratara Tiga, baik dalam kegiatan sosial kemasyarakatan maupun pertanian.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm font-bold">
                <Link href="/profil" className="group flex items-center gap-1 text-[var(--foreground)] hover:text-[var(--primary)] underline decoration-[var(--primary)] underline-offset-4">
                  Baca profil lengkap <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/peta" className="group flex items-center gap-1 text-[var(--foreground)] hover:text-[var(--primary)] underline decoration-[var(--primary)] underline-offset-4">
                  Lihat peta <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <div className="border-b border-[var(--line)] pb-4">
                <p className="text-xs text-muted font-medium mb-1">Kecamatan</p>
                <p className="font-semibold text-sm">Tomohon Barat</p>
              </div>
              <div className="border-b border-[var(--line)] pb-4">
                <p className="text-xs text-muted font-medium mb-1">Kota</p>
                <p className="font-semibold text-sm">Tomohon, Sulawesi Utara</p>
              </div>
              <div className="border-b border-[var(--line)] pb-4">
                <p className="text-xs text-muted font-medium mb-1">Penduduk</p>
                <p className="font-semibold text-sm">{(data.profile?.jumlah_penduduk ?? 0).toLocaleString("id-ID")} jiwa</p>
              </div>
              <div className="border-b border-[var(--line)] pb-4">
                <p className="text-xs text-muted font-medium mb-1">Wilayah</p>
                <p className="font-semibold text-sm">{data.profile?.lingkungan ?? 0} lingkungan</p>
              </div>
              <div className="border-b border-[var(--line)] pb-4 sm:border-0 sm:pb-0">
                <p className="text-xs text-muted font-medium mb-1">Luas Kelurahan</p>
                <p className="font-semibold text-sm">744.80 Ha</p>
              </div>
              <div className="border-b border-[var(--line)] pb-4 sm:border-0 sm:pb-0">
                <p className="text-xs text-muted font-medium mb-1">Kode pos</p>
                <p className="font-semibold text-sm">95423</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="grid gap-5 py-10 md:grid-cols-2">
        <GlassCard className="flex items-center gap-4 p-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Images size={22} /></span>
          <div>
            <h2 className="font-extrabold">Galeri kegiatan</h2>
            <p className="text-muted mt-1 text-sm">Dokumentasi kegiatan warga dan pelayanan kelurahan.</p>
            <Link href="/galeri" className="mt-3 inline-flex font-bold text-[var(--primary)]">Lihat galeri <ChevronRight size={16} /></Link>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4 p-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Sparkles size={22} /></span>
          <div>
            <h2 className="font-extrabold">Potensi wilayah</h2>
            <p className="text-muted mt-1 text-sm">Kenali potensi lokal dan usaha warga Taratara Tiga.</p>
            <div className="mt-3 flex gap-3 text-sm font-bold">
              <Link href="/potensi" className="text-[var(--primary)]">Lihat potensi</Link>
              <Link href="/umkm" className="text-[var(--primary)]">Lihat UMKM</Link>
            </div>
          </div>
        </GlassCard>
      </Reveal>

      <Reveal id="layanan" className="py-10">
        <SectionHeading eyebrow="Layanan publik" title="Ada yang bisa kami bantu?" description="Pilih layanan yang Anda perlukan dan ikuti alurnya dengan mudah." />

        <div className="mt-8 mb-10">
          <div className="glass-strong rounded-3xl p-6 sm:p-8">
            <h3 className="mb-8 text-lg font-extrabold text-center">Alur Pelayanan Umum</h3>
            <div className="grid gap-6 sm:grid-cols-3 relative">
              <div className="hidden sm:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-[var(--line)] z-0"></div>
              {[
                ["1", "Siapkan Berkas", "Lengkapi dokumen sesuai persyaratan layanan."],
                ["2", "Kunjungi Kantor", "Datang ke kelurahan pada jam kerja."],
                ["3", "Proses Selesai", "Layanan atau dokumen Anda akan diterbitkan."],
              ].map(([number, title, text]) => (
                <div key={number} className="relative z-10 flex flex-col items-center text-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-white font-bold text-xl ring-4 ring-white dark:ring-[#102b1a]">{number}</span>
                  <div>
                    <h4 className="font-bold">{title}</h4>
                    <p className="text-xs text-muted mt-1">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.layanan.length ? data.layanan.map((item) => (
            <motion.div key={item.id} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}>
              <GlassCard className="h-full p-5">
                <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><ShieldCheck size={20} /></span>
                <h3 className="font-extrabold">{item.nama}</h3>
                <p className="text-muted mt-2 text-sm leading-6">{item.ringkasan}</p>
                <Link href={`/layanan/${item.slug}`} className="focus-ring mt-5 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-[var(--primary)]">Lihat syarat <ChevronRight size={16} /></Link>
              </GlassCard>
            </motion.div>
          )) : (
            <div className="sm:col-span-2 lg:col-span-3"><EmptyState title="Layanan segera hadir" description="Informasi layanan sedang disiapkan oleh kelurahan." /></div>
          )}
        </div>
      </Reveal>

      <FasilitasSection />

      <Reveal id="hubungi" className="py-10">
        <GlassCard className="flex flex-col items-start gap-6 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--accent)]">Kontak</p>
            <h2 className="mt-2 text-2xl font-extrabold">Hubungi Kelurahan Taratara Tiga</h2>
            <p className="text-muted mt-2 max-w-lg text-sm leading-6">Ada pertanyaan, masukan, atau pengaduan? Sampaikan langsung lewat WhatsApp. Kami layani pada jam kerja.</p>
            {data.profile?.alamat && <p className="text-muted mt-3 flex items-center gap-2 text-xs"><MapPin size={13} />{data.profile.alamat}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--primary)] px-6 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95">
                <MessageCircle size={17} /> Chat WhatsApp
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="focus-ring glass-pill inline-flex min-h-12 items-center gap-2 px-6 text-sm font-bold">
                <Phone size={17} /> Telepon
              </a>
            )}
            {!wa && !phone && (
              <Link href="/kontak" className="focus-ring glass-pill inline-flex min-h-12 items-center gap-2 px-6 text-sm font-bold">Lihat halaman kontak</Link>
            )}
          </div>
        </GlassCard>
      </Reveal>
    </Container>
  </main>;
}

export function Footer({ profile }: { profile: Pick<Profile, "alamat" | "telepon"> | null }) {
  return <footer id="kontak" className="px-5 pb-8 sm:px-8"><div className="glass-pill mx-auto flex max-w-7xl flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-extrabold">Kelurahan Taratara Tiga</p><p className="text-muted mt-1 flex items-center gap-2 text-xs"><MapPin size={13} />{profile?.alamat ?? "Tomohon Barat, Tomohon"}</p></div><div className="flex flex-wrap gap-4 text-xs font-semibold text-muted"><span className="flex items-center gap-1"><Phone size={13} />{profile?.telepon ?? "-"}</span><span className="flex items-center gap-1"><Clock3 size={13} />Senin-Jumat, 08.00-16.00</span><Link href="/profil" className="text-[var(--primary)]">Profil</Link><Link href="/layanan" className="text-[var(--primary)]">Layanan</Link><Link href="/berita" className="text-[var(--primary)]">Berita</Link><Link href="/agenda" className="text-[var(--primary)]">Agenda</Link><Link href="/lokasi" className="text-[var(--primary)]">Lokasi</Link><Link href="/kontak" className="text-[var(--primary)]">Kontak</Link></div></div></footer>;
}