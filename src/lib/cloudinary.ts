// Serves a resized, auto-compressed copy of a Cloudinary image instead of the
// original upload. A 5 MB phone photo shown in a 400px card becomes ~40 KB,
// which keeps Cloudinary bandwidth well inside the free plan.
//
// f_auto picks WebP/AVIF per browser, q_auto picks the quality, and c_limit
// only ever shrinks (never upscales). Each width is generated once per image
// and then cached by Cloudinary's CDN. Non-Cloudinary URLs pass through as-is.
export function cloudinaryUrl(url: string | null | undefined, width: number): string {
  if (!url) return "";

  const marker = "/image/upload/";
  const i = url.indexOf(marker);
  if (!url.includes("res.cloudinary.com") || i === -1) return url;

  const rest = url.slice(i + marker.length);
  // Already transformed: the first path segment is a transformation, not v123.
  const firstSegment = rest.split("/")[0];
  if (/(^|,)(f|q|w|c)_/.test(firstSegment)) return url;

  return `${url.slice(0, i + marker.length)}f_auto,q_auto,c_limit,w_${width}/${rest}`;
}
