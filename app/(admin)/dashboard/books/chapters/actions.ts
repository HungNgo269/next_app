import { uploadChapterContent } from "@/app/data/admin/chapterData";
import { ChapterUploadProps } from "@/app/interface/chapter";

export async function uploadChapterContentAction(props: ChapterUploadProps) {
  try {
    return await uploadChapterContent(props);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch Slides.");
  }
}
