export default function BookCardSkeleton() {
  return (
    <div className="flex flex-col w-full h-[400px] p-1 mt-10">
      <div className="w-full h-[300px] bg-gray-200 animate-pulse rounded"></div>
      <div className="flex flex-col mt-2.5">
        <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
      </div>
    </div>
  );
}
