create table public.site_content (
 page text primary key,
 draft jsonb not null,
 published jsonb,
 updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
revoke all on public.site_content from anon, authenticated;
grant all on public.site_content to service_role;
