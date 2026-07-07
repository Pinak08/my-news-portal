"use client";
import { useState } from "react";
import Image from "next/image";

interface Props {
  title: string;
  imageUrls: string[];
  videoUrls: string[];
}

// Images and videos are shown as two separate sections — an image gallery
// (main photo + thumbnail strip when there's more than one) followed by a
// video section (each video gets its own player). Previously a video's
// poster frame was set to the cover image, which made it look like the video
// was "on top of" the picture and the image was never visible on its own.
export default function ArticleMedia({ title, imageUrls, videoUrls }: Props) {
  const [activeImage, setActiveImage] = useState(0);

  if (imageUrls.length === 0 && videoUrls.length === 0) return null;

  return (
    <div className="mb-6 space-y-4">
      {imageUrls.length > 0 && (
        <div>
          <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-200">
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

      {videoUrls.length > 0 && (
        <div className={videoUrls.length > 1 ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : ""}>
          {videoUrls.map((url, i) => (
            <div key={url + i} className="w-full aspect-video bg-black overflow-hidden">
              <video src={url} controls className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
