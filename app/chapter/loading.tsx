import PaginationSkeleton, { SlideSkeleton } from "../ui/skeletons";

export default async function Loading() {
  return (
    <div className="w=full">
      <span className="font-bold text-2xl text-start whitespace-nowrap">
        Newest Chapter
      </span>

      <div className="grid grid-cols-2 gap-4 mt-5 w-full"></div>
      <div className="mt-5 flex w-full justify-center">
        <PaginationSkeleton></PaginationSkeleton>
      </div>
    </div>
  );
}
