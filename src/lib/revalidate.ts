import { revalidatePath } from "next/cache";
import { categories } from "@/lib/categories";

// Refresh only the pages an article change can affect. The old code called
// revalidatePath("/", "layout"), which threw away the cache for every page on
// the site, so each publish triggered a rebuild of every article page on its
// next visit — that is what used up the Vercel ISR write quota.
//
// Other articles' "related" sidebars refresh on their own within a week.
export function revalidateArticlePages(slug?: string | null) {
  revalidatePath("/");
  for (const c of categories) {
    if (c.slug !== "/") revalidatePath(`/category/${c.slug}`);
  }
  // Every older category page shifts by one when an article is added.
  revalidatePath("/category/[slug]/page/[page]", "page");
  if (slug) revalidatePath(`/article/${slug}`);
}

// Ads show on the home page and in every article's sidebar. Ad changes are
// rare, so refreshing all article pages here is cheap and keeps a removed ad
// from lingering. Category pages carry no ads.
export function revalidateAdPages() {
  revalidatePath("/");
  revalidatePath("/article/[slug]", "page");
}
