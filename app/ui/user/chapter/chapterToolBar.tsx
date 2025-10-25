"use client";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Info,
  BookmarkCheck,
  Sun,
  Moon,
  Minus,
  Plus,
  TypeIcon,
  ALargeSmall,
  Bookmark,
  Loader2,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { ReaderSettings } from "@/lib/readerSetting";
import Link from "next/link";
import { updateReaderSettings } from "@/app/book/[bookId]/chapter/[chapterId]/action";
import { IBookmark } from "@/app/interface/bookMark";

interface Props {
  iniSettings: ReaderSettings;
  bookId: number;
  idPrev?: number | undefined | null;
  idNext?: number | undefined | null;
  bookMarkOnClick: () => void;
  bookMark: IBookmark | undefined | null;
}

export default function ChapterToolBar({
  iniSettings,
  bookId,
  idPrev,
  idNext,
  bookMarkOnClick,
  bookMark,
}: Props) {
  const [settings, setSettings] = useState(iniSettings);
  const [isPending, startTransition] = useTransition();
  const { theme, setTheme } = useTheme();
  const [scrollDown,setScrollDown] = useState(false);
  useEffect(()=>{
    let lastY = window.scrollY;
    const handleScroll =()=>{
      const currentScrollY = window.scrollY
      if(currentScrollY>lastY){
          setScrollDown(true)
      }
      else{
        setScrollDown(false)
      }
       lastY = currentScrollY;
    }
  window.addEventListener('scroll', handleScroll);

    return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
  const [loadingBtn, setLoadingBtn] = useState<"prev" | "next" | null>(null);
  const handleSettingChange = (key: keyof ReaderSettings, value: any) => {
    const newSettings = { ...settings, [key]: value }; //fontsize :16(etc)
    setSettings(newSettings);
    startTransition(async () => {
      await updateReaderSettings({ [key]: value });
    });
  };
  return (
    <div className={`
      ${scrollDown? "hidden lg:block" :"block"}
       fixed lg:right-4 bottom-0 left-0 lg:bottom-auto lg:left-auto
     lg:top-1/2 lg:-translate-y-1/2 z-50 lg:w-fit w-full transition delay-150 duration-300 ease-in-out`}>
      <div  className={` flex
      flex-row 
      lg:flex-col lg:gap-2 bg-card border rounded-lg
       shadow-lg items-center justify-between `}>
        <Link
          className="lg:hidden block"
          prefetch={true}
          href={
            idPrev != null
              ? `/book/${bookId}/chapter/${idPrev}`
              : `/book/${bookId}`
          }
          onClick={(e) => idPrev == null && e.preventDefault()} // Ngăn click khi không có prev
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
        <Link prefetch={true} href={`/book/${bookId}`}>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10"
            title="Home Page"
          >
            <Home className="w-5 h-5 " />
          </Button>
        </Link>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              title="Font"
              className="w-10 h-10 "
            >
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
                <option value="lusitana">Lusitana</option>
                <option value="georgia">Georgia</option>
                <option value="inter">Inter</option>
                <option value="jetbrains">JetBrains Mono</option>
              </select>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              title="FontSize"
              className="w-10 h-10"
            >
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
                  title="Decrease FontSize"
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
                  title="Increase FontSize"
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
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              title="Theme"
              className="w-10 h-10"
            >
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
              title="Light"
            >
              <Sun className="w-4 h-4 mr-2" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              title="Dark"
              className="cursor-pointer"
            >
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem
              title="System"
              onClick={() => setTheme("system")}
              className="cursor-pointe"
            >
              <Info className="w-4 h-4 mr-2" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 hidden lg:flex"
          title="Report"
        >
          <Info className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10"
          title="Book Mark"
          onClick={bookMarkOnClick}
        >
          {bookMark ? (
            <BookmarkCheck className="w-5 h-5 fill-current text-primary" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
        </Button>
        <div className="w-full h-px bg-border my-1 lg:block hidden " />

        <Link
          className="hidden lg:block"
          prefetch={true}
          href={
            idPrev != null
              ? `/book/${bookId}/chapter/${idPrev}`
              : `/book/${bookId}`
          }
          aria-disabled={idPrev == null}
          onClick={(e) => {
            if (!idPrev) {
              e.preventDefault();
              return;
            }
            setLoadingBtn("prev");
          }}
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
            {loadingBtn === "prev" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </Link>
        <Link
          prefetch={true}
          href={
            idNext != null
              ? `/book/${bookId}/chapter/${idNext}`
              : `/book/${bookId}`
          }
          aria-disabled={idNext == null}
          onClick={(e) => {
            if (!idNext) {
              e.preventDefault();
              return;
            }
            setLoadingBtn("next");
          }}
        >
          <Button
            disabled={!idNext}
            variant="ghost"
            size="icon"
            className={`w-10 h-10 ${
              idNext === null
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer "
            }`}
          >
            {loadingBtn === "next" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
}
