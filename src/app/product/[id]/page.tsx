import Link from "next/link";

export default function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="p-6">
      <Link href="/">← Back</Link>
      <h1 className="text-2xl mt-4">
        Product ID: {params.id}
      </h1>
    </div>
  );
}