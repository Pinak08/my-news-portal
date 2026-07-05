import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isValidAdminSession } from "@/lib/adminAuth";
import { revalidatePath } from "next/cache";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

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
    featured,
    breaking,
  } = body;

  if (!title || !category || !categorySlug) {
    return NextResponse.json(
      { error: "Title and category are required." },
      { status: 400 }
    );
  }

  // Image is required only for regular articles, not for ticker-only items
  if (!breaking && !imageUrl) {
    return NextResponse.json(
      { error: "A cover image is required for regular articles." },
      { status: 400 }
    );
  }

  const slug = `${slugify(title)}-${Date.now().toString(36)}`;

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("articles")
    .insert({
      slug,
      title,
      excerpt: excerpt || "",
      content: content || "",
      category,
      category_slug: categorySlug,
      author: author || "",
      image_url: imageUrl,
      video_url: videoUrl || null,
      featured: !!featured,
      breaking: !!breaking,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Immediately refresh cached pages so the new article shows up right away
  // instead of waiting for the 60-second background refresh.
  revalidatePath("/", "layout");

  return NextResponse.json({ article: data });
}
