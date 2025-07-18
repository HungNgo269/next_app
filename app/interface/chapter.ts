export interface IChapter {
  id: string;
  product_id: string;
  title: string;
  chapter_number: number;
  content: string;
  audio_url?: string;
  durations: number;
  is_free: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
