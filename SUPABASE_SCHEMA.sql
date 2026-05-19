-- Andrew Radar Brain future schema.
-- RLS is enabled for safety. Add explicit policies before any public use.

create extension if not exists pgcrypto;

create table if not exists channels (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  channel text,
  url text,
  summary text,
  why_it_matters text,
  action text,
  status text default 'active',
  tags text[] default '{}',
  created_at timestamptz default now()
);

alter table channels enable row level security;

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  channel text,
  url text,
  summary text,
  why_it_matters text,
  action text,
  status text default 'new',
  tags text[] default '{}',
  created_at timestamptz default now()
);

alter table videos enable row level security;

create table if not exists insights (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  channel text,
  url text,
  summary text,
  why_it_matters text,
  action text,
  status text default 'new',
  tags text[] default '{}',
  created_at timestamptz default now()
);

alter table insights enable row level security;

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  channel text,
  url text,
  summary text,
  why_it_matters text,
  action text,
  status text default 'draft',
  tags text[] default '{}',
  created_at timestamptz default now()
);

alter table reports enable row level security;

-- TODO: Add private-user auth policies before connecting this to a public app.
-- Do not expose service role keys in the frontend.
