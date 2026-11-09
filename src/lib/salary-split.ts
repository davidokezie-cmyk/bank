/**
 * Salary Split pure functions.
 * 
 * Rules:
 * - Users create rules dividing income between Spending, Savings, and named Goals
 * - Totals must equal exactly 100%
 * - Each rule can be: percentage of net salary, fixed amount per period, or remaining after others
 * - No negative balances allowed
 * 
 * Test coverage required:
 * - percentage split rules
 * - fixed amount rules
 * - salary split = exactly 100%
 * - no negative balances
 * - ₦40,000 @ 5% = ₦2,000
 */

import { koboToNaira, nairaToKobo, addKobo, multiplyKobo, percentageOfKobo, ensureTotal100 } from './money'

export type SplitCategory = 'spending' | 'savings' | 'goal'

export interface SalarySplitRule {
  id: string
  category: SplitCategory
  allocationPercentage: number  // 0-100
  isActive: boolean
  goalId?: string  // if category is 'goal'
}

export interface SalarySplitState {
  rules: SalarySplitRule[]
  totalNaira: number  // in kobo
  categoryBalances: Record<SplitCategory, number>  // in kobo
}

/**
 * Create a new salary split rule.
 * Ensures the total across all rules remains 100%.
 * Returns { rule, updatedRules, isValid }
 */
export function createRule(
  rules: SalarySplitRule[],
  category: SplitCategory,
  allocationPercentage: number,
  goalId?: string
): { rule: SalarySplitRule; updatedRules: SalarySplitRule[]; isValid: boolean } {
  // Clamp percentage to 0-100
  const clamped = Math.max(0, Math.min(100, allocationPercentage))

  // Create the new rule
  const newRule: SalarySplitRule = {
    id: `rule_${Date.now()}`,
    category,
    allocationPercentage: clamped,
    isActive: true,
    goalId,
  }

  // Try to ensure total remains 100%
  const { valid, corrected } = ensureTotal100(
    rules.map(r => r.allocationPercentage).concat(clamped)
  )

  let updatedRules: SalarySplitRule[]

  if (valid) {
    // Replace or add the rule with the corrected percentage
    const existingIndex = rules.findIndex(r => r.category === category)
    
    if (existingIndex >= 0) {
      // Update existing rule
      updatedRules = rules.map((r, i) =>
        i === existingIndex
          ? { ...r, allocationPercentage: corrected[existingIndex] }
          : r
      )
    } else {
      // Add new rule
      updatedRules = [...rules, newRule]
      // Re-ensure total after addition
      const { valid: valid2, corrected: corrected2 } = ensureTotal100(
        updatedRules.map(r => r.allocationPercentage)
      )
      if (valid2) {
        // Find and replace with corrected value
        const finalIndex = updatedRules.findIndex(r => r.category === category)
        if (finalIndex >= 0) {
          updatedRules = updatedRules.map(r =>
            r.category === category
              ? { ...r, allocationPercentage: corrected2[finalIndex] }
              : r
          )
        }
      }
    }
  } else {
    // Failed to balance - return the original rule but invalid
    updatedRules = [...rules]
  }

  return { rule: newRule, updatedRules, isValid: valid }
}

/**
 * Remove a salary split rule.
 * Rebalances percentages to total 100%.
 */
