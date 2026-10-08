"use client";

import { useState } from "react";
import { AuroraBackground } from "@/components/shared/aurora-background";
import { BottomTabBar, FloatingNav } from "@/components/shared/floating-nav";
import { GlassButton, GlassCard, GlassChip } from "@/components/shared/glass";
import { GlassDialog } from "@/components/shared/glass-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Container, SectionHeading } from "@/components/shared/layout";
import { Reveal } from "@/components/shared/reveal";
import { SegmentedControl } from "@/components/shared/segmented-control";
import { Skeleton } from "@/components/shared/skeleton";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { glassToast } from "@/components/shared/toast";

const modes = [{ label: "Ringkas", value: "ringkas" }, { label: "Lengkap", value: "lengkap" }] as const;

export default function DesignTestPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<(typeof modes)[number]["value"]>("ringkas");
  return <AuroraBackground><FloatingNav /><Container className="pb-28 pt-28 md:pb-12"><header className="flex items-start justify-between gap-4"><div><GlassChip>Design system test</GlassChip><h1 className="mt-4 text-4xl font-extrabold tracking-[-.05em] sm:text-6xl">Liquid Glass</h1><p className="text-muted mt-4 max-w-2xl text-sm leading-7 sm:text-base">Halaman uji visual untuk menilai keterbacaan, fokus keyboard, responsivitas, tema, dan perilaku komponen pada layar ponsel.</p></div><ThemeToggle /></header>
    <Reveal className="mt-12"><SectionHeading eyebrow="Surface" title="Permukaan kaca" description="Default untuk kartu ringan; strong untuk panel yang berisi informasi lebih padat." /><div className="mt-6 grid gap-5 md:grid-cols-2"><GlassCard className="min-h-48 p-6"><GlassChip>Default</GlassChip><h2 className="mt-7 text-xl font-bold">Teks tegas di atas kaca</h2><p className="text-muted mt-2 max-w-sm text-sm leading-6">Permukaan transparan tetap menjaga hierarki teks dan fokus pada konten.</p></GlassCard><GlassCard variant="strong" className="min-h-48 p-6"><GlassChip>Strong</GlassChip><h2 className="mt-7 text-xl font-bold">Panel dengan kontras tinggi</h2><p className="text-muted mt-2 max-w-sm text-sm leading-6">Varian ini dipakai untuk artikel, formulir, tabel, dan konten padat.</p></GlassCard></div></Reveal>
    <Reveal delay={.05} className="mt-12"><SectionHeading eyebrow="Controls" title="Kontrol interaktif" /><div className="mt-6 flex flex-wrap items-center gap-3"><GlassButton onClick={() => glassToast("Toast dengan permukaan kaca aktif.")}>Primary</GlassButton><GlassButton variant="secondary" onClick={() => setDialogOpen(true)}>Buka dialog</GlassButton><SegmentedControl options={modes} value={mode} onChange={setMode} /><GlassChip>Mode: {mode}</GlassChip></div></Reveal>
    <Reveal delay={.1} className="mt-12"><SectionHeading eyebrow="States" title="Loading dan empty state" /><div className="mt-6 grid gap-5 md:grid-cols-2"><GlassCard variant="strong" className="space-y-3 p-6"><Skeleton className="h-5 w-1/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /><Skeleton className="h-11 w-32" /></GlassCard><EmptyState title="Belum ada konten" description="Data akan muncul di sini ketika tersedia." action={<GlassButton variant="secondary" onClick={() => glassToast("Belum ada data baru.")}>Coba lagi</GlassButton>} /></div></Reveal>
    <Reveal delay={.15} className="mt-12"><SectionHeading eyebrow="Readability" title="Contoh teks panjang" description="Uji ini menjaga ukuran teks, panjang baris, dan kontras pada layar ponsel." /><GlassCard variant="strong" className="mt-6 max-w-3xl p-6 sm:p-8"><p className="text-sm leading-8 sm:text-base">Kelurahan Taratara Tiga berkomitmen menghadirkan informasi publik yang mudah ditemukan, dapat dipahami, dan dapat diakses oleh seluruh warga. Gunakan permukaan strong untuk konten yang perlu dibaca lebih lama agar latar kaca tidak mengurangi kenyamanan membaca.</p></GlassCard></Reveal>
    <GlassDialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="Dialog kaca"><p className="text-muted text-sm leading-7">Dialog menggunakan overlay, animasi spring, target sentuh 44px, dan dapat ditutup dengan tombol yang jelas.</p><div className="mt-5 flex justify-end"><GlassButton onClick={() => setDialogOpen(false)}>Selesai</GlassButton></div></GlassDialog>
  </Container><BottomTabBar /></AuroraBackground>;
}
