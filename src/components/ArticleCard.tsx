import Link from "next/link";
import Image from "next/image";
import type { ArticleSummary } from "@/lib/articles";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { extractYouTubeId } from "@/lib/youtube";
import TimeAgo from "@/components/TimeAgo";

// Author and time; the author and its separator are left out when empty.
function Byline({ article, className }: { article: ArticleSummary; className: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {article.author && (
        <>
          <span className="truncate">{article.author}</span>
          <span>·</span>
        </>
      )}
      <TimeAgo date={article.publishedAt} />
    </div>
  );
}

// Large horizontal card — for featured/hero. `priority` loads the photo first
// when the card is the first thing on screen.
export function FeaturedCard({ article, priority = false }: { article: ArticleSummary; priority?: boolean }) {
  return (
    <Link prefetch={false} href={`/article/${article.slug}`} className="group block">
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-200 rounded-xl shadow-md">
        <Image
          src={cloudinaryUrl(article.imageUrl, 1200)}
          alt={article.title}
          fill
          priority={priority}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="inline-block bg-brand-blue text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 mb-2 rounded-full">
            {article.category}
          </span>
          <h2 className="text-white text-xl md:text-2xl font-bold leading-snug font-serif group-hover:text-gray-200 transition-colors line-clamp-3">
            {article.title}
          </h2>
          {article.excerpt && <p className="text-gray-300 text-sm mt-1 line-clamp-2">{article.excerpt}</p>}
          <Byline article={article} className="mt-2 text-gray-400 text-xs" />
        </div>
      </div>
    </Link>
  );
}

// Medium card — image top, text below
export function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <Link prefetch={false} href={`/article/${article.slug}`} className="group block">
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-200 mb-3 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
        <Image
          src={cloudinaryUrl(article.imageUrl, 640)}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <span className="inline-block text-brand-blue text-[11px] font-bold uppercase tracking-wider mb-1">
        {article.category}
      </span>
      <h3 className="font-bold text-gray-900 leading-snug group-hover:text-brand-blue transition-colors font-serif text-base line-clamp-3">
        {article.title}
      </h3>
      {article.excerpt && <p className="text-gray-500 text-sm mt-1 line-clamp-2">{article.excerpt}</p>}
      <Byline article={article} className="mt-2 text-gray-400 text-xs" />
    </Link>
  );
}

// Small horizontal card — for sidebar lists
export function SmallCard({ article }: { article: ArticleSummary }) {
  return (
    <Link prefetch={false} href={`/article/${article.slug}`} className="group flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden bg-gray-200 rounded-md">
        <Image
          src={cloudinaryUrl(article.imageUrl, 240)}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-brand-blue text-xs font-bold uppercase">{article.category}</span>
        <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-blue transition-colors mt-0.5 font-serif">
          {article.title}
        </h4>
        <span className="text-gray-400 text-xs"><TimeAgo date={article.publishedAt} /></span>
      </div>
    </Link>
  );
}

// Video card for the home page video strip. The thumbnail comes from
// YouTube's own servers, so it costs nothing on Cloudinary or Vercel.
export function VideoCard({ article }: { article: ArticleSummary }) {
  const id = extractYouTubeId(article.videoUrl);
  if (!id) return null;
  return (
    <Link prefetch={false} href={`/article/${article.slug}`} className="group block">
      <div className="relative w-full aspect-video overflow-hidden bg-black rounded-lg shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt={article.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
        />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </div>
      <h3 className="mt-2 text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-brand-sky transition-colors font-serif">
        {article.title}
      </h3>
    </Link>
  );
}
