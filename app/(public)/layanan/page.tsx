import { createClient } from "@/lib/supabase/server";
import { Container, SectionHeading } from "@/components/shared/layout";
import { ServiceSearch } from "@/components/shared/public-interactions";

export default async function LayananPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("layanan").select("id, nama, slug, ringkasan").eq("aktif", true).order("urutan");
  return <main className="pb-24 pt-28"><Container><SectionHeading eyebrow="Layanan publik" title="Layanan untuk warga" description="Cari informasi persyaratan dan alur layanan kelurahan." /><div className="mt-8"><ServiceSearch services={data ?? []} /></div></Container></main>;
}
