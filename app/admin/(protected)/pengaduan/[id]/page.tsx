import Link from "next/link";
import { notFound } from "next/navigation";
import { ComplaintEditor } from "@/components/admin/complaint-editor";
import { PageHeader } from "@/components/admin/page-header";
import { requireStaff } from "@/lib/supabase/admin";

export default async function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireStaff();
  const { data } = await supabase.from("pengaduan").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const signed = data.lampiran_url ? await supabase.storage.from("lampiran").createSignedUrl(data.lampiran_url, 600) : { data: null };
  return <div><PageHeader title={`Pengaduan ${data.nomor_tiket}`} description="Periksa detail laporan dan kirim tanggapan." /><Link href="/admin/pengaduan" className="mb-5 inline-flex min-h-11 items-center font-bold text-[var(--primary)]">← Kembali ke daftar</Link><ComplaintEditor complaint={{ ...data, attachmentUrl: signed.data?.signedUrl ?? null }} /></div>;
}
