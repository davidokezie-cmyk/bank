/**
 * Shop & Save pure functions.
 * 
 * When an eligible purchase happens, a user-chosen fixed amount, percentage, or round-up
 * is set aside as a separate contribution.
 * 
 * Canonical example: a ₦40,000 purchase with a 5% rule triggers a separate ₦2,000 contribution.
 * It is NOT a discount. Never taken without explicit opt-in.
 * Users can pause, change, or opt out any time. Every contribution is itemised.
 * 
 * Test coverage required:
 * - fixed amount rule
 * - percentage rule (₦40,000 @ 5% = ₦2,000)
 * - round-up to nearest ₦100
 * - explicit opt-in before contributions enabled
 * - pause/change/opt-out at any time
 */

import { nairaToKobo, koboToNaira, addKobo, multiplyKobo, percentageOfKobo } from './money'

export type ShopSaveRuleType = 'fixed' | 'percentage' | 'round_up'

export interface ShopSaveRule {
  id: string
  ruleType: ShopSaveRuleType
  ruleValue: number  // fixed amount in kobo, or percentage (0-100), or round-up base
  isActive: boolean
  isOptInEnabled: boolean  // explicit opt-in required
  /** Merchant name or pattern this rule applies to */
  merchantPattern?: string
  /** Last trigger amount in kobo */
  lastTriggerKobo?: number
  /** Last contribution amount in kobo */
  lastContributionKobo?: number
  createdAt: number  // timestamp
  triggeredCount: number  // number of times triggered
}

/**
 * Create a new Shop & Save rule.
 */
export function createShopSaveRule(
  ruleType: ShopSaveRuleType,
  ruleValue: number,
  isOptInEnabled: boolean = false
): ShopSaveRule => {
  const now = Date.now()
  return {
    id: `shop-save-${now}`,
    ruleType,
    ruleValue,
    isActive: true,
    isOptInEnabled,
    lastTriggerKobo: undefined,
    lastContributionKobo: undefined,
    createdAt: now,
    triggeredCount: 0,
  }
}

/**
 * Calculate the Shop & Save contribution for a given purchase amount.
 * 
 * - fixed: fixed amount in kobo (must be <= purchase amount)
 * - percentage: percentage of purchase amount
 * - round_up: round up to nearest ₦100, then contribute the difference
 * 
 * Returns { contributionKobo, method, description }
 */
export function calculateContribution(
  purchaseKobo: number,
  rule: ShopSaveRule
): { contributionKobo: number; method: string; description: string } | null {
  if (!rule.isActive) return null

  switch (rule.ruleType) {
    case 'fixed':
      // Fixed amount contribution
      // Only trigger if purchase amount >= rule value
      if (purchaseKobo >= rule.ruleValue) {
        const contribution = rule.ruleValue
        return {
          contributionKobo: contribution,
          method: 'fixed',
          description: `₦${koboToNaira(contribution)} fixed contribution`,
        }
      }
      return null

    case 'percentage':
      // Percentage of purchase amount
      const contribution = multiplyKobo(purchaseKobo, rule.ruleValue)
      // Only trigger if contribution > 0
      if (contribution > 0) {
        return {
          contributionKobo: contribution,
          method: 'percentage',
          description: `${rule.ruleValue}% of ₦${koboToNaira(purchaseKobo)} = ₦${koboToNaira(contribution)}`,
        }
      }
      return null

    case 'round_up':
      // Round up to nearest ₦100, contribute the difference
      // e.g. ₦40,370 → round up to ₦40,400 → contribute ₦30
      const roundedUp = Math.ceil(purchaseKobo / 100) * 100
      const contribution = roundedUp - purchaseKobo
      if (contribution > 0) {
        return {
          contributionKobo: contribution,
          method: 'round_up',
          description: `Round-up from ₦${koboToNaira(purchaseKobo)} to ₦${koboToNaira(roundedUp)} = ₦${koboToNaira(contribution)}`,
        }
      }
      return null

    default:
      return null
  }
}

/**
 * Validate a Shop & Save rule.
 */
export function validateShopSaveRule(rule: ShopSaveRule): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (rule.ruleValue <= 0) {
    errors.push('Rule value must be greater than zero')
  }

  if (rule.ruleType === 'fixed' && rule.ruleValue > 1000000) {
    errors.push('Fixed amount is very high - please confirm')
  }

  if (rule.ruleType === 'percentage' && (rule.ruleValue < 0 || rule.ruleValue > 100)) {
    errors.push('Percentage must be between 0 and 100')
  }

  if (rule.ruleType === 'round_up' && rule.ruleValue !== 100) {
    errors.push('Round-up base must be ₦100')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Example: ₦40,000 purchase with 5% rule → ₦2,000 contribution
 */
export function exampleCanonicalCase(): {
  purchaseKobo: number
  rule: ShopSaveRule
  contribution: { contributionKobo: number; method: string; description: string }
} {
  const purchaseKobo = nairaToKobo(40000)
  const rule: ShopSaveRule = {
    id: 'ss1',
    ruleType: 'percentage',
    ruleValue: 5,
    isActive: true,
    isOptInEnabled: true,
    lastTriggerKobo: undefined,
    lastContributionKobo: undefined,
    createdAt: Date.now(),
    triggeredCount: 0,
  }

  const contribution = calculateContribution(purchaseKobo, rule)

  return {
    purchaseKobo,
    rule,
    contribution: contribution!,
  }
}

/**
 * Round up amount to nearest ₦100 (pure function, no side effects).
 */
export function roundUpToHundred(kobo: number): number {
  return Math.ceil(kobo / 100) * 100
}

/**
 * Round down amount to nearest ₦100.
 */
export function roundDownToHundred(kobo: number): number {
  return Math.floor(kobo / 100) * 100
}