/**
 * Money handling: stored as integer kobo (100 kobo = 1₦)
 * Never use floats for money calculations.
 * Format with Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })
 */

export const KoboPerNaira = 100

export function koboToNaira(kobo: number): number {
  return kobo / KoboPerNaira
}

export function nairaToKobo(naira: number): number {
  // Round to nearest kobo to avoid floating point issues
  return Math.round(naira * KoboPerNaira)
}

export function addKobo(a: number, b: number): number {
  return a + b
}

export function subtractKobo(a: number, b: number): number {
  return a - b
}

export function multiplyKobo(amount: number, factor: number): number {
  // amount in kobo, factor can be percentage (e.g. 5 for 5%) or decimal
  return Math.round(amount * factor / 100)
}

export function percentageOfKobo(totalKobo: number, percentage: number): number {
  // Returns the kobo amount for a given percentage of total
  // Eg: percentageOfKobo(40000, 5) = 2000 (₦40,000 @ 5% = ₦2,000 = 2000 kobo)
  return multiplyKobo(totalKobo, percentage)
}

export function ensureTotal100(percentages: number[]): { valid: boolean; corrected: number[] } {
  // Ensure salary split percentages total exactly 100%
  const sum = percentages.reduce((a, b) => a + b, 0)
  if (sum === 100) {
    return { valid: true, corrected: [...percentages] }
  }
  if (sum === 0) {
    // All zeros - distribute equally across 3 categories
    const equal = 100 / percentages.length
    return { valid: true, corrected: percentages.map(() => equal) }
  }
  if (sum > 100) {
    // Reduce proportionally
    const ratio = 100 / sum
    const corrected = percentages.map(p => Math.round(p * ratio))
    const correctedSum = corrected.reduce((a, b) => a + b, 0)
    // Adjust the difference to/from the largest category
    const diff = 100 - correctedSum
    const maxIndex = corrected.findIndex((_, i) => corrected[i] === Math.max(...corrected))
    corrected[maxIndex] += diff
    return { valid: true, corrected }
  }
  // sum < 100, increase proportionally
  const ratio = 100 / sum
  const corrected = percentages.map(p => Math.round(p * ratio))
  const correctedSum = corrected.reduce((a, b) => a + b, 0)
  const diff = 100 - correctedSum
  // Add remainder to the largest category
  const maxIndex = corrected.findIndex((_, i) => corrected[i] === Math.max(...corrected))
  corrected[maxIndex] += diff
  return { valid: true, corrected }
}

export function formatNaira(kobo: number): string {
  // Format kobo as ₦ with tabular numerals
  const naira = kobo / KoboPerNaira
  return Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    // Use maximum fraction digits to show kobo when needed
    // but we'll display as whole naira for simplicity in most cases
    maximumFractionDigits: 0,
  }).format(naira)
}

export function formatKobo(kobo: number): string {
  return Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(kobo / KoboPerNaira)
}