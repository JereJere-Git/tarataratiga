import { PageHeader } from "@/components/admin/page-header";
import { DocumentTable } from "@/components/admin/document-table";
import { requireStaff } from "@/lib/supabase/admin";
export default async function AdminDocumentsPage() { const { supabase } = await requireStaff(); const { data } = await supabase.from("dokumen").select("id, judul, kategori, file_url, file_size, tanggal").order("tanggal", { ascending: false }); return <><PageHeader title="Dokumen" description="Kelola formulir dan dokumen unduhan publik." /><DocumentTable rows={data ?? []} /></>; }
