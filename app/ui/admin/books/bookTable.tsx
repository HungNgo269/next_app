import EditBook from "@/app/ui/admin/books/editBook";
import UploadBook from "@/app/ui/admin/books/uploadBook";
import DeleteBook from "@/app/ui/admin/books/deleteBook";
import {
  fetchBooksByPageActions,
  fetchTotalChapterInBookByIdAction,
} from "@/app/actions/bookActions";
import { formatEnDate, formatEnDateTime } from "@/lib/utils/formatDate";
import Active from "@/app/ui/admin/slides/active";
import StatusLabel from "@/app/ui/admin/slides/status";
import { Book, BookTableProps } from "@/app/interface/book";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BookViewCount from "@/app/ui/admin/books/bookChapterCount";
import BookChapterCount from "@/app/ui/admin/books/bookChapterCount";

export default async function BookTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const books = (await fetchBooksByPageActions(query, currentPage)) as Book[];

  return (
    <div className="mt-4">
      <div className="md:hidden space-y-4">
        {books?.map((book: Book) => (
          <Card key={book.id}>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                  <Image
                    src={book.image_urls?.[0] || "/placeholder.svg"}
                    alt={book.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-base">{book.name}</p>
                  {book.status && <StatusLabel status={book.status} />}
                </div>
                <Active status={book.is_active} />
              </div>
              {book.author && (
                <p className="text-sm text-muted-foreground">
                  Author: {book.author}
                </p>
              )}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{formatEnDateTime(book.created_at ?? "")}</span>
                <div className="flex gap-2">
                  <EditBook book={{ ...book, id: Number(book.id) }} />
                  <DeleteBook bookId={Number(book.id)} bookTitle={book.name} />
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
              <TableHead className="font-medium">Book</TableHead>
              <TableHead className="font-medium">Author</TableHead>
              <TableHead className="font-medium text-center">Status</TableHead>
              <TableHead className="font-medium">Active</TableHead>
              <TableHead className="font-medium text-center">
                Chapters
              </TableHead>
              <TableHead className="font-medium text-center">Views</TableHead>
              <TableHead className="font-medium text-center">
                Publish Date
              </TableHead>

              <TableHead className="w-[100px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books?.map((book: Book) => (
              <TableRow key={book.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-md border">
                      <Image
                        src={book.image_urls?.[0] || "/placeholder.svg"}
                        alt={book.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium max-w-[200px] truncate">
                      {book.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {book.author || "-"}
                </TableCell>
                <TableCell className="text-center">
                  {book.status ? <StatusLabel status={book.status} /> : "-"}
                </TableCell>
                <TableCell>
                  <Active status={book.is_active} />
                </TableCell>
                <TableCell className="text-center">
                  <BookChapterCount bookId={book.id} />
                </TableCell>
                <TableCell className="text-center">
                  {book.views || "-"}
                </TableCell>
                <TableCell className="text-center text-sm text-muted-foreground">
                  {formatEnDate(book.publish_date ?? "")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-4">
                    <EditBook book={{ ...book, id: Number(book.id) }} />
                    <DeleteBook
                      bookId={Number(book.id)}
                      bookTitle={book.name}
                    />
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
