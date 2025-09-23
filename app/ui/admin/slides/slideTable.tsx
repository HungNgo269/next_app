import EditSlide from "@/app/ui/admin/slides/editSlide";
import { fetchSlidesByPageActions } from "@/app/actions/slideActions";
import { formatEnDateTime } from "@/lib/utils/formatDate";
import Active from "@/app/ui/admin/slides/active";
import { ISlide } from "@/app/interface/slide";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteSlide from "@/app/ui/admin/slides/deleteSlide";

export default async function SlideTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const slides = (await fetchSlidesByPageActions(
    query,
    currentPage
  )) as ISlide[];

  return (
    <div className="mt-4">
      <div className="md:hidden space-y-4">
        {slides?.map((slide: ISlide) => (
          <Card key={slide.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="font-medium">{slide.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {slide.description}
                  </p>
                </div>
                <Active status={slide.is_active} />
              </div>
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  Order: {slide.display_order} •{" "}
                  {formatEnDateTime(slide.created_at ?? "")}
                </div>
                <div className="flex gap-2">
                  <EditSlide slide={slide} />
                  <DeleteSlide
                    slideId={slide.id}
                    slideTitle={slide.title}
                  ></DeleteSlide>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Slide</TableHead>
              <TableHead className="font-medium">Description</TableHead>
              <TableHead className="font-medium text-center">
                Display Order
              </TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium text-center">Date</TableHead>
              <TableHead className="w-[100px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides?.map((slide: ISlide) => (
              <TableRow key={slide.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="font-medium max-w-[200px] truncate">
                      {slide.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <span className="truncate">{slide.description}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span>{slide.display_order}</span>
                </TableCell>
                <TableCell>
                  <Active status={slide.is_active} />
                </TableCell>
                <TableCell className="text-center text-sm text-muted-foreground">
                  {formatEnDateTime(slide.created_at ?? "")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-4">
                    <EditSlide slide={slide} />
                    <DeleteSlide
                      slideId={slide.id}
                      slideTitle={slide.title}
                    ></DeleteSlide>{" "}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
