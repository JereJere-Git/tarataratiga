-- Remove staff/admin access from the public portal database.
-- Keep the original migrations immutable; this migration cleans existing projects.

drop policy if exists profil_staff_insert on public.profil_kelurahan;
drop policy if exists profil_staff_update on public.profil_kelurahan;
drop policy if exists profil_admin_delete on public.profil_kelurahan;

drop policy if exists pejabat_staff_insert on public.pejabat;
drop policy if exists pejabat_staff_update on public.pejabat;
drop policy if exists pejabat_staff_delete on public.pejabat;

drop policy if exists layanan_staff_insert on public.layanan;
drop policy if exists layanan_staff_update on public.layanan;
drop policy if exists layanan_staff_delete on public.layanan;
drop policy if exists layanan_public_read on public.layanan;
create policy layanan_public_read on public.layanan
  for select to anon, authenticated using (aktif = true);

drop policy if exists dokumen_staff_insert on public.dokumen;
drop policy if exists dokumen_staff_update on public.dokumen;
drop policy if exists dokumen_staff_delete on public.dokumen;

drop policy if exists berita_staff_insert on public.berita;
drop policy if exists berita_staff_update on public.berita;
drop policy if exists berita_staff_delete on public.berita;
drop policy if exists berita_public_read on public.berita;
create policy berita_public_read on public.berita
  for select to anon, authenticated
  using (status = 'terbit' and terbit_pada <= now());

drop policy if exists agenda_staff_insert on public.agenda;
drop policy if exists agenda_staff_update on public.agenda;
drop policy if exists agenda_staff_delete on public.agenda;

drop policy if exists galeri_staff_insert on public.galeri;
drop policy if exists galeri_staff_update on public.galeri;
drop policy if exists galeri_staff_delete on public.galeri;

drop policy if exists pengaduan_staff_read on public.pengaduan;
drop policy if exists pengaduan_staff_update on public.pengaduan;
drop policy if exists pengaduan_admin_delete on public.pengaduan;

drop policy if exists umkm_staff_read on public.umkm;
drop policy if exists umkm_staff_insert on public.umkm;
drop policy if exists umkm_staff_update on public.umkm;
drop policy if exists umkm_staff_delete on public.umkm;
drop policy if exists potensi_staff_read on public.potensi;
drop policy if exists potensi_staff_insert on public.potensi;
drop policy if exists potensi_staff_update on public.potensi;
drop policy if exists potensi_staff_delete on public.potensi;
drop policy if exists monografi_staff_insert on public.statistik_monografi;
drop policy if exists monografi_staff_update on public.statistik_monografi;
drop policy if exists monografi_staff_delete on public.statistik_monografi;
drop policy if exists ekonomi_staff_insert on public.statistik_ekonomi;
drop policy if exists ekonomi_staff_update on public.statistik_ekonomi;
drop policy if exists ekonomi_staff_delete on public.statistik_ekonomi;

drop policy if exists admin_profiles_staff_read_own on public.admin_profiles;
drop policy if exists admin_profiles_admin_insert on public.admin_profiles;
drop policy if exists admin_profiles_admin_update on public.admin_profiles;
drop policy if exists admin_profiles_admin_delete on public.admin_profiles;
drop table if exists public.admin_profiles;

drop function if exists public.is_admin();
drop function if exists public.is_staff();
drop type if exists public.admin_role;

drop policy if exists media_staff_insert on storage.objects;
drop policy if exists media_staff_update on storage.objects;
drop policy if exists media_staff_delete on storage.objects;
drop policy if exists lampiran_staff_read on storage.objects;
drop policy if exists lampiran_staff_update on storage.objects;
drop policy if exists lampiran_staff_delete on storage.objects;

-- The remaining admin-only features used this key. Public submission and
-- status lookup work with the normal anon key and their existing RLS policies.
