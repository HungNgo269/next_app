export interface ViewProps {
  id: string;
  chapter_id: string;
  book_id: string;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  viewed_at?: string | Date;
}
