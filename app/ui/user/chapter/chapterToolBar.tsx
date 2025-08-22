"use client";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Type,
  Info,
  Bookmark,
  BookmarkCheck,
  Sun,
  Moon,
  Minus,
  Plus,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React, { useState, useTransition } from "react";
import { ReaderSettings } from "@/lib/readerSetting";
import { updateReaderSettings } from "@/app/book/[bookId]/[chapterId]/action";

interface Props {
  iniSettings: ReaderSettings;
}

export default function ChapterToolBar({ iniSettings }: Props) {
  const [settings, setSettings] = useState(iniSettings);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { theme, setTheme } = useTheme();
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleSettingChange = (key: keyof ReaderSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    startTransition(async () => {
      await updateReaderSettings({ [key]: value });
    });
  };
  return (
    <div className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2">
      <div className="flex flex-col gap-2 bg-card border rounded-lg p-2 shadow-lg">
        <label className="block text-sm">
          Font:
          <select
            className="ml-2 rounded border px-2 py-1"
            value={settings.fontFamily}
            onChange={(e) => handleSettingChange("fontFamily", e.target.value)}
            disabled={isPending}
          >
            <option value="system">System</option>
            <option value="serif">Serif </option>
            <option value="sans">Sans </option>
            <option value="mono">Mono</option>
            <option value="georgia">Georgia</option>
            <option value="inter">Inter</option>
            <option value="jetbrains">JetBrains Mono</option>
          </select>
        </label>

        {/* Previous Chapter */}
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <ChevronLeft className="w-5 h-5" />
        </Button>

        {/* Home */}
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <Home className="w-5 h-5" />
        </Button>

        {/* Font Size Controls */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <Type className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left" className="w-48">
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Font Size</span>
                <span className="text-sm text-muted-foreground">
                  {settings.fontSize}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 bg-transparent"
                  onClick={() =>
                    handleSettingChange("fontSize", settings.fontSize - 1)
                  }
                  disabled={settings.fontSize <= 12}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <div className="flex-1 text-center text-sm">A</div>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 bg-transparent"
                  onClick={() =>
                    handleSettingChange("fontSize", settings.fontSize + 1)
                  }
                  disabled={settings.fontSize >= 24}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              {theme === "dark" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="w-4 h-4 mr-2" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Info className="w-4 h-4 mr-2" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Info */}
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <Info className="w-5 h-5" />
        </Button>

        {/* Bookmark */}
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10"
          onClick={toggleBookmark}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 fill-current" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </Button>

        {/* Next Chapter */}
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
