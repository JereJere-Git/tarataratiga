import { Container, SectionHeading } from "@/components/shared/layout";
import { GalleryClient } from "./gallery-client";
import { publicGallery } from "@/lib/public-gallery";

export default function GaleriPage() {
  return <main className="py-28"><Container><SectionHeading eyebrow="Dokumentasi" title="Fasilitas Taratara Tiga" description="Lihat beberapa fasilitas yang mendukung kegiatan dan pelayanan warga." /><div className="mt-8"><GalleryClient items={publicGallery} /></div></Container></main>;
}
