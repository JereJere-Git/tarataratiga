insert into public.profil_kelurahan (
  id, sambutan, sejarah, visi, misi, alamat, telepon, whatsapp, email,
  jam_pelayanan, zona_waktu, lat, lng, jumlah_rt, jumlah_rw, jumlah_penduduk
)
values (
  '00000000-0000-4000-8000-000000000001',
  'Selamat datang di portal resmi Kelurahan Taratara Tiga.',
  'Kelurahan Taratara Tiga merupakan bagian dari Kecamatan Tomohon Barat, Kota Tomohon.',
  'Terwujudnya kelurahan yang tertib, terbuka, dan melayani.',
  'Meningkatkan kualitas pelayanan publik dan partisipasi warga.',
  'Kelurahan Taratara Tiga, Kecamatan Tomohon Barat, Kota Tomohon',
  '(0431) 000000',
  '6281200000000',
  'kelurahan.taratara3@example.go.id',
  '{"senin":{"buka":"08:00","tutup":"16:00"},"selasa":{"buka":"08:00","tutup":"16:00"},"rabu":{"buka":"08:00","tutup":"16:00"},"kamis":{"buka":"08:00","tutup":"16:00"},"jumat":{"buka":"08:00","tutup":"15:00"}}'::jsonb,
  'Asia/Makassar',
  1.316700,
  124.833300,
  12,
  4,
  2500
)
on conflict (id) do update set
  sambutan = excluded.sambutan,
  sejarah = excluded.sejarah,
  visi = excluded.visi,
  misi = excluded.misi,
  alamat = excluded.alamat,
  telepon = excluded.telepon,
  whatsapp = excluded.whatsapp,
  email = excluded.email,
  jam_pelayanan = excluded.jam_pelayanan,
  zona_waktu = excluded.zona_waktu,
  lat = excluded.lat,
  lng = excluded.lng,
  jumlah_rt = excluded.jumlah_rt,
  jumlah_rw = excluded.jumlah_rw,
  jumlah_penduduk = excluded.jumlah_penduduk;

insert into public.layanan (id, nama, slug, ringkasan, syarat, alur, biaya, estimasi_waktu, urutan, aktif)
values
  ('00000000-0000-4000-8000-000000000101', 'Surat Keterangan Domisili', 'surat-keterangan-domisili', 'Pengajuan surat keterangan domisili warga.', '["KTP","Kartu Keluarga"]'::jsonb, '["Isi formulir","Verifikasi berkas","Surat diterbitkan"]'::jsonb, 'Gratis', '1 hari kerja', 1, true),
  ('00000000-0000-4000-8000-000000000102', 'Surat Pengantar', 'surat-pengantar', 'Layanan surat pengantar untuk kebutuhan administrasi warga.', '["KTP","Kartu Keluarga"]'::jsonb, '["Ajukan ke kelurahan","Validasi data","Surat ditandatangani"]'::jsonb, 'Gratis', '1 hari kerja', 2, true),
  ('00000000-0000-4000-8000-000000000103', 'Legalisasi Dokumen', 'legalisasi-dokumen', 'Legalisasi dokumen administrasi sesuai ketentuan.', '["Dokumen asli","Fotokopi dokumen","KTP"]'::jsonb, '["Serahkan dokumen","Pemeriksaan","Dokumen selesai"]'::jsonb, 'Gratis', '1 hari kerja', 3, true)
on conflict (id) do update set
  nama = excluded.nama,
  slug = excluded.slug,
  ringkasan = excluded.ringkasan,
  syarat = excluded.syarat,
  alur = excluded.alur,
  biaya = excluded.biaya,
  estimasi_waktu = excluded.estimasi_waktu,
  urutan = excluded.urutan,
  aktif = excluded.aktif;

insert into public.berita (id, judul, slug, ringkasan, isi, kategori, status, terbit_pada)
values
  ('00000000-0000-4000-8000-000000000201', 'Pelayanan administrasi kelurahan', 'pelayanan-administrasi-kelurahan', 'Informasi jam dan alur pelayanan administrasi.', 'Pelayanan administrasi tersedia pada hari kerja sesuai jam pelayanan kelurahan.', 'Pelayanan', 'terbit', '2026-10-01 08:00:00+08'),
  ('00000000-0000-4000-8000-000000000202', 'Kerja bakti lingkungan', 'kerja-bakti-lingkungan', 'Warga diajak menjaga kebersihan lingkungan bersama.', 'Kegiatan kerja bakti dilaksanakan bersama perangkat kelurahan dan warga.', 'Kegiatan', 'terbit', '2026-09-28 08:00:00+08'),
  ('00000000-0000-4000-8000-000000000203', 'Jadwal posyandu bulan Oktober', 'jadwal-posyandu-oktober', 'Jadwal layanan kesehatan warga bulan ini.', 'Posyandu dilaksanakan sesuai jadwal yang telah disepakati bersama kader dan warga.', 'Kesehatan', 'terbit', '2026-09-25 08:00:00+08')
on conflict (id) do update set
  judul = excluded.judul,
  slug = excluded.slug,
  ringkasan = excluded.ringkasan,
  isi = excluded.isi,
  kategori = excluded.kategori,
  status = excluded.status,
  terbit_pada = excluded.terbit_pada;

insert into public.agenda (id, judul, deskripsi, lokasi, mulai, selesai)
values
  ('00000000-0000-4000-8000-000000000301', 'Musyawarah kelurahan', 'Pembahasan rencana kegiatan dan kebutuhan lingkungan.', 'Aula Kelurahan Taratara Tiga', '2026-10-10 09:00:00+08', '2026-10-10 11:00:00+08'),
  ('00000000-0000-4000-8000-000000000302', 'Kerja bakti lingkungan', 'Gotong royong membersihkan fasilitas umum kelurahan.', 'Lingkungan Taratara Tiga', '2026-10-17 07:00:00+08', '2026-10-17 10:00:00+08')
on conflict (id) do update set
  judul = excluded.judul,
  deskripsi = excluded.deskripsi,
  lokasi = excluded.lokasi,
  mulai = excluded.mulai,
  selesai = excluded.selesai;
