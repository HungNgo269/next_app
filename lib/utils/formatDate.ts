//timestamp
export function formatVietnameseDateTime(
  dateInput: string | number | Date
): string {
  const date = new Date(dateInput);

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatEnDateTime(dateInput: string | number | Date): string {
  if (!dateInput) {
    return "";
  }
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    console.error("Invalid date input:", dateInput);
    return "";
  }

  return new Intl.DateTimeFormat("en-EN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
export function formatEnDate(dateInput: string | Date): string {
  if (!dateInput) {
    return "";
  }
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    console.error("Invalid date input:", dateInput);
    return "";
  }
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
