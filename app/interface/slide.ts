export interface ISlide {
  id: number;
  title: string;
  image_url: string;
  redirect_url: string;
  display_order: number;
  is_active: boolean;
  public_id: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface SlideResponse {
  success: boolean;
  images?: ISlide[];
  slide?: ISlide;
  error?: string;
  message?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSlideRequest {
  url: string;
  alt?: string;
  title?: string;
  order: number;
}
