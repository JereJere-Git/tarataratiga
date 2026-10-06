import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { ServiceForm } from "@/components/admin/service-form";
import { requireStaff } from "@/lib/supabase/admin";
export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const { supabase } = await requireStaff(); const { data } = await supabase.from("layanan").select("id, nama, slug, ringkasan, syarat, alur, biaya, estimasi_waktu, urutan, aktif").eq("id", id).maybeSingle(); if (!data) notFound(); return <><PageHeader title="Ubah layanan" /><ServiceForm initial={data} /></>; }
