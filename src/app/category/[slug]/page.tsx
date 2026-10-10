import { notFound } from "next/navigation";
import { getCategoryPage } from "@/lib/articles";
import { getCategoryName, isKnownCategory, categories } from "@/lib/categories";
import CategoryListing from "@/components/CategoryListing";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = getCategoryName(slug);
  return {
    title: `${name} News`,
    description: `TV10 Gujarat પરથી નવીનતમ ${name} સમાચાર.`,
  };
}

export async function generateStaticParams() {
  return categories
    .filter((c) => c.slug !== "/")
    .map((c) => ({ slug: c.slug }));
}

export const revalidate = 86400; // 24 hrs safety net — publish/edit/delete refresh this page instantly
// Only the categories above exist; any other /category/... URL is a plain 404
// instead of a fresh render and cache write for every bot-guessed URL.
export const dynamicParams = false;

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  if (!isKnownCategory(slug)) notFound();

  const { articles, hasMore } = await getCategoryPage(slug, 1);
  return (
    <CategoryListing slug={slug} name={getCategoryName(slug)} page={1} articles={articles} hasMore={hasMore} />
  );
}
