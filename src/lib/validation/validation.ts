/**
 * NUBAN and Nigerian phone number validation helpers.
 * 
 * Account numbers use NUBAN format: 10 digits (first digit 0-9, followed by 9 digits).
 * Phone numbers use Nigerian format: +234 + 10 digits.
 * 
 * All validation is pure (no side effects, no network calls).
 * Used by: forms, mock services, backend schemas, client-side validation.
 */

// NUBAN pattern: 10 digits, first digit can be 0-9
export const NUBAN_REGEX = /^0\d{9}$/

// Nigerian phone pattern: +234 + 10 digits
export const NIGERIAN_PHONE_REGEX = /^\+234\d{10}$/

/**
 * Validate a NUBAN account number.
 * 
 * @param accountNumber Account number to validate (e.g. "0123456789")
 * @returns { valid, message }
 */
export function validateNuban(accountNumber: string): { valid: boolean; message: string } {
  const isValid = NUBAN_REGEX.test(accountNumber)
  return {
    valid: isValid,
    message: isValid
      ? 'Valid NUBAN account number (10 digits)'
      : 'Invalid NUBAN format. Account numbers must be 10 digits (e.g. 0123456789).',
  }
}

/**
 * Validate a Nigerian phone number.
 * 
 * @param phone Phone number to validate (e.g. "+2348012345678")
 * @returns { valid, message }
 */
export function validateNigerianPhone(phone: string): { valid: boolean; message: string } {
  const isValid = NIGERIAN_PHONE_REGEX.test(phone)
  return {
    valid: isValid,
    message: isValid
      ? 'Valid Nigerian phone number'
      : 'Invalid format. Must be +234 followed by 10 digits (e.g. +2348012345678).',
  }
}

/**
 * Format a phone number to Nigerian format.
 * Ensures +234 prefix and 10 digits.
 * 
 * @param phone Phone number (may or may not have +234 prefix)
 * @returns { formatted, wasAlreadyValid }
 */
export function formatNigerianPhone(phone: string): { formatted: string; wasAlreadyValid: boolean } {
  // Remove any whitespace
  const cleaned = phone.replace(/\s+/g, '')

  // Check if already in valid format
  const alreadyValid = NIGERIAN_PHONE_REGEX.test(cleaned)

  if (alreadyValid) {
    return { formatted: cleaned, wasAlreadyValid: true }
  }

  // Try to extract digits
  const digits = cleaned.replace(/\D+/g, '')

  if (digits.length === 10) {
    // Assume it's the 10-digit part without +234 prefix
    return { formatted: `+234${digits}`, wasAlreadyValid: false }
  }

  if (digits.length === 13 && digits.startsWith('234')) {
    // Assume it's +234 without the plus
    return { formatted: `+${digits}`, wasAlreadyValid: false }
  }

  // Return as-is if can't format
  return { formatted: cleaned, wasAlreadyValid: false }
}

/**
 * Validate that a salary split total equals exactly 100%.
 * 
 * @param percentages Array of percentage values
 * @returns { valid, corrected, errors }
 */
export function validateSalarySplitPercentages(
  percentages: number[]
): { valid: boolean; corrected: number[]; errors: string[] } {
  const errors: string[] = []
  const corrected = [...percentages]

  const { valid, corrected: ensured } = ensureTotal100(percentages)

  if (!ensured) {
    errors.push('Percentages must total exactly 100%')
  }

  corrected.length === ensured.length
    ? (corrected = ensured)
    : (corrected = ensureTotal100(percentages).corrected)

  return {
    valid: errors.length === 0,
    corrected,
    errors,
  }
}

/**
 * Format kobo amount as naira string with proper formatting.
 * 
 * @param kobo Amount in kobo
 * @returns formatted naira string
 */
export function formatAmount(kobo: number): string {
  const naira = kobo / 100
  return Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(naira)
}