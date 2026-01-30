-- Creates a table to store landing page form submissions for the admin dashboard.

create extension if not exists "pgcrypto";

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null,
  email text not null,
  data jsonb not null,
  source text,
  created_at timestamptz not null default now()
);

alter table public.form_submissions enable row level security;

drop policy if exists "Service role full access" on public.form_submissions;
create policy "Service role full access" on public.form_submissions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
