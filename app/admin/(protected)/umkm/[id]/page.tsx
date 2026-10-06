import { notFound } from "next/navigation";
import { CatalogForm } from "@/components/admin/catalog-form";
import { PageHeader } from "@/components/admin/page-header";
import { requireStaff } from "@/lib/supabase/admin";

export default async function EditUmkmPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireStaff();
  const { data } = await supabase.from("umkm").select("id, nama, kategori, deskripsi, alamat, telepon, whatsapp, jam_operasional, urutan, aktif").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <><PageHeader title="Ubah UMKM" /><CatalogForm kind="umkm" initial={data} /></>;
}
