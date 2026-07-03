import { getFeaturedArticle, getLatestArticles, getArticlesByCategory, getBreakingNews } from "@/lib/articles";
import { FeaturedCard, ArticleCard, SmallCard } from "@/components/ArticleCard";
import BreakingTicker from "@/components/BreakingTicker";
import SectionHeader from "@/components/SectionHeader";

export default function HomePage() {
  const featured = getFeaturedArticle();
  const latest = getLatestArticles(8);
  const breakingNews = getBreakingNews();
  const politics = getArticlesByCategory("politics").slice(0, 4);
  const business = getArticlesByCategory("business").slice(0, 4);
  const sports = getArticlesByCategory("sports").slice(0, 3);
  const entertainment = getArticlesByCategory("entertainment").slice(0, 3);

  // Latest articles excluding featured
  const latestExFeatured = latest.filter((a) => a.slug !== featured.slug).slice(0, 5);

  return (
    <div>
      {/* Breaking news ticker */}
      {breakingNews.length > 0 && <BreakingTicker articles={breakingNews} />}

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ─── HERO SECTION ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Big featured story */}
          <div className="lg:col-span-2">
            <FeaturedCard article={featured} />
          </div>

          {/* Sidebar: latest articles */}
          <div className="bg-white p-4 border border-gray-100 shadow-sm">
            <SectionHeader title="Latest News" href="/category/politics" />
            <div>
              {latestExFeatured.map((article) => (
                <SmallCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </div>

        {/* ─── LATEST NEWS GRID ─── */}
        <section className="mb-10">
          <SectionHeader title="Top Stories" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.filter((a) => a.slug !== featured.slug).slice(0, 4).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        {/* ─── POLITICS + BUSINESS SIDE BY SIDE ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* Politics */}
          <section className="bg-white p-5 border border-gray-100 shadow-sm">
            <SectionHeader title="Politics" href="/category/politics" />
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

          {/* Business */}
          <section className="bg-white p-5 border border-gray-100 shadow-sm">
            <SectionHeader title="Business" href="/category/business" />
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

        </div>

        {/* ─── SPORTS + ENTERTAINMENT ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* Sports */}
          <section>
            <SectionHeader title="Sports" href="/category/sports" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sports.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>

          {/* Entertainment */}
          <section>
            <SectionHeader title="Entertainment" href="/category/entertainment" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {entertainment.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>

        </div>

        {/* ─── AD PLACEHOLDER ─── */}
        <div className="bg-gray-200 text-gray-500 text-center py-6 rounded text-sm mb-10">
          Advertisement Space
        </div>

      </div>
    </div>
  );
}
