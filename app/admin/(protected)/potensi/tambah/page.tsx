import { CatalogForm } from "@/components/admin/catalog-form";
import { PageHeader } from "@/components/admin/page-header";

export default function AddPotensiPage() {
  return <><PageHeader title="Tambah potensi" description="Tambahkan potensi wilayah yang sudah dikonfirmasi oleh kelurahan." /><CatalogForm kind="potensi" /></>;
}
