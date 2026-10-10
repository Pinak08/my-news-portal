import Link from "next/link";
import { ArticleCard, FeaturedCard } from "@/components/ArticleCard";
import type { ArticleSummary } from "@/lib/articles";

interface Props {
  slug: string;
  name: string;
  page: number;
  articles: ArticleSummary[];
  hasMore: boolean;
}

function pageHref(slug: string, page: number) {
  return page <= 1 ? `/category/${slug}` : `/category/${slug}/page/${page}`;
}

// Shared by /category/[slug] (page 1) and /category/[slug]/page/[n].
export default function CategoryListing({ slug, name, page, articles, hasMore }: Props) {
  // Page 1 leads with a featured story and two beside it; later pages are a plain grid.
  const lead = page === 1 ? articles.slice(0, 3) : [];
  const rest = page === 1 ? articles.slice(3) : articles;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="border-b-4 border-brand-blue pb-3 mb-6 flex items-end justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">{name}</h1>
        {page > 1 && <span className="text-sm text-gray-500">પાનું {page}</span>}
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-2xl mb-2">હજુ કોઈ લેખ નથી</p>
          <p className="text-sm">નવીનતમ {name} સમાચાર માટે ટૂંક સમયમાં ફરી તપાસો.</p>
        </div>
      ) : (
        <>
          {lead.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <FeaturedCard article={lead[0]} priority />
              </div>
              {lead.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                  {lead.slice(1).map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              )}
            </div>
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}

          {(page > 1 || hasMore) && (
            <nav className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
              {page > 1 ? (
                <Link prefetch={false} href={pageHref(slug, page - 1)} className="text-sm font-semibold text-brand-blue hover:text-brand-navy">
                  ← નવા સમાચાર
                </Link>
              ) : (
                <span />
              )}
              {hasMore && (
                <Link
                  prefetch={false}
                  href={pageHref(slug, page + 1)}
                  className="bg-brand-blue text-white text-sm font-semibold px-5 py-2.5 rounded hover:bg-brand-navy transition-colors"
                >
                  જૂના સમાચાર →
                </Link>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
