"use client";
import { useState } from "react";

interface Props {
  label: string;
  accept: "image" | "video";
  urls: string[];
  onChange: (urls: string[]) => void;
  max?: number; // default 3
}

// Same Cloudinary unsigned-upload approach as CloudinaryUploadButton, but lets
// the admin attach up to `max` files (default 3) instead of just one. Each
// newly picked file is appended to the list; any item can be removed with the
// ✕ button. The order in the list is the order shown on the article page,
// and the first item is what's used everywhere only one image/video is shown
// (cards, homepage, social share previews, etc.) for backward compatibility.
export default function CloudinaryMultiUploadButton({ label, accept, urls, onChange, max = 3 }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const remainingSlots = Math.max(0, max - urls.length);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // allow re-selecting the same file again later
    if (files.length === 0) return;

    setError("");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError("Cloudinary is not configured yet (missing env vars).");
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setError(`You can only add ${max} ${accept === "video" ? "videos" : "images"} in total. Extra file(s) were skipped.`);
    }
    if (filesToUpload.length === 0) return;

    setUploading(true);
    const resourceType = accept === "video" ? "video" : "image";
    const uploadedUrls: string[] = [];

    try {
      for (const file of filesToUpload) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
          { method: "POST", body: formData }
        );
        const data = await res.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          setError(data.error?.message || "Upload failed for one of the files.");
        }
      }
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      if (uploadedUrls.length > 0) onChange([...urls, ...uploadedUrls]);
      setUploading(false);
    }
  }

  function handleRemove(index: number) {
    onChange(urls.filter((_, i) => i !== index));
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} <span className="font-normal text-gray-400">({urls.length}/{max})</span>
      </label>

      {remainingSlots > 0 && (
        <input
          type="file"
          accept={accept === "video" ? "video/*" : "image/*"}
          multiple
          onChange={handleFiles}
          className="text-sm"
        />
      )}
      {remainingSlots === 0 && (
        <p className="text-xs text-gray-400">
          Maximum of {max} {accept === "video" ? "videos" : "images"} reached. Remove one to add another.
        </p>
      )}

      {uploading && <p className="text-sm text-brand-blue mt-1">Uploading...</p>}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

      {urls.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-2">
          {urls.map((url, i) => (
            <div key={url + i} className="relative">
              {accept === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={`Preview ${i + 1}`} className="h-24 w-24 rounded object-cover border border-gray-200" />
              ) : (
                <video src={url} controls className="h-24 w-32 rounded border border-gray-200" />
              )}
              <button
                type="button"
                onClick={() => handleRemove(i)}
                title="Remove"
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none hover:bg-red-700"
              >
                ✕
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
