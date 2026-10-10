// Kept separate from articles.ts on purpose: the header and admin form are
// client components, and importing articles.ts there would ship the Supabase
// client, URL and key to every visitor's browser.
export const categories = [
  { name: "હોમ", slug: "/" },
  { name: "રાજકારણ", slug: "politics" },
  { name: "વ્યાપાર", slug: "business" },
  { name: "રમતગમત", slug: "sports" },
  { name: "મનોરંજન", slug: "entertainment" },
  { name: "ટેકનોલોજી", slug: "technology" },
  { name: "લાઇફસ્ટાઇલ", slug: "lifestyle" },
  { name: "ક્રાઇમ", slug: "crime" },
  { name: "આધ્યાત્મિક", slug: "religious" },
];

export function getCategoryName(slug: string): string {
  const cat = categories.find((c) => c.slug === slug);
  return cat ? cat.name : slug;
}

export function isKnownCategory(slug: string): boolean {
  return slug !== "/" && categories.some((c) => c.slug === slug);
}
