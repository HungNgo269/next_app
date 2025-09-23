import { Chapter } from "@/app/interface/chapter";
import PremiumGate from "@/components/premiumGate";
import { ReaderSettings } from "@/lib/readerSetting";
import { requireSubscription } from "@/lib/utils/stripe/subcriptionCheck";

interface ChapterContentProps {
  chapter: Chapter;
  settings: ReaderSettings;
}

export default async function ChapterContent({
  chapter,
  settings,
}: ChapterContentProps) {
  const contentStyle = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSize}px`,
    lineHeight: settings.lineHeight,
  };
  console.log("chec", settings);
  let hasAccess = true;
  let accessReason = "";

  if (chapter.chapter_number > 1) {
    const subscriptionCheck = await requireSubscription();
    hasAccess = subscriptionCheck.hasAccess;
    accessReason = subscriptionCheck.reason || "";
  }
  return (
    <PremiumGate hasAccess={hasAccess} reason={accessReason}>
      <article className={`max-w-4xl mx-auto px-4 py-8`} style={contentStyle}>
        <div className="prose prose-lg max-w-none leading-relaxed text-justify">
          <div
            className="prose prose-lg max-w-none leading-relaxed text-justify"
            dangerouslySetInnerHTML={{ __html: chapter.content }}
          />
        </div>
      </article>
    </PremiumGate>
  );
}
