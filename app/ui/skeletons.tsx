// Loading animation
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}>
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
      <div className="rounded-xl bg-gray-100 p-4">
        <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4" />
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-200" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b border-gray-100 py-4">
      <div className="flex items-center">
        <div className="mr-2 h-8 w-8 rounded-full bg-gray-200" />
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md bg-gray-200" />
          <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
        </div>
      </div>
      <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
    </div>
  );
}

export function LatestInvoicesSkeleton() {
  return (
    <div
      className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}
    >
      <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-100 p-4">
        <div className="bg-white px-6">
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
        </div>
        <div className="flex items-center pb-2 pt-6">
          <div className="h-5 w-5 rounded-full bg-gray-200" />
          <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <div
        className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-gray-100`}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <RevenueChartSkeleton />
        <LatestInvoicesSkeleton />
      </div>
    </>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="w-full border-b border-gray-100 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      {/* Customer Name and Image */}
      <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-24 rounded bg-gray-100"></div>
        </div>
      </td>
      {/* Email */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-32 rounded bg-gray-100"></div>
      </td>
      {/* Amount */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Date */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Status */}
      <td className="whitespace-nowrap px-3 py-3">
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </td>
      {/* Actions */}
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
          <div className="h-[38px] w-[38px] rounded bg-gray-100"></div>
        </div>
      </td>
    </tr>
  );
}

export function InvoicesMobileSkeleton() {
  return (
    <div className="mb-2 w-full rounded-md bg-white p-4">
      <div className="flex items-center justify-between border-b border-gray-100 pb-8">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full bg-gray-100"></div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
        </div>
        <div className="h-6 w-16 rounded bg-gray-100"></div>
      </div>
      <div className="flex w-full items-center justify-between pt-4">
        <div>
          <div className="h-6 w-16 rounded bg-gray-100"></div>
          <div className="mt-2 h-6 w-24 rounded bg-gray-100"></div>
        </div>
        <div className="flex justify-end gap-2">
          <div className="h-10 w-10 rounded bg-gray-100"></div>
          <div className="h-10 w-10 rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  );
}

export function InvoicesTableSkeleton() {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
            <InvoicesMobileSkeleton />
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Customer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
              <TableRowSkeleton />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export function SlideSkeleton() {
  return (
    <div
      className={`${shimmer} relative w-full mx-auto bg-white shadow-lg overflow-hidden`}
    >
      <div className="relative h-[450px] md:h-[500px] overflow-hidden">
        {/* Main skeleton slide */}
        <div className="w-full h-full relative">
          {/* Image skeleton */}
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />

          {/* Gradient overlay skeleton */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-300/50 to-transparent" />

          {/* Content skeleton */}
          <div className="absolute inset-0 flex items-center">
            <div className="p-8 md:p-12 max-w-2xl space-y-4">
              {/* Title skeleton */}
              <div className="space-y-2">
                <div className="h-8 md:h-12 bg-gray-300 rounded animate-pulse w-3/4" />
                <div className="h-8 md:h-12 bg-gray-300 rounded animate-pulse w-1/2" />
              </div>

              {/* Description skeleton */}
              <div className="space-y-2">
                <div className="h-5 md:h-6 bg-gray-300 rounded animate-pulse w-full" />
                <div className="h-5 md:h-6 bg-gray-300 rounded animate-pulse w-2/3" />
              </div>

              {/* Button skeleton */}
              <div className="h-12 w-32 bg-gray-300 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Navigation buttons skeleton */}
        <div className="absolute right-24 bottom-0 -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full animate-pulse shadow-lg" />
        <div className="absolute right-4 bottom-0 -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full animate-pulse shadow-lg" />
        <div className="absolute bottom-0 right-14 -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full animate-pulse shadow-lg" />
      </div>

      {/* Slide indicators skeleton */}
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
