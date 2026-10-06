# Membuat admin pertama

1. Buat akun di **Supabase Dashboard → Authentication → Users → Add user**. Pastikan email dan kata sandi sudah ditentukan, lalu nonaktifkan email confirmation untuk akun internal bila kebijakan organisasi mengizinkan.
2. Salin UUID user tersebut dari daftar Authentication.
3. Jalankan SQL berikut di **SQL Editor**:

```sql
insert into public.admin_profiles (user_id, nama, peran)
values ('UUID_USER_DARI_SUPABASE', 'Nama Admin', 'admin');
```

4. Buka `/admin/login` dan masuk menggunakan email akun tersebut.
5. Untuk staf editorial, ulangi langkah 1–3 dengan `peran = 'editor'`.

Jangan memasukkan `SUPABASE_SERVICE_ROLE_KEY` ke browser atau `.env` yang dikomit.
