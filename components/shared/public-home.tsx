import { createClient } from "@/lib/supabase/server";
import { PublicHomeClient, type PublicHomeData } from "@/components/shared/public-home-client";

export async function PublicHome() {
  const supabase = await createClient();
  const [{ data: profile, error: profileError }, { data: layanan }] = await Promise.all([
    supabase.from("profil_kelurahan").select("sambutan, alamat, telepon, whatsapp, email, jam_pelayanan, zona_waktu, lingkungan, jumlah_penduduk").maybeSingle(),
    supabase.from("layanan").select("id, nama, slug, ringkasan, urutan").eq("aktif", true).order("urutan").limit(6),
  ]);
  if (profileError) console.error("profil_kelurahan:", profileError.message);

  return <PublicHomeClient data={{ profile: profile as PublicHomeData["profile"], layanan: layanan ?? [] }} />;
}