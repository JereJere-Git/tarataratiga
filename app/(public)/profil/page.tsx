import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Container, SectionHeading } from "@/components/shared/layout";
import { GlassCard, GlassChip } from "@/components/shared/glass";
import { ProfileTabs } from "@/components/shared/public-interactions";
import { EmptyState } from "@/components/shared/empty-state";

export default async function ProfilPage() {
  const supabase = await createClient();
  const [{ data: profile }, { data: pejabat }] = await Promise.all([
    supabase.from("profil_kelurahan").select("sejarah, visi, misi").maybeSingle(),
    supabase.from("pejabat").select("id, nama, jabatan, foto_url, urutan").order("urutan"),
  ]);
  return <main className="pb-24 pt-28"><Container><SectionHeading eyebrow="Tentang kelurahan" title="Profil Taratara Tiga" description="Kenali sejarah, arah pelayanan, dan perangkat kelurahan." /><div className="mt-8">{profile ? <ProfileTabs sejarah={profile.sejarah ?? null} visi={profile.visi ?? null} misi={profile.misi ?? null} /> : <EmptyState title="Informasi profil belum diisi" description="Informasi sejarah, visi, dan misi akan ditampilkan setelah diisi oleh pengelola kelurahan." />}</div><section className="mt-16"><SectionHeading eyebrow="Perangkat kelurahan" title="Struktur organisasi" /><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{pejabat?.length ? pejabat.map((person) => <GlassCard key={person.id} className="group p-4"><div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--primary-soft)] dark:bg-[var(--primary-soft)]">{person.foto_url ? <Image src={person.foto_url} alt={`Foto ${person.nama}`} fill unoptimized className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-4xl font-extrabold text-[var(--primary)]">{person.nama.charAt(0)}</div>}</div><GlassChip className="mt-4">{person.jabatan}</GlassChip><h3 className="mt-3 font-extrabold">{person.nama}</h3></GlassCard>) : <div className="sm:col-span-2 lg:col-span-4"><EmptyState title="Informasi profil belum diisi" description="Data pejabat dan struktur organisasi akan ditampilkan setelah diisi oleh pengelola kelurahan." /></div>}</div></section></Container></main>;
}
