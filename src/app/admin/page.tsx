import { supabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = supabaseAdmin();
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-navy font-serif">TV10 Gujarat — Admin</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/new"
            className="bg-brand-blue text-white px-4 py-2 rounded font-semibold hover:bg-brand-navy transition-colors text-sm"
          >
            + Add New Article
          </Link>
          <LogoutButton />
        </div>
      </div>

      {(!articles || articles.length === 0) && (
        <p className="text-gray-500">No articles yet. Click "Add New Article" to publish your first one.</p>
      )}

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {articles?.map((a) => (
          <div key={a.id} className="flex items-center justify-between px-4 py-3">
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{a.title}</p>
              <p className="text-xs text-gray-500">
                {a.category} · {new Date(a.published_at).toLocaleDateString()}
                {a.video_url ? " · 🎬 has video" : ""}
                {a.breaking ? " · 🔴 breaking" : ""}
                {a.featured ? " · ⭐ featured" : ""}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              <Link
                href={`/article/${a.slug}`}
                target="_blank"
                className="text-sm text-gray-500 hover:text-brand-blue"
              >
                View
              </Link>
              <Link href={`/admin/edit/${a.id}`} className="text-sm text-brand-blue hover:underline">
                Edit
              </Link>
              <DeleteButton id={a.id} title={a.title} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
