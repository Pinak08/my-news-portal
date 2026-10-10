import AdBanner from "@/components/AdBanner";
import type { Advertisement } from "@/lib/ads";

// First in-article ad after paragraph 2, then one every 4 paragraphs, at
// most 2, and never after the last paragraph.
const FIRST_AD_AFTER = 2;
const AD_EVERY = 4;
const MAX_IN_ARTICLE_ADS = 2;

const BLOCK_END = /(?<=<\/(?:p|h2|h3|ul|ol|blockquote)>)/i;

// Articles are mostly typed as plain text with line breaks, which HTML
// ignores, so each line becomes its own paragraph. Older articles written
// as HTML are split at their own block tags instead.
function toParagraphs(content: string): string[] {
  const trimmed = content.trim();
  if (/<(p|h2|h3|ul|ol|blockquote)[\s>]/i.test(trimmed)) {
    return trimmed.split(BLOCK_END).map((s) => s.trim()).filter(Boolean);
  }
  return trimmed
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${line}</p>`);
}

export default function ArticleBody({ content, ads }: { content: string; ads: Advertisement[] }) {
  const paragraphs = toParagraphs(content);
  let adsShown = 0;

  return (
    <div className="article-body text-gray-800 leading-relaxed">
      {paragraphs.map((html, i) => {
        const n = i + 1;
        const isAdSlot =
          ads.length > 0 &&
          adsShown < MAX_IN_ARTICLE_ADS &&
          n < paragraphs.length &&
          n >= FIRST_AD_AFTER &&
          (n - FIRST_AD_AFTER) % AD_EVERY === 0;
        const ad = isAdSlot ? ads[adsShown++ % ads.length] : null;

        return (
          <div key={i}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
            {ad && (
              <div className="my-6">
                <AdBanner ad={ad} compact />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
