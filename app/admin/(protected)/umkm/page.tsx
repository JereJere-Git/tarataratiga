import { CatalogTable } from "@/components/admin/catalog-table";
import { PageHeader } from "@/components/admin/page-header";
import { requireStaff } from "@/lib/supabase/admin";

export default async function AdminUmkmPage() {
  const { supabase } = await requireStaff();
  const { data } = await supabase.from("umkm").select("id, nama, kategori, deskripsi, urutan, aktif").order("urutan");
  return <><PageHeader eyebrow="Ekonomi warga" title="UMKM" description="Kelola usaha warga yang dapat ditemukan dan didukung oleh masyarakat." /><CatalogTable kind="umkm" rows={data ?? []} /></>;
}
