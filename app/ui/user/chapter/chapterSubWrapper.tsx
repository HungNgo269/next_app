import { getBookMarkAction } from "@/app/actions/bookMarkActions";
import { IBookmark } from "@/app/interface/bookMark";
import { Chapter } from "@/app/interface/chapter";
import ChapterContent from "@/app/ui/user/chapter/chapterContent";
import PremiumGate from "@/components/premiumGate";
import { getServerReaderSettings, ReaderSettings } from "@/lib/readerSetting";
import { requireSubscription } from "@/lib/utils/stripe/subcriptionCheck";

interface ChapterSubWrapperProps {
  userId: string;
  chapter: Chapter;
  bookId: number;
  idNextChapter: number;
  idPrevChapter: number;
}

export default async function ChapterSubWrapper({
  userId,
  chapter,
  bookId,
  idNextChapter,
  idPrevChapter,
}: ChapterSubWrapperProps) {
  const settings: ReaderSettings = (await getServerReaderSettings()) || 16;
  let hasAccess = true;
  let accessReason = "";

  if (chapter.chapter_number > 1) {
    const subscriptionCheck = await requireSubscription();
    hasAccess = subscriptionCheck.hasAccess;
    accessReason = subscriptionCheck.reason || "";
  }

  return (
    <PremiumGate hasAccess={hasAccess} reason={accessReason}>
      <ChapterContent
        userId={userId}
        chapter={chapter}
        settings={settings}
        bookId={bookId}
        idNextChapter={idNextChapter}
        idPrevChapter={idPrevChapter}
      ></ChapterContent>
    </PremiumGate>
  );
}
