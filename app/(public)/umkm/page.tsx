import { Container, SectionHeading } from "@/components/shared/layout";
import { EmptyState } from "@/components/shared/empty-state";
export const revalidate = 60;
import { createClient } from "@/lib/supabase/server";
import { CatalogList } from "@/components/shared/catalog-list";
import { ArrowUpRight, MapPin } from "lucide-react";

export default async function UmkmPage() {
  const { data } = await (await createClient()).from("umkm").select("id, nama, kategori, deskripsi, alamat, telepon, whatsapp, jam_operasional, urutan").eq("aktif", true).order("urutan");
  return <main className="pb-24 pt-28"><Container><SectionHeading eyebrow="Ekonomi warga" title="UMKM Taratara Tiga" description="Temukan usaha warga dan dukung produk lokal di sekitar kelurahan." /><div className="mt-5"><a href="https://www.google.com/maps/search/?api=1&query=UMKM+Taratara+Tiga,+Tomohon" target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--line)] bg-white/65 px-4 text-sm font-bold text-[var(--primary)] shadow-sm transition-colors hover:bg-[var(--primary-soft)]"><MapPin size={16} />Jelajahi hasil Google Maps<ArrowUpRight size={15} /></a><p className="text-muted mt-2 text-xs">Tautan ini membuka hasil terbaru langsung di Google Maps.</p></div><div className="mt-6">{data?.length ? <CatalogList kind="umkm" items={data} /> : <EmptyState title="Direktori UMKM sedang disiapkan" description="Data yang tampil di direktori ini diverifikasi oleh pengelola kelurahan. Sementara itu, Anda dapat menjelajahi hasil terbaru lewat Google Maps di atas." />}</div></Container></main>;
}
