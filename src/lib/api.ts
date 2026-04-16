export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  images: string[];
  thumbnail:string;
  description:string;
  category:string;
}

export const fetchProducts = async (
  page: number,
  limit: number,
  query: string,
  options?: { signal?: AbortSignal } // 1. Add options parameter
) => {
  const skip = (page - 1) * limit;

  const url = query
    ? `https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${skip}`
    : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

  // 2. Pass the signal to the fetch call
  const res = await fetch(url, {
    signal: options?.signal,
  });

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
};


export const fetchProductById = async (slug: string): Promise<Product> => {
  const url = `https://dummyjson.com/products/${slug}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  return res.json();
};