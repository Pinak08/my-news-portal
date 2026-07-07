import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import AdForm from "@/components/admin/AdForm";

export default async function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("advertisements").select("*").eq("id", id).single();

  if (!data) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/admin/ads" className="text-sm text-brand-blue hover:underline mb-4 inline-block">
        ← Back to advertisements
      </Link>
      <h1 className="text-2xl font-bold text-brand-navy font-serif mb-6">Edit Advertisement</h1>
      <AdForm
        initial={{
          id: data.id,
          title: data.title || "",
          imageUrl: data.image_url || "",
          videoUrl: data.video_url || "",
          bodyText: data.body_text || "",
          linkUrl: data.link_url || "",
          active: data.active,
        }}
      />
    </div>
  );
}
