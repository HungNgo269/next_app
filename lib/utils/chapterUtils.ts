export function isNewChapter(
  createdAt: Date | string,
  daysThreshold: number = 7
): boolean {
  const createdDate =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const now = new Date();
  const diffInDays =
    (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
  console.log("diof", diffInDays);
  return diffInDays <= daysThreshold;
}
