export interface Slide {
  id: string;
  title?: string;
  image_url: string;
  redirect_url: string;
  display_order: number;
  is_active: boolean;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface SlideResponse {
  success: boolean;
  images?: Slide[];
  slide?: Slide;
  error?: string;
  message?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SlideTable {
  id: string;
  image_url: string;
  title: string;
  display_order: number;
  is_active: boolean;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSlideRequest {
  url: string;
  alt?: string;
  title?: string;
  order: number;
}
