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

    it('should reject a split that does not total 100%', () => {
      const { updatedRules, isValid } = createRule(initialRules, 'spending', 50)
      expect(isValid).toBe(false)
      expect(updatedRules.length).toBe(1)
      expect(updatedRules[0].allocationPercentage).toBe(50)
    })

    it('should only accept a completed 100% allocation', () => {
      const rules = [
        { id: 'r1', category: 'spending' as SplitCategory, allocationPercentage: 50, isActive: true },
        { id: 'r2', category: 'savings' as SplitCategory, allocationPercentage: 30, isActive: true },
      ]
      const { updatedRules, isValid } = createRule(rules, 'goal', 20, 'rent')
      expect(isValid).toBe(true)
      expect(updatedRules.reduce((sum, rule) => sum + rule.allocationPercentage, 0)).toBe(100)
    })

    it('should update an existing category without introducing a duplicate', () => {
      const rules = [
        { id: 'r1', category: 'spending' as SplitCategory, allocationPercentage: 50, isActive: true },
        { id: 'r2', category: 'savings' as SplitCategory, allocationPercentage: 30, isActive: true },
        { id: 'r3', category: 'goal' as SplitCategory, allocationPercentage: 20, isActive: true, goalId: 'rent' },
      ]
      const { updatedRules, isValid } = createRule(rules, 'spending', 40)
      expect(isValid).toBe(false)
      expect(updatedRules.length).toBe(3)
      expect(updatedRules[0].id).toBe('r1')
      expect(updatedRules[0].allocationPercentage).toBe(40)
    })
  })

  describe('removeRule', () => {
    it('should remove a rule and rebalance', () => {
      const rules = [
        { id: 'r1', category: 'spending' as SplitCategory, allocationPercentage: 50, isActive: true },
        { id: 'r2', category: 'savings' as SplitCategory, allocationPercentage: 30, isActive: true },
        { id: 'r3', category: 'goal' as SplitCategory, allocationPercentage: 20, isActive: true },
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
        { id: 'r1', category: 'spending' as SplitCategory, allocationPercentage: 100, isActive: true },
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
        { id: 'r3', category: 'goal' as SplitCategory, allocationPercentage: 20, isActive: true, goalId: 'rent' },
      ]
      const result = allocateSalary(40000, rules)
      
      // ₦40,000 * 50% = ₦20,000 = 20000 kobo
      // ₦40,000 * 30% = ₦12,000 = 12000 kobo
      // ₦40,000 * 20% = ₦8,000 = 8000 kobo
      expect(result.spending).toBe(nairaToKobo(20000))
      expect(result.savings).toBe(nairaToKobo(12000))
      expect(result.goal).toBe(nairaToKobo(8000))
    })

    it('should handle single rule (100% to one category)', () => {
      const rules = [
        { id: 'r1', category: 'savings' as SplitCategory, allocationPercentage: 100, isActive: true },
      ]
      const result = allocateSalary(50000, rules)
      expect(result.savings).toBe(nairaToKobo(50000))
      expect(result.spending).toBe(0)
      expect(result.goal).toBe(0)
    })

    it('should handle no rules (all to spending)', () => {
      const rules: import('@/lib/salary-split').SalarySplitRule[] = []
      const result = allocateSalary(30000, rules)
      expect(result.spending).toBe(nairaToKobo(30000))
      expect(result.savings).toBe(0)
      expect(result.goal).toBe(0)
    })
  })

  describe('calculateAvailableToSpend', () => {
    it('should calculate available to spend and save', () => {
      const rules = [
        { id: 'r1', category: 'spending' as SplitCategory, allocationPercentage: 50, isActive: true },
        { id: 'r2', category: 'savings' as SplitCategory, allocationPercentage: 30, isActive: true },
        { id: 'r3', category: 'goal' as SplitCategory, allocationPercentage: 20, isActive: true, goalId: 'rent' },
      ]
      const result = calculateAvailableToSpend(100000, rules)
      
      expect(result.availableSpend).toBe(nairaToKobo(50000))
      expect(result.availableSave).toBe(nairaToKobo(30000))
      expect(Object.values(result.goalAllocations)).toEqual([nairaToKobo(20000)])
    })
  })

  describe('validateSalarySplit', () => {
    it('should validate a correct 3-rule split', () => {
      const rules = [
        { id: 'r1', category: 'spending' as SplitCategory, allocationPercentage: 50, isActive: true },
        { id: 'r2', category: 'savings' as SplitCategory, allocationPercentage: 30, isActive: true },
        { id: 'r3', category: 'goal' as SplitCategory, allocationPercentage: 20, isActive: true, goalId: 'rent' },
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

  it('should calculate the canonical 5% amount: ₦40,000 @ 5% = ₦2,000', () => {
    const { goalKobo } = exampleCanonicalCase()
    expect(goalKobo).toBe(nairaToKobo(2000))
  })
})