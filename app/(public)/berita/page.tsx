export const revalidate = 60;
import { createClient } from "@/lib/supabase/server";
import { Container, SectionHeading } from "@/components/shared/layout";
import { EmptyState } from "@/components/shared/empty-state";
import { NewsList } from "@/components/shared/news-list";

export default async function BeritaPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("berita").select("id, judul, slug, ringkasan, gambar_url, kategori, terbit_pada").eq("status", "terbit").lte("terbit_pada", new Date().toISOString()).order("terbit_pada", { ascending: false });
  return <main className="pb-24 pt-28"><Container><SectionHeading eyebrow="Kabar kelurahan" title="Berita terbaru" description="Informasi resmi dan kegiatan terbaru Taratara Tiga." /><div className="mt-8">{data?.length ? <NewsList news={data} /> : <EmptyState title="Belum ada berita" description="Berita terbaru akan tampil di halaman ini." />}</div></Container></main>;
}
