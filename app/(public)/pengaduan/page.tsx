import { SectionHeading, Container } from "@/components/shared/layout";
import { ComplaintForm } from "./complaint-form";

export default function ComplaintPage() {
  return <main className="py-28"><Container><SectionHeading eyebrow="Layanan warga" title="Sampaikan pengaduan" description="Bantu kami meningkatkan pelayanan Kelurahan Taratara Tiga. Laporan Anda akan ditangani oleh petugas." /><div className="mt-8"><ComplaintForm /></div></Container></main>;
}
