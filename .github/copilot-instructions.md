PROYEK
Website resmi Kelurahan Taratara Tiga, Kec. Tomohon Barat, Tomohon. Bahasa UI: Indonesia.
Pengguna utama: warga lewat ponsel. Admin: staf non-teknis.

STACK
Next.js (App Router) + TypeScript, Tailwind CSS, shadcn/ui, Framer Motion,
lucide-react, sonner (toast), react-hook-form + zod, Tiptap (editor admin),
Supabase (Postgres, Auth, Storage) via @supabase/ssr. Deploy: Vercel.

STRUKTUR
app/(public)/*, app/admin/*, components/ui, components/shared,
lib/supabase/{client,server}.ts, lib/validations, supabase/migrations

GAYA DESAIN: "LIQUID GLASS" (terinspirasi iOS 26), tetap resmi dan terbaca
- Konsep: permukaan kaca bening melayang di atas latar berwarna lembut. Sudut
  sangat membulat, sorotan tepi tipis, bayangan lembut, gerakan kenyal.
- Font: Plus Jakarta Sans (judul dan isi) lewat next/font.
- Warna: biru #1D4ED8 sebagai warna utama, oranye hangat (#FB923C) sebagai aksen,
  teks navy #0F1F3D. Definisikan sebagai CSS variable; dukung mode terang dan gelap.
- Latar (wajib, karena kaca butuh sesuatu di belakangnya): gradien mesh
  (terang: #DBE9FF -> #EEF3FF -> #FFE9D6) dengan 3 blob blur besar (biru, oranye,
  cyan) yang bergerak sangat pelan (CSS animation, hanya transform). Mode gelap:
  versi lebih gelap dengan blob lebih redup.
- Token kaca di globals.css (CSS variable, terang & gelap):
  .glass        : background rgba(255,255,255,.38), backdrop-filter
                  blur(18px) saturate(170%), border 1px rgba(255,255,255,.6),
                  box-shadow: inset 0 1px 0 rgba(255,255,255,.85),
                  inset 0 -1px 0 rgba(255,255,255,.2), 0 12px 32px rgba(30,70,140,.16)
  .glass-strong : sama, tetapi background lebih pekat (.7-.8) dan blur 24px;
                  dipakai untuk isi artikel, formulir, tabel, panel admin
  .glass-pill   : varian untuk tombol/chip (radius penuh)
  Sorotan spekular: pseudo-element ::before berisi gradien putih tipis di sudut
  kiri atas; pada perangkat pointer, sorotan mengikuti kursor.
- Bentuk: radius 28-32px untuk kartu, 999px untuk tombol dan navigasi kapsul.
- Komponen khas:
  * Navbar kapsul kaca melayang (bukan menempel penuh), menyusut halus saat scroll.
  * Bottom tab bar kaca melayang di ponsel untuk navigasi utama.
  * Tombol utama: pill biru solid; tombol sekunder: pill kaca. Efek tekan "kenyal"
    (hover scale 1.04, active scale .95, spring).
  * Kartu terangkat saat hover (translateY -6px, transisi spring).
  * Dialog, menu, dan toast berbentuk kaca dengan animasi spring.
  * Toggle dan segmented control gaya iOS dengan indikator bergeser halus.
- Gerak: Framer Motion dengan spring (stiffness ~300, damping ~28); animasi muncul
  saat scroll (fade + slide halus), skeleton saat memuat. Hormati prefers-reduced-motion.
- Teks di atas kaca: kontras minimal 4.5:1; pakai warna teks tegas, jangan putih
  transparan.
- ATURAN KINERJA & AKSESIBILITAS (wajib):
  * Maksimal ~6 elemen ber-backdrop-filter dalam satu layar; jangan menumpuk kaca
    di dalam kaca.
  * Di layar < 768px: blur maks 14px dan kurangi jumlah blob latar.
  * @supports not (backdrop-filter): ganti dengan background solid semi-opak.
  * @media (prefers-reduced-transparency: reduce) dan (prefers-contrast: more):
    matikan blur, pakai background solid dan border tegas.
  * Jangan pakai kaca tipis untuk isi artikel panjang, tabel, atau formulir panjang;
    pakai .glass-strong atau permukaan solid.
  * Label form, fokus keyboard terlihat, alt gambar, target sentuh min. 44px.

ATURAN KODE
- Server Components secara default; "use client" hanya jika perlu interaksi.
- Mutasi lewat Server Actions; validasi input dengan zod di server.
- Jangan ekspos service role key ke browser. Semua kunci di .env.local.
- Komentar singkat hanya pada logika yang tidak jelas.

CARA KERJA
- Tampilkan hanya file yang dibuat/diubah, jangan ulang file yang tidak berubah.
- Akhiri dengan: (1) perintah yang harus saya jalankan, (2) cara memverifikasi hasil.
- Jika ada keputusan yang belum jelas, tanya dulu, jangan menebak.