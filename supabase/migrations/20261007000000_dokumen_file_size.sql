alter table public.dokumen add column if not exists file_size bigint;
alter table public.dokumen add constraint dokumen_file_size_check check (file_size is null or file_size >= 0);
