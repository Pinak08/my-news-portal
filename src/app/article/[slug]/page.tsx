import { notFound } from "next/navigation";
import ArticleMedia from "@/components/ArticleMedia";
import ArticleReactions from "@/components/ArticleReactions";
import { getReactionCounts } from "@/lib/reactions";
import Link from "next/link";
import { getArticleBySlug, getArticlesByCategory, getAllArticles } from "@/lib/articles";
import { SmallCard } from "@/components/ArticleCard";
import SectionHeader from "@/components/SectionHeader";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl],
    },
  };
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const revalidate = 60;

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = (await getArticlesByCategory(article.categorySlug))
    .filter((a) => a.slug !== article.slug)
    .slice(0, 4);

  const reactionCounts = await getReactionCounts(article.id);

  // Falls back to your current Vercel URL if NEXT_PUBLIC_SITE_URL isn't set.
  // Once tv10gujarat.in (or any custom domain) is pointed at this project,
  // just set NEXT_PUBLIC_SITE_URL in Vercel's project settings and every
  // share link will use that instead — no code change needed.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://my-news-portal-gules.vercel.app";
  const articleUrl = `${siteUrl}/article/${article.slug}`;
  const whatsappText = encodeURIComponent(`${article.title}\n\n${articleUrl}`);
  const twitterText = encodeURIComponent(article.title);
  const encodedArticleUrl = encodeURIComponent(articleUrl);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ─── ARTICLE MAIN ─── */}
        <article className="lg:col-span-2">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-brand-blue transition-colors">હોમ</Link>
            <span>/</span>
            <Link href={`/category/${article.categorySlug}`} className="hover:text-brand-blue transition-colors">
              {article.category}
            </Link>
          </div>

          {/* Category badge */}
          <span className="inline-block bg-brand-blue text-white text-xs font-bold uppercase tracking-wider px-2 py-1 mb-3">
            {article.category}
          </span>

          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-4 font-serif">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-600 border-l-4 border-brand-blue pl-4 mb-5 italic">
            {article.excerpt}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-5 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold">
                {article.author.charAt(0)}
              </div>
              <span className="font-semibold text-gray-700">{article.author}</span>
            </div>
            <span>·</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-semibold text-gray-600">શેર કરો:</span>
            <a
              href={`https://wa.me/?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-green-500 text-white text-sm px-3 py-1.5 rounded hover:bg-green-600 transition-colors font-semibold"
            >
              📱 WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${twitterText}&url=${encodedArticleUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-sky-500 text-white text-sm px-3 py-1.5 rounded hover:bg-sky-600 transition-colors font-semibold"
            >
              𝕏 Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedArticleUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-blue-600 text-white text-sm px-3 py-1.5 rounded hover:bg-blue-700 transition-colors font-semibold"
            >
              Facebook
            </a>
          </div>

          {/* Images and videos, shown as separate sections */}
          <ArticleMedia
            title={article.title}
            imageUrls={article.imageUrls.length > 0 ? article.imageUrls : article.imageUrl ? [article.imageUrl] : []}
            videoUrls={article.videoUrls}
          />

          {/* Article body */}
          <div
            className="article-body text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Like / Dislike */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-600 mb-3">આ લેખ કેવો લાગ્યો?</p>
            <ArticleReactions
              articleId={article.id}
              initialLikes={reactionCounts.likes}
              initialDislikes={reactionCounts.dislikes}
            />
          </div>

          {/* Bottom share */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-600 mb-3">શું આ લેખ તમને ઉપયોગી લાગ્યો? શેર કરો:</p>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-green-500 text-white text-sm px-4 py-2 rounded hover:bg-green-600 transition-colors font-semibold"
              >
                📱 WhatsApp પર શેર કરો
              </a>
            </div>
          </div>

        </article>

        {/* ─── SIDEBAR ─── */}
        <aside className="space-y-6">

          {/* Related articles */}
          {related.length > 0 && (
            <div className="bg-white p-5 border border-gray-100 shadow-sm">
              <SectionHeader title="સંબંધિત સમાચાર" />
              {related.map((a) => (
                <SmallCard key={a.id} article={a} />
              ))}
            </div>
          )}

          {/* Ad placeholder */}
          <div className="bg-gray-200 text-gray-500 text-center py-12 rounded text-sm">
            જાહેરાત
          </div>

        </aside>

      </div>
    </div>
  );
}
