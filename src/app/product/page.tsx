"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/usedebounce";
import { useIntersectionObserver } from "@/hooks/useintersectionobserver";
import { useProductFeed } from "@/hooks/useproductfeed";
import { ProductCard } from "@/components/pages/productcard";
import { SkeletonCard } from "@/components/pages/skeletoncard";
import { Button } from "@/components/ui/button";
import { BackToTopButton } from "@/components/pages/backtotop";


export default function ProductFeed() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const initialQuery = searchParams.get("q") || "";
    const [search, setSearch] = useState(initialQuery);
    const debounced = useDebounce(search, 500);

    useEffect(() => {
        const q = searchParams.get("q") || "";
        if (q !== search) setSearch(q);
    }, [searchParams]);

    useEffect(() => {
        const currentQuery = searchParams.get("q") || "";
        if (debounced !== currentQuery) {
            const params = new URLSearchParams(searchParams.toString());
            if (debounced) params.set("q", debounced);
            else params.delete("q");

            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    }, [debounced, pathname, router, searchParams]);

    const { products, load, loading, hasMore, error } = useProductFeed(debounced || initialQuery);

    const scrollRef = useRef<HTMLDivElement>(null);

    useIntersectionObserver(scrollRef, () => {
        if (hasMore && !loading) load();
    });

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">All Products</h1>

            <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <p className="text-sm text-gray-500">Showing {products.length} results</p>

            {/* Product Cards */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                    <ProductCard key={p.id} p={p} />
                ))}

                {loading && Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={`skeleton-${i}`} />
                ))}
            </div>

            {error === "initial" && (
                <div className="text-center py-10">
                    <p className="text-red-500">Failed to load products</p>
                    <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => load(1, true)}
                    >
                        Retry
                    </Button>
                </div>
            )}

            {!hasMore && !loading && products.length > 0 && (
                <p className="text-center text-gray-500 py-10 font-medium">
                    You've reached the end!
                </p>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={scrollRef} className="h-10" />
            
            <BackToTopButton />
        </div>
    );
}
