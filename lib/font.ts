export type ReaderFont =
  | "serif"
  | "sans"
  | "mono"
  | "inter"
  | "georgia"
  | "jetbrains";

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
