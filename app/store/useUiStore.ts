import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";
export type Language = "vi" | "en";

export type UIState = {
  theme: Theme;
  language: Language;
  sidebarCollapsed: boolean;
  notifications: boolean;
};

export type UIActions = {
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setNotifications: (enabled: boolean) => void;
};

export type UIStore = UIActions & UIState;

const defaultUIState: UIState = {
  theme: "system",
  language: "vi",
  sidebarCollapsed: false,
  notifications: true,
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      ...defaultUIState,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setNotifications: (notifications) => set({ notifications }),
    }),
    {
      name: "ui-preferences",
    }
  )
);
