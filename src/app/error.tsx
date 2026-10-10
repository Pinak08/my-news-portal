"use client";

// Shown when navigating to a page that has never been cached while the
// database is unreachable. Cached pages keep being served during an outage.
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">થોડી તકલીફ આવી છે</h2>
      <p className="text-gray-500 mb-8">કૃપા કરીને થોડી વાર પછી ફરી પ્રયાસ કરો.</p>
      <button
        type="button"
        onClick={reset}
        className="inline-block bg-brand-blue text-white px-6 py-3 font-semibold hover:bg-brand-navy transition-colors"
      >
        ફરી પ્રયાસ કરો
      </button>
    </div>
  );
}
