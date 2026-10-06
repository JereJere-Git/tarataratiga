import { notFound } from "next/navigation";
import { CatalogForm } from "@/components/admin/catalog-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireStaff } from "@/lib/supabase/admin";

export default async function EditPotensiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireStaff();
  const { data } = await supabase.from("potensi").select("id, nama, kategori, deskripsi, lokasi, urutan, aktif").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <><PageHeader title="Ubah potensi" /><CatalogForm kind="potensi" initial={data} /></>;
}
