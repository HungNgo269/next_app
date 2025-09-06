import { Metadata } from "next";
import { fetchSlidePages } from "@/app/data/admin/slideData";
import ChapterEditor from "@/app/ui/admin/text-editor/chapterEditor";

export const metadata: Metadata = {
  title: "Chapter",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchSlidePages(query);

  return (
    <div className="max-w-7xl mx-auto p-8">
      <ChapterEditor></ChapterEditor>
    </div>
  );
}
