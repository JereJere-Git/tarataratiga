import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/shared/layout";
import { GlassCard, GlassChip } from "@/components/shared/glass";
import { ShareButtons } from "@/components/shared/public-interactions";

async function getNews(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("berita").select("id, judul, slug, ringkasan, isi, gambar_url, kategori, terbit_pada").eq("slug", slug).eq("status", "terbit").lte("terbit_pada", new Date().toISOString()).maybeSingle();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const news = await getNews((await params).slug);
  return { title: news ? `${news.judul} | Kelurahan Taratara Tiga` : "Berita", description: news?.ringkasan ?? "Berita Kelurahan Taratara Tiga", openGraph: news ? { title: news.judul, description: news.ringkasan ?? undefined, images: news.gambar_url ? [news.gambar_url] : undefined, type: "article", publishedTime: news.terbit_pada ?? undefined } : undefined };
}

export default async function BeritaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const news = await getNews((await params).slug);
  if (!news) notFound();
  const supabase = await createClient();
  const { data: related } = await supabase.from("berita").select("id, judul, slug, kategori").eq("status", "terbit").neq("id", news.id).limit(3);
  const words = news.isi.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
  return <main className="pb-24 pt-28"><Container><article className="mx-auto max-w-4xl"><GlassCard variant="strong" className="overflow-hidden p-5 sm:p-9"><GlassChip>{news.kategori ?? "Informasi"}</GlassChip><h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-[-.04em] sm:text-5xl">{news.judul}</h1><p className="text-muted mt-4 text-sm">{news.terbit_pada ? new Date(news.terbit_pada).toLocaleDateString("id-ID", { dateStyle: "long" }) : ""} · {Math.max(1, Math.ceil(words / 200))} menit baca</p>{news.gambar_url && <div className="relative mt-8 aspect-video overflow-hidden rounded-3xl"><Image src={news.gambar_url} alt={news.judul} fill unoptimized className="object-cover" /></div>}<div className="prose prose-slate mt-8 max-w-none leading-8 dark:prose-invert" dangerouslySetInnerHTML={{ __html: news.isi }} /><div className="mt-8 border-t border-white/40 pt-6"><p className="mb-3 text-sm font-bold">Bagikan berita</p><ShareButtons title={news.judul} /></div></GlassCard><section className="mt-10"><h2 className="text-2xl font-extrabold">Berita terkait</h2><div className="mt-4 grid gap-4 sm:grid-cols-3">{related?.map((item) => <a key={item.id} href={`/berita/${item.slug}`} className="glass p-5"><GlassChip>{item.kategori ?? "Informasi"}</GlassChip><p className="mt-3 font-bold">{item.judul}</p></a>)}</div></section></article></Container></main>;
}
