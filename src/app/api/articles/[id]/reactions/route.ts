import { NextRequest, NextResponse } from "next/server";
import { getReactionCounts, getUserReaction, applyReaction } from "@/lib/reactions";

interface Params {
  params: Promise<{ id: string }>;
}

function parseArticleId(id: string): number | null {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// GET /api/articles/[id]/reactions?visitorId=xxx
// Returns current like/dislike counts, plus this visitor's own reaction (if any).
export async function GET(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const articleId = parseArticleId(id);
  if (!articleId) {
    return NextResponse.json({ error: "Invalid article id." }, { status: 400 });
  }

  const visitorId = req.nextUrl.searchParams.get("visitorId") || "";
  const [counts, userReaction] = await Promise.all([
    getReactionCounts(articleId),
    getUserReaction(articleId, visitorId),
  ]);

  return NextResponse.json({ ...counts, userReaction });
}

// POST /api/articles/[id]/reactions   body: { visitorId, reaction: "like" | "dislike" }
// Clicking the same reaction again removes it; clicking the other one switches it.
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const articleId = parseArticleId(id);
  if (!articleId) {
    return NextResponse.json({ error: "Invalid article id." }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const { visitorId, reaction } = body;

  if (typeof visitorId !== "string" || visitorId.length < 8 || visitorId.length > 100) {
    return NextResponse.json({ error: "A valid visitorId is required." }, { status: 400 });
  }
  if (reaction !== "like" && reaction !== "dislike") {
    return NextResponse.json({ error: "reaction must be 'like' or 'dislike'." }, { status: 400 });
  }

  const result = await applyReaction(articleId, visitorId, reaction);
  return NextResponse.json(result);
}
