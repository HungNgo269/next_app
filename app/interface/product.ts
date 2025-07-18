export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id: string;
  image_urls: string[];
  stock_quantity: number;
  sku: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  author?: string;
}
export interface IProductCard {
  id: string;
  name: string;
  price: number;
  image_urls: string[];
  sold: number;
}
export interface IProductImage {
  image_urls: string[];
  description?: string;
  name?: string;
}
