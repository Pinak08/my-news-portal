import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isValidAdminSession } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!isValidAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("advertisements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!isValidAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, imageUrl, videoUrl, bodyText, linkUrl, active } = body;

  // Nothing is individually required, but an entirely blank ad has nothing
  // to show, so require at least one of the four content fields.
  if (!title && !imageUrl && !videoUrl && !bodyText) {
    return NextResponse.json(
      { error: "Add at least one of: title, image, video, or text." },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("advertisements")
    .insert({
      title: title || null,
      image_url: imageUrl || null,
      video_url: videoUrl || null,
      body_text: bodyText || null,
      link_url: linkUrl || null,
      active: active === undefined ? true : !!active,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
