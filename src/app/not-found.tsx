import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-brand-blue text-8xl font-bold font-serif mb-4">404</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">પાનું મળ્યું નથી</h2>
      <p className="text-gray-500 mb-8">તમે શોધી રહ્યા છો તે સમાચાર અથવા પાનું અસ્તિત્વમાં નથી અથવા ખસેડવામાં આવ્યું છે.</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          prefetch={false}
          href="/"
          className="inline-block bg-brand-blue text-white px-6 py-3 font-semibold hover:bg-brand-navy transition-colors"
        >
          ← હોમ પેજ પર જાઓ
        </Link>
        <Link
          prefetch={false}
          href="/search"
          className="inline-block border border-brand-blue text-brand-blue px-6 py-3 font-semibold hover:bg-brand-mist transition-colors"
        >
          સમાચાર શોધો
        </Link>
      </div>
    </div>
  );
}
