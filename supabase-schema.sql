-- Run this once in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New Query → paste this → Run)

create table if not exists articles (
  id bigint generated always as identity primary key,
  slug text unique not null,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  category text not null,
  category_slug text not null,
  author text not null default '',
  published_at timestamptz not null default now(),
  image_url text not null default '',
  video_url text, -- nullable: not every article has a video
  featured boolean not null default false,
  breaking boolean not null default false
);

-- Row Level Security: the public site can only READ articles.
-- All writes go through the /api/admin/* routes, which use the
-- service role key (bypasses RLS) after checking the admin password.
alter table articles enable row level security;

create policy "Public can read articles"
  on articles for select
  using (true);
