"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  title: string;
  imageUrls: string[];
  youtubeUrl?: string;
}

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export default function ArticleMedia({ title, imageUrls, youtubeUrl }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const ytId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;

  if (imageUrls.length === 0 && !ytId) return null;

  return (
    <div className="mb-6 space-y-5">

      {/* ── IMAGE GALLERY ── */}
      {imageUrls.length > 0 && (
        <div>
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-200 rounded-lg">
            <Image
              src={imageUrls[activeImage]}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {imageUrls.length > 1 && (
            <div className="flex gap-2 mt-2">
              {imageUrls.map((url, i) => (
                <button
                  key={url + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-14 flex-shrink-0 overflow-hidden rounded border-2 transition-colors ${
                    i === activeImage ? "border-brand-blue" : "border-transparent"
                  }`}
                >
                  <Image src={url} alt={`${title} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── YOUTUBE EMBEDDED VIDEO ── */}
      {ytId && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube વિડિઓ
            </span>
          </div>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-md bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
              title={title}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      )}

    </div>
  );
}
