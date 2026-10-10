import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isValidAdminSession } from "@/lib/adminAuth";
import { revalidateArticlePages } from "@/lib/revalidate";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isValidAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();

  // Support both the new arrays and the older single-URL fields, in case
  // something still only sends imageUrl/videoUrl.
  const finalImageUrls: string[] = (Array.isArray(body.imageUrls) ? body.imageUrls : body.imageUrl ? [body.imageUrl] : [])
    .filter(Boolean)
    .slice(0, 3);
  const finalVideoUrls: string[] = (Array.isArray(body.videoUrls) && body.videoUrls.length > 0 ? body.videoUrls : body.videoUrl ? [body.videoUrl] : [])
    .filter(Boolean)
    .slice(0, 3);

  if (!body.breaking && finalImageUrls.length === 0) {
    return NextResponse.json(
      { error: "At least one cover image is required for regular articles." },
      { status: 400 }
    );
  }

  // Same rule as publishing: no image means ticker-only, title only.
  const tickerOnly = finalImageUrls.length === 0;

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("articles")
    .update({
      title: body.title,
      excerpt: tickerOnly ? "" : body.excerpt,
      content: tickerOnly ? "" : body.content,
      category: body.category,
      category_slug: body.categorySlug,
      author: body.author,
      // image_url/video_url mirror the first item for backward compatibility
      // with cards, homepage, and social share previews that only read one.
      image_url: finalImageUrls[0] || "",
      video_url: tickerOnly ? null : finalVideoUrls[0] || null,
      image_urls: finalImageUrls,
      video_urls: tickerOnly ? [] : finalVideoUrls,
      featured: !tickerOnly && !!body.featured,
      breaking: !!body.breaking,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidateArticlePages(data.slug);
  return NextResponse.json({ article: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isValidAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("articles")
    .delete()
    .eq("id", id)
    .select("slug")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  // The deleted article's own page must be purged too, or it stays live from cache.
  revalidateArticlePages(data?.slug);
  return NextResponse.json({ ok: true });
}
