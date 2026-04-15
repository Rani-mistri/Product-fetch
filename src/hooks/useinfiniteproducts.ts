"use client";

import { useEffect, useRef, useState } from "react";
import { fetchProducts } from "@/lib/api";
import { useProductStore } from "@/store/useproductstore";

const LIMIT = 12;

export function useInfiniteProducts(query: string) {
  const {
    products,
    page,
    setProducts,
    appendProducts,
    setPage,
    hasMore,
    setHasMore,
  } = useProductStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFetching = useRef(false);

  const load = async (pageNum: number, reset = false) => {
    if (isFetching.current) return;

    isFetching.current = true;
    setLoading(true);
    setError("");

    try {
      const data = await fetchProducts(pageNum, LIMIT, query);

      if (reset) setProducts(data.products);
      else appendProducts(data.products);

      if (data.products.length === 0) {
        setHasMore(false);
      }
    } catch {
      setError("Failed to load");
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  // 🔁 Search reset
  useEffect(() => {
    useProductStore.getState().reset();
    load(1, true);
  }, [query]);

  // 📦 Pagination
  useEffect(() => {
    if (page === 1) return;
    load(page);
  }, [page]);

  // 👀 Intersection Observer
  const observer = useRef<IntersectionObserver>();

  const lastRef = (node: HTMLDivElement | null) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(page + 1);
        }
      },
      { rootMargin: "300px" }
    );

    if (node) observer.current.observe(node);
  };

  return { products, loading, error, lastRef, hasMore, page };
}