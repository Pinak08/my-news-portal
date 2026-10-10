"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CloudinaryMultiUploadButton from "@/components/CloudinaryMultiUploadButton";
import { categories } from "@/lib/categories";

export interface ArticleFormValues {
  id?: number;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  author: string;
  imageUrls: string[];
  youtubeUrl: string;
  featured: boolean;
  breaking: boolean;
}

const navCategories = categories.filter((c) => c.slug !== "/");
const MAX_IMAGES = 3;

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function ArticleForm({ initial }: { initial?: ArticleFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<ArticleFormValues>(
    initial || {
      title: "",
      excerpt: "",
      content: "",
      category: navCategories[0].name,
      categorySlug: navCategories[0].slug,
      author: "",
      imageUrls: [],
      youtubeUrl: "",
      featured: false,
      breaking: false,
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof ArticleFormValues>(key: K, value: ArticleFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!values.title) {
      setError("Title is required.");
      return;
    }

    if (!values.breaking && values.imageUrls.length === 0) {
      setError("At least one cover image is required for regular articles.");
      return;
    }

    // Validate YouTube URL if provided
    if (values.youtubeUrl && !extractYouTubeId(values.youtubeUrl)) {
      setError("Please enter a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=...)");
      return;
    }

    setSaving(true);
    const isEdit = !!values.id;
    const payload = {
      ...values,
      imageUrl: values.imageUrls[0] || "",
      videoUrl: values.youtubeUrl || "",
      imageUrls: values.imageUrls,
      videoUrls: [],
    };
    const res = await fetch(isEdit ? `/api/admin/articles/${values.id}` : "/api/admin/articles", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
    }
  }

  const ytPreviewId = extractYouTubeId(values.youtubeUrl);

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
      <input
        value={values.title}
        onChange={(e) => update("title", e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-brand-blue mb-4"
      />

      <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt (short summary)</label>
      <textarea
        value={values.excerpt}
        onChange={(e) => update("excerpt", e.target.value)}
        rows={2}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-brand-blue mb-4"
      />

      <label className="block text-sm font-semibold text-gray-700 mb-1">Full article text</label>
      <textarea
        value={values.content}
        onChange={(e) => update("content", e.target.value)}
        rows={8}
        placeholder="Write the article here. You can use simple HTML like <p>, <h2>, <b> if you want formatting."
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-brand-blue mb-4"
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select
            value={values.categorySlug}
            onChange={(e) => {
              const cat = navCategories.find((c) => c.slug === e.target.value)!;
              update("category", cat.name);
              update("categorySlug", cat.slug);
            }}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-brand-blue"
          >
            {navCategories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Author name</label>
          <input
            value={values.author}
            onChange={(e) => update("author", e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-brand-blue"
          />
        </div>
      </div>

      <CloudinaryMultiUploadButton
        label={values.breaking ? "Images (optional for ticker, up to 3)" : "Images * (up to 3)"}
        accept="image"
        urls={values.imageUrls}
        onChange={(urls) => update("imageUrls", urls)}
        max={MAX_IMAGES}
      />

      {/* YouTube URL field */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          YouTube Video Link{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="url"
          value={values.youtubeUrl}
          onChange={(e) => update("youtubeUrl", e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
        <p className="text-xs text-gray-400 mt-1">
          Paste any YouTube link — the video will be shown nicely on the article page.
        </p>

        {/* Live preview when URL is valid */}
        {ytPreviewId && (
          <div className="mt-3">
            <p className="text-xs font-semibold text-green-600 mb-1.5">✅ Valid YouTube link — preview:</p>
            <div className="aspect-video w-full max-w-sm rounded overflow-hidden border border-green-200">
              <iframe
                src={`https://www.youtube.com/embed/${ytPreviewId}`}
                className="w-full h-full"
                allowFullScreen
                title="YouTube preview"
              />
            </div>
          </div>
        )}

        {values.youtubeUrl && !ytPreviewId && (
          <p className="text-xs text-red-500 mt-1">
            ⚠️ This doesn't look like a valid YouTube URL. Please check it.
          </p>
        )}
      </div>

      <div className="mb-6 mt-2 space-y-3">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => update("featured", e.target.checked)}
          />
          Featured on homepage
        </label>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={values.breaking}
              onChange={(e) => update("breaking", e.target.checked)}
            />
            Show in breaking news ticker
          </label>

          {values.breaking && (
            <div className="mt-2 ml-5 flex items-start gap-2 bg-amber-50 border border-amber-300 rounded-md px-3 py-2.5">
              <span className="text-amber-500 text-base mt-0.5 flex-shrink-0">ℹ️</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold block mb-0.5">ટિકરમાં ફક્ત શીર્ષક (Title) જ દેખાય છે.</span>
                Excerpt, content, image — nothing else appears in the ticker. Only the <strong>Title</strong> field is used. Make sure your title is clear and complete.
              </p>
              {values.imageUrls.length === 0 && (
                <p className="text-xs text-amber-800 leading-relaxed mt-1.5">
                  <span className="font-semibold">ફોટો વગર: ફક્ત ટિકર.</span> No image, so this appears only in the ticker. No article page is created.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-brand-blue text-white px-6 py-2.5 rounded font-semibold hover:bg-brand-navy transition-colors disabled:opacity-60"
      >
        {saving ? "Saving..." : values.id ? "Save Changes" : "Publish Article"}
      </button>
    </form>
  );
}
