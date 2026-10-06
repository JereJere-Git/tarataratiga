import { PageHeader } from "@/components/admin/page-header";
import { LocationTable } from "@/components/admin/location-table";
import { requireStaff } from "@/lib/supabase/admin";
export default async function AdminLocationPage() { const { supabase } = await requireStaff(); const { data } = await supabase.from("lokasi_penting").select("id, nama, kategori, alamat, lat, lng, aktif").order("urutan"); return <><PageHeader title="Lokasi penting" description="Kelola tempat penting yang dapat membantu warga." /><LocationTable rows={data ?? []} /></>; }
