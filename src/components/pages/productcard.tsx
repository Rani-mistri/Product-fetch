
'use client';

import { useIntersectionObserver } from '@/hooks/useintersectionobserver';
import { getFeedCache, saveFeedCache } from '@/lib/feedcache';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { FaStar } from 'react-icons/fa';

export function ProductCard({ p }: { p: any }) {
  const ref = useRef<HTMLDivElement | null>(null);
  
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);

  useIntersectionObserver(ref, () => setVisible(true));

  const handleClick = () => {
    const currentCache = getFeedCache();
    if (currentCache) {
      saveFeedCache({ ...currentCache, scroll: window.scrollY });
    }
  };

  const imageSrc = Array.isArray(p.image) ? p.image[0] : p.image;

  return (
    <Link href={`/product/${p.id}`} scroll={false} onClick={handleClick}>
      <div 
        ref={ref} 
        className="border p-3 shadow-sm hover:shadow-md transition-shadow bg-white min-h-80"
      >
        <div className="relative w-full h-60 bg-gray-100 rounded overflow-hidden">
          {visible && !error && imageSrc ? (
            <Image
              src={imageSrc}
              alt={p.title || 'Product Image'}
              onError={() => setError(true)}
              className="h-full w-full object-contain"
              fill 
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 animate-pulse" />
          )}
        </div>

        <div className="mt-3 space-y-1">
          <h2 className="line-clamp-1 font-bold text-gray-800 text-lg">
            {p.title}
          </h2>

          <p className="text-sm text-gray-600 line-clamp-2">
            {p.description || "No description available"}
          </p>

          <div className="flex items-center justify-between mt-2">
            <p className="font-bold text-base text-blue-600">
              ₹{p.price?.toLocaleString() ?? '0'}
            </p>
            {p.rating && (
              <div className="flex items-center text-base text-yellow-500">
                <FaStar size={20} className='pe-1' />
                {p.rating}
              </div>
            )}
          </div>
          
          <div className="pt-2">
            <span className="text-sm text-blue-500 font-medium hover:underline">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
