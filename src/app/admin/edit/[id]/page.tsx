import { supabaseAdmin } from "@/lib/supabase";
import ArticleForm from "@/components/admin/ArticleForm";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("articles").select("*").eq("id", id).single();

  if (!data) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/admin" className="text-sm text-brand-blue hover:underline mb-4 inline-block">
        ← Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold text-brand-navy mb-6 font-serif">Edit Article</h1>
      <ArticleForm
        initial={{
          id: data.id,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          categorySlug: data.category_slug,
          author: data.author,
          imageUrl: data.image_url,
          videoUrl: data.video_url || "",
          featured: data.featured,
          breaking: data.breaking,
        }}
      />
    </div>
  );
}
