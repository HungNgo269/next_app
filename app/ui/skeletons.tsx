const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";
export function SlideSkeleton() {
  return (
    <div
      className={`${shimmer} relative w-full mx-auto bg-white shadow-lg overflow-hidden`}
    >
      <div className="relative h-[450px] md:h-[500px] overflow-hidden">
        <div className="w-full h-full relative">
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="p-8 md:p-12 max-w-2xl space-y-4">
              <div className="space-y-2">
                <div className="h-8 md:h-12 bg-gray-300 rounded animate-pulse w-3/4" />
                <div className="h-8 md:h-12 bg-gray-300 rounded animate-pulse w-1/2" />
              </div>
              <div className="space-y-2">
                <div className="h-5 md:h-6 bg-gray-300 rounded animate-pulse w-full" />
                <div className="h-5 md:h-6 bg-gray-300 rounded animate-pulse w-2/3" />
              </div>
              <div className="h-12 w-32 bg-gray-300 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
        <div className="absolute right-24 bottom-0 -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full animate-pulse shadow-lg" />
        <div className="absolute right-4 bottom-0 -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full animate-pulse shadow-lg" />
        <div className="absolute bottom-0 right-14 -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full animate-pulse shadow-lg" />
      </div>
      <div className="flex justify-center items-center space-x-2 py-4 bg-transparent absolute z-10 bottom-0 left-0 right-0">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full animate-pulse ${
              index === 0 ? "bg-gray-400 scale-110" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

type Variant = "lg" | "sm";

const MAP = {
  lg: {
    card: "w-[230px] h-[355px]",
    imgWrap: "w-[230px] h-[300px]",
    title: "h-4",
    author: "h-3",
  },
  sm: {
    card: "w-[160px] h-[259px]",
    imgWrap: "w-[160px] h-[207px]",
    title: "h-3",
    author: "h-3",
  },
} as const;

export function BookCardSkeleton({ variant = "lg" }: { variant?: Variant }) {
  const s = MAP[variant];

  return (
    <div className={`flex flex-col p-1 ${s.card} ${shimmer}`}>
      <div
        className={`relative overflow-hidden rounded-[8px] bg-muted animate-pulse ${s.imgWrap}`}
      >
        <div className="w-full h-full bg-gradient-to-br from-muted to-muted/80" />
      </div>

      <div className="flex flex-col mt-3 h-[43px] justify-between">
        <div className={`bg-muted animate-pulse rounded ${s.title} w-3/4`} />

        <div
          className={`bg-muted/70 animate-pulse rounded ${s.author} w-1/2`}
        />
      </div>
    </div>
  );
}
