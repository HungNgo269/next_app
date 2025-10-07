export interface ViewProps {
  id: string;
  chapter_id: string;
  book_id: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  viewed_at?: string | Date;
}
export interface ViewMetadata {
  chapterId: number;
  bookId: number;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp: string;
}

export interface ViewResult {
  success: boolean;
  isNewView?: boolean;
  error?: string;
}
