export type UserRole = "user" | "admin" | "subUser" | "editor";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  phone?: string | null;
  image_url?: string | null;
  address?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface User extends UserProfile {
  password: string;
}