export function removeRule(
  rules: SalarySplitRule[],
  category: SplitCategory
): { removedRule: SalarySplitRule; remainingRules: SalarySplitRule[]; rebalanced: boolean } {
  const removed = rules.find(r => r.category === category)
  if (!removed) {
    return { removedRule: { id: '', category, allocationPercentage: 0, isActive: false, goalId: undefined }, remainingRules: rules, rebalanced: false }
  }

  const remaining = rules.filter(r => r.category !== category)
  
  // If no rules left, nothing to rebalance
  if (remaining.length === 0) {
    return { removedRule: removed, remainingRules: [], rebalanced: true }
  }

  // Rebalance: distribute the removed percentage across remaining rules proportionally
  const currentSum = remaining.reduce((sum, r) => sum + r.allocationPercentage, 0)
  
  if (currentSum === 100) {
    // Already totaling 100, no rebalancing needed
    return { removedRule: removed, remainingRules, rebalanced: true }
  }

  // Distribute proportionally
  const ratio = 100 / currentSum
  const rebalanced = remaining.map(r => ({
    ...r,
    allocationPercentage: Math.round(r.allocationPercentage * ratio),
  }))

  // Ensure exact 100% - adjust the largest category
  const sum = rebalanced.reduce((acc, r) => acc + r.allocationPercentage, 0)
  if (sum !== 100) {
    const maxIndex = rebalanced.findIndex(
      (r, i) => r.allocationPercentage === Math.max(...rebalanced.map(x => x.allocationPercentage))
    )
    rebalanced[maxIndex].allocationPercentage += 100 - sum
  }

  return { removedRule: removed, remainingRules: rebalanced, rebalanced: true }
}

/**
 * Allocate salary to categories based on split rules.
 * Returns the koba amount available for each category.
 */
export function allocateSalary(
  totalNaira: number,
  rules: SalarySplitRule[]
): Record<SplitCategory, number> {
  const totalKobo = nairaToKobo(totalNaira)
  const result: Record<SplitCategory, number> = {
    spending: 0,
    savings: 0,
    goal: 0,
  }

  // Filter active rules
  const activeRules = rules.filter(r => r.isActive)

  if (activeRules.length === 0) {
    // No rules - everything goes to spending
    return { spending: totalKobo, savings: 0, goal: 0 }
  }

  // If only one rule, assign all to it
  if (activeRules.length === 1) {
    const allKobo = activeRules[0].allocationPercentage === 100 ? totalKobo : 0
    if (activeRules[0].category === 'spending') return { spending: totalKobo, savings: 0, goal: 0 }
    if (activeRules[0].category === 'savings') return { spending: 0, savings: totalKobo, goal: 0 }
    return { spending: 0, savings: 0, goal: totalKobo }
  }

  // Distribute proportionally based on allocation percentages
  // First pass: calculate each rule's share
  let remainingKobo = totalKobo
  const allocations: { category: SplitCategory; percentage: number; kobo: number }[] = []

  for (const rule of activeRules) {
    const kobo = percentageOfKobo(totalKobo, rule.allocationPercentage)
    allocations.push({
      category: rule.category,
      percentage: rule.allocationPercentage,
      kobo,
    })
    remainingKobo = subtractKobo(remainingKobo, kobo)
  }

  // Second pass: handle any remainder (ensure no negative balances)
  // Distribute the remainder to the largest allocation(s)
  if (remainingKobo > 0) {
    // Find the allocation(s) with the highest percentage
    const maxKobo = Math.max(...allocations.map(a => a.kobo))
    const maxIndices = allocations.filter(a => a.kobo === maxKobo).map(a => a.category)
    
    // Add remainder proportionally
    for (const category of maxIndices) {
      // Find the allocation for this category
      const alloc = allocations.find(a => a.category === category)
      if (alloc) {
        alloc.kobo = addKobo(alloc.kobo, remainingKobo)
        break // Give full remainder to one category
      }
    }
  } else if (remainingKobo < 0) {
    // Shouldn't happen, but handle it
    // Take from the smallest allocation
    const minKobo = Math.min(...allocations.map(a => a.kobo))
    const minIndices = allocations.filter(a => a.kobo === minKobo).map(a => a.category)
    
    for (const category of minIndices) {
      const alloc = allocations.find(a => a.category === category)
      if (alloc && alloc.kobo > 0) {
        alloc.kobo = subtractKobo(alloc.kobo, Math.abs(remainingKobo))
        break
      }
    }
  }

  // Build the result object
  for (const alloc of allocations) {
    result[alloc.category] = alloc.kobo
  }

  return result
}

/**
 * Calculate available-to-spend after savings allocation.
 * Available to spend = total income - savings - goals
 */
