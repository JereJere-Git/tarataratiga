import { PageHeader } from "@/components/admin/page-header";
import { GalleryTable } from "@/components/admin/gallery-table";
import { requireStaff } from "@/lib/supabase/admin";
export default async function AdminGalleryPage() { const { supabase } = await requireStaff(); const { data } = await supabase.from("galeri").select("id, judul, album, gambar_url, urutan").order("urutan"); return <><PageHeader title="Galeri" description="Kelola dokumentasi foto kegiatan." /><GalleryTable rows={data ?? []} /></>; }
