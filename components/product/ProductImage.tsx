"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function ProductImage({
  src,
  alt,
  className = "",
  priority = false,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex h-full w-full items-center justify-center bg-brand-green/8 ${className}`}
      >
        <span className="font-display text-3xl text-brand-gold/40" aria-hidden>
          SHF
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
      priority={priority}
    />
  );
}
