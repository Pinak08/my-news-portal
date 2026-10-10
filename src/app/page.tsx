import { getHomePageArticles, type ArticleSummary } from "@/lib/articles";
import { getRandomActiveAd } from "@/lib/ads";
import { FeaturedCard, ArticleCard, SmallCard } from "@/components/ArticleCard";
import BreakingTicker from "@/components/BreakingTicker";
import SectionHeader from "@/components/SectionHeader";
import AdBanner from "@/components/AdBanner";

export const revalidate = 86400; // 24 hrs safety net — publish/edit/delete refresh this page instantly

export default async function HomePage() {
  // One small query feeds every section below.
  const [recent, ad] = await Promise.all([getHomePageArticles(), getRandomActiveAd()]);

  // Ticker-only breaking items have no image; every other section needs one.
  // The ticker is a client component, so pass it only what it renders.
  const breakingNews = recent
    .filter((a) => a.breaking)
    .map(({ slug, title, imageUrl }) => ({ slug, title, hasPage: !!imageUrl }));
  const withImage = recent.filter((a) => a.imageUrl);
  const inCategory = (slug: string, n: number): ArticleSummary[] =>
    withImage.filter((a) => a.categorySlug === slug).slice(0, n);

  const featured = withImage.find((a) => a.featured) ?? withImage[0];
  const politics = inCategory("politics", 4);
  const business = inCategory("business", 4);
  const sports = inCategory("sports", 3);
  const entertainment = inCategory("entertainment", 3);

  // Latest articles excluding featured
  const others = withImage.filter((a) => a.slug !== featured?.slug);
  const latestExFeatured = others.slice(0, 5);
  const latestGrid = others.slice(0, 4);
  const hasSidebar = latestExFeatured.length > 0;
  const hasPoliticsOrBusiness = politics.length > 0 || business.length > 0;
  const hasSportsOrEntertainment = sports.length > 0 || entertainment.length > 0;

  return (
    <div>
      {/* Breaking news ticker */}
      {breakingNews.length > 0 && <BreakingTicker articles={breakingNews} />}

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ─── HERO SECTION ─── */}
        <div className={`grid grid-cols-1 ${hasSidebar ? "lg:grid-cols-3" : ""} gap-6 mb-10`}>
          {/* Big featured story */}
          <div className={hasSidebar ? "lg:col-span-2" : ""}>
            {featured ? (
              <FeaturedCard article={featured} />
            ) : (
              <div className="text-center py-20 text-gray-400">
                <p className="text-2xl mb-2">હજુ કોઈ લેખ નથી</p>
              </div>
            )}
          </div>

          {/* Sidebar: latest articles — only shown once there's more than one article */}
          {hasSidebar && (
            <div className="bg-white p-4 border border-gray-100 shadow-sm">
              <SectionHeader title="તાજા સમાચાર" href="/category/politics" />
              <div>
                {latestExFeatured.map((article) => (
                  <SmallCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ─── LATEST NEWS GRID ─── */}
        {latestGrid.length > 0 && (
          <section className="mb-10">
            <SectionHeader title="મુખ્ય સમાચાર" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestGrid.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}

        {/* ─── POLITICS + BUSINESS SIDE BY SIDE ─── */}
        {hasPoliticsOrBusiness && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

            {/* Politics */}
            {politics.length > 0 && (
              <section className="bg-white p-5 border border-gray-100 shadow-sm">
                <SectionHeader title="રાજકારણ" href="/category/politics" />
                {politics[0] && (
                  <div className="mb-4">
                    <FeaturedCard article={politics[0]} />
                  </div>
                )}
                <div>
                  {politics.slice(1).map((article) => (
                    <SmallCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* Business */}
            {business.length > 0 && (
              <section className="bg-white p-5 border border-gray-100 shadow-sm">
                <SectionHeader title="વ્યાપાર" href="/category/business" />
                {business[0] && (
                  <div className="mb-4">
                    <FeaturedCard article={business[0]} />
                  </div>
                )}
                <div>
                  {business.slice(1).map((article) => (
                    <SmallCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

        {/* ─── SPORTS + ENTERTAINMENT ─── */}
        {hasSportsOrEntertainment && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

            {/* Sports */}
            {sports.length > 0 && (
              <section>
                <SectionHeader title="રમતગમત" href="/category/sports" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sports.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* Entertainment */}
            {entertainment.length > 0 && (
              <section>
                <SectionHeader title="મનોરંજન" href="/category/entertainment" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {entertainment.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

        {/* ─── AD SLOT ─── */}
        <div className="mb-10">
          {ad ? (
            <AdBanner ad={ad} />
          ) : (
            <div className="bg-gray-200 text-gray-500 text-center py-6 rounded text-sm">
              જાહેરાત સ્થળ
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
