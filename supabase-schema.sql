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
  image_url text not null default '', -- kept for backward compatibility: always mirrors image_urls[0]
  video_url text, -- kept for backward compatibility: always mirrors video_urls[0]
  image_urls jsonb not null default '[]', -- up to 3 image URLs, admin can upload 1-3
  video_urls jsonb not null default '[]', -- up to 3 video URLs, admin can upload 1-3
  featured boolean not null default false,
  breaking boolean not null default false
);

-- If you already created this table before, run these two lines once in the
-- Supabase SQL editor to add the new multi-image/multi-video columns without
-- losing any existing articles:
-- alter table articles add column if not exists image_urls jsonb not null default '[]';
-- alter table articles add column if not exists video_urls jsonb not null default '[]';
-- update articles set image_urls = jsonb_build_array(image_url) where image_url is not null and image_url != '' and (image_urls is null or image_urls = '[]'::jsonb);
-- update articles set video_urls = jsonb_build_array(video_url) where video_url is not null and video_url != '' and (video_urls is null or video_urls = '[]'::jsonb);

-- Row Level Security: the public site can only READ articles.
-- All writes go through the /api/admin/* routes, which use the
-- service role key (bypasses RLS) after checking the admin password.
alter table articles enable row level security;

create policy "Public can read articles"
  on articles for select
  using (true);
