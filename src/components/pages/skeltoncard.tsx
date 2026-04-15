export default function SkeletonCard() {
  return (
    <div className="animate-pulse border rounded-xl p-3">
      <div className="h-40 bg-gray-200 mb-2 rounded" />
      <div className="h-4 bg-gray-200 mb-2 w-3/4" />
      <div className="h-4 bg-gray-200 mb-1 w-1/2" />
      <div className="h-3 bg-gray-200 w-1/3" />
    </div>
  );
}