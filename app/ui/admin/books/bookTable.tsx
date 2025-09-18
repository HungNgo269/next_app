import Image from "next/image";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatEnDateTime } from "@/lib/utils/formatDate";
import Status from "@/app/ui/admin/slides/status";
import { fetchBooksByPageActions } from "@/app/actions/bookActions";
import Active from "@/app/ui/admin/slides/active";
import { BookTableProps } from "@/app/interface/book";

export default async function BookTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const Books = (await fetchBooksByPageActions(
    query,
    currentPage
  )) as unknown as BookTableProps[];
  return (
    <div className="mt-4 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {Books?.map((Book: BookTableProps) => (
              <div
                key={Book.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={Book.image_urls[0]}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${Book}'s profile picture`}
                      />
                      <p>{Book.name}</p>
                    </div>
                  </div>
                  <Active status={Book.is_active}></Active>
                  <Status status={Book.status}></Status>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div className="flex justify-end gap-2">
                    <PencilIcon className="w-5" />
                    <TrashIcon className="w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Book
                </th>
                <th scope="col" className="px-3 py-5 font-medium ">
                  Active
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>

                <th scope="col" className="px-3 py-5 font-medium text-center">
                  Date
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {Books?.map((Book: BookTableProps) => (
                <tr
                  key={Book.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={Book.image_urls[0]}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${Book}'s profile picture`}
                      />
                      <p>{Book.name}</p>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-3 py-3">
                    <Active status={Book.is_active}></Active>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Status status={Book.status}></Status>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    {formatEnDateTime(Book?.created_at ?? new Date())}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {/* <EditButton></EditButton>
                      <DeleteButton BookId={Book.id}></DeleteButton> */}
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
