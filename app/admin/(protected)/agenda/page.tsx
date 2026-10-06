import { PageHeader } from "@/components/admin/page-header";
import { AgendaTable } from "@/components/admin/agenda-table";
import { requireStaff } from "@/lib/supabase/admin";
export default async function AdminAgendaPage() { const { supabase } = await requireStaff(); const { data } = await supabase.from("agenda").select("id, judul, lokasi, mulai, selesai").order("mulai"); return <><PageHeader title="Agenda" description="Kelola jadwal kegiatan kelurahan." /><AgendaTable rows={data ?? []} /></>; }
