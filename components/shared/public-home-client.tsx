"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ArrowRight, Bell, CalendarDays, ChevronRight, Clock3, MapPin, MessageCircle, Phone, ShieldCheck, Users, Images, Sparkles } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { GlassButton, GlassCard, GlassChip } from "@/components/shared/glass";
import { Reveal } from "@/components/shared/reveal";
import { Container, SectionHeading } from "@/components/shared/layout";

type Profile = {
  sambutan: string | null; alamat: string | null; telepon: string | null; whatsapp: string | null; email: string | null;
  jam_pelayanan: Record<string, { buka?: string; tutup?: string }>; zona_waktu: string; jumlah_rt: number; jumlah_rw: number; jumlah_penduduk: number;
};
export type PublicHomeData = { profile: Profile | null; layanan: { id: string; nama: string; slug: string; ringkasan: string | null; urutan: number }[]; berita: { id: string; judul: string; slug: string; ringkasan: string | null; gambar_url: string | null; kategori: string | null; terbit_pada: string | null }[]; agenda: { id: string; judul: string; mulai: string; lokasi: string | null }[] };

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
  return <main className="pb-28 pt-20 md:pb-10">
    <Container>
      <section id="beranda" className="grid items-center gap-10 py-14 md:grid-cols-[1.08fr_.92fr] md:py-24">
        <Reveal><GlassChip className={status.open ? "text-emerald-700 dark:text-emerald-300" : "text-slate-600 dark:text-slate-300"}><span className={`mr-2 inline-block h-2 w-2 rounded-full ${status.open ? "bg-emerald-500" : "bg-slate-400"}`} />{status.open ? "Buka sekarang" : "Tutup"} · {status.label}</GlassChip><h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-[-.06em] sm:text-[60px]">Melayani warga, <span className="text-[var(--primary)]">dengan hati.</span></h1><p className="text-muted mt-6 max-w-xl text-base leading-8 sm:text-lg">{data.profile?.sambutan ?? "Portal resmi Kelurahan Taratara Tiga, Kecamatan Tomohon Barat."}</p><div className="mt-8 flex flex-wrap gap-3"><Link href="#layanan"><GlassButton>Lihat Layanan <ArrowRight size={17} /></GlassButton></Link><Link href="/pengaduan"><GlassButton variant="secondary">Cek Status Pengaduan</GlassButton></Link></div></Reveal>
        <Reveal delay={.1} className="relative min-h-[360px] overflow-hidden rounded-[32px] shadow-2xl shadow-[var(--primary)]/20"><Image src="/bg/hero.jpeg" alt="Pemandangan alam dan persawahan di sekitar Tomohon" fill priority sizes="(max-width: 768px) 100vw, 42vw" className="object-cover object-center" /><div className="absolute inset-0 bg-gradient-to-t from-[#0f1f17]/85 via-[#0f1f17]/15 to-transparent" /><div className="absolute bottom-6 left-6 right-6 text-white"><p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[var(--accent)]"><MapPin size={14} /> Tomohon Barat</p><p className="max-w-sm text-2xl font-bold drop-shadow-md">Informasi kelurahan yang dekat dengan warga.</p></div></Reveal>
      </section>

      <Reveal id="layanan" className="py-10"><SectionHeading eyebrow="Layanan publik" title="Ada yang bisa kami bantu?" description="Pilih layanan yang Anda perlukan dan ikuti alurnya dengan mudah." /><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data.layanan.length ? data.layanan.map((item) => <motion.div key={item.id} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}><GlassCard className="h-full p-5"><span className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] dark:bg-[var(--primary-soft)]"><ShieldCheck size={20} /></span><h3 className="font-extrabold">{item.nama}</h3><p className="text-muted mt-2 text-sm leading-6">{item.ringkasan}</p><Link href={`/layanan/${item.slug}`} className="focus-ring mt-5 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-[var(--primary)]">Lihat alur <ChevronRight size={16} /></Link></GlassCard></motion.div>) : <div className="sm:col-span-2 lg:col-span-3"><EmptyState title="Layanan segera hadir" description="Informasi layanan sedang disiapkan oleh kelurahan." /></div>}</div></Reveal>

      <Reveal className="py-10"><div className="glass-strong grid gap-5 p-5 sm:grid-cols-3 sm:p-7">{([{ label: "Lingkungan", value: data.profile?.jumlah_rt ?? 0, icon: <Users size={19} /> }, { label: "Lingkungan", value: data.profile?.jumlah_rw ?? 0, icon: <MapPin size={19} /> }, { label: "Penduduk", value: data.profile?.jumlah_penduduk ?? 0, icon: <Users size={19} /> }] as { label: string; value: number; icon: ReactNode }[]).map((item, index) => <div key={`${item.label}-${index}`} className="flex items-center gap-4 border-b border-white/30 pb-4 last:border-0 sm:border-b-0 sm:border-r sm:pb-0 sm:last:border-0"><span className="glass-pill flex h-11 w-11 items-center justify-center text-[var(--primary)]">{item.icon}</span><div><p className="text-2xl font-extrabold">{item.value.toLocaleString("id-ID")}</p><p className="text-xs font-semibold text-muted">{item.label} wilayah</p></div></div>)}</div></Reveal>

      <Reveal id="informasi" className="grid gap-5 py-10 lg:grid-cols-[1.3fr_.7fr]"><div><SectionHeading eyebrow="Kabar terbaru" title="Informasi untuk warga" /><div className="mt-6 space-y-4">{data.berita.length ? data.berita.map((item) => <Link key={item.id} href={`/berita/${item.slug}`} className="group block"><GlassCard className="flex gap-4 p-4"><div className="hidden h-24 w-32 shrink-0 rounded-2xl bg-[var(--primary-soft)] bg-cover bg-center sm:block" style={item.gambar_url ? { backgroundImage: `url(${item.gambar_url})` } : undefined} /><div className="min-w-0"><GlassChip>{item.kategori ?? "Informasi"}</GlassChip><h3 className="mt-3 truncate font-extrabold group-hover:text-[var(--primary)]">{item.judul}</h3><p className="text-muted mt-1 line-clamp-2 text-sm leading-6">{item.ringkasan}</p></div></GlassCard></Link>) : <EmptyState title="Belum ada berita" description="Kabar terbaru akan tampil di sini." />}</div></div><div className="glass-strong h-fit p-6"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-[var(--accent)]"><Bell size={15} /> Agenda warga</p><div className="mt-5 space-y-4">{data.agenda.length ? data.agenda.map((item) => <div key={item.id} className="border-b border-white/30 pb-4 last:border-0"><p className="font-bold">{item.judul}</p><p className="text-muted mt-1 flex items-center gap-1 text-xs"><CalendarDays size={13} />{new Date(item.mulai).toLocaleDateString("id-ID", { dateStyle: "medium" })} · {item.lokasi}</p></div>) : <p className="text-sm text-muted">Belum ada agenda terdekat.</p>}</div></div></Reveal>

      <Reveal className="grid gap-5 py-10 md:grid-cols-2"><GlassCard className="flex items-center gap-4 p-6"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Images size={22} /></span><div><h2 className="font-extrabold">Galeri kegiatan</h2><p className="text-muted mt-1 text-sm">Dokumentasi kegiatan warga dan pelayanan kelurahan.</p><Link href="/galeri" className="mt-3 inline-flex font-bold text-[var(--primary)]">Lihat galeri <ChevronRight size={16} /></Link></div></GlassCard><GlassCard className="flex items-center gap-4 p-6"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Sparkles size={22} /></span><div><h2 className="font-extrabold">Potensi wilayah</h2><p className="text-muted mt-1 text-sm">Kenali potensi lokal dan usaha warga Taratara Tiga.</p><div className="mt-3 flex gap-3 text-sm font-bold"><Link href="/potensi" className="text-[var(--primary)]">Lihat potensi</Link><Link href="/umkm" className="text-[var(--primary)]">Lihat UMKM</Link></div></div></GlassCard></Reveal>

      <Reveal id="profil" className="py-10"><GlassCard className="flex flex-col items-start gap-6 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-10"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--accent)]">Suara warga</p><h2 className="mt-2 text-2xl font-extrabold">Ada yang perlu disampaikan?</h2><p className="text-muted mt-2 max-w-lg text-sm leading-6">Sampaikan pengaduan atau masukan. Kami akan menindaklanjuti dengan transparan.</p></div><Link href="/pengaduan"><GlassButton> <MessageCircle size={17} /> Buat Pengaduan</GlassButton></Link></GlassCard></Reveal>
    </Container>
  </main>;
}

export function Footer({ profile }: { profile: Pick<Profile, "alamat" | "telepon"> | null }) {
  return <footer id="kontak" className="px-5 pb-8 sm:px-8"><div className="glass-pill mx-auto flex max-w-7xl flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-extrabold">Kelurahan Taratara Tiga</p><p className="text-muted mt-1 flex items-center gap-2 text-xs"><MapPin size={13} />{profile?.alamat ?? "Tomohon Barat, Tomohon"}</p></div><div className="flex flex-wrap gap-4 text-xs font-semibold text-muted"><span className="flex items-center gap-1"><Phone size={13} />{profile?.telepon ?? "-"}</span><span className="flex items-center gap-1"><Clock3 size={13} />Senin-Jumat, 08.00-16.00</span><Link href="/profil" className="text-[var(--primary)]">Profil</Link><Link href="/layanan" className="text-[var(--primary)]">Layanan</Link><Link href="/berita" className="text-[var(--primary)]">Berita</Link><Link href="/agenda" className="text-[var(--primary)]">Agenda</Link><Link href="/lokasi" className="text-[var(--primary)]">Lokasi</Link><Link href="/kontak" className="text-[var(--primary)]">Kontak</Link></div></div></footer>;
}
