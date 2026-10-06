import { notFound } from "next/navigation";
import { ArrowRight, Clock3, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Container, SectionHeading } from "@/components/shared/layout";
import { GlassCard, GlassChip } from "@/components/shared/glass";
import { ServiceChecklist } from "@/components/shared/public-interactions";

export default async function LayananDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("layanan").select("nama, ringkasan, syarat, alur, biaya, estimasi_waktu").eq("slug", slug).eq("aktif", true).maybeSingle();
  if (!data) notFound();
  const requirements = Array.isArray(data.syarat) ? data.syarat.filter((item): item is string => typeof item === "string") : [];
  const steps = Array.isArray(data.alur) ? data.alur.filter((item): item is string => typeof item === "string") : [];
  return <main className="pb-24 pt-28"><Container><SectionHeading eyebrow="Detail layanan" title={data.nama} description={data.ringkasan ?? undefined} /><div className="mt-8 grid gap-6 lg:grid-cols-[.8fr_1.2fr]"><div className="space-y-5"><GlassCard className="grid gap-4 p-6 sm:grid-cols-2"><div><GlassChip>Biaya</GlassChip><p className="mt-3 font-extrabold">{data.biaya ?? "Gratis"}</p></div><div><GlassChip><Clock3 size={13} className="mr-1" />Estimasi</GlassChip><p className="mt-3 font-extrabold">{data.estimasi_waktu ?? "-"}</p></div></GlassCard><ServiceChecklist slug={slug} items={requirements} /></div><GlassCard variant="strong" className="p-6"><h2 className="text-xl font-extrabold">Alur pelayanan</h2><div className="mt-7 space-y-5">{steps.length ? steps.map((step, index) => <div key={`${step}-${index}`} className="flex gap-4"><div className="flex flex-col items-center"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] font-extrabold text-white">{index + 1}</span>{index < steps.length - 1 && <span className="mt-2 h-full w-px bg-[var(--primary-soft)] dark:bg-[var(--primary-soft)]" />}</div><div className="pb-5"><p className="font-bold">{step}</p><ArrowRight className="mt-2 text-[var(--accent)]" size={16} /></div></div>) : <p className="text-muted">Alur belum tersedia.</p>}</div><button type="button" className="focus-ring glass-pill mt-4 inline-flex min-h-11 items-center gap-2 px-4 text-sm font-bold"><FileText size={16} />Unduh formulir</button></GlassCard></div></Container></main>;
}
