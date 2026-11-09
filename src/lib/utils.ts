/**
 * Utility functions shared across the codebase.
 * cn: tailwind-merge for conditional classNames.
 */

import { twMerge } from 'tailwind-merge'

type ClassValue =
  | string
  | false
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>

function flattenClassNames(value: ClassValue): string[] {
  if (!value) return []
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(flattenClassNames)
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, enabled]) => enabled)
      .map(([className]) => className)
  }
  return []
}

/**
 * Merge Tailwind class names, eliminating conflicts.
 * Accepts same arguments as classNames/celastic.
 */
export function cn(...classes: ClassValue[]): string {
  return twMerge(classes.flatMap(flattenClassNames).join(' '))
}

export type { twMerge } from 'tailwind-merge'