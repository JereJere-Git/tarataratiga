/** Nomor contoh sementara untuk tampilan publik hingga data kontak resmi tersedia. */
export const NOMOR_KONTAK_SEMENTARA = "085238826849";

/** Ubah nomor tiap jabatan di sini. Nomor dapat ditulis sebagai 08..., 62..., atau +62.... */
export const KONTAK_PEJABAT = [
  { jabatan: "Lurah", nama: "Rommy N. Loho, SH", nomor: NOMOR_KONTAK_SEMENTARA },
  { jabatan: "Sekretaris Lurah", nama: "Sekretaris Lurah", nomor: NOMOR_KONTAK_SEMENTARA },
  { jabatan: "Pegawai Kelurahan", nama: "Petugas pelayanan", nomor: NOMOR_KONTAK_SEMENTARA },
] as const;
