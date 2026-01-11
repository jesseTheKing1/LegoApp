// src/components/ui/Thumb.tsx
import React from "react";

export function Thumb({ src, alt, size = 40 }: { src?: string | null; alt: string; size?: number }) {
  if (!src) {
    return (
      <div
        className="grid place-items-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-[10px] text-neutral-400"
        style={{ width: size, height: size }}
        title="No image"
      >
        —
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      className="rounded-xl border border-neutral-200 bg-white object-cover"
      style={{ width: size, height: size }}
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
