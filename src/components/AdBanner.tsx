import type { Advertisement } from "@/lib/ads";
import { cloudinaryUrl } from "@/lib/cloudinary";

interface Props {
  ad: Advertisement;
  // In-article slots: the whole poster is shown (never cropped) at a capped
  // height, the text is cut to 3 lines and no video player, so an ad never
  // fills the reader's screen in the middle of the news.
  compact?: boolean;
}

// Styled to clearly read as a sponsored/advertisement slot — a distinct
// amber accent border and an "જાહેરાત" (Advertisement) label badge, so it's
// never mistaken for editorial content. Every field on the ad is optional,
// so this only renders the pieces that were actually filled in.
export default function AdBanner({ ad, compact = false }: Props) {
  const hasContent = !!(ad.title || ad.imageUrl || ad.videoUrl || ad.bodyText);
  if (!hasContent) return null;

  const content = (
    <div className="relative bg-amber-50 border border-amber-300 rounded-lg overflow-hidden hover:border-amber-400 transition-colors">
      <span className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
        જાહેરાત
      </span>

      {ad.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cloudinaryUrl(ad.imageUrl, 800)}
          loading="lazy"
          alt={ad.title || "Advertisement"}
          className={compact ? "w-full max-h-64 object-contain bg-white" : "w-full max-h-72 object-cover"}
        />
      )}

      {ad.videoUrl && !compact && (
        <video src={ad.videoUrl} controls preload="none" className="w-full max-h-72 bg-black" />
      )}

      {(ad.title || ad.bodyText) && (
        <div className="p-4">
          {ad.title && <h3 className={`font-bold text-gray-900 mb-1 ${compact ? "line-clamp-2" : ""}`}>{ad.title}</h3>}
          {ad.bodyText && (
            <p className={`text-sm text-gray-700 whitespace-pre-line ${compact ? "line-clamp-3" : ""}`}>{ad.bodyText}</p>
          )}
        </div>
      )}
    </div>
  );

  if (ad.linkUrl) {
    return (
      <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">
        {content}
      </a>
    );
  }

  return content;
}
