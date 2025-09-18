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
  google_id?: string;
}

export interface User extends UserProfile {
  password: string;
}
export interface UserOauth {
  email: string;
  name?: string;
  image_url?: string | null;
  google_id?: string;
}
