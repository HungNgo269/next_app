import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Chapter } from "@/app/interface/chapter";
import ViewIncrementer from "./viewIncrement";
import {
  checkNextChapterAction,
  checkPrevChapterAction,
  fetchChapterActions,
} from "./action";
import ChapterToolBar from "@/app/ui/user/chapter/chapterToolBar";
import { getServerReaderSettings, ReaderSettings } from "@/lib/readerSetting";
import ChapterContent from "@/app/ui/user/chapter/chapterContent";

type PageProps = {
  params: Promise<{
    chapterId: number;
    bookId: number;
  }>;
};

export default async function ChapterPage({ params }: PageProps) {
  const { chapterId, bookId } = await params;
  const [chapterData] = await Promise.all([fetchChapterActions(chapterId)]);
  const chapter: Chapter = chapterData;
  const [idPrevChapter, idNextChapter] = await Promise.all([
    checkPrevChapterAction(chapter.chapter_number),
    checkNextChapterAction(chapter.chapter_number),
  ]);
  const settings: ReaderSettings = (await getServerReaderSettings()) || 16;

  return (
    <div className="min-h-screen bg-background relative">
      <ViewIncrementer chapterId={chapterId} />

      {/* Main Content */}
      <div className={`max-w-4xl mx-auto px-4 py-8 `}>
        <ChapterContent chapter={chapter} settings={settings}></ChapterContent>

        {/* Navigation Buttons - Hidden on mobile/tablet */}
        <div className="hidden lg:flex justify-between items-center mt-12 pt-8 border-t">
          <Button
            variant="outline"
            disabled={!idPrevChapter}
            className={`flex items-center gap-2 bg-transparent  ${
              idPrevChapter === null ? "cursor-not-allowed" : "cursor-pointer "
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Chương trước
          </Button>
          <Button
            variant="outline"
            disabled={!idNextChapter}
            className={`flex items-center gap-2 bg-transparent  ${
              idNextChapter === null ? "cursor-not-allowed" : "cursor-pointer "
            }`}
          >
            Chương tiếp theo
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <ChapterToolBar
        iniSettings={settings}
        bookId={bookId}
        idPrev={idPrevChapter}
        idNext={idNextChapter}
      ></ChapterToolBar>
    </div>
  );
}
export const dynamic = "force-dynamic"; // Buộc SSR cho mỗi yêu cầu
