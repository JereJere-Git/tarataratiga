create table public.pengaduan_rate_limits (
  ip inet primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0,
  constraint pengaduan_rate_limits_count_check check (request_count >= 0)
);

alter table public.pengaduan_rate_limits enable row level security;

create or replace function public.consume_pengaduan_rate_limit(
  client_ip text,
  max_requests integer default 5,
  window_seconds integer default 3600
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.pengaduan_rate_limits;
begin
  if client_ip is null or client_ip !~ '^[0-9a-fA-F:.]+$'
     or max_requests < 1 or window_seconds < 1 then
    return false;
  end if;

  insert into public.pengaduan_rate_limits (ip, window_started_at, request_count)
  values (client_ip::inet, now(), 1)
  on conflict (ip) do update
    set window_started_at = case
      when now() - pengaduan_rate_limits.window_started_at >= make_interval(secs => window_seconds)
      then now()
      else pengaduan_rate_limits.window_started_at
    end,
    request_count = case
      when now() - pengaduan_rate_limits.window_started_at >= make_interval(secs => window_seconds)
      then 1
      else pengaduan_rate_limits.request_count + 1
    end
  returning * into current_row;

  return current_row.request_count <= max_requests;
exception when others then
  return false;
end;
$$;

revoke all on function public.consume_pengaduan_rate_limit(text, integer, integer) from public;
grant execute on function public.consume_pengaduan_rate_limit(text, integer, integer) to anon, authenticated;
