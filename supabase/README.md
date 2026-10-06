# Supabase database setup

## Menjalankan secara lokal

1. Install Supabase CLI dan Docker Desktop.
2. Dari root project, jalankan `supabase init` hanya jika folder konfigurasi belum dibuat.
3. Jalankan `supabase start`.
4. Terapkan migration dengan `supabase db reset`.
5. Seed dijalankan sebagai bagian dari reset jika `seed.sql` dikonfigurasi sebagai seed file; atau jalankan manual dengan `supabase db query < supabase/seed.sql`.
6. Salin `.env.example` menjadi `.env.local`, lalu isi URL dan anon key dari `supabase status`. Simpan service role key hanya di server.

## Menjalankan pada project Supabase hosted

1. Hubungkan project dengan `supabase link --project-ref <project-ref>`.
2. Terapkan migration dengan `supabase db push`.
3. Jalankan seed dengan `supabase db query --linked < supabase/seed.sql`.
4. Periksa policy pada Supabase Dashboard > Database > Policies dan Storage.

Migration utama berada di `supabase/migrations/20261005000000_initial_schema.sql`.
Migration `20261006000000_pengaduan_rate_limit.sql` menambahkan penghitung kiriman
anonim per IP (maksimal 5 kiriman per jam). Isi `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
dan `TURNSTILE_SECRET_KEY` pada `.env.local`; gunakan site key/secret Cloudflare
Turnstile untuk production dan jangan pernah menaruh secret di browser.

## Uji manual pengaduan

1. Jalankan aplikasi dengan environment Supabase dan Turnstile yang valid, lalu
   kirim satu pengaduan dari `/pengaduan`. Pastikan nomor tiket tampil dan foto
   tidak menghasilkan URL publik.
2. Dengan anon key, jalankan `select * from public.pengaduan;` melalui Supabase
   client. Hasil harus kosong/tidak memiliki baris, sedangkan halaman
   `/pengaduan/status` hanya menampilkan status, kategori, tanggal, dan balasan.
3. Login sebagai editor/admin dan buka `/admin/pengaduan`. Pastikan daftar,
   filter status, signed URL lampiran, pembaruan status/balasan, dan ekspor CSV
   hanya tersedia setelah login.
4. Kirim lebih dari lima laporan dari IP yang sama dalam satu jam. Kiriman
   berikutnya harus ditolak oleh RPC rate-limit.

Untuk membuat akun admin pertama, ikuti [ADMIN_SETUP.md](./ADMIN_SETUP.md).

## Tiga query uji keamanan

Jalankan Query 1 menggunakan Supabase client dengan `NEXT_PUBLIC_SUPABASE_ANON_KEY` tanpa login. Hasil yang diharapkan adalah `data: []` dan tidak ada baris pengaduan yang terbaca:

```sql
select * from public.pengaduan;
```

Query 2 dijalankan di SQL editor untuk memastikan tidak ada policy SELECT yang diberikan kepada role publik/anon pada tabel pengaduan. Hasil yang diharapkan adalah nol baris:

```sql
select policyname, roles, cmd
from pg_policies
where schemaname = 'public'
  and tablename = 'pengaduan'
  and cmd = 'SELECT'
  and ('anon' = any(roles) or 'public' = any(roles));
```

Query 3 boleh dijalankan dengan anon key untuk membuktikan bahwa akses status hanya melalui RPC dan hanya mengembalikan kolom yang diizinkan, bukan row pengaduan lengkap:

```sql
select status, kategori, tanggal, balasan
from public.cek_status_pengaduan('ADU-2026-0001');
```

Catatan: Query 3 akan mengembalikan nol baris jika nomor tiket belum ada. RPC tidak mengembalikan `id`, `nama`, `kontak`, `isi`, atau `lampiran_url`.
