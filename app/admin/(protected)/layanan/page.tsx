import { PageHeader } from "@/components/admin/page-header";
import { ServiceTable } from "@/components/admin/service-table";
import { requireStaff } from "@/lib/supabase/admin";
export default async function ServicesPage() { const { supabase } = await requireStaff(); const { data } = await supabase.from("layanan").select("id, nama, slug, ringkasan, urutan, aktif").order("urutan"); return <><PageHeader eyebrow="Konten publik" title="Layanan" description="Kelola layanan, syarat, alur, biaya, dan estimasi waktu." /><ServiceTable rows={data ?? []} /></>; }
