"use client";

import { useEffect } from "react";
import { incrementChapterView } from "./action";

interface ViewIncrementerProps {
  userId: string;
  chapterId: number;
  bookId: number;
}

export default function ViewIncrementer({
  userId,
  chapterId,
  bookId,
}: ViewIncrementerProps) {
  useEffect(() => {
    // Increment view khi component mount
    const incrementView = async () => {
      try {
        const result = await incrementChapterView(chapterId, bookId, userId);
        console.log("check", result);
        if (result.success) {
        } else {
          console.error("Failed to increment view:", result.error);
        }
      } catch (error) {
        console.error("Error incrementing view:", error);
      }
    };

    incrementView();
  }, [chapterId]);
  return null;
}
