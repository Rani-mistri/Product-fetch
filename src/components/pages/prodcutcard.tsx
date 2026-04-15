"use client";

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
      { rootMargin: "200px" }
    );

    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <Link href={`/product/${product.id}`}>
      <div ref={ref} className="border rounded-xl p-3 shadow-sm">
        {visible && !error ? (
          <img
            src={product.images[0]}
            onError={() => setError(true)}
            className="h-40 w-full object-cover rounded"
          />
        ) : (
          <div className="h-40 bg-gray-200 rounded" />
        )}

        <h2 className="line-clamp-2 mt-2">{product.title}</h2>
        <p className="font-semibold">
          ₹{product.price.toLocaleString()}
        </p>
        <p>⭐ {product.rating}</p>
      </div>
    </Link>
  );
}