import { Chapter } from "@/app/interface/chapter";
import { ReaderSettings } from "@/lib/readerSetting";

interface ChapterContentProps {
  chapter: Chapter;
  settings: ReaderSettings;
}

export default function ChapterContent({
  chapter,
  settings,
}: ChapterContentProps) {
  const contentStyle = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
  };
  return (
    <article className={`max-w-4xl mx-auto px-4 py-8`} style={contentStyle}>
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
      <div className="prose prose-lg max-w-none leading-relaxed text-justify">
        <div
          className="prose prose-lg max-w-none leading-relaxed text-justify"
          dangerouslySetInnerHTML={{ __html: chapter.content }}
        />
      </div>
    </article>
  );
}
