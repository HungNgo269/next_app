import { create } from "zustand";
import { UserRole } from "@/app/interface/user";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image_url?: string;
  role?: UserRole;
};

export type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export type AuthActions = {
  login: (user: AuthUser) => void;
  register: (user: AuthUser) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: AuthUser | null) => void;
};

export type AuthStore = AuthActions & AuthState;

export const defaultInitState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...defaultInitState,

  login: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    }),

  register: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
}));
