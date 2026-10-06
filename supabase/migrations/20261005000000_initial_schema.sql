create extension if not exists "pgcrypto";

create type public.berita_status as enum ('draf', 'terbit');
create type public.pengaduan_status as enum ('baru', 'diproses', 'selesai');
create type public.admin_role as enum ('admin', 'editor');

create sequence public.pengaduan_nomor_tiket_seq;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profil_kelurahan (
  id uuid primary key default gen_random_uuid(),
  sambutan text,
  sejarah text,
  visi text,
  misi text,
  alamat text,
  telepon text,
  whatsapp text,
  email text,
  jam_pelayanan jsonb not null default '{}'::jsonb,
  zona_waktu text not null default 'Asia/Makassar',
  lat numeric(9,6),
  lng numeric(9,6),
  jumlah_rt integer not null default 0 check (jumlah_rt >= 0),
  jumlah_rw integer not null default 0 check (jumlah_rw >= 0),
  jumlah_penduduk integer not null default 0 check (jumlah_penduduk >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profil_kelurahan_singleton_idx on public.profil_kelurahan ((true));

create table public.pejabat (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  jabatan text not null,
  foto_url text,
  urutan integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.layanan (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  slug text not null unique,
  ringkasan text,
  syarat jsonb not null default '[]'::jsonb,
  alur jsonb not null default '[]'::jsonb,
  biaya text,
  estimasi_waktu text,
  urutan integer not null default 0,
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.dokumen (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  kategori text not null,
  file_url text not null,
  tanggal date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.berita (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  slug text not null unique,
  ringkasan text,
  isi text not null,
  gambar_url text,
  kategori text,
  status public.berita_status not null default 'draf',
  terbit_pada timestamptz,
  penulis_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint berita_terbit_pada_check check (status = 'draf' or terbit_pada is not null)
);

create table public.agenda (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  deskripsi text,
  lokasi text,
  mulai timestamptz not null,
  selesai timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agenda_waktu_check check (selesai is null or selesai >= mulai)
);

create table public.galeri (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  album text,
  gambar_url text not null,
  urutan integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pengaduan (
  id uuid primary key default gen_random_uuid(),
  nomor_tiket text not null unique default format('ADU-%s-%04s', extract(year from now())::integer, nextval('public.pengaduan_nomor_tiket_seq')),
  nama text,
  kontak text,
  kategori text not null,
  isi text not null,
  lampiran_url text,
  anonim boolean not null default false,
  status public.pengaduan_status not null default 'baru',
  balasan text,
  dibalas_pada timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  nama text not null,
  peran public.admin_role not null default 'editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index berita_publik_idx on public.berita (status, terbit_pada desc);
create index layanan_aktif_idx on public.layanan (aktif, urutan);
create index agenda_mulai_idx on public.agenda (mulai);
create index galeri_album_idx on public.galeri (album, urutan);
create index pengaduan_status_idx on public.pengaduan (status, created_at desc);

create trigger profil_kelurahan_updated_at before update on public.profil_kelurahan for each row execute function public.set_updated_at();
create trigger pejabat_updated_at before update on public.pejabat for each row execute function public.set_updated_at();
create trigger layanan_updated_at before update on public.layanan for each row execute function public.set_updated_at();
create trigger dokumen_updated_at before update on public.dokumen for each row execute function public.set_updated_at();
create trigger berita_updated_at before update on public.berita for each row execute function public.set_updated_at();
create trigger agenda_updated_at before update on public.agenda for each row execute function public.set_updated_at();
create trigger galeri_updated_at before update on public.galeri for each row execute function public.set_updated_at();
create trigger pengaduan_updated_at before update on public.pengaduan for each row execute function public.set_updated_at();
create trigger admin_profiles_updated_at before update on public.admin_profiles for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles
    where user_id = auth.uid() and peran = 'admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles
    where user_id = auth.uid() and peran in ('admin', 'editor')
  );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.is_staff() from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_staff() to anon, authenticated;

alter table public.profil_kelurahan enable row level security;
alter table public.pejabat enable row level security;
alter table public.layanan enable row level security;
alter table public.dokumen enable row level security;
alter table public.berita enable row level security;
alter table public.agenda enable row level security;
alter table public.galeri enable row level security;
alter table public.pengaduan enable row level security;
alter table public.admin_profiles enable row level security;

create policy profil_public_read on public.profil_kelurahan for select to anon, authenticated using (true);
create policy profil_staff_insert on public.profil_kelurahan for insert to authenticated with check (public.is_staff());
create policy profil_staff_update on public.profil_kelurahan for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy profil_admin_delete on public.profil_kelurahan for delete to authenticated using (public.is_admin());

create policy pejabat_public_read on public.pejabat for select to anon, authenticated using (true);
create policy pejabat_staff_insert on public.pejabat for insert to authenticated with check (public.is_staff());
create policy pejabat_staff_update on public.pejabat for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy pejabat_staff_delete on public.pejabat for delete to authenticated using (public.is_staff());

create policy layanan_public_read on public.layanan for select to anon, authenticated using (aktif = true or public.is_staff());
create policy layanan_staff_insert on public.layanan for insert to authenticated with check (public.is_staff());
create policy layanan_staff_update on public.layanan for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy layanan_staff_delete on public.layanan for delete to authenticated using (public.is_staff());

create policy dokumen_public_read on public.dokumen for select to anon, authenticated using (true);
create policy dokumen_staff_insert on public.dokumen for insert to authenticated with check (public.is_staff());
create policy dokumen_staff_update on public.dokumen for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy dokumen_staff_delete on public.dokumen for delete to authenticated using (public.is_staff());

create policy berita_public_read on public.berita for select to anon, authenticated using ((status = 'terbit' and terbit_pada <= now()) or public.is_staff());
create policy berita_staff_insert on public.berita for insert to authenticated with check (public.is_staff());
create policy berita_staff_update on public.berita for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy berita_staff_delete on public.berita for delete to authenticated using (public.is_staff());

create policy agenda_public_read on public.agenda for select to anon, authenticated using (true);
create policy agenda_staff_insert on public.agenda for insert to authenticated with check (public.is_staff());
create policy agenda_staff_update on public.agenda for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy agenda_staff_delete on public.agenda for delete to authenticated using (public.is_staff());

create policy galeri_public_read on public.galeri for select to anon, authenticated using (true);
create policy galeri_staff_insert on public.galeri for insert to authenticated with check (public.is_staff());
create policy galeri_staff_update on public.galeri for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy galeri_staff_delete on public.galeri for delete to authenticated using (public.is_staff());

create policy pengaduan_public_insert on public.pengaduan for insert to anon, authenticated with check (true);
create policy pengaduan_staff_read on public.pengaduan for select to authenticated using (public.is_staff());
create policy pengaduan_staff_update on public.pengaduan for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy pengaduan_admin_delete on public.pengaduan for delete to authenticated using (public.is_admin());

create policy admin_profiles_staff_read_own on public.admin_profiles for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy admin_profiles_admin_insert on public.admin_profiles for insert to authenticated with check (public.is_admin());
create policy admin_profiles_admin_update on public.admin_profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy admin_profiles_admin_delete on public.admin_profiles for delete to authenticated using (public.is_admin());

create or replace function public.cek_status_pengaduan(nomor_tiket text)
returns table (
  status public.pengaduan_status,
  kategori text,
  tanggal timestamptz,
  balasan text
)
language sql
stable
security definer
set search_path = public
as $$
  select p.status, p.kategori, p.created_at as tanggal, p.balasan
  from public.pengaduan p
  where p.nomor_tiket = cek_status_pengaduan.nomor_tiket;
$$;

revoke all on function public.cek_status_pengaduan(text) from public;
grant execute on function public.cek_status_pengaduan(text) to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('media', 'media', true), ('lampiran', 'lampiran', false)
on conflict (id) do update set public = excluded.public;

create policy media_public_read on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy media_staff_insert on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_staff());
create policy media_staff_update on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_staff()) with check (bucket_id = 'media' and public.is_staff());
create policy media_staff_delete on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_staff());

create policy lampiran_public_upload on storage.objects for insert to anon, authenticated with check (bucket_id = 'lampiran' and (storage.foldername(name))[1] = 'pengaduan');
create policy lampiran_staff_read on storage.objects for select to authenticated using (bucket_id = 'lampiran' and public.is_staff());
create policy lampiran_staff_update on storage.objects for update to authenticated using (bucket_id = 'lampiran' and public.is_staff()) with check (bucket_id = 'lampiran' and public.is_staff());
create policy lampiran_staff_delete on storage.objects for delete to authenticated using (bucket_id = 'lampiran' and public.is_staff());
