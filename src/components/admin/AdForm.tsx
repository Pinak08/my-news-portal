"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CloudinaryUploadButton from "@/components/CloudinaryUploadButton";

export interface AdFormValues {
  id?: number;
  title: string;
  imageUrl: string;
  videoUrl: string;
  bodyText: string;
  linkUrl: string;
  active: boolean;
}

export default function AdForm({ initial }: { initial?: AdFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<AdFormValues>(
    initial || {
      title: "",
      imageUrl: "",
      videoUrl: "",
      bodyText: "",
      linkUrl: "",
      active: true,
    }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof AdFormValues>(key: K, value: AdFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!values.title && !values.imageUrl && !values.videoUrl && !values.bodyText) {
      setError("Add at least a title, image, video, or text — an ad needs at least one of these to show anything.");
      return;
    }

    setSaving(true);
    const isEdit = !!values.id;
    const res = await fetch(isEdit ? `/api/admin/ads/${values.id}` : "/api/admin/ads", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaving(false);

    if (res.ok) {
      router.push("/admin/ads");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <p className="text-sm text-gray-500 mb-6">
        બધા ફિલ્ડ વૈકલ્પિક છે — તમે ફક્ત ટાઈટલ, ફક્ત ઈમેજ, ફક્ત વિડિઓ, અથવા ફક્ત ટેક્સ્ટ સાથે પણ જાહેરાત બનાવી શકો છો.
        <br />
        <span className="text-gray-400">
          (All fields are optional — you can publish an ad with just a title, just an image, just a video, or just text.)
        </span>
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-3 py-2 mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
        <input
          type="text"
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g. Diwali Sale — 50% Off"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
      </div>

      <CloudinaryUploadButton
        label="Image"
        accept="image"
        currentUrl={values.imageUrl}
        onUploaded={(url) => update("imageUrl", url)}
      />

      <CloudinaryUploadButton
        label="Video"
        accept="video"
        currentUrl={values.videoUrl}
        onUploaded={(url) => update("videoUrl", url)}
      />

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Text</label>
        <textarea
          value={values.bodyText}
          onChange={(e) => update("bodyText", e.target.value)}
          rows={4}
          placeholder="Short promotional text shown under the title/image"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Link (optional) — where clicking the ad takes people
        </label>
        <input
          type="text"
          value={values.linkUrl}
          onChange={(e) => update("linkUrl", e.target.value)}
          placeholder="https://example.com"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
      </div>

      <label className="flex items-center gap-2 mb-6 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={values.active}
          onChange={(e) => update("active", e.target.checked)}
        />
        Active (shown on the live site)
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-blue text-white px-5 py-2 rounded font-semibold hover:bg-brand-navy transition-colors disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Advertisement"}
        </button>
      </div>
    </form>
  );
}
