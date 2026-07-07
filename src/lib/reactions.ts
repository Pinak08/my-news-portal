import { supabaseAdmin } from "@/lib/supabase";

export type ReactionCounts = { likes: number; dislikes: number };
export type ReactionType = "like" | "dislike";

// These all use the service-role client because article_reactions has no
// public RLS policies (see supabase-schema.sql) — reads and writes only
// happen here, on the server, inside /api/articles/[id]/reactions.

export async function getReactionCounts(articleId: number): Promise<ReactionCounts> {
  const supabase = supabaseAdmin();
  const [likes, dislikes] = await Promise.all([
    supabase
      .from("article_reactions")
      .select("id", { count: "exact", head: true })
      .eq("article_id", articleId)
      .eq("reaction", "like"),
    supabase
      .from("article_reactions")
      .select("id", { count: "exact", head: true })
      .eq("article_id", articleId)
      .eq("reaction", "dislike"),
  ]);
  return { likes: likes.count || 0, dislikes: dislikes.count || 0 };
}

export async function getUserReaction(
  articleId: number,
  visitorId: string
): Promise<ReactionType | null> {
  if (!visitorId) return null;
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("article_reactions")
    .select("reaction")
    .eq("article_id", articleId)
    .eq("visitor_id", visitorId)
    .maybeSingle();
  return (data?.reaction as ReactionType) || null;
}

// Applies a visitor's like/dislike click and returns the fresh state.
// - Clicking the same reaction again removes it (un-like / un-dislike).
// - Clicking the other reaction switches it.
export async function applyReaction(
  articleId: number,
  visitorId: string,
  reaction: ReactionType
): Promise<{ counts: ReactionCounts; userReaction: ReactionType | null }> {
  const supabase = supabaseAdmin();
  const existing = await getUserReaction(articleId, visitorId);

  if (existing === reaction) {
    await supabase
      .from("article_reactions")
      .delete()
      .eq("article_id", articleId)
      .eq("visitor_id", visitorId);
    const counts = await getReactionCounts(articleId);
    return { counts, userReaction: null };
  }

  await supabase
    .from("article_reactions")
    .upsert(
      {
        article_id: articleId,
        visitor_id: visitorId,
        reaction,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "article_id,visitor_id" }
    );

  const counts = await getReactionCounts(articleId);
  return { counts, userReaction: reaction };
}
