"use client";

import { useEffect } from "react";
import { incrementChapterView } from "./action";
import { useAuthStore } from "@/app/store/useAuthStore";

interface ViewIncrementerProps {
  chapterId: number;
}

export default function ViewIncrementer({ chapterId }: ViewIncrementerProps) {
  const userId = useAuthStore((state) => state.user?.id);
  useEffect(() => {
    // Increment view khi component mount
    const incrementView = async () => {
      try {
        const result = await incrementChapterView(chapterId, userId);

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
