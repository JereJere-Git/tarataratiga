import type { Metadata } from "next";
import { BookOpen, MapPin, Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/shared/layout";
import { GlassChip } from "@/components/shared/glass";
import { HistoryProfile } from "@/components/shared/history-profile";
import { OrganizationChart } from "@/components/shared/organization-chart";

export const metadata: Metadata = {
  title: "Profil Taratara Tiga | Sejarah dan Kehidupan Warga",
  description: "Jelajahi sejarah, kronologi pemekaran, para pemimpin, serta budaya Kelurahan Taratara Tiga.",
};

export default async function ProfilPage() {
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profil_kelurahan").select("visi, misi").maybeSingle();

  return <main className="pb-24 pt-28">
    <Container>
      <section className="relative mb-8 overflow-hidden rounded-[32px] border border-[var(--line)] bg-gradient-to-br from-emerald-50 via-white/80 to-cyan-50 p-6 dark:from-emerald-950/60 dark:via-[#0a2d26] dark:to-cyan-950/40 sm:p-10">
        <div className="pointer-events-none absolute -right-8 -top-16 h-56 w-56 rounded-full bg-emerald-300/25 blur-3xl" />
        <div className="relative max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-700/15 bg-white/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[.13em] text-[var(--primary)] dark:bg-white/5"><MapPin size={14} /> Tomohon Barat · Sulawesi Utara</p>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-[-.04em] sm:text-5xl">Profil Taratara Tiga</h1>
          <p className="text-muted mt-4 max-w-2xl text-sm leading-7 sm:text-base">Sebuah kisah yang berawal dari perjalanan para Tonaas, tumbuh bersama alam, dan berlanjut dalam semangat mapalus. Jelajahi cerita, linimasa, dan tokoh yang membentuk kelurahan ini.</p>
          <div className="mt-5 flex flex-wrap gap-2"><GlassChip><BookOpen size={13} className="mr-1.5" />Berdasarkan dokumen sejarah Taratara</GlassChip><GlassChip>1303 — sekarang</GlassChip></div>
        </div>
      </section>

      <section aria-label="Visi dan misi Kelurahan Taratara Tiga" className="mb-8 grid gap-4 md:grid-cols-2">
        <article className="rounded-[28px] border border-[var(--line)] bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm dark:from-emerald-950/50 dark:to-white/5 sm:p-8"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]"><Sprout size={21} /></span><p className="mt-5 text-xs font-bold uppercase tracking-[.15em] text-[var(--accent)]">Arah bersama</p><h2 className="mt-1 text-2xl font-extrabold">Visi</h2><p className="text-muted mt-3 whitespace-pre-line text-sm leading-7">{profile?.visi || "Visi kelurahan belum dicantumkan."}</p></article>
        <article className="rounded-[28px] border border-[var(--line)] bg-white/65 p-6 shadow-sm dark:bg-white/5 sm:p-8"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)]"><BookOpen size={21} /></span><p className="mt-5 text-xs font-bold uppercase tracking-[.15em] text-[var(--accent)]">Langkah pelayanan</p><h2 className="mt-1 text-2xl font-extrabold">Misi</h2><p className="text-muted mt-3 whitespace-pre-line text-sm leading-7">{profile?.misi || "Misi kelurahan belum dicantumkan."}</p></article>
      </section>

      <HistoryProfile />

      <OrganizationChart />
    </Container>
  </main>;
}
