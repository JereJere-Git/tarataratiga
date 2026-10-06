import { requireStaff } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/admin/page-header";
import { BeritaTable } from "@/components/admin/berita-table";

export default async function BeritaPage() {
  const { supabase } = await requireStaff();
  const { data, error } = await supabase.from("berita").select("id, judul, slug, kategori, status, terbit_pada").order("created_at", { ascending: false });
  if (error) throw new Error("Gagal memuat berita.");
  return <><PageHeader eyebrow="Konten publik" title="Berita" description="Kelola berita warga dengan alur draf dan terbit yang aman." /><BeritaTable rows={data ?? []} /></>;
}
