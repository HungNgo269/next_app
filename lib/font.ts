import type { ReaderFont } from "@/app/store/useReaderSettings";

export function fontClass(font: ReaderFont) {
  switch (font) {
    case "serif":
      return "font-serif";
    case "sans":
      return "font-sans";
    case "mono":
      return "font-mono";
    case "inter":
      return "font-inter";
    case "georgia":
      return "font-georgia";
    case "jetbrains":
      return "font-jetbrains"; // tương tự
    default:
      return ""; // system
  }
}
