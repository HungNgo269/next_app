export interface Chapter {
  id: number;
  title: string;
  content: string;
  book_id: number;
  chapter_number: number;
  created_at: string;
  updated_at: string;
  view_count?: number;
}
export interface ChapterInfo {
  id: number;
  title: string;
  chapter_number: number;
  view_count?: number;
  created_at?: string;
  updated_at?: string;
}
export interface ChapterBase {
  id: number;
  book_id: number;
  title?: string;
  content: string;
  chapter_number: number;
  created_at?: string;
  updated_at?: string;
}
export interface ChapterStats {
  guestViews?: number;
  todayViews?: number;
  result?: any;
}

export interface ChapterWithStats extends Chapter {
  stats: ChapterStats;
}

export interface ViewResult {
  success: boolean;
  totalViews?: number;
  dailyViews?: number;
  guestViews?: number;
  isNewView?: boolean;
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
export interface ChapterCardProps {
  id: number;
  book_id: number; //=>get bookName
  title: string;
  chapter_number: number;
}
