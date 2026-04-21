import { Skeleton } from "../ui/skeleton";

export function SkeletonCard() {
  return (
    <Skeleton className="p-4 border rounded-xl animate-pulse space-y-3">
      <Skeleton className="h-40 bg-gray-200 rounded" />
      <Skeleton className="h-4 bg-gray-200 w-3/4" />
      <Skeleton className="h-4 bg-gray-200 w-1/2" />
    </Skeleton>
  );
}