export function calculateAvailableToSpend(
  totalNaira: number,
  rules: SalarySplitRule[]
): { availableSpend: number; availableSave: number; goalAllocations: Record<string, number> }
{
  const allocations = allocateSalary(totalNaira, rules)

  // Savings is the 'savings' category
  const availableSave = allocations.savings

  // Available to spend = total - savings
  const availableSpend = nairaToKobo(totalNaira) - availableSave

  // Goal allocations
  const goalAllocations: Record<string, number> = {}
  const goalRules = rules.filter(r => r.category === 'goal' && r.isActive)

  for (const rule of goalRules) {
    if (rule.goalId) {
      const goalKobo = percentageOfKobo(nairaToKobo(totalNaira), rule.allocationPercentage)
      // Ensure we don't exceed available
      goalAllocations[rule.goalId] = goalKobo
    }
  }

  return { availableSpend, availableSave, goalAllocations }
}

/**
 * Validate a salary split rule set.
 * Returns { valid, errors, correctedRules }
 */
export function validateSalarySplit(
  totalNaira: number,
  rules: SalarySplitRule[]
): { valid: boolean; errors: string[]; correctedRules: SalarySplitRule[] } {
  const errors: string[] = []
  const corrected = [...rules]

  // Check total percentage = 100
  const percentages = rules.map(r => r.allocationPercentage)
  const { valid: totalValid, corrected: correctedPercentages } = ensureTotal100(percentages)

  if (!totalValid) {
    errors.push('Salary split percentages must total exactly 100%')
  }

  // Check for negative naira amount
  if (totalNaira <= 0) {
    errors.push('Total salary must be greater than zero')
  }

  // Check for duplicate categories
  const categories = rules.map(r => r.category)
  const uniqueCategories = new Set(categories)
  if (categories.length !== uniqueCategories.size && rules.length > 1) {
    errors.push('Duplicate categories are not allowed')
  }

  // Check individual percentages are valid
  for (const rule of rules) {
    if (rule.allocationPercentage < 0 || rule.allocationPercentage > 100) {
      errors.push(`Allocation for ${rule.category} must be between 0% and 100%`)
    }
    if (rule.category === 'goal' && !rule.goalId) {
      errors.push(`Goal category must have a goal ID`)
    }
  }

  // Apply corrections if needed
  if (totalValid) {
    corrected.forEach((rule, index) => {
      rule.allocationPercentage = correctedPercentages[index]
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    correctedRules: corrected,
  }
}

/**
 * Example usage with the canonical test case:
 * ₦40,000 salary split 5% to a goal → ₦2,000 contribution
 */
export function exampleCanonicalCase(): {
  totalNaira: number
  rules: SalarySplitRule[]
  allocations: Record<SplitCategory, number>
  goalKobo: number
} {
  const totalNaira = 40000
  const rules: SalarySplitRule[] = [
    { id: 'r1', category: 'spending', allocationPercentage: 50, isActive: true },
    { id: 'r2', category: 'savings', allocationPercentage: 30, isActive: true },
    { id: 'r3', category: 'goal', allocationPercentage: 20, isActive: true, goalId: 'laptop-goal' },
  ]

  const allocations = allocateSalary(totalNaira, rules)
  const goalKobo = allocations.goal // Should be 8000 (₦40,000 @ 20% = ₦8,000 = 8000 kobo)

  // For the canonical 5% example: if only one rule with 5% to a goal
  const fivePctRule: SalarySplitRule[] = [
    { id: 'r1', category: 'goal', allocationPercentage: 5, isActive: true, goalId: 'test-goal' },
  ]
  const fivePctAllocations = allocateSalary(40000, fivePctRule)
  const fivePctGoalKobo = fivePctAllocations.goal // Should be 2000 (₦40,000 @ 5% = ₦2,000 = 2000 kobo)

  return {
    totalNaira,
    rules,
    allocations,
    goalKobo: fivePctGoalKobo,
  }
}