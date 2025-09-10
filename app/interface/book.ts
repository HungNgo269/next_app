import { Status } from "@/app/interface/enum";

export interface Book {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_urls: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  author?: string;
  views?: number;
  publish_date?: string | Date;
  status: Status;
}
export interface BookCardProps {
  id: number;
  name: string;
  author?: string;
  image_urls: string[];
  status?: Status;
  rating?: number;
}
export interface BookImage {
  id: number;
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
