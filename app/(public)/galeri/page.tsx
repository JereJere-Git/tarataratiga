import { Container, SectionHeading } from "@/components/shared/layout";
import { createClient } from "@/lib/supabase/server";
import { GalleryClient } from "./gallery-client";

export default async function GaleriPage() {
  const { data } = await (await createClient()).from("galeri").select("id, judul, album, gambar_url, urutan").order("urutan");
  return <main className="py-28"><Container><SectionHeading eyebrow="Dokumentasi" title="Galeri kegiatan" description="Momen pelayanan dan kegiatan warga Kelurahan Taratara Tiga." /><div className="mt-8"><GalleryClient items={data ?? []} /></div></Container></main>;
}
