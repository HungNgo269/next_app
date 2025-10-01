export interface Notification {
  id: number;
  userId: string;
  bookId: number;
  chapterId: number;
  read: boolean;
  created_at: Date;
  updated_at: Date;
}
export interface NotificationRow {
  userId: string;
  bookId: number;
  chapterId: number;
}
