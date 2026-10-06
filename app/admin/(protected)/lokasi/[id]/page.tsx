import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { LocationForm } from "@/components/admin/location-form";
import { requireStaff } from "@/lib/supabase/admin";
export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const { supabase } = await requireStaff(); const { data } = await supabase.from("lokasi_penting").select("id, nama, kategori, alamat, deskripsi, telepon, jam_operasional, lat, lng, urutan, aktif").eq("id", id).maybeSingle(); if (!data) notFound(); return <><PageHeader title="Ubah lokasi penting" /><LocationForm initial={data} /></>; }
