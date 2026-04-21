import { fetchProductById } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
import {  FaArrowLeft, FaStar } from "react-icons/fa";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
 
  const { id } = await params;

  const product = await fetchProductById(id);

  if (!product) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-red-500 text-lg">
           Failed to load product
        </p>

        <Link href="/" className="underline flex items-center gap-2">
         <FaArrowLeft className="text-sm"/> Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Link href="/" className="hover:underline flex items-center gap-2">
      <FaArrowLeft className="text-sm "/>
         Back to products
      </Link>

      <Image
        src={product.image}
        alt={product.title}
        width={500}
        height={300}
        className="rounded"
        priority
      />

      <h1 className="text-2xl font-bold">
        {product.title}
      </h1>

      <p className="text-gray-500">{product.category}</p>

      <p className="text-xl font-semibold">
        ₹{product.price.toLocaleString()}
      </p>

      <p>
        <FaStar className="inline-block text-yellow-400 text-[20px]"/> {product.rating} ({product.stock} in stock)
      </p>

      <p>{product.description}</p>
    </div>
  );
}