import { searchArticles } from "@/lib/articles";
import { ArticleCard } from "@/components/ArticleCard";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" માટે શોધ પરિણામો` : "શોધો",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query ? await searchArticles(query) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="border-b-4 border-brand-blue pb-3 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">
          {query ? `"${query}" માટે શોધ પરિણામો` : "શોધો"}
        </h1>
        {query && (
          <p className="text-sm text-gray-500 mt-1">{results.length} લેખ મળ્યા</p>
        )}
      </div>

      {!query ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-2xl mb-2">શોધવા માટે ઉપર કંઈક ટાઈપ કરો</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-2xl mb-2">કોઈ પરિણામ મળ્યું નથી</p>
          <p className="text-sm">બીજા શબ્દોથી ફરી પ્રયાસ કરો.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
