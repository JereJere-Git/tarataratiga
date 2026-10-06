import { CatalogTable } from "@/components/admin/catalog-table";
import { PageHeader } from "@/components/admin/page-header";
import { requireStaff } from "@/lib/supabase/admin";

export default async function AdminPotensiPage() {
  const { supabase } = await requireStaff();
  const { data } = await supabase.from("potensi").select("id, nama, kategori, deskripsi, urutan, aktif").order("urutan");
  return <><PageHeader eyebrow="Informasi wilayah" title="Potensi wilayah" description="Kelola potensi, unggulan, dan aset lokal yang ingin diperkenalkan kepada warga." /><CatalogTable kind="potensi" rows={data ?? []} /></>;
}
