import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="text-brand-blue text-8xl font-bold font-serif mb-4">404</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-8">The article or page you are looking for doesn't exist or has been moved.</p>
      <Link
        href="/"
        className="inline-block bg-brand-blue text-white px-6 py-3 font-semibold hover:bg-brand-navy transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
