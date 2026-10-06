import { Container, SectionHeading } from "@/components/shared/layout";
import { EmptyState } from "@/components/shared/empty-state";
import { createClient } from "@/lib/supabase/server";
import { MapClient, type MapLocation, type OfficeLocation } from "./map-client";

export default async function MapPage() {
  const supabase = await createClient();
  const [{ data: locations }, { data: profile }] = await Promise.all([
    supabase
      .from("lokasi_penting")
      .select("id, nama, kategori, alamat, deskripsi, telepon, jam_operasional, lat, lng, urutan")
      .eq("aktif", true)
      .order("urutan")
      .order("nama"),
    supabase.from("profil_kelurahan").select("alamat, telepon, lat, lng").maybeSingle(),
  ]);

  const validLocations = (locations ?? []).filter(
    (location): location is MapLocation =>
      typeof location.lat === "number" && typeof location.lng === "number",
  );
  const office: OfficeLocation | null =
    profile && typeof profile.lat === "number" && typeof profile.lng === "number"
      ? {
          nama: "Kantor Kelurahan Taratara Tiga",
          alamat: profile.alamat,
          telepon: profile.telepon,
          lat: profile.lat,
          lng: profile.lng,
        }
      : null;

  return (
    <main className="pb-28 pt-28">
      <Container>
        <SectionHeading
          eyebrow="Informasi warga"
          title="Peta lokasi penting"
          description="Temukan tempat penting di sekitar Kelurahan Taratara Tiga dan rencanakan perjalanan Anda."
        />
        <div className="mt-8">
          {validLocations.length || office ? (
            <MapClient locations={validLocations} office={office} missingCount={(locations ?? []).length - validLocations.length} />
          ) : (
            <EmptyState
              title="Belum ada lokasi berkoordinat"
              description="Lokasi penting dan kantor kelurahan belum memiliki koordinat untuk ditampilkan di peta."
            />
          )}
        </div>
      </Container>
    </main>
  );
}
