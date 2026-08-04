import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names, resolving conflicting utility classes
 * (e.g. `p-2` vs `p-4`) in favor of the later one. Standard shadcn/ui
 * utility, used by every component under components/ui/.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
