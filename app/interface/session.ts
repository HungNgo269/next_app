import { UserRole } from "@/app/interface/user";

export default interface UserToken {
  id: string;
  name: string;
  email: string;
  role?: UserRole;
  phone?: string;
  image_url?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}
