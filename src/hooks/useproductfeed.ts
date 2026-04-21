
"use client";

import { getFeedCache, saveFeedCache } from "@/lib/feedcache";
import { Product } from "@/types";
import { fetchProducts } from "@/types/api";
import { useEffect, useRef, useState } from "react";

export function useProductFeed(search: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"initial" | "next" | null>(null);

  const isFetching = useRef(false);
  const didRestore = useRef(false);

  const load = async (p = page, reset = false) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const res = await fetchProducts(p, search);
      setProducts((prev) => {
        const updated = reset ? res.products : [...prev, ...res.products];

        //for saving the list page and product so user don't lose them
        saveFeedCache({
          products: updated,
          page: p + 1,
          hasMore: res.hasMore,
          scroll: window.scrollY,
          search,
        });
        return updated;
      });

      setPage(p + 1);
      setHasMore(res.hasMore);
    } catch {
      setError(p === 1 ? "initial" : "next");
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };
//maanaging the search
  useEffect(() => {
    // checks that we stored the data in browsers memory 
    const cache = getFeedCache();

    if (cache && cache.search === search) {
      setProducts(cache.products);
      setPage(cache.page);
      setHasMore(cache.hasMore);
      setLoading(false);
      didRestore.current = false; 
    } else {
      setProducts([]);
      setPage(1);
      setHasMore(true);
      didRestore.current = true; 
      load(1, true);
    }
  }, [search]);

  //handimg scroll position
  useEffect(() => {
    const cache = getFeedCache();

    if (!didRestore.current && products.length > 0 && cache?.search === search) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: cache.scroll, behavior: "instant" });
        didRestore.current = true;
      });
    }
  }, [products, search]);

  return { products, load, loading, hasMore, error };
}
