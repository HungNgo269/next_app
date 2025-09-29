import {
  fetchChaptersByPageAction,
  fetchChaptersByPageOfBookAction,
} from "@/app/actions/chapterAdminActions";
import { formatDateTime } from "@/lib/utils/formatDate";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EditChapter from "@/app/ui/admin/chapters/editChapter";
import DeleteChapter from "@/app/ui/admin/chapters/deleteChapter";
import { fetchChapterOfBookAction } from "@/app/actions/chapterActions";
import { Edit, Info } from "lucide-react";
import Link from "next/link";

interface ChapterRow {
  id: number;
  title: string;
  chapter_number: number;
  book_id: number;
  content?: string | null;
  created_at: string;
  updated_at: string;
}

export default async function ChapterTable({
  query,
  currentPage,
  bookId,
}: {
  query: string;
  currentPage: number;
  bookId?: number;
}) {
  let chapters;
  if (bookId) {
    chapters = (await fetchChaptersByPageOfBookAction(
      query,
      currentPage,
      bookId
    )) as ChapterRow[];
  } else {
    chapters = (await fetchChaptersByPageAction(
      query,
      currentPage
    )) as ChapterRow[];
  }

  return (
    <div className="mt-4">
      <div className="md:hidden space-y-4">
        {chapters?.map((chapter: ChapterRow) => (
          <Card key={chapter.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-base">{chapter.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Chapter {chapter.chapter_number} · Book {chapter.book_id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <EditChapter
                    chapter={{
                      id: chapter.id,
                      title: chapter.title,
                      chapter_number: chapter.chapter_number,
                      book_id: chapter.book_id,
                      content: chapter.content ?? "",
                    }}
                  />
                  <DeleteChapter
                    chapterId={Number(chapter.id)}
                    chapterTitle={chapter.title}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(chapter.created_at ?? "")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium text-center">
                Chapter #
              </TableHead>
              <TableHead className="font-medium text-center">Book ID</TableHead>
              <TableHead className="font-medium text-center">Created</TableHead>
              <TableHead className="w-[100px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chapters?.map((chapter: ChapterRow) => (
              <TableRow key={chapter.id}>
                <TableCell className="max-w-[250px] truncate">
                  {chapter.title}
                </TableCell>
                <TableCell className="text-center">
                  {chapter.chapter_number}
                </TableCell>
                <TableCell className="text-center">{chapter.book_id}</TableCell>
                <TableCell className="text-center text-sm text-muted-foreground">
                  {formatDateTime(chapter.created_at ?? "")}
                </TableCell>
                <TableCell>
                  <div className="flex gap-4">
                    <Link
                      href={`/dashboard/books/${chapter.book_id}/chapters/${chapter.id}`}
                    >
                      <Edit className="w-5 h-5" />
                    </Link>
                    <DeleteChapter
                      chapterId={Number(chapter.id)}
                      chapterTitle={chapter.title}
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
