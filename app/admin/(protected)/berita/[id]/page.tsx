import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/admin/page-header";
import { BeritaForm } from "@/components/admin/berita-form";

export default async function EditBeritaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireStaff();
  const { data, error } = await supabase.from("berita").select("id, judul, slug, ringkasan, isi, gambar_url, kategori, status, terbit_pada").eq("id", id).maybeSingle();
  if (error || !data) notFound();
  return <><PageHeader eyebrow="Konten publik" title="Ubah berita" description="Perbarui konten, media, dan jadwal terbit berita." /><BeritaForm initial={data} /></>;
}
