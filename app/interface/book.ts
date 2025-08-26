import { Status } from "./enum";

export interface Book {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_urls: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  author?: string;
  views?: number;
  publish_date?: string;
  status: Status;
}
export interface BookCardProps {
  id: number;
  name: string;
  author: string;
  image_urls: string[];
  status?: Status;
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
export interface RecommendedBookProps {
  id: number;
  name: string;
  author: string;
  description: string;
  image_urls: string;
  badges: Array<{
    label: string;
    icon: string;
    priority: number;
  }>;
}
