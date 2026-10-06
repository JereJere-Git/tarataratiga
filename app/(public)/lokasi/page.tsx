import { Container, SectionHeading } from "@/components/shared/layout";
import { createClient } from "@/lib/supabase/server";
import { LocationClient } from "./location-client";
export default async function LocationsPage() { const { data } = await (await createClient()).from("lokasi_penting").select("id, nama, kategori, alamat, deskripsi, telepon, jam_operasional, lat, lng, urutan").eq("aktif", true).order("urutan").order("nama"); return <main className="pb-28 pt-28"><Container><SectionHeading eyebrow="Informasi warga" title="Lokasi penting" description="Temukan tempat ibadah, layanan publik, dan fasilitas penting di sekitar kelurahan." /><div className="mt-8"><LocationClient items={data ?? []} /></div></Container></main>; }
