import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Calculate time elapsed
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'اليوم';
  } else if (diffDays === 1) {
    return 'البارحة';
  } else if (diffDays < 7) {
    return `منذ ${diffDays} أيام`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `منذ ${weeks} ${weeks === 1 ? 'أسبوع' : 'أسابيع'}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `منذ ${months} ${months === 1 ? 'شهر' : 'أشهر'}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `منذ ${years} ${years === 1 ? 'سنة' : 'سنوات'}`;
  }
}

export function formatPrice(price: number | string): string {
  const p = typeof price === 'string' ? parseFloat(price) : price;
  return p.toFixed(2) + '$';
}
