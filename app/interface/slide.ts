export interface ISlide {
  id: number;
  title?: string;
  image_url: string;
  redirect_url: string;
  display_order: number;
  is_active: boolean;
  description: string;
}

export interface ISlideResponse {
  success: boolean;
  images?: ISlide[];
  slide?: ISlide;
  error?: string;
  message?: string;
}

export interface ICreateSlideRequest {
  url: string;
  alt?: string;
  title?: string;
  order: number;
}
