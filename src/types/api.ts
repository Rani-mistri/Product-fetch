import { Product } from "@/types";

const API ="https://dummyjson.com/products"

export async function fetchProducts(
  page: number,
  search: string,
  signal?: AbortSignal
) {
  const limit = 12;
  const skip = (page - 1) * limit;

  const url = search
    ? `${API}/search?q=${search}&limit=${limit}&skip=${skip}`
    : `${API}?limit=${limit}&skip=${skip}`;

  const res = await fetch(url, { signal });

  if (!res.ok) throw new Error("Failed");

  const data = await res.json();

  return {
    products: data.products.map((p: any): Product => ({
      id: p.id,
      title: p.title,
      price: p.price * 80,
      rating: p.rating,
      image: p.thumbnail,
      category: p.category,
      description:p.description
    })),
    hasMore: skip + limit < data.total,
    total: data.total,
  };
}


export async function fetchProductById(id: string) {
  try {
    const res = await fetch(
      `${API}/${id}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const p = await res.json();

    return {
      id: p.id,
      title: p.title,
      price: p.price * 80,
      rating: p.rating,
      stock: p.stock,
      description: p.description,
      image: p.thumbnail,
      category: p.category,
    };
  } catch {
    return null;
  }
}