-- Tabel statistik monografi: data key-value per kategori
create table public.statistik_monografi (
  id uuid primary key default gen_random_uuid(),
  kategori text not null,      -- 'kependudukan' | 'pendidikan' | 'pekerjaan' | 'usia' | 'agama'
  label text not null,         -- contoh: 'Laki-laki', 'SD', 'Petani', '0-14 tahun', 'Islam'
  nilai integer not null default 0 check (nilai >= 0),
  urutan integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabel statistik ekonomi: sektor usaha warga
create table public.statistik_ekonomi (
  id uuid primary key default gen_random_uuid(),
  sektor text not null,        -- contoh: 'Pertanian', 'Perdagangan', 'PNS'
  jumlah integer not null default 0 check (jumlah >= 0),
  urutan integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indeks
create index statistik_monografi_kategori_idx on public.statistik_monografi (kategori, urutan);
create index statistik_ekonomi_urutan_idx on public.statistik_ekonomi (urutan);

-- Trigger updated_at
create trigger statistik_monografi_updated_at
  before update on public.statistik_monografi
  for each row execute function public.set_updated_at();

create trigger statistik_ekonomi_updated_at
  before update on public.statistik_ekonomi
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.statistik_monografi enable row level security;
alter table public.statistik_ekonomi enable row level security;

-- Monografi: publik baca, staff kelola
create policy monografi_public_read on public.statistik_monografi
  for select to anon, authenticated using (true);
create policy monografi_staff_insert on public.statistik_monografi
  for insert to authenticated with check (public.is_staff());
create policy monografi_staff_update on public.statistik_monografi
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy monografi_staff_delete on public.statistik_monografi
  for delete to authenticated using (public.is_staff());

-- Ekonomi: publik baca, staff kelola
create policy ekonomi_public_read on public.statistik_ekonomi
  for select to anon, authenticated using (true);
create policy ekonomi_staff_insert on public.statistik_ekonomi
  for insert to authenticated with check (public.is_staff());
create policy ekonomi_staff_update on public.statistik_ekonomi
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy ekonomi_staff_delete on public.statistik_ekonomi
  for delete to authenticated using (public.is_staff());
