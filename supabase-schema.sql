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

-- ─── Likes / Dislikes ───
-- One row per (article, visitor). visitor_id is a random ID generated in the
-- visitor's browser (stored in localStorage) — there's no login system on
-- the public site, so this is what lets someone change/undo their own vote
-- and stops a single page reload from double-counting, without requiring
-- accounts. It's not bulletproof against someone clearing localStorage to
-- vote again, but it's the standard lightweight approach for a site like
-- this with no user accounts.
create table if not exists article_reactions (
  id bigint generated always as identity primary key,
  article_id bigint not null references articles(id) on delete cascade,
  visitor_id text not null,
  reaction text not null check (reaction in ('like', 'dislike')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (article_id, visitor_id)
);

create index if not exists article_reactions_article_id_idx on article_reactions (article_id);

-- Locked down: no RLS policies at all, so the anon key (used by the public
-- site directly) cannot read or write this table. All access goes through
-- our own /api/articles/[id]/reactions route, which uses the service role
-- key on the server and validates the reaction value itself.
alter table article_reactions enable row level security;
