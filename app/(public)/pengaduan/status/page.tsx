import { Container, SectionHeading } from "@/components/shared/layout";
import { ComplaintStatusForm } from "./status-form";

export default async function ComplaintStatusPage({ searchParams }: { searchParams: Promise<{ nomor?: string }> }) {
  const params = await searchParams;
  return <main className="py-28"><Container><SectionHeading eyebrow="Pelacakan" title="Cek status pengaduan" description="Masukkan nomor tiket yang Anda terima setelah mengirim laporan." /><div className="mt-8"><ComplaintStatusForm initialTicket={params.nomor ?? ""} /></div></Container></main>;
}
