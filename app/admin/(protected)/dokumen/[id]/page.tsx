import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { DocumentForm } from "@/components/admin/document-form";
import { requireStaff } from "@/lib/supabase/admin";
export default async function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const { supabase } = await requireStaff(); const { data } = await supabase.from("dokumen").select("id, judul, kategori, file_url, tanggal").eq("id", id).maybeSingle(); if (!data) notFound(); return <><PageHeader title="Ubah dokumen" /><DocumentForm initial={data} /></>; }
