import Link from "next/link";

interface Props {
  title: string;
  href?: string;
}

export default function SectionHeader({ title, href }: Props) {
  return (
    <div className="flex items-center justify-between mb-5 border-b-2 border-brand-red pb-2">
      <h2 className="text-lg font-bold uppercase tracking-wide text-gray-900 font-serif">
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-xs font-semibold text-brand-red hover:text-brand-darkred uppercase tracking-wide transition-colors"
        >
          બધું જુઓ →
        </Link>
      )}
    </div>
  );
}
