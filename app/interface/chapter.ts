export interface Chapter {
  id: string;
  title: string;
  content: string;
  book_id: string;
  chapter_number: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterStats {
  totalViews: number;
  uniqueViews: number;
  todayViews: number;
}

export interface ChapterWithStats extends Chapter {
  stats: ChapterStats;
}

export interface ViewResult {
  success: boolean;
  totalViews?: number;
  dailyViews?: number;
  error?: string;
  message?: string;
}

export interface ViewHistoryItem {
  date: string;
  views: number;
}

export interface TopChapter {
  rank: number;
  chapterId: string;
  views: number;
}

export interface ChapterUploadProps {
  book_id: number;
  title: string;
  chapter_number: number;
  content: string;
}
