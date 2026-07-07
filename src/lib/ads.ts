import { supabasePublic, supabaseAdmin } from "@/lib/supabase";

export type Advertisement = {
  id: number;
  title: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  bodyText: string | null;
  linkUrl: string | null;
  active: boolean;
  createdAt: string;
};

function mapRow(row: Record<string, unknown>): Advertisement {
  return {
    id: row.id as number,
    title: (row.title as string) || null,
    imageUrl: (row.image_url as string) || null,
    videoUrl: (row.video_url as string) || null,
    bodyText: (row.body_text as string) || null,
    linkUrl: (row.link_url as string) || null,
    active: row.active as boolean,
    createdAt: row.created_at as string,
  };
}

// Public: only ads currently turned on (used on the live site).
export async function getActiveAds(): Promise<Advertisement[]> {
  const { data, error } = await supabasePublic
    .from("advertisements")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapRow);
}

// Picks one active ad to show in a single ad slot. Rotates randomly across
// requests so that if there are several ads, they all get shown over time
// instead of always the same one.
export async function getRandomActiveAd(): Promise<Advertisement | null> {
  const ads = await getActiveAds();
  if (ads.length === 0) return null;
  return ads[Math.floor(Math.random() * ads.length)];
}

// Admin: every ad, active or not (used in the admin dashboard).
export async function getAllAdsForAdmin(): Promise<Advertisement[]> {
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("advertisements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapRow);
}
