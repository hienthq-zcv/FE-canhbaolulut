import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, addHours } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date | undefined | null, dateFormat: string = "dd/MM/yyyy HH:mm") {
  if (!date) return ""
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return ""
    // Add 7 hours to convert to UTC+7 as requested
    const dateInVN = addHours(d, 7)
    return format(dateInVN, dateFormat)
  } catch {
    return ""
  }
}

