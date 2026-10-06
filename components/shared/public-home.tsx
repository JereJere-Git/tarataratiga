import { createClient } from "@/lib/supabase/server";
import { PublicHomeClient, type PublicHomeData } from "@/components/shared/public-home-client";

export async function PublicHome() {
  const supabase = await createClient();
  const [{ data: profile }, { data: layanan }, { data: berita }, { data: agenda }] = await Promise.all([
    supabase.from("profil_kelurahan").select("sambutan, alamat, telepon, whatsapp, email, jam_pelayanan, zona_waktu, jumlah_rt, jumlah_rw, jumlah_penduduk").maybeSingle(),
    supabase.from("layanan").select("id, nama, slug, ringkasan, urutan").eq("aktif", true).order("urutan").limit(6),
    supabase.from("berita").select("id, judul, slug, ringkasan, gambar_url, kategori, terbit_pada").eq("status", "terbit").lte("terbit_pada", new Date().toISOString()).order("terbit_pada", { ascending: false }).limit(3),
    supabase.from("agenda").select("id, judul, mulai, lokasi").gte("mulai", new Date().toISOString()).order("mulai").limit(3),
  ]);

  return <PublicHomeClient data={{ profile: profile as PublicHomeData["profile"], layanan: layanan ?? [], berita: berita ?? [], agenda: agenda ?? [] }} />;
}
