import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { GalleryForm } from "@/components/admin/gallery-form";
import { requireStaff } from "@/lib/supabase/admin";
export default async function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const { supabase } = await requireStaff(); const { data } = await supabase.from("galeri").select("id, judul, album, gambar_url").eq("id", id).maybeSingle(); if (!data) notFound(); return <><PageHeader title="Ubah foto" /><GalleryForm initial={data} /></>; }
