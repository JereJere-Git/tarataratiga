import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { AgendaForm } from "@/components/admin/agenda-form";
import { requireStaff } from "@/lib/supabase/admin";
export default async function EditAgendaPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const { supabase } = await requireStaff(); const { data } = await supabase.from("agenda").select("id, judul, deskripsi, lokasi, mulai, selesai").eq("id", id).maybeSingle(); if (!data) notFound(); return <><PageHeader title="Ubah agenda" description="Perbarui jadwal kegiatan." /><AgendaForm initial={data} /></>; }
