import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchProductById(id).catch(() => null);

  if (!product) notFound();

  return (
    <div className="max-w-5xl mx-auto p-6 md:py-12">
      {/* Simple Navigation */}

<Link 
  href="/" 
  scroll={false} // Prevents Next.js from forcing scroll to top immediately
  className="text-gray-500 hover:text-black text-sm"
>
  ← Back to products
</Link>


      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left: Clean Image Area */}
        <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center border">
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            className="max-h-100 object-contain"
          />
        </div>

        {/* Right: Essential Info */}
        <div className="flex flex-col">
          <span className="text-blue-600 text-xs font-bold uppercase">{product.category}</span>
          <h1 className="text-3xl font-bold mt-1 text-gray-900">{product.title}</h1>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-semibold">⭐ {product.rating}</span>
            <span className="text-gray-300 text-xs">|</span>
            <span className="text-green-600 text-sm font-medium">In Stock</span>
          </div>

          <p className="text-3xl font-bold mt-6">₹{product.price.toLocaleString()}</p>
          
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-tight">Description</h3>
            <p className="mt-2 text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Clean Buttons */}
          <div className="mt-auto pt-8 space-y-3">
            <Button className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition">
              Add to Cart
            </Button>
            <Button className="w-full bg-white border border-gray-300 py-3 rounded-md font-semibold hover:bg-gray-50 transition">
              Save to Wishlist
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
