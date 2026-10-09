export type Kategori = "pemerintahan" | "kesehatan" | "ekonomi" | "ibadah" | "pendidikan" | "lainnya";

export type Fasilitas = {
  nama: string;
  kategori: Kategori;
  deskripsi: string;
  /** Jalur foto di folder public, mis. "/fasilitas/kantor-kelurahan.jpg" */
  foto?: string;
  /** Tautan Google Maps (Bagikan > Salin link). Dipakai lebih dulu daripada lat/lng. */
  maps?: string;
  lat?: number;
  lng?: number;
};

export const KATEGORI: Record<Kategori, string> = {
  pemerintahan: "Pemerintahan",
  kesehatan: "Kesehatan",
  ekonomi: "Ekonomi & Pertanian",
  ibadah: "Ibadah",
  pendidikan: "Pendidikan",
  lainnya: "Lainnya",
};

export function mapsUrl(item: Fasilitas): string | null {
  if (item.maps) return item.maps;
  if (typeof item.lat === "number" && typeof item.lng === "number") {
    return `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`;
  }
  return null;
}

// Untuk mengisi lokasi: tambahkan  maps: "https://maps.app.goo.gl/xxxx",
// atau  lat: 1.3, lng: 124.8  pada fasilitas yang bersangkutan.
export const fasilitas: Fasilitas[] = [
  { nama: "Kantor Kelurahan", kategori: "pemerintahan", deskripsi: "Pusat pelayanan administrasi dan pemerintahan kelurahan.", foto: "/fasilitas/kantor-kelurahan.jpg", maps: "https://maps.app.goo.gl/4ewqLrG6zanBFqyQ9" },
  { nama: "Puskesmas Taratara", kategori: "kesehatan", deskripsi: "Layanan kesehatan masyarakat tingkat pertama.", foto: "/fasilitas/puskesmas-taratara.jpg", maps: "https://maps.app.goo.gl/k4zocqou7geRu9oe9" },
  { nama: "Puskesmas Pembantu", kategori: "kesehatan", deskripsi: "Layanan kesehatan dasar bagi warga sekitar.", foto: "/fasilitas/puskesmas-pembantu.jpg", maps: "https://maps.app.goo.gl/k4zocqou7geRu9oe9" },
  { nama: "Balai Penyuluhan Pertanian", kategori: "ekonomi", deskripsi: "Penyuluhan dan pendampingan bagi petani.", foto: "/fasilitas/bpp.jpg", maps: "https://maps.app.goo.gl/iWUKgpBEFt6StDA46" },
  { nama: "Koperasi Merah Putih", kategori: "ekonomi", deskripsi: "Koperasi untuk mendukung ekonomi warga.", foto: "/fasilitas/koperasi-merah-putih.jpg", maps: "https://maps.app.goo.gl/chkRfxFAPYJBFBxh9" },
  { nama: "GMIM Gloria Taratara", kategori: "ibadah", deskripsi: "Tempat ibadah jemaat GMIM.", foto: "/fasilitas/gmim-gloria.jpg", maps: "https://maps.app.goo.gl/WQwWG1Z9gXXa8RTy6" },
  { nama: "GMIM Siloam Taratara", kategori: "ibadah", deskripsi: "Tempat ibadah jemaat GMIM.", foto: "/fasilitas/gmim-siloam.jpg", maps: "https://maps.app.goo.gl/YYNUBp6kuvnr3RuF7" },
  { nama: "GPDI Tiberias Taratara", kategori: "ibadah", deskripsi: "Tempat ibadah jemaat GPDI.", foto: "/fasilitas/gpdi-tiberias.jpg", maps: "https://maps.app.goo.gl/rL4c9pkTP1Dh8Mu68" },
  { nama: "GMAHK Jemaat Yerusalem Taratara Tiga", kategori: "ibadah", deskripsi: "Tempat ibadah jemaat GMAHK.", foto: "/fasilitas/gmahk-yerusalem.jpg", maps: "https://maps.app.goo.gl/63CxoLA1K4VKsVMs7" },
  { nama: "PAUD Pionir", kategori: "pendidikan", deskripsi: "Pendidikan anak usia dini.", foto: "/fasilitas/paud-pionir.jpg", maps: "https://maps.app.goo.gl/aj3iDc98o7W1nbPa6" },
  { nama: "TK Eben Haezer", kategori: "pendidikan", deskripsi: "Taman kanak-kanak.", foto: "/fasilitas/tk-eben-haezer.jpg", maps: "https://maps.app.goo.gl/gTmak3UeXTGNXQKL7" },
  { nama: "TK GMIM Siloam", kategori: "pendidikan", deskripsi: "Taman kanak-kanak.", foto: "/fasilitas/tk-gmim-siloam.jpg", maps: "https://maps.app.goo.gl/cAiftSsKHyQ3YejR6" },
  { nama: "TKN Taratara", kategori: "pendidikan", deskripsi: "Taman kanak-kanak negeri.", foto: "/fasilitas/tkn-taratara.jpg", maps: "https://maps.app.goo.gl/qozc5VvULA2AKrK58" },
  { nama: "SD GMIM 2 Taratara", kategori: "pendidikan", deskripsi: "Sekolah dasar.", foto: "/fasilitas/sd-gmim-2.jpg", maps: "https://maps.app.goo.gl/mxkZi3YUyB2Q76Pv5" },
  { nama: "SMA Negeri 2 Tomohon", kategori: "pendidikan", deskripsi: "Sekolah menengah atas negeri.", foto: "/fasilitas/sma-negeri-2-tomohon.jpg", maps: "https://maps.app.goo.gl/Wi8vEy4YdRepL2dL6" },
  { nama: "Pekuburan Desa Taratara", kategori: "lainnya", deskripsi: "Pemakaman Umum untuk warga taratara tiga.", foto: "/fasilitas/pekuburan-umum.jpg", maps: "https://maps.app.goo.gl/jiXBNGtHhHvERTTs5" },
];
