-- Future captures table for Andrew Radar Brain.
-- RLS is enabled. Add private-user policies before using this publicly.

create extension if not exists pgcrypto;

create table if not exists captures (
  id uuid primary key default gen_random_uuid(),
  category text,
  intent text,
  raw_input text,
  summary text,
  response text,
  priority int,
  source_type text,
  created_at timestamptz default now()
);

alter table captures enable row level security;

-- Do not create unsafe public policies.
-- Do not use a Supabase service role key in the frontend.
