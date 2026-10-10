import Link from "next/link";

interface Props {
  title: string;
  href?: string;
}

export default function SectionHeader({ title, href }: Props) {
  return (
    <div className="flex items-center justify-between mb-5 border-b border-gray-200 pb-2">
      <h2 className="flex items-center gap-2.5 text-lg font-bold tracking-wide text-gray-900 font-serif">
        <span className="w-1.5 h-5 bg-brand-blue rounded-full" aria-hidden="true" />
        {title}
      </h2>
      {href && (
        <Link
          prefetch={false}
          href={href}
          className="text-xs font-semibold text-brand-blue hover:text-brand-navy tracking-wide transition-colors whitespace-nowrap"
        >
          બધું જુઓ →
        </Link>
      )}
    </div>
  );
}
