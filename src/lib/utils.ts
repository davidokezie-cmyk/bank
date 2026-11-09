/**
 * Utility functions shared across the codebase.
 * cn: tailwind-merge for conditional classNames.
 */

import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind class names, eliminating conflicts.
 * Accepts same arguments as classNames/celastic.
 */
export function cn(...classes: string[]): string {
  return twMerge(classes.filter(Boolean))
}

export type { twMerge } from 'tailwind-merge'