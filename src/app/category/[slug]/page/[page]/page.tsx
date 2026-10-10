import { notFound } from "next/navigation";
import { getCategoryPage } from "@/lib/articles";
import { getCategoryName, isKnownCategory } from "@/lib/categories";
import CategoryListing from "@/components/CategoryListing";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; page: string }>;
}

// Older pages are rarely visited, so none are built at deploy time; each is
// rendered on its first visit and then served from cache like the rest.
export async function generateStaticParams() {
  return [];
}

export const revalidate = 86400;

const MAX_PAGE = 100;

function parsePage(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 2 && n <= MAX_PAGE ? n : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, page } = await params;
  const name = getCategoryName(slug);
  return { title: `${name} News – પાનું ${page}` };
}

export default async function CategoryPageN({ params }: Props) {
  const { slug, page: raw } = await params;
  const page = parsePage(raw);
  if (!isKnownCategory(slug) || page === null) notFound();

  const { articles, hasMore } = await getCategoryPage(slug, page);
  if (articles.length === 0) notFound();

  return <CategoryListing slug={slug} name={getCategoryName(slug)} page={page} articles={articles} hasMore={hasMore} />;
}
