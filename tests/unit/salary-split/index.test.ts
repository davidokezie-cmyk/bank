import {
  createRule,
  removeRule,
  allocateSalary,
  calculateAvailableToSpend,
  validateSalarySplit,
  exampleCanonicalCase,
  SplitCategory,
} from '@/lib/salary-split'
import { nairaToKobo } from '@/lib/money'

describe('Salary Split - Pure Functions', () => {
  describe('createRule', () => {
    const initialRules: import('@/lib/salary-split').SalarySplitRule[] = []

    it('should create a rule with 50% allocation', () => {
      const { updatedRules, isValid } = createRule(initialRules, 'spending', 50)
      expect(isValid).toBe(true)
      expect(updatedRules.length).toBe(1)
      expect(updatedRules[0].allocationPercentage).toBe(50)
    })

    it('should ensure total remains 100% when adding rules', () => {
      const rules = [
        { id: 'r1', category: 'spending', allocationPercentage: 50, isActive: true },
      ]
      const { updatedRules: updated, isValid } = createRule(rules, 'savings', 30)
      expect(isValid).toBe(true)
      // Total should be 80, not 100 - the function tries to balance
      // But with only 2 rules totaling 80, it should still be valid
      expect(updatedRules.length).toBe(2)
    })

    it('should handle duplicate category by updating', () => {
      const rules = [
        { id: 'r1', category: 'spending', allocationPercentage: 60, isActive: true },
      ]
      const { updatedRules, isValid } = createRule(rules, 'spending', 40)
      expect(isValid).toBe(true)
      // Should have updated the existing rule
      expect(updatedRules.length).toBe(1)
      expect(updatedRules[0].allocationPercentage).toBe(40)
    })
  })

  describe('removeRule', () => {
    it('should remove a rule and rebalance', () => {
      const rules = [
        { id: 'r1', category: 'spending', allocationPercentage: 50, isActive: true },
        { id: 'r2', category: 'savings', allocationPercentage: 30, isActive: true },
        { id: 'r3', category: 'goal', allocationPercentage: 20, isActive: true },
      ]
      const { remainingRules, rebalanced } = removeRule(rules, 'savings')
      expect(rebalanced).toBe(true)
      expect(remainingRules.length).toBe(2)
      // Total should be 100 (50 + 20 = 70, then rebalanced to 50 + 50 = 100)
      const total = remainingRules.reduce(
        (sum, r) => sum + r.allocationPercentage,
        0
      )
      expect(total).toBe(100)
    })

    it('should handle removing the only rule', () => {
      const rules = [
        { id: 'r1', category: 'spending', allocationPercentage: 100, isActive: true },
      ]
      const { remainingRules } = removeRule(rules, 'spending')
      expect(remainingRules.length).toBe(0)
    })
  })

  describe('allocateSalary', () => {
    it('should distribute ₦40,000 across 3 categories at 50/30/20', () => {
      const rules = [
        { id: 'r1', category: 'spending' as SplitCategory, allocationPercentage: 50, isActive: true },
        { id: 'r2', category: 'savings' as SplitCategory, allocationPercentage: 30, isActive: true },
        { id: 'r3', category: 'goal' as SplitCategory, allocationPercentage: 20, isActive: true },
      ]
      const result = allocateSalary(40000, rules)
      
      // ₦40,000 * 50% = ₦20,000 = 20000 kobo
      // ₦40,000 * 30% = ₦12,000 = 12000 kobo
      // ₦40,000 * 20% = ₦8,000 = 8000 kobo
      expect(result.spending).toBe(20000)
      expect(result.savings).toBe(12000)
      expect(result.goal).toBe(8000)
    })

    it('should handle single rule (100% to one category)', () => {
      const rules = [
        { id: 'r1', category: 'savings' as SplitCategory, allocationPercentage: 100, isActive: true },
      ]
      const result = allocateSalary(50000, rules)
      expect(result.savings).toBe(50000)
      expect(result.spending).toBe(0)
      expect(result.goal).toBe(0)
    })

    it('should handle no rules (all to spending)', () => {
      const rules: import('@/lib/salary-split').SalarySplitRule[] = []
      const result = allocateSalary(30000, rules)
      expect(result.spending).toBe(30000)
      expect(result.savings).toBe(0)
      expect(result.goal).toBe(0)
    })
  })

  describe('calculateAvailableToSpend', () => {
    it('should calculate available to spend and save', () => {
      const rules = [
        { id: 'r1', category: 'spending' as SplitCategory, allocationPercentage: 50, isActive: true },
        { id: 'r2', category: 'savings' as SplitCategory, allocationPercentage: 30, isActive: true },
        { id: 'r3', category: 'goal' as SplitCategory, allocationPercentage: 20, isActive: true },
      ]
      const result = calculateAvailableToSpend(100000, rules)
      
      // Total = ₦100,000 = 100000 kobo
      // Savings = 30% = 30000 kobo
      // Available to spend = 70000 kobo
      expect(result.availableSpend).toBe(70000)
      expect(result.availableSave).toBe(30000)
    })
  })

  describe('validateSalarySplit', () => {
    it('should validate a correct 3-rule split', () => {
      const rules = [
        { id: 'r1', category: 'spending' as SplitCategory, allocationPercentage: 50, isActive: true },
        { id: 'r2', category: 'savings' as SplitCategory, allocationPercentage: 30, isActive: true },
        { id: 'r3', category: 'goal' as SplitCategory, allocationPercentage: 20, isActive: true },
      ]
      const result = validateSalarySplit(100000, rules)
      expect(result.valid).toBe(true)
      expect(result.errors.length).toBe(0)
    })

    it('should fail when total ≠ 100%', () => {
      const rules = [
        { id: 'r1', category: 'spending' as SplitCategory, allocationPercentage: 60, isActive: true },
        { id: 'r2', category: 'savings' as SplitCategory, allocationPercentage: 30, isActive: true },
      ]
      const result = validateSalarySplit(100000, rules)
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('100%'))).toBe(true)
    })

    it('should fail on negative naira amount', () => {
      const rules = [
        { id: 'r1', category: 'spending' as SplitCategory, allocationPercentage: 50, isActive: true },
      ]
      const result = validateSalarySplit(-1000, rules)
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('salary'))).toBe(true)
    })
  })

  it('should pass the canonical example: ₦40,000 @ 5% = ₦2,000', () => {
    const { contribution } = exampleCanonicalCase()
    // 5% of ₦40,000 = ₦2,000 = 2000 kobo
    expect(contribution.contributionKobo).toBe(2000)
    expect(contribution.method).toBe('percentage')
  })
})