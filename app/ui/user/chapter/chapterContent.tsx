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
      <div className="prose prose-lg max-w-none leading-relaxed text-justify">
        <div
          className="prose prose-lg max-w-none leading-relaxed text-justify"
          dangerouslySetInnerHTML={{ __html: chapter.content }}
        />
      </div>
    </article>
  );
}
