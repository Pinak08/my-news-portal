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
  videoUrl?: string; // YouTube link, a few dozen bytes; feeds the home video strip
};

// Everything the article page itself needs.
export type Article = ArticleSummary & {
  content: string;
  imageUrls: string[]; // up to 3 images
};

export type SearchResult = ArticleSummary & {
  snippet: string; // plain-text extract around the first match
};


const SUMMARY_COLUMNS =
  "id,slug,title,excerpt,category,category_slug,author,published_at,image_url,featured,breaking,video_url";
const ARTICLE_COLUMNS = `${SUMMARY_COLUMNS},content,image_urls`;

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
    videoUrl: (row.video_url as string) || undefined,
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
// Ticker-only items (no image) have no article page, so they 404 here.
export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const { data, error } = await supabasePublic
    .from("articles")
    .select(ARTICLE_COLUMNS)
    .eq("slug", slug)
    .neq("image_url", "")
    .maybeSingle();

  if (error) fail(`article "${slug}"`, error.message);
  return data ? mapArticle(data) : null;
});

// One page of a category, newest first. Fetches one extra row only to know
// whether a next page exists.
export async function getCategoryPage(
  categorySlug: string,
  page: number
): Promise<{ articles: ArticleSummary[]; hasMore: boolean }> {
  const from = (page - 1) * CATEGORY_PAGE_LIMIT;
  const { data, error } = await supabasePublic
    .from("articles")
    .select(SUMMARY_COLUMNS)
    .eq("category_slug", categorySlug)
    .neq("image_url", "")
    .order("published_at", { ascending: false })
    .range(from, from + CATEGORY_PAGE_LIMIT);

  if (error) fail(`category "${categorySlug}" page ${page}`, error.message);
  const rows = (data ?? []).map(mapSummary);
  return { articles: rows.slice(0, CATEGORY_PAGE_LIMIT), hasMore: rows.length > CATEGORY_PAGE_LIMIT };
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

function makeSnippet(text: string, words: string[], length = 160): string {
  const lower = text.toLowerCase();
  const hit = words.map((w) => lower.indexOf(w.toLowerCase())).filter((i) => i >= 0).sort((a, b) => a - b)[0];
  if (hit === undefined) return text.slice(0, length) + (text.length > length ? "…" : "");
  const start = Math.max(0, hit - 50);
  const end = Math.min(text.length, start + length);
  return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
}

// Every word typed must appear in the title, summary or body. Results whose
// title contains all the words come first, then newest first. The body is
// matched inside the database but never downloaded, so a search costs no
// more than a list of cards; the snippet comes from the summary.
export async function searchArticles(query: string, categorySlug?: string): Promise<SearchResult[]> {
  // Comma/parentheses have special meaning in PostgREST's .or() filter syntax.
  const words = query
    .replace(/[,()%*]/g, " ")
    .trim()
    .slice(0, 100)
    .split(/\s+/)
    .filter((w) => w.length >= 2)
    .slice(0, 5);
  if (words.length === 0) return [];

  let q = supabasePublic
    .from("articles")
    .select(SUMMARY_COLUMNS)
    .neq("image_url", "");
  for (const w of words) {
    q = q.or(`title.ilike.%${w}%,excerpt.ilike.%${w}%,content.ilike.%${w}%`);
  }
  if (categorySlug) q = q.eq("category_slug", categorySlug);

  const { data, error } = await q.order("published_at", { ascending: false }).limit(SEARCH_LIMIT);
  if (error) fail("search results", error.message);

  const titleHasAll = (t: string) => words.every((w) => t.toLowerCase().includes(w.toLowerCase()));
  return (data ?? [])
    .map((row) => {
      const summary = mapSummary(row);
      return { ...summary, snippet: summary.excerpt ? makeSnippet(summary.excerpt, words) : "" };
    })
    .sort((a, b) => Number(titleHasAll(b.title)) - Number(titleHasAll(a.title)));
}

