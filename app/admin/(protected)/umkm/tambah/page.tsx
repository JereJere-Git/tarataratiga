import { CatalogForm } from "@/components/admin/catalog-form";
import { PageHeader } from "@/components/admin/page-header";

export default function AddUmkmPage() {
  return <><PageHeader title="Tambah UMKM" description="Tambahkan usaha warga yang sudah dikonfirmasi oleh kelurahan." /><CatalogForm kind="umkm" /></>;
}
