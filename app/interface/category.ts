export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  url?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface CategoryCard {
  id: string;
  name: string;
  image_url: string;
  url?: string;
}
