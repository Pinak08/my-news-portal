import ArticleForm from "@/components/admin/ArticleForm";
import Link from "next/link";

export default function NewArticlePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/admin" className="text-sm text-brand-blue hover:underline mb-4 inline-block">
        ← Back to dashboard
      </Link>
      <h1 className="text-2xl font-bold text-brand-navy mb-6 font-serif">Add New Article</h1>
      <ArticleForm />
    </div>
  );
}
