import { Container, SectionHeading } from "@/components/shared/layout";
import { EmptyState } from "@/components/shared/empty-state";
import { createClient } from "@/lib/supabase/server";
import { CatalogList } from "@/components/shared/catalog-list";

export default async function UmkmPage() {
  const { data } = await (await createClient()).from("umkm").select("id, nama, kategori, deskripsi, alamat, telepon, whatsapp, jam_operasional, urutan").eq("aktif", true).order("urutan");
  return <main className="pb-24 pt-28"><Container><SectionHeading eyebrow="Ekonomi warga" title="UMKM Taratara Tiga" description="Temukan usaha warga dan dukung produk lokal di sekitar kelurahan." /><div className="mt-8">{data?.length ? <CatalogList kind="umkm" items={data} /> : <EmptyState title="Data UMKM belum tersedia" description="Informasi usaha warga akan ditampilkan setelah diverifikasi oleh pengelola kelurahan." />}</div></Container></main>;
}
