"use client";

import { useQueryState } from "nuqs";
import { useEffect } from "react";
import useDebounce from "@/hooks/usedebounce";
import { useInfiniteProducts } from "@/hooks/useinfiniteproducts";
import ErrorState from "@/components/pages/errorstate";
import ProductCard from "@/components/pages/prodcutcard";
import SkeletonCard from "@/components/pages/skeltoncard";
import BackToTop from "@/components/pages/backtotop";
import { useProductStore } from "@/store/useproductstore";

export default function Page() {
  const [search, setSearch] = useQueryState("q", {
    defaultValue: "",
  });

  const debounced = useDebounce(search, 500);

  const { products, loading, error, lastRef, hasMore, page } =
    useInfiniteProducts(debounced);

  const { scrollY, setScroll } = useProductStore();

  // 🔥 scroll restore
  useEffect(() => {
    window.scrollTo(0, scrollY);
  }, []);

  useEffect(() => {
    const handler = () => setScroll(window.scrollY);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🛍️ Products</h1>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="border p-2 w-full mb-4"
      />

      {error && products.length === 0 ? (
        <ErrorState onRetry={() => location.reload()} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p, i) => (
              <div
                key={p.id}
                ref={i === products.length - 1 ? lastRef : null}
              >
                <ProductCard product={p} />
              </div>
            ))}

            {loading &&
              Array.from({ length: page === 1 ? 12 : 4 }).map(
                (_, i) => <SkeletonCard key={i} />
              )}
          </div>

          {error && products.length > 0 && (
            <div className="text-center mt-4 text-red-500">
              Failed to load. Retry.
            </div>
          )}

          {!hasMore && (
            <p className="text-center mt-6">
              🎉 You've reached the end!
            </p>
          )}
        </>
      )}

      <BackToTop />
    </div>
  );
}