import { fasilitas } from "@/lib/fasilitas";

const captions: Record<string, string> = {
  "Kantor Kelurahan": "Pusat pelayanan dan pemerintahan warga.",
  "Puskesmas Taratara": "Layanan kesehatan untuk masyarakat Taratara.",
  "Balai Penyuluhan Pertanian": "Ruang belajar dan pendampingan bagi petani.",
  "GMIM Gloria Taratara": "Salah satu tempat ibadah di lingkungan kelurahan.",
  "TKN Taratara": "Fasilitas pendidikan anak usia dini.",
};

export const publicGallery = Object.entries(captions).flatMap(([nama, deskripsi]) => {
  const facility = fasilitas.find((item) => item.nama === nama);
  return facility?.foto
    ? [{ id: `fasilitas-${nama.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, judul: nama, gambar_url: facility.foto, deskripsi }]
    : [];
});
