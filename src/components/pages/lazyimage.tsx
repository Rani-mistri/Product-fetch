"use client";

import { useRef, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useintersectionobserver";
import Image from "next/image";

export default function LazyImage({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  useIntersectionObserver(ref, () => setShow(true));

  return (
    <div
      ref={ref}
      className="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden rounded"
    >
      {!show && <div className="w-full h-full bg-gray-200 animate-pulse" />}

      {show && !error && (
        <Image
          src={src}
          alt="product image"
          fill
          className="object-cover"
          onError={() => setError(true)}
          priority
        />
      )}

      {error && (
        <div className="text-gray-400 text-sm">
          Image not available
        </div>
      )}
    </div>
  );
}