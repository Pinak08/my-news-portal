import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isValidAdminSession } from "@/lib/adminAuth";
import { revalidatePath } from "next/cache";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isValidAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("articles")
    .update({
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      category_slug: body.categorySlug,
      author: body.author,
      image_url: body.imageUrl,
      video_url: body.videoUrl || null,
      featured: !!body.featured,
      breaking: !!body.breaking,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/", "layout");
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
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
