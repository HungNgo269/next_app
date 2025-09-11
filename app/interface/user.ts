export type UserRole = "user" | "admin" | "subUser" | "editor";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  image_url?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}
