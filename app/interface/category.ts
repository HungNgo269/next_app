export interface Category {
  id: string;
  name: string;
  url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CategoryCard {
  id: string;
  name: string;
  image_url: string;
  url?: string;
}
