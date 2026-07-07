import Link from "next/link";
import { getAllAdsForAdmin } from "@/lib/ads";
import DeleteAdButton from "@/components/admin/DeleteAdButton";

export const dynamic = "force-dynamic";

export default async function AdminAdsPage() {
  const ads = await getAllAdsForAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy font-serif">જાહેરાત (Advertisements)</h1>
          <Link href="/admin" className="text-sm text-brand-blue hover:underline">
            ← Back to articles
          </Link>
        </div>
        <Link
          href="/admin/ads/new"
          className="bg-brand-blue text-white px-4 py-2 rounded font-semibold hover:bg-brand-navy transition-colors text-sm"
        >
          + Add New Advertisement
        </Link>
      </div>

      {ads.length === 0 && (
        <p className="text-gray-500">
          No advertisements yet. Click &quot;Add New Advertisement&quot; to create your first one.
        </p>
      )}

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {ads.map((ad) => (
          <div key={ad.id} className="flex items-center justify-between px-4 py-3 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {ad.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ad.imageUrl} alt="" className="w-12 h-12 rounded object-cover flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {ad.title || <span className="text-gray-400 italic">(no title)</span>}
                </p>
                <p className="text-xs text-gray-500">
                  {ad.active ? (
                    <span className="text-green-600">● Active</span>
                  ) : (
                    <span className="text-gray-400">● Inactive</span>
                  )}
                  {ad.imageUrl ? " · 🖼️ image" : ""}
                  {ad.videoUrl ? " · 🎬 video" : ""}
                  {ad.linkUrl ? " · 🔗 link" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href={`/admin/ads/edit/${ad.id}`} className="text-sm text-brand-blue hover:underline">
                Edit
              </Link>
              <DeleteAdButton id={ad.id} label={ad.title || `Ad #${ad.id}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
