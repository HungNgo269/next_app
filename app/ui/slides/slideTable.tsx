import Image from "next/image";
import SlideStatus from "./status";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import EditButton from "./editButton";
import DeleteButton from "./deleteButton";
import { SlideTable } from "@/app/interface/slide";
import { fetchSlidesByPageActions } from "@/app/actions/slideActions";
import { formatEnDateTime } from "@/lib/utils/formatDate";

export default async function SlideTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const slides: SlideTable[] = await fetchSlidesByPageActions(
    query,
    currentPage
  );
  return (
    <div className="mt-4 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {slides?.map((slide: SlideTable) => (
              <div
                key={slide.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={slide.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${slide.display_order}'s profile picture`}
                      />
                      <p>{slide.title}</p>
                    </div>
                    <p className="text-sm text-gray-500">{slide.description}</p>
                  </div>
                  <SlideStatus status={slide.is_active}></SlideStatus>
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
                  Slide
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
              {slides?.map((slide: SlideTable) => (
                <tr
                  key={slide.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={slide.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${slide.display_order}'s profile picture`}
                      />
                      <p>{slide.title}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {slide.description}
                  </td>

                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    {slide.display_order}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <SlideStatus status={slide.is_active}></SlideStatus>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    {formatEnDateTime(slide?.created_at)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <EditButton></EditButton>
                      <DeleteButton slideId={slide.id}></DeleteButton>
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
