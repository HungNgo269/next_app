export interface Category {
  id: number;
  name: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
  title?: string;
}
export interface CategoryCard {
  id: string;
  name: string;
  image_url: string;
  url?: string;
}
