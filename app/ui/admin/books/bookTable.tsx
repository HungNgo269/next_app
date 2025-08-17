import Image from "next/image";
import BookStatus from "./status";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import EditButton from "./editButton";
import DeleteButton from "./deleteButton";
import { BookTable } from "@/app/interface/Book";
import { fetchBooksByPageActions } from "@/app/actions/BookActions";
import { formatEnDateTime } from "@/lib/utils/formatDate";

export default async function BookTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const Books: BookTable[] = await fetchBooksByPageActions(query, currentPage);
  return (
    <div className="mt-4 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {Books?.map((Book: BookTable) => (
              <div
                key={Book.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={Book.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${Book.display_order}'s profile picture`}
                      />
                      <p>{Book.title}</p>
                    </div>
                    <p className="text-sm text-gray-500">{Book.description}</p>
                  </div>
                  <BookStatus status={Book.is_active}></BookStatus>
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
                <th scope="col" className="px-3 py-5 font-medium">
                  Description
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Display order
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {Books?.map((Book: BookTable) => (
                <tr
                  key={Book.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={Book.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${Book.display_order}'s profile picture`}
                      />
                      <p>{Book.title}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {Book.description}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    {Book.display_order}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <BookStatus status={Book.is_active}></BookStatus>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    {formatEnDateTime(Book?.created_at)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <EditButton></EditButton>
                      <DeleteButton BookId={Book.id}></DeleteButton>
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
