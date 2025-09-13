export type TimeFrame = "Today" | "Week" | "Month";
export function getStartDate(timeframe: TimeFrame): Date {
  const now = new Date();

  switch (timeframe) {
    case "Today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // "Sun Sep 07 2025 00:00:00 GMT+0700 (Indochina Time)" mà hình như node vẫn in ra utc ?
    case "Week":
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return weekAgo;
    case "Month":
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return monthStart;
    default:
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
}
