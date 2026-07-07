import { getFeaturedArticle, getLatestArticles, getArticlesByCategory, getBreakingNews } from "@/lib/articles";
import { getRandomActiveAd } from "@/lib/ads";
import { FeaturedCard, ArticleCard, SmallCard } from "@/components/ArticleCard";
import BreakingTicker from "@/components/BreakingTicker";
import SectionHeader from "@/components/SectionHeader";
import AdBanner from "@/components/AdBanner";

export const revalidate = 60; // refresh homepage from the database every 60 seconds

export default async function HomePage() {
  const featured = await getFeaturedArticle();
  const latest = await getLatestArticles(8);
  const breakingNews = await getBreakingNews();
  const politics = (await getArticlesByCategory("politics")).slice(0, 4);
  const business = (await getArticlesByCategory("business")).slice(0, 4);
  const sports = (await getArticlesByCategory("sports")).slice(0, 3);
  const entertainment = (await getArticlesByCategory("entertainment")).slice(0, 3);
  const ad = await getRandomActiveAd();

  // Latest articles excluding featured
  const latestExFeatured = latest.filter((a) => a.slug !== featured.slug).slice(0, 5);
  const latestGrid = latest.filter((a) => a.slug !== featured.slug).slice(0, 4);
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
            <FeaturedCard article={featured} />
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
