import { notFound } from "next/navigation";
import { getArticlesByCategory, getCategoryName, categories } from "@/lib/articles";
import { ArticleCard, FeaturedCard } from "@/components/ArticleCard";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = getCategoryName(slug);
  return {
    title: `${name} News`,
    description: `Latest ${name} news from The Daily Report.`,
  };
}

export async function generateStaticParams() {
  return categories
    .filter((c) => c.slug !== "/")
    .map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const articles = getArticlesByCategory(slug);
  const categoryName = getCategoryName(slug);

  if (!articles && !categoryName) notFound();

  const [featured, ...rest] = articles;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Category header */}
      <div className="border-b-4 border-brand-red pb-3 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">{categoryName}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {articles.length} article{articles.length !== 1 ? "s" : ""}
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-2xl mb-2">No articles yet</p>
          <p className="text-sm">Check back soon for the latest {categoryName} news.</p>
        </div>
      ) : (
        <>
          {/* Featured article */}
          {featured && (
            <div className="mb-8">
              <FeaturedCard article={featured} />
            </div>
          )}

          {/* Rest of articles */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </>
      )}

    </div>
  );
}
