import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  return formatter.format(d).replace(/\./g, ":")
}

export function safeDateDisplay(
  value?: string | null,
  format: string = "dddd, D MMMM YYYY"
): string {
  if (!value || value === "0001-01-01T00:00:00Z" || value === "-") {
    return "-"
  }
  return dayjs(value).format(format)
}

