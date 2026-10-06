import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { PejabatForm } from "@/components/admin/pejabat-form";
import { requireStaff } from "@/lib/supabase/admin";
export default async function EditPejabatPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const { supabase } = await requireStaff(); const { data } = await supabase.from("pejabat").select("id, nama, jabatan, foto_url, urutan").eq("id", id).maybeSingle(); if (!data) notFound(); return <><PageHeader title="Ubah pejabat" /><PejabatForm initial={data} /></>; }
