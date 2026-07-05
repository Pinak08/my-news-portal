import { createClient } from "@supabase/supabase-js";

// Public client — safe to use for reading published articles.
// Uses the anon key, which only has read access (enforced by Row Level
// Security policies set up in supabase-schema.sql).
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Admin client — only ever used inside API routes that run on the server
// (never imported into client components). Uses the service role key,
// which can insert/update/delete articles. Keep SUPABASE_SERVICE_ROLE_KEY
// out of any NEXT_PUBLIC_ variable.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
