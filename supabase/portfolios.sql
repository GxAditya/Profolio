create extension if not exists "pgcrypto";

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null,
  template_id text not null
);

alter table public.portfolios enable row level security;

drop policy if exists "Public read portfolios" on public.portfolios;
create policy "Public read portfolios"
on public.portfolios
for select
using (true);

drop policy if exists "Public insert portfolios" on public.portfolios;
create policy "Public insert portfolios"
on public.portfolios
for insert
with check (true);
