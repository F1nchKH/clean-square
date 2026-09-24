create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  cleaning_type text not null,
  area integer not null,
  add_ons jsonb not null default '[]'::jsonb,
  calculated_price integer not null,
  consent boolean not null,
  created_at timestamptz not null default now(),
  constraint leads_area_range check (area between 10 and 500),
  constraint leads_consent_true check (consent = true)
);

alter table public.leads enable row level security;

-- Data API access is opt-in when automatic table exposure is disabled.
revoke all on table public.leads from anon, authenticated;
grant usage on schema public to service_role;
grant insert on table public.leads to service_role;
