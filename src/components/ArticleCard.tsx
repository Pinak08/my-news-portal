import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/articles";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// Large horizontal card — for featured/hero
export function FeaturedCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-200">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="inline-block bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 mb-2">
            {article.category}
          </span>
          <h2 className="text-white text-xl md:text-2xl font-bold leading-snug font-serif group-hover:text-gray-200 transition-colors">
            {article.title}
          </h2>
          <p className="text-gray-300 text-sm mt-1 line-clamp-2">{article.excerpt}</p>
          <div className="flex items-center gap-2 mt-2 text-gray-400 text-xs">
            <span>{article.author}</span>
            <span>·</span>
            <span>{timeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Medium card — image top, text below
export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-200 mb-3">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <span className="inline-block text-brand-red text-xs font-bold uppercase tracking-wider mb-1">
        {article.category}
      </span>
      <h3 className="font-bold text-gray-900 leading-snug group-hover:text-brand-red transition-colors font-serif text-base line-clamp-3">
        {article.title}
      </h3>
      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{article.excerpt}</p>
      <div className="flex items-center gap-2 mt-2 text-gray-400 text-xs">
        <span>{article.author}</span>
        <span>·</span>
        <span>{timeAgo(article.publishedAt)}</span>
      </div>
    </Link>
  );
}

// Small horizontal card — for sidebar lists
export function SmallCard({ article }: { article: Article }) {
  return (
    <Link href={`/article/${article.slug}`} className="group flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden bg-gray-200">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-brand-red text-xs font-bold uppercase">{article.category}</span>
        <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-brand-red transition-colors mt-0.5 font-serif">
          {article.title}
        </h4>
        <span className="text-gray-400 text-xs">{timeAgo(article.publishedAt)}</span>
      </div>
    </Link>
  );
}
