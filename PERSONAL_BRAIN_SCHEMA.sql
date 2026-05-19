-- Andrew Radar Brain personal knowledge schema.
-- RLS is enabled on every table. Add safe private-user policies before public use.

create extension if not exists pgcrypto;
create extension if not exists vector;

create table if not exists brain_conversations (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id text,
  chat_id text,
  input_type text,
  category text,
  message text,
  response text,
  file_id text,
  file_type text,
  created_at timestamptz default now()
);

alter table brain_conversations enable row level security;

create table if not exists youtube_channels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  yt_channel_id text,
  rss_url text,
  url text,
  category text,
  priority int default 3,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table youtube_channels enable row level security;

create table if not exists youtube_videos (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid references youtube_channels(id),
  yt_video_id text unique,
  channel_name text,
  title text not null,
  url text not null,
  transcript text,
  summary text,
  takeaways text[],
  action_items text[],
  category text,
  published_at timestamptz,
  ingested_at timestamptz default now()
);

alter table youtube_videos enable row level security;

create table if not exists youtube_video_chunks (
  id uuid primary key default gen_random_uuid(),
  video_id uuid references youtube_videos(id) on delete cascade,
  chunk_index int,
  content text not null,
  embedding vector(1536),
  created_at timestamptz default now()
);

alter table youtube_video_chunks enable row level security;

create table if not exists brain_queries (
  id uuid primary key default gen_random_uuid(),
  source text,
  query text,
  category text,
  answer text,
  matched_video_ids uuid[],
  created_at timestamptz default now()
);

alter table brain_queries enable row level security;

-- Correct table names used by the app:
-- brain_conversations
-- youtube_channels
-- youtube_videos
--
-- Do not create unsafe public policies.
-- Do not use a service role key in the frontend.
