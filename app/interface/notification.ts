export interface Notification {
  id: number;
  user_id: string;
  book_id: number;
  chapter_id: number;
  read: boolean;
  title?: string;
  book_name: string;
  chapter_number: number;
  book_image: string;
  created_at: Date | string;
  updated_at: Date | string;
}
export interface NotificationRow {
  user_id: string;
  book_id: number;
  chapter_id: number;
  title?: string;
  book_name: string;
  chapter_number: number;
  book_image: string;
}
export interface NotificationUI {
  book_id: number;
  chapter_id: number;
  title?: string;
  book_name: string;
  chapter_number: number;
  book_image: string;
  created_at: Date | string;
}
