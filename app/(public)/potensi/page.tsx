import { Container, SectionHeading } from "@/components/shared/layout";
import { EmptyState } from "@/components/shared/empty-state";
export const revalidate = 60;
import { createClient } from "@/lib/supabase/server";
import { CatalogList } from "@/components/shared/catalog-list";

export default async function PotensiPage() {
  const { data } = await (await createClient()).from("potensi").select("id, nama, kategori, deskripsi, lokasi, urutan").eq("aktif", true).order("urutan");
  return <main className="pb-24 pt-28"><Container><SectionHeading eyebrow="Informasi wilayah" title="Potensi Taratara Tiga" description="Kenali potensi, unggulan, dan aset lokal yang berkembang di wilayah kelurahan." /><div className="mt-8">{data?.length ? <CatalogList kind="potensi" items={data} /> : <EmptyState title="Data potensi belum tersedia" description="Informasi potensi wilayah akan ditampilkan setelah disiapkan oleh pengelola kelurahan." />}</div></Container></main>;
}
