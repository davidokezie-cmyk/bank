/**
 * Banking mock service.
 * Interface: banking.ts
 * Mock implementation for demo mode.
 * Real provider: Banks, swapped via env var.
 */

// Balance result interface
export interface BalanceResult {
  success: boolean
  balanceKobo: number
  currency: string
  message: string
}

/**
 * Get account balance (mock).
 */
export function getBalance(): BalanceResult {
  return {
    success: true,
    balanceKobo: 85000, // ₦850 demo balance
    currency: 'NGN',
    message: 'Your current balance is ₦850 (demo mode)',
  }
}

/**
 * Validate account number (mock - NUBAN 10 digits).
 */
export function validateAccountNumber(
  accountNumber: string
): { valid: boolean; message: string } {
  const nubanRegex = /^0\d{9}$/
  return {
    valid: nubanRegex.test(accountNumber),
    message: nubanRegex.test(accountNumber)
      ? 'Valid NUBAN account number'
      : 'Account number must be 10 digits (NUBAN format)',
  }
}

/**
 * Validate phone number (mock - Nigerian format +234).
 */
export function validatePhoneNumber(
  phone: string
): { valid: boolean; message: string } {
  const nigerianRegex = /^\+234\d{10}$/
  return {
    valid: nigerianRegex.test(phone),
    message: nigerianRegex.test(phone)
      ? 'Valid Nigerian phone number'
      : 'Phone number must be in format: +234 followed by 10 digits',
  }
}

/**
 * Transfer between accounts (mock).
 */
export function transferFunds(
  fromAccount: string,
  toAccount: string,
  amountKobo: number
): { success: boolean; message: string; transactionId?: string } {
  // In demo mode, succeed if amounts are valid
  const fromValid = /^0\d{9}$/.test(fromAccount)
  const toValid = /^0\d{9}$/.test(toAccount)

  if (!fromValid || !toValid) {
    return {
      success: false,
      message: 'Invalid account number format',
    }
  }

  if (amountKobo <= 0) {
    return {
      success: false,
      message: 'Amount must be greater than zero',
    }
  }

  return {
    success: true,
    message: `Transfer of ₦${amountKobo / 100} completed successfully (demo mode)`,
    transactionId: `demo_tx_${Date.now()}`,
  }
}