/**
 * Payments mock service.
 * Interface: payments.ts
 * Mock implementation for demo mode.
 * Real provider: Paystack, Mono, etc. swapped via env var.
 */

// Transfer result interface
export interface TransferResult {
  success: boolean
  transactionId: string
  amountKobo: number
  recipient: string
  status: 'completed' | 'pending' | 'failed'
  message: string
}

/**
 * Initiate a transfer (mock).
 * In demo mode, always succeeds with a generated transaction ID.
 */
export function initiateTransfer(
  amount: number,
  recipient: string
): TransferResult {
  const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  return {
    success: true,
    transactionId,
    amount,
    recipient,
    status: 'completed',
    message: `Transfer of ₦${amount / 100} to ${recipient} completed successfully`,
  }
}

/**
 * Link bank account (mock).
 * In demo mode, validates NUBAN format and returns success.
 */
export function linkBankAccount(
  accountNumber: string
): { success: boolean; accountNumberValid: boolean; message: string } {
  // Validate NUBAN format: 10 digits
  const nubanRegex = /^0\d{9}$/
  const isValid = nubanRegex.test(accountNumber)

  if (isValid) {
    return {
      success: true,
      accountNumberValid: true,
      message: 'Bank account linked successfully (demo mode)',
    }
  }

  return {
    success: false,
    accountNumberValid: false,
    message: 'Invalid NUBAN format. Account numbers must be 10 digits (NUBAN format).',
  }
}

/**
 * Get balance (mock).
 * In demo mode, returns a fixed balance.
 */
export function getBalance(): { balanceKobo: number; currency: string; message: string } {
  return {
    balanceKobo: nairaToKobo(50000), // ₦50,000 demo balance
    currency: 'NGN',
    message: 'Balance retrieved successfully (demo mode)',
  }
}

// Helper import - in real code, this would be from the money module
function nairaToKobo(naira: number): number {
  return Math.round(naira * 100)
}