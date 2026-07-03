"use client";
import Link from "next/link";
import { Article } from "@/lib/articles";

export default function BreakingTicker({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  const tickerText = articles
    .map((a) => `● ${a.title}`)
    .join("     ");

  return (
    <div className="bg-gray-900 text-white flex items-stretch overflow-hidden">
      <div className="bg-brand-red px-4 py-2 flex items-center flex-shrink-0 z-10">
        <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">
          🔴 બ્રેકિંગ
        </span>
      </div>
      <div className="overflow-hidden flex-1 relative flex items-center">
        <div className="animate-marquee whitespace-nowrap text-sm py-2 px-4">
          {articles.map((a, i) => (
            <span key={i}>
              <Link
                href={`/article/${a.slug}`}
                className="hover:text-brand-light transition-colors mr-12"
              >
                ● {a.title}
              </Link>
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {articles.map((a, i) => (
            <span key={`dup-${i}`}>
              <Link
                href={`/article/${a.slug}`}
                className="hover:text-brand-light transition-colors mr-12"
              >
                ● {a.title}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
