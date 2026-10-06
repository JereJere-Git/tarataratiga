import { PageHeader } from "@/components/admin/page-header";
import { BeritaForm } from "@/components/admin/berita-form";

export default function TambahBeritaPage() {
  return <><PageHeader eyebrow="Konten publik" title="Tambah berita" description="Tulis dan jadwalkan informasi baru untuk warga." /><BeritaForm /></>;
}
