import { Status } from "./enum";

export interface Book {
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
  views?: number;
}
export interface BookCard {
  id: string;
  name: string;
  author: string;
  image_urls: string[];
}
export interface BookImage {
  id: string;
  name: string;
  image_urls: string[];
  description?: string;
}
export interface BookTableProps {
  id: string;
  name: string;
  status: Status;
  image_urls: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
