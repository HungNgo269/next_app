"use client";

import { useUIStore } from "@/app/store/useUiStore";

export default function ThemeToggle() {
  const { theme, setTheme } = useUIStore();

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm">Theme:</label>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        className="border rounded p-1"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}
