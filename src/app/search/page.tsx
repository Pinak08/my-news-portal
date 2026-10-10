import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getHomePageArticles, searchArticles, type SearchResult } from "@/lib/articles";
import { categories, getCategoryName, isKnownCategory } from "@/lib/categories";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { SmallCard } from "@/components/ArticleCard";
import SectionHeader from "@/components/SectionHeader";
import TimeAgo from "@/components/TimeAgo";

interface Props {
  searchParams: Promise<{ q?: string; cat?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" માટે શોધ પરિણામો` : "શોધો",
    robots: { index: false },
  };
}

// Wraps every typed word in <mark>. Text is split into React nodes, never
// injected as HTML, so a search can't inject markup into the page.
function Highlight({ text, words }: { text: string; words: string[] }) {
  if (words.length === 0) return <>{text}</>;
  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-amber-100 text-gray-900 rounded px-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function ResultRow({ article, words }: { article: SearchResult; words: string[] }) {
  return (
    <Link
      prefetch={false}
      href={`/article/${article.slug}`}
      className="group flex gap-4 py-5 border-b border-gray-100 last:border-0"
    >
      <div className="relative w-28 h-20 sm:w-44 sm:h-28 flex-shrink-0 overflow-hidden bg-gray-200 rounded-lg">
        <Image
          src={cloudinaryUrl(article.imageUrl, 400)}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs mb-1">
          <span className="text-brand-blue font-bold">{article.category}</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-400">
            <TimeAgo date={article.publishedAt} />
          </span>
        </div>
        <h2 className="font-bold text-gray-900 leading-snug font-serif text-base sm:text-lg line-clamp-2 group-hover:text-brand-blue transition-colors">
          <Highlight text={article.title} words={words} />
        </h2>
        {article.snippet && (
          <p className="hidden sm:block text-sm text-gray-500 mt-1.5 line-clamp-2">
            <Highlight text={article.snippet} words={words} />
          </p>
        )}
      </div>
    </Link>
  );
}

function chipHref(q: string, cat?: string) {
  const params = new URLSearchParams({ q });
  if (cat) params.set("cat", cat);
  return `/search?${params.toString()}`;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "", cat = "" } = await searchParams;
  const query = q.trim().slice(0, 100);
  const category = isKnownCategory(cat) ? cat : "";
  const words = query.split(/\s+/).filter((w) => w.length >= 2).slice(0, 5);

  const results = words.length > 0 ? await searchArticles(query, category || undefined) : [];
  // Only when nothing matched: suggest the latest news (one small query).
  const suggestions = words.length > 0 && results.length === 0 ? (await getHomePageArticles()).filter((a) => a.imageUrl).slice(0, 6) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <form action="/search" method="GET" className="mb-6">
        <div className="flex items-stretch bg-white border-2 border-brand-blue rounded-lg overflow-hidden shadow-sm focus-within:shadow-md transition-shadow">
          <input
            type="search"
            name="q"
            defaultValue={query}
            autoFocus={!query}
            placeholder="સમાચાર શોધો… (દા.ત. અમદાવાદ, ક્રિકેટ, મેયર)"
            className="flex-1 px-4 py-3 text-base outline-none min-w-0"
          />
          {category && <input type="hidden" name="cat" value={category} />}
          <button type="submit" className="bg-brand-blue text-white px-5 sm:px-8 font-semibold hover:bg-brand-navy transition-colors">
            શોધો
          </button>
        </div>
      </form>

      {query && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <Link
            prefetch={false}
            href={chipHref(query)}
            className={`whitespace-nowrap text-sm px-3 py-1.5 rounded-full border transition-colors ${
              !category ? "bg-brand-blue text-white border-brand-blue" : "bg-white text-gray-700 border-gray-300 hover:border-brand-blue"
            }`}
          >
            બધા
          </Link>
          {categories
            .filter((c) => c.slug !== "/")
            .map((c) => (
              <Link
                key={c.slug}
                prefetch={false}
                href={chipHref(query, c.slug)}
                className={`whitespace-nowrap text-sm px-3 py-1.5 rounded-full border transition-colors ${
                  category === c.slug
                    ? "bg-brand-blue text-white border-brand-blue"
                    : "bg-white text-gray-700 border-gray-300 hover:border-brand-blue"
                }`}
              >
                {c.name}
              </Link>
            ))}
        </div>
      )}

      {!query ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-xl mb-2">શોધવા માટે ઉપર કંઈક ટાઈપ કરો</p>
          <p className="text-sm">શીર્ષક, સારાંશ અને આખા લેખમાં શોધ થાય છે.</p>
        </div>
      ) : words.length === 0 ? (
        <p className="text-center py-16 text-gray-400">ઓછામાં ઓછા 2 અક્ષર લખો.</p>
      ) : results.length === 0 ? (
        <div>
          <div className="text-center py-10 text-gray-500">
            <p className="text-xl mb-2">
              &ldquo;{query}&rdquo;{category && ` (${getCategoryName(category)})`} માટે કોઈ પરિણામ મળ્યું નથી
            </p>
            <p className="text-sm text-gray-400">ઓછા અથવા બીજા શબ્દોથી ફરી પ્રયાસ કરો.</p>
          </div>
          {suggestions.length > 0 && (
            <section className="bg-white p-5 border border-gray-100 shadow-sm rounded-lg">
              <SectionHeader title="તાજા સમાચાર" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {suggestions.map((a) => (
                  <SmallCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-2">
            &ldquo;{query}&rdquo; માટે {results.length}
            {results.length === 20 ? "+" : ""} પરિણામ
            {category && ` · ${getCategoryName(category)}`}
          </p>
          <div className="bg-white px-4 sm:px-6 border border-gray-100 shadow-sm rounded-lg">
            {results.map((a) => (
              <ResultRow key={a.id} article={a} words={words} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
