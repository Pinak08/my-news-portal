import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isValidAdminSession } from "@/lib/adminAuth";
import { revalidateArticlePages } from "@/lib/revalidate";
import { slugify } from "@/lib/slug";

export async function GET(req: NextRequest) {
  if (!isValidAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ articles: data });
}

export async function POST(req: NextRequest) {
  if (!isValidAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    excerpt,
    content,
    category,
    categorySlug,
    author,
    imageUrl,
    videoUrl,
    imageUrls,
    videoUrls,
    featured,
    breaking,
  } = body;

  // Support both the new arrays and the older single-URL fields, in case
  // something still only sends imageUrl/videoUrl.
  const finalImageUrls: string[] = (Array.isArray(imageUrls) ? imageUrls : imageUrl ? [imageUrl] : [])
    .filter(Boolean)
    .slice(0, 3);
  const finalVideoUrls: string[] = (Array.isArray(videoUrls) && videoUrls.length > 0 ? videoUrls : videoUrl ? [videoUrl] : [])
    .filter(Boolean)
    .slice(0, 3);

  if (!title || !category || !categorySlug) {
    return NextResponse.json(
      { error: "Title and category are required." },
      { status: 400 }
    );
  }

  // At least one image is required only for regular articles, not for ticker-only items
  if (!breaking && finalImageUrls.length === 0) {
    return NextResponse.json(
      { error: "At least one cover image is required for regular articles." },
      { status: 400 }
    );
  }

  // No image means a ticker-only item: it has no article page, so keep only
  // the title and drop everything that would only ever show on that page.
  const tickerOnly = finalImageUrls.length === 0;

  // Only new articles get a slug; editing never changes it, so links that
  // have already been shared keep working.
  const slug = `${slugify(title) || "news"}-${Date.now().toString(36)}`;

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("articles")
    .insert({
      slug,
      title,
      excerpt: tickerOnly ? "" : excerpt || "",
      content: tickerOnly ? "" : content || "",
      category,
      category_slug: categorySlug,
      author: author || "",
      // image_url/video_url mirror the first item for backward compatibility
      // with cards, homepage, and social share previews that only read one.
      image_url: finalImageUrls[0] || "",
      video_url: tickerOnly ? null : finalVideoUrls[0] || null,
      image_urls: finalImageUrls,
      video_urls: tickerOnly ? [] : finalVideoUrls,
      featured: !tickerOnly && !!featured,
      breaking: !!breaking,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateArticlePages();

  return NextResponse.json({ article: data });
}
