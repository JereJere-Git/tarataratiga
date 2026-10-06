import Link from "next/link";
import { Download } from "lucide-react";
import { ComplaintTable, type ComplaintTableRow } from "@/components/admin/complaint-table";
import { PageHeader } from "@/components/admin/page-header";
import { requireStaff } from "@/lib/supabase/admin";

export default async function AdminComplaintsPage() {
  const { supabase } = await requireStaff();
  const { data } = await supabase.from("pengaduan").select("id, nomor_tiket, kategori, status, anonim, created_at").order("created_at", { ascending: false });
  const rows = (data ?? []) as ComplaintTableRow[];
  return <div><PageHeader title="Pengaduan warga" description="Tinjau laporan, berikan balasan, dan perbarui status." action={<Link href="/admin/pengaduan/export" className="glass-pill inline-flex min-h-11 items-center gap-2 px-4 text-sm font-bold"><Download size={16} />Ekspor CSV</Link>} /><ComplaintTable rows={rows} /></div>;
}
