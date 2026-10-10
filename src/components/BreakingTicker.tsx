"use client";
import Link from "next/link";

type TickerItem = {
  slug: string;
  title: string;
  hasPage: boolean; // false for ticker-only items, which have no article page
};

function Item({ item }: { item: TickerItem }) {
  if (!item.hasPage) return <span className="mr-12">● {item.title}</span>;
  return (
    <Link prefetch={false} href={`/article/${item.slug}`} className="hover:text-brand-sky transition-colors mr-12">
      ● {item.title}
    </Link>
  );
}

export default function BreakingTicker({ articles }: { articles: TickerItem[] }) {
  if (!articles.length) return null;

  return (
    <div className="bg-brand-navy text-white flex items-stretch overflow-hidden">
      <div className="bg-brand-blue px-4 py-2 flex items-center flex-shrink-0 z-10">
        <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">
          🔴 બ્રેકિંગ
        </span>
      </div>
      <div className="overflow-hidden flex-1 relative flex items-center">
        <div className="animate-marquee whitespace-nowrap text-sm py-2 px-4">
          {articles.map((a, i) => (
            <Item key={i} item={a} />
          ))}
          {/* Duplicate for seamless loop */}
          {articles.map((a, i) => (
            <Item key={`dup-${i}`} item={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
