export interface Product {
  id: number;
  title: string;
  price: number;
  rating: number;
  images: string[];
}

export const fetchProducts = async (
  page: number,
  limit: number,
  query: string
) => {
  const skip = (page - 1) * limit;

  const url = query
    ? `https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${skip}`
    : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json();
};