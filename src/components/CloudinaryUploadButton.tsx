"use client";
import { useState } from "react";

interface Props {
  label: string;
  accept: "image" | "video";
  onUploaded: (url: string) => void;
  currentUrl?: string;
}

// Uses Cloudinary's unsigned upload API directly from the browser — no
// server code needed for the upload itself. Requires NEXT_PUBLIC_CLOUDINARY_
// CLOUD_NAME and an unsigned upload preset (NEXT_PUBLIC_CLOUDINARY_UPLOAD_
// PRESET) created in the Cloudinary dashboard under Settings → Upload.
export default function CloudinaryUploadButton({ label, accept, onUploaded, currentUrl }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentUrl || "");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      setError("Cloudinary is not configured yet (missing env vars).");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const resourceType = accept === "video" ? "video" : "image";
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setPreview(data.secure_url);
        onUploaded(data.secure_url);
      } else {
        setError(data.error?.message || "Upload failed");
      }
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type="file"
        accept={accept === "video" ? "video/*" : "image/*"}
        onChange={handleFile}
        className="text-sm"
      />
      {uploading && <p className="text-sm text-brand-blue mt-1">Uploading...</p>}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {preview && accept === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Preview" className="mt-2 h-32 rounded object-cover" />
      )}
      {preview && accept === "video" && (
        <video src={preview} controls className="mt-2 h-32 rounded" />
      )}
    </div>
  );
}
