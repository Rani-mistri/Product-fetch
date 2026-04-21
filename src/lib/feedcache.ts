
const KEY = "product-feed-cache";

interface FeedCache {
  products: any[];
  page: number;
  hasMore: boolean;
  scroll: number;
  search: string;
}

export function saveFeedCache(data: FeedCache) {
  if (typeof window !== "undefined" && data) {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  }
}

export function getFeedCache(): FeedCache | null {
  if (typeof window === "undefined") return null;
  try {
    const data = sessionStorage.getItem(KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}


export function clearFeedCache() {
  sessionStorage.removeItem(KEY);
}