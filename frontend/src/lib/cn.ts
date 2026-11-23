import clsx, { type ClassValue } from 'clsx'

/** Tiny className composer. Wraps clsx so call-sites stay terse. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}
