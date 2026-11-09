import {
  calculateContribution,
  createShopSaveRule,
  validateShopSaveRule,
  roundUpToHundred,
  roundDownToHundred,
  exampleCanonicalCase,
  ShopSaveRuleType,
} from '@/lib/shop-save'
import { nairaToKobo } from '@/lib/money'

describe('Shop & Save - Pure Functions', () => {
  describe('calculateContribution', () => {
    const fixedRule = createShopSaveRule('fixed', 2000, true) // ₦2,000 fixed
    const percentageRule = createShopSaveRule('percentage', 5, true) // 5%
    const roundUpRule = createShopSaveRule('round_up', 100, true) // round up to ₦100

    it('should calculate fixed contribution', () => {
      const result = calculateContribution(nairaToKobo(50000), fixedRule)
      expect(result).not.toBeNull()
      expect(result!.contributionKobo).toBe(2000)
      expect(result!.method).toBe('fixed')
    })

    it('should not trigger fixed if purchase < rule value', () => {
      const result = calculateContribution(nairaToKobo(1000), fixedRule)
      expect(result).toBeNull()
    })

    it('should calculate percentage contribution (₦40,000 @ 5% = ₦2,000)', () => {
      const result = calculateContribution(nairaToKobo(40000), percentageRule)
      expect(result).not.toBeNull()
      expect(result!.contributionKobo).toBe(2000)
      expect(result!.method).toBe('percentage')
      expect(result!.description).toContain('₦2,000')
    })

    it('should calculate round-up contribution', () => {
      // ₦40,370 → round up to ₦40,400 → contribute ₦30
      const purchaseKobo = nairaToKobo(40370)
      const result = calculateContribution(purchaseKobo, roundUpRule)
      expect(result).not.toBeNull()
      expect(result!.contributionKobo).toBe(30)
      expect(result!.method).toBe('round_up')
    })

    it('should not round up if already at ₦100 boundary', () => {
      const purchaseKobo = nairaToKobo(40400) // exactly at 100 boundary
      const result = calculateContribution(purchaseKobo, roundUpRule)
      expect(result).toBeNull()
    })
  })

  describe('validateShopSaveRule', () => {
    it('should validate a fixed rule', () => {
      const rule = createShopSaveRule('fixed', 1000, true)
      const result = validateShopSaveRule(rule)
      expect(result.valid).toBe(true)
    })

    it('should fail on invalid percentage', () => {
      const rule = createShopSaveRule('percentage', 150, true) // > 100
      const result = validateShopSaveRule(rule)
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('percentage'))).toBe(true)
    })

    it('should fail on round_up with wrong base', () => {
      const rule = createShopSaveRule('round_up', 50, true) // not 100
      const result = validateShopSaveRule(rule)
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('round-up base'))).toBe(true)
    })
  })

  it('should pass the canonical example: ₦40,000 @ 5% = ₦2,000', () => {
    const { contribution } = exampleCanonicalCase()
    expect(contribution.contributionKobo).toBe(2000)
    expect(contribution.method).toBe('percentage')
  })

  describe('roundUpToHundred / roundDownToHundred', () => {
    it('should round ₦40,370 up to ₦40,400', () => {
      expect(roundUpToHundred(nairaToKobo(40370))).toBe(nairaToKobo(40400))
    })

    it('should round ₦40,370 down to ₦40,300', () => {
      expect(roundDownToHundred(nairaToKobo(40370))).toBe(nairaToKobo(40300))
    })
  })
})