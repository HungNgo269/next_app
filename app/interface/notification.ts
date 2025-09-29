export interface Notification {
  id: number;
  userId: string;
  bookId: number;
  chapterId: number;
  title: string;
  message: string;
  created_at: Date;
  updated_at: Date;
}
