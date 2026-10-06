import { Container, SectionHeading } from "@/components/shared/layout";
import { createClient } from "@/lib/supabase/server";
import { DocumentsClient } from "./documents-client";
export default async function DocumentsPage() {
  const { data } = await (await createClient()).from("dokumen").select("id, judul, kategori, file_url, file_size, tanggal").order("tanggal", { ascending: false });
  return <main className="py-28"><Container><SectionHeading eyebrow="Pusat unduhan" title="Dokumen publik" description="Formulir dan informasi resmi yang dapat diunduh warga." /><div className="mt-8"><DocumentsClient items={data ?? []} /></div></Container></main>;
}
