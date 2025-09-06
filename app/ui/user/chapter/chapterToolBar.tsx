"use client";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Info,
  Bookmark,
  BookmarkCheck,
  Sun,
  Moon,
  Minus,
  Plus,
  TypeIcon,
  ALargeSmall,
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
import Link from "next/link";
import { updateReaderSettings } from "@/app/book/[bookId]/chapter/[chapterId]/action";

interface Props {
  iniSettings: ReaderSettings;
  bookId: number;
  idPrev?: number | undefined | null;
  idNext?: number | undefined | null;
}

export default function ChapterToolBar({
  iniSettings,
  bookId,
  idPrev,
  idNext,
}: Props) {
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
    <div className="hidden lg:block fixed right-4 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col gap-2 bg-card border rounded-lg shadow-lg items-center ">
        <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/book/${bookId}`}>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10"
            title="Trang chủ"
          >
            <Home className="w-5 h-5 " />
          </Button>
        </Link>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-10 h-10 ">
              <TypeIcon className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="left"
            className="w-56 "
            sideOffset={5}
            alignOffset={0}
            avoidCollisions={true}
            collisionPadding={8}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Font Family</span>
              </div>
              <select
                className="w-full rounded border px-3 py-2 text-sm bg-background"
                value={settings.fontFamily}
                onChange={(e) =>
                  handleSettingChange("fontFamily", e.target.value)
                }
                disabled={isPending}
              >
                <option value="system">System Default</option>
                <option value="serif">Serif</option>
                <option value="sans">Sans Serif</option>
                <option value="mono">Monospace</option>
                <option value="georgia">Georgia</option>
                <option value="inter">Inter</option>
                <option value="jetbrains">JetBrains Mono</option>
              </select>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              <ALargeSmall className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="left"
            className="w-48"
            sideOffset={5}
            alignOffset={0}
            avoidCollisions={true}
            collisionPadding={8}
          >
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Font size</span>
                <span className="text-sm text-muted-foreground font-mono">
                  {settings.fontSize}px
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() =>
                    handleSettingChange(
                      "fontSize",
                      Math.max(12, settings.fontSize - 1)
                    )
                  }
                  disabled={settings.fontSize <= 12 || isPending}
                  title="Giảm cỡ chữ"
                >
                  <Minus className="w-3 h-3" />
                </Button>

                <div className="flex-1 text-center">
                  <span
                    className="text-lg font-medium select-none"
                    style={{ fontSize: `${Math.min(20, settings.fontSize)}px` }}
                  >
                    Aa
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() =>
                    handleSettingChange(
                      "fontSize",
                      Math.min(24, settings.fontSize + 1)
                    )
                  }
                  disabled={settings.fontSize >= 24 || isPending}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>

              <div className="mt-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={settings.fontSize}
                  onChange={(e) =>
                    handleSettingChange("fontSize", parseInt(e.target.value))
                  }
                  disabled={isPending}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="w-10 h-10">
              {theme === "dark" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="left"
            sideOffset={5}
            alignOffset={0}
            avoidCollisions={true}
            collisionPadding={8}
          >
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="cursor-pointer"
            >
              <Sun className="w-4 h-4 mr-2" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="cursor-pointer"
            >
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="cursor-pointer"
            >
              <Info className="w-4 h-4 mr-2" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10"
          title="Thông tin"
        >
          <Info className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10"
          onClick={toggleBookmark}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 fill-current text-yellow-500" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </Button>

        <div className="w-full h-px bg-border my-1" />

        <Link
          href={
            idPrev != null
              ? `${process.env.NEXT_PUBLIC_BASE_URL}/book/${bookId}/chapter/${idPrev}`
              : `${process.env.NEXT_PUBLIC_BASE_URL}/book/${bookId}`
          }
          aria-disabled={idPrev == null} // Ngăn điều hướng bằng bàn phím
          onClick={(e) => idPrev == null && e.preventDefault()} // Ngăn click khi không có idNext
        >
          <Button
            disabled={!idPrev}
            variant="ghost"
            size="icon"
            className={`w-10 h-10 ${
              idPrev === null
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer "
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Link
          href={
            idNext != null
              ? `${process.env.NEXT_PUBLIC_BASE_URL}/book/${bookId}/chapter/${idNext}`
              : `${process.env.NEXT_PUBLIC_BASE_URL}/book/${bookId}`
          }
          aria-disabled={idNext == null}
          onClick={(e) => idNext == null && e.preventDefault()}
        >
          <Button
            disabled={!idPrev}
            variant="ghost"
            size="icon"
            className={`w-10 h-10 ${
              idNext === null
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer "
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
