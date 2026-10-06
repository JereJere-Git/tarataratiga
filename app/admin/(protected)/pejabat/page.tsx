import { PageHeader } from "@/components/admin/page-header";
import { PejabatTable } from "@/components/admin/pejabat-table";
import { requireStaff } from "@/lib/supabase/admin";
export default async function PejabatPage() { const { supabase } = await requireStaff(); const { data } = await supabase.from("pejabat").select("id, nama, jabatan, foto_url, urutan").order("urutan"); return <><PageHeader eyebrow="Profil kelurahan" title="Pejabat" description="Kelola struktur pejabat yang tampil di halaman profil." /><PejabatTable rows={data ?? []} /></>; }
