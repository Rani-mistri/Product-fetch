

"use client";

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import { fetchProducts } from "@/lib/api";
import { useProductStore } from "@/store/useproductstore";

const LIMIT = 12;

export function useInfiniteProducts(query: string) {
  const {
    products, page, setProducts, appendProducts,
    setPage, hasMore, setHasMore, reset,
    scrollY, setScroll, lastQuery, setLastQuery
  } = useProductStore();

  const [loading, setLoading] = useState(false);
  const isFetching = useRef(false);

  // Requirement 1 & 3: Memory Preservation & Search Sync
  useEffect(() => {
    // Only reset if the search query actually changed
    if (query !== lastQuery) {
      reset();
      setLastQuery(query);
      load(1, query, true);
    } else if (products.length === 0) {
      // First load ever
      load(1, query, true);
    }
    // If query is same and products exist (Back Button), do nothing!
  }, [query]);

  // Requirement 2: Exact Pixel Restoration
  useLayoutEffect(() => {
    if (products.length > 0 && scrollY > 0) {
      // Use a tiny delay to ensure the DOM has painted the 150 items
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    }

    const handleScroll = () => {
      // Save scroll position as user moves
      setScroll(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [products.length]); // Triggers once products are restored to memory

  // Requirement 4: Resume from next page (e.g., Page 13)
  const load = useCallback(async (pageNum: number, searchQuery: string, isReset = false) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);
    try {
      const data = await fetchProducts(pageNum, LIMIT, searchQuery);
      if (isReset) setProducts(data.products);
      else appendProducts(data.products);
      setHasMore(data.products.length === LIMIT);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, []);

  // Pagination Trigger
  useEffect(() => {
    // If page state is 13, but we only have 12 pages in memory, fetch!
    if (page > 1 && products.length < page * LIMIT) {
      load(page, query);
    }
  }, [page, query, load]);

  // 4. INTERSECTION OBSERVER
  const observer = useRef<IntersectionObserver>();
  const lastRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(page + 1);
      }
    }, { rootMargin: "400px" });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, page, setPage]);

  return { products, loading, lastRef, hasMore, page };
}
