import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Chapter } from "@/app/interface/chapter";
import ViewIncrementer from "./viewIncrement";
import { fetchChapterActions } from "./action";
import ChapterToolBar from "@/app/ui/user/chapter/chapterToolBar";
import { getServerReaderSettings, ReaderSettings } from "@/lib/readerSetting";
import ChapterContent from "@/app/ui/user/chapter/chapterContent";

type PageProps = {
  params: Promise<{
    chapterId: string;
  }>;
};

export default async function ChapterPage({ params }: PageProps) {
  const { chapterId } = await params;
  const [chapterData] = await Promise.all([fetchChapterActions(chapterId)]);
  const chapter: Chapter = chapterData;
  const settings: ReaderSettings = (await getServerReaderSettings()) || 16;

  return (
    <div className="min-h-screen bg-background relative">
      <ViewIncrementer chapterId={chapterId} />

      {/* Main Content */}
      <div className={`max-w-4xl mx-auto px-4 py-8 `}>
        {/* Chapter Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Phần 1</h1>
          <h2 className="text-xl font-semibold mb-4">Chương 02</h2>
          <div className="text-sm text-muted-foreground space-x-4">
            <span>0 Bình luận</span>
            <span>-</span>
            <span>Độ dài: 2.331 từ</span>
            <span>-</span>
            <span>Cập nhật: 1 giờ</span>
          </div>
        </div>
        <ChapterContent chapter={chapter} settings={settings}></ChapterContent>

        {/* Navigation Buttons - Hidden on mobile/tablet */}
        <div className="hidden lg:flex justify-between items-center mt-12 pt-8 border-t">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            Chương trước
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            Chương tiếp theo
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <ChapterToolBar iniSettings={settings}></ChapterToolBar>
    </div>
  );
}
export const dynamic = "force-dynamic"; // Buộc SSR cho mỗi yêu cầu
