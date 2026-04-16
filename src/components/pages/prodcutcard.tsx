"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ProductCard({ product }: any) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "400px" } // Increased margin for smoother appearance
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    // REQUIREMENT: scroll={false} prevents Next.js from jumping to top
    <Link href={`/product/${product.id}`} scroll={false}>
      <div 
        ref={ref} 
        className="border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow bg-white min-h-[320px]"
      >
        {/* FIXED ASPECT RATIO: Prevents layout shift when image loads */}
        <div className="relative w-full h-60 bg-gray-100 rounded overflow-hidden">
          {visible && !error ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              onError={() => setError(true)}
              className="h-full w-full object-contain"
              loading="lazy"
              width={500}
              height={500}
            />
          ) : (
            <div className="h-full w-full bg-gray-200 animate-pulse" />
          )}
        </div>

        <div className="mt-3 space-y-1">
          <h2 className="line-clamp-2 text-xl font-medium text-gray-800 h-10">
            {product.title}
          </h2>
          <p className="line-clamp-2 text-sm font-medium text-gray-800 h-10">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className="font-bold text-lg text-blue-600">
              ₹{product.price.toLocaleString()}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <span>⭐ {product.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
