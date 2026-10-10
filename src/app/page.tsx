import { getHomePageArticles, type ArticleSummary } from "@/lib/articles";
import { getRandomActiveAd } from "@/lib/ads";
import { categories } from "@/lib/categories";
import { extractYouTubeId } from "@/lib/youtube";
import { FeaturedCard, ArticleCard, SmallCard, VideoCard } from "@/components/ArticleCard";
import BreakingTicker from "@/components/BreakingTicker";
import SectionHeader from "@/components/SectionHeader";
import AdBanner from "@/components/AdBanner";

export const revalidate = 86400; // 24 hrs safety net — publish/edit/delete refresh this page instantly

function CategoryBlock({ name, slug, articles }: { name: string; slug: string; articles: ArticleSummary[] }) {
  const [lead, ...rest] = articles;
  return (
    <section className="bg-white p-5 border border-gray-100 shadow-sm rounded-lg">
      <SectionHeader title={name} href={`/category/${slug}`} />
      <div className="mb-2">
        <FeaturedCard article={lead} />
      </div>
      {rest.map((a) => (
        <SmallCard key={a.id} article={a} />
      ))}
    </section>
  );
}

export default async function HomePage() {
  // One small query feeds every section below.
  const [recent, ad] = await Promise.all([getHomePageArticles(), getRandomActiveAd()]);

  // Ticker-only breaking items have no image; every other section needs one.
  // The ticker is a client component, so pass it only what it renders.
  const breakingNews = recent
    .filter((a) => a.breaking)
    .map(({ slug, title, imageUrl }) => ({ slug, title, hasPage: !!imageUrl }));
  const withImage = recent.filter((a) => a.imageUrl);

  const featured = withImage.find((a) => a.featured) ?? withImage[0];
  const others = withImage.filter((a) => a.slug !== featured?.slug);
  const latestList = others.slice(0, 5); // sidebar beside the hero
  const topGrid = others.slice(5, 9); // the next four, so nothing repeats

  const videos = withImage.filter((a) => extractYouTubeId(a.videoUrl)).slice(0, 4);

  const categoryBlocks = categories
    .filter((c) => c.slug !== "/")
    .map((c) => ({
      ...c,
      articles: others.filter((a) => a.categorySlug === c.slug).slice(0, 4),
    }))
    .filter((c) => c.articles.length > 0);

  return (
    <div>
      {breakingNews.length > 0 && <BreakingTicker articles={breakingNews} />}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!featured ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-2xl mb-2">હજુ કોઈ લેખ નથી</p>
          </div>
        ) : (
          <>
            {/* ─── HERO ─── */}
            <div className={`grid grid-cols-1 ${latestList.length > 0 ? "lg:grid-cols-3" : ""} gap-6 mb-10`}>
              <div className={latestList.length > 0 ? "lg:col-span-2" : ""}>
                <FeaturedCard article={featured} priority />
              </div>
              {latestList.length > 0 && (
                <aside className="bg-white p-4 border border-gray-100 shadow-sm rounded-lg">
                  <SectionHeader title="તાજા સમાચાર" />
                  {latestList.map((a) => (
                    <SmallCard key={a.id} article={a} />
                  ))}
                </aside>
              )}
            </div>

            {/* ─── TOP STORIES ─── */}
            {topGrid.length > 0 && (
              <section className="mb-10">
                <SectionHeader title="મુખ્ય સમાચાર" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {topGrid.map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
                </div>
              </section>
            )}

            {ad && (
              <div className="mb-10 max-w-3xl mx-auto">
                <AdBanner ad={ad} compact />
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── VIDEO STRIP ─── */}
      {videos.length >= 2 && (
        <section className="bg-brand-navy py-8 mb-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-1.5 h-6 bg-red-600 rounded-full" />
              <h2 className="text-lg font-bold text-white font-serif">વિડિઓ સમાચાર</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x lg:grid lg:grid-cols-4 lg:overflow-visible">
              {videos.map((a) => (
                <div key={a.id} className="w-64 flex-shrink-0 snap-start lg:w-auto">
                  <VideoCard article={a} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CATEGORY SECTIONS ─── */}
      {categoryBlocks.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {categoryBlocks.map((c) => (
              <CategoryBlock key={c.slug} name={c.name} slug={c.slug} articles={c.articles} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
