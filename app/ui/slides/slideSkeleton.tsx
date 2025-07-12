const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export default function SlideSkeleton() {
  return (
    <div className={`${shimmer}mt-6 flow-root relative`}>
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile */}
          <div className="md:hidden">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="mb-2 w-full animate-pulse rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <div className="mr-2 h-7 w-7 rounded-full bg-gray-300" />
                      <div className="h-4 w-28 rounded bg-gray-300" />
                    </div>
                    <div className="h-3 w-40 rounded bg-gray-200" />
                  </div>
                  <div className="h-6 w-14 rounded bg-gray-200" />
                </div>
                <div className="flex w-full justify-end pt-4 gap-2">
                  <div className="h-5 w-5 rounded bg-gray-300" />
                  <div className="h-5 w-5 rounded bg-gray-300" />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 sm:pl-6">Tiêu đề</th>
                <th className="px-3 py-5">Thông tin thêm</th>
                <th className="px-3 py-5">Thứ tự hiển thị</th>
                <th className="px-3 py-5">Trạng thái</th>
                <th className="py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {[...Array(3)].map((_, i) => (
                <tr key={i} className="animate-pulse border-b text-sm">
                  <td className="py-3 pl-6 pr-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-gray-300" />
                      <div className="h-4 w-28 rounded bg-gray-200" />
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="h-3 w-40 rounded bg-gray-200" />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="h-3 w-10 rounded bg-gray-200" />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <div className="h-5 w-16 rounded bg-gray-200" />
                  </td>
                  <td className="py-3 pl-6 pr-3 whitespace-nowrap">
                    <div className="flex justify-end gap-3">
                      <div className="h-5 w-5 rounded bg-gray-300" />
                      <div className="h-5 w-5 rounded bg-gray-300" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
