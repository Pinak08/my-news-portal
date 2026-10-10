import { notFound } from "next/navigation";
import ArticleMedia from "@/components/ArticleMedia";
import ArticleBody from "@/components/ArticleBody";
import { getActiveAds } from "@/lib/ads";
import AdBanner from "@/components/AdBanner";
import Link from "next/link";
import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { cloudinaryUrl } from "@/lib/cloudinary";
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
      images: article.imageUrl ? [cloudinaryUrl(article.imageUrl, 1200)] : ["/logo.jpg"],
    },
  };
}

// Build nothing at deploy time. Each article page is rendered on its first
// visit and then served from cache, so a deploy no longer re-renders (and
// re-fetches) the entire archive.
export async function generateStaticParams() {
  return [];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

// Articles rarely change, and every edit/delete refreshes the page instantly,
// so this is only a weekly safety net. Fewer rebuilds = fewer ISR writes.
export const revalidate = 604800;

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [related, ads] = await Promise.all([
    getRelatedArticles(article.categorySlug, article.slug),
    getActiveAds(),
  ]);

  // One ad query serves every slot. The sidebar gets a random ad and the
  // in-article slots carry on through the rest of the rotation.
  const start = ads.length > 0 ? Math.floor(Math.random() * ads.length) : 0;
  const rotated = [...ads.slice(start), ...ads.slice(0, start)];
  const ad = rotated[0] ?? null;
  const inArticleAds = [...rotated.slice(1), ...rotated.slice(0, 1)];

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
            <Link prefetch={false} href="/" className="hover:text-brand-blue transition-colors">હોમ</Link>
            <span>/</span>
            <Link prefetch={false} href={`/category/${article.categorySlug}`} className="hover:text-brand-blue transition-colors">
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
            imageUrls={article.imageUrls}
            youtubeUrl={article.videoUrl || undefined}
          />

          {/* Article body */}
          <ArticleBody content={article.content} ads={inArticleAds} />

          {/* Bottom share */}
          <div className="mt-8 pt-6 border-t border-gray-200">
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

          {/* Advertisement */}
          {ad ? (
            <AdBanner ad={ad} />
          ) : (
            <div className="bg-gray-200 text-gray-500 text-center py-12 rounded text-sm">
              જાહેરાત
            </div>
          )}

        </aside>

      </div>
    </div>
  );
}
