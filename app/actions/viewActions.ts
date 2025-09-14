import { addView } from "@/app/data/viewData";
import { ViewProps } from "@/app/interface/view";

export async function addViewActions({
  id,
  chapter_id,
  book_id,
  user_id,
  ip_address,
  user_agent,
  viewed_at,
}: ViewProps) {
  try {
    return await addView({
      id,
      chapter_id,
      book_id,
      user_id,
      ip_address,
      user_agent,
      viewed_at,
    });
  } catch (error) {
    console.error("Server Action Error:", error);
    throw new Error("Failed to fetch chapter");
  }
}
