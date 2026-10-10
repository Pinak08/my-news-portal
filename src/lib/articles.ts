import { cache } from "react";
import "server-only";
import { supabasePublic } from "@/lib/supabase";

// What cards, lists, the ticker and search need. Deliberately excludes
// `content` (the full article HTML), which is by far the largest column —
// fetching it for every list was what exhausted the Supabase egress quota.
export type ArticleSummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  author: string;
  publishedAt: string;
  imageUrl: string; // cover image, always = imageUrls[0]
  featured: boolean;
  breaking: boolean;
};

// Everything the article page itself needs.
export type Article = ArticleSummary & {
  content: string;
  imageUrls: string[]; // up to 3 images
  videoUrl?: string; // YouTube link
};


const SUMMARY_COLUMNS =
  "id,slug,title,excerpt,category,category_slug,author,published_at,image_url,featured,breaking";
const ARTICLE_COLUMNS = `${SUMMARY_COLUMNS},content,image_urls,video_url`;

// The home page is built from the most recent articles only. At 2–3 articles
// a day this covers roughly a month, which is plenty for every home section.
const HOME_PAGE_WINDOW = 80;
const CATEGORY_PAGE_LIMIT = 30;
const SEARCH_LIMIT = 20;

// Errors are thrown, never swallowed. When a page rebuild throws, Next.js keeps
// serving the last good cached copy, so a Supabase outage leaves the site up
// with real articles instead of rendering an empty or wrong page.
function fail(what: string, message: string): never {
  throw new Error(`Supabase: failed to load ${what}: ${message}`);
}

function mapSummary(row: Record<string, unknown>): ArticleSummary {
  return {
    id: row.id as number,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: (row.excerpt as string) || "",
    category: row.category as string,
    categorySlug: row.category_slug as string,
    author: (row.author as string) || "",
    publishedAt: row.published_at as string,
    imageUrl: (row.image_url as string) || "",
    featured: !!row.featured,
    breaking: !!row.breaking,
  };
}

function mapArticle(row: Record<string, unknown>): Article {
  const summary = mapSummary(row);
  const rawImageUrls = row.image_urls;
  const imageUrls =
    Array.isArray(rawImageUrls) && rawImageUrls.length > 0
      ? (rawImageUrls as string[])
      : summary.imageUrl
      ? [summary.imageUrl]
      : [];

  return {
    ...summary,
    imageUrl: summary.imageUrl || imageUrls[0] || "",
    content: (row.content as string) || "",
    imageUrls,
    videoUrl: (row.video_url as string) || undefined,
  };
}

// Newest articles, including ticker-only breaking items that have no image.
// The home page derives every section from this one query.
export const getHomePageArticles = cache(async (): Promise<ArticleSummary[]> => {
  const { data, error } = await supabasePublic
    .from("articles")
    .select(SUMMARY_COLUMNS)
    .order("published_at", { ascending: false })
    .limit(HOME_PAGE_WINDOW);

  if (error) fail("home page articles", error.message);
  return (data ?? []).map(mapSummary);
});

// cache() lets generateMetadata and the page share one query per render.
export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const { data, error } = await supabasePublic
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) fail(`article "${slug}"`, error.message);
  return data ? mapArticle(data) : null;
});

export async function getArticlesByCategory(
  categorySlug: string,
  limit = CATEGORY_PAGE_LIMIT
): Promise<ArticleSummary[]> {
  const { data, error } = await supabasePublic
    .from("articles")
    .select(SUMMARY_COLUMNS)
    .eq("category_slug", categorySlug)
    .neq("image_url", "")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) fail(`category "${categorySlug}"`, error.message);
  return (data ?? []).map(mapSummary);
}

export async function getRelatedArticles(
  categorySlug: string,
  excludeSlug: string,
  limit = 4
): Promise<ArticleSummary[]> {
  const { data, error } = await supabasePublic
    .from("articles")
    .select(SUMMARY_COLUMNS)
    .eq("category_slug", categorySlug)
    .neq("slug", excludeSlug)
    .neq("image_url", "")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) fail(`related articles for "${excludeSlug}"`, error.message);
  return (data ?? []).map(mapSummary);
}

export async function searchArticles(query: string): Promise<ArticleSummary[]> {
  // Comma/parentheses have special meaning in PostgREST's .or() filter syntax.
  const safeQ = query.replace(/[,()]/g, " ").trim().slice(0, 100);
  if (safeQ.length < 2) return [];

  // Matching on content happens inside the database; only the matching rows'
  // summary columns come back, so searching the body costs no extra egress.
  const { data, error } = await supabasePublic
    .from("articles")
    .select(SUMMARY_COLUMNS)
    .neq("image_url", "")
    .or(`title.ilike.%${safeQ}%,excerpt.ilike.%${safeQ}%,content.ilike.%${safeQ}%`)
    .order("published_at", { ascending: false })
    .limit(SEARCH_LIMIT);

  if (error) fail("search results", error.message);
  return (data ?? []).map(mapSummary);
}
