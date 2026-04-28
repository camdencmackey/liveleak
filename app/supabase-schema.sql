-- supabase-schema.sql
-- Run this once in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  youtube_url text not null,
  youtube_id text not null,
  rating_tag text default 'MA',
  mini_tag text default 'HD',
  category text default 'Videos',
  author text default 'liveleak',
  views integer default 0,
  likes integer default 0,
  shares integer default 0,
  published boolean default true,
  created_at timestamptz default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references videos(id) on delete cascade,
  display_name text not null,
  body text not null,
  created_at timestamptz default now()
);

create index if not exists videos_created_at_idx on videos(created_at desc);
create index if not exists comments_video_id_idx on comments(video_id);