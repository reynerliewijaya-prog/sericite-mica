-- Run once in the Supabase SQL editor before enabling production traffic.
create table public.products (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(name) between 2 and 160),
 series text not null check (char_length(series) between 1 and 80),
 description text not null check (char_length(description) between 10 and 4000),
 published boolean not null default false,
 created_at timestamptz not null default now()
);
create table public.inquiries (
 id uuid primary key default gen_random_uuid(),
 name text not null, email text not null, company text not null default '',
 message text not null, consent_at timestamptz not null,
 notified boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.products enable row level security;
alter table public.inquiries enable row level security;
revoke all on public.products,public.inquiries from anon,authenticated;
grant all on public.products,public.inquiries to service_role;
-- No browser policies: access only via server endpoints with explicit admin authorization.
create index on public.inquiries(created_at desc);
