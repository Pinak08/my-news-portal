import Link from "next/link";
import AdForm from "@/components/admin/AdForm";

export default function NewAdPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/admin/ads" className="text-sm text-brand-blue hover:underline mb-4 inline-block">
        ← Back to advertisements
      </Link>
      <h1 className="text-2xl font-bold text-brand-navy font-serif mb-6">Add New Advertisement</h1>
      <AdForm />
    </div>
  );
}
