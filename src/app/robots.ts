import type { MetadataRoute } from "next";

// Keeps crawlers off pages that can't be cached or shouldn't be indexed,
// so bot traffic doesn't burn database queries or function runs.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: ["/admin", "/api", "/search"] },
  };
}
