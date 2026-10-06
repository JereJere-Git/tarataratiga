create table if not exists public.umkm (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kategori text not null,
  deskripsi text,
  alamat text not null,
  telepon text,
  whatsapp text,
  jam_operasional text,
  urutan integer not null default 0 check (urutan >= 0),
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.potensi (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  kategori text not null,
  deskripsi text not null,
  lokasi text,
  urutan integer not null default 0 check (urutan >= 0),
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists umkm_aktif_idx on public.umkm (aktif, urutan);
create index if not exists potensi_aktif_idx on public.potensi (aktif, urutan);

drop trigger if exists umkm_updated_at on public.umkm;
create trigger umkm_updated_at before update on public.umkm for each row execute function public.set_updated_at();
drop trigger if exists potensi_updated_at on public.potensi;
create trigger potensi_updated_at before update on public.potensi for each row execute function public.set_updated_at();

alter table public.umkm enable row level security;
alter table public.potensi enable row level security;

create policy umkm_public_read on public.umkm for select to anon, authenticated using (aktif = true);
create policy umkm_staff_read on public.umkm for select to authenticated using (public.is_staff());
create policy umkm_staff_insert on public.umkm for insert to authenticated with check (public.is_staff());
create policy umkm_staff_update on public.umkm for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy umkm_staff_delete on public.umkm for delete to authenticated using (public.is_staff());

create policy potensi_public_read on public.potensi for select to anon, authenticated using (aktif = true);
create policy potensi_staff_read on public.potensi for select to authenticated using (public.is_staff());
create policy potensi_staff_insert on public.potensi for insert to authenticated with check (public.is_staff());
create policy potensi_staff_update on public.potensi for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy potensi_staff_delete on public.potensi for delete to authenticated using (public.is_staff());
