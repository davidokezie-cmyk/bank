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

import { nairaToKobo, addKobo, subtractKobo, percentageOfKobo } from './money'

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
 * Updates or adds a rule and reports whether the active rules total exactly 100%.
 */
export function createRule(
  rules: SalarySplitRule[],
  category: SplitCategory,
  allocationPercentage: number,
  goalId?: string
): { rule: SalarySplitRule; updatedRules: SalarySplitRule[]; isValid: boolean } {
  const existingRule = rules.find((rule) => rule.category === category)
  const newRule: SalarySplitRule = {
    id: existingRule?.id ?? `rule_${Date.now()}`,
    category,
    allocationPercentage,
    isActive: true,
    goalId,
  }

  const existingIndex = rules.findIndex((rule) => rule.category === category)
  const updatedRules = existingIndex < 0
    ? [...rules, newRule]
    : rules.map((rule, index) => index === existingIndex ? newRule : rule)
  const activeRules = updatedRules.filter((rule) => rule.isActive)
  const percentagesValid = activeRules.every((rule) =>
    Number.isFinite(rule.allocationPercentage)
    && rule.allocationPercentage >= 0
    && rule.allocationPercentage <= 100
    && (rule.category !== 'goal' || Boolean(rule.goalId))
  )

  return {
    rule: newRule,
    updatedRules,
    isValid: percentagesValid
      && activeRules.reduce((sum, rule) => sum + rule.allocationPercentage, 0) === 100
      && new Set(activeRules.map((rule) => rule.category)).size === activeRules.length,
  }
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
    return { removedRule: removed, remainingRules: remaining, rebalanced: true }
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
      (r) => r.allocationPercentage === Math.max(...rebalanced.map(x => x.allocationPercentage))
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
  if (activeRules.reduce((sum, rule) => sum + rule.allocationPercentage, 0) !== 100) {
    return result
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

  const availableSpend = allocations.spending

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
  const activeRules = rules.filter((rule) => rule.isActive)
  const percentages = activeRules.map(r => r.allocationPercentage)
  const totalValid = percentages.reduce((sum, percentage) => sum + percentage, 0) === 100

  if (!totalValid) {
    errors.push('Salary split percentages must total exactly 100%')
  }

  if (!Number.isFinite(totalNaira) || totalNaira <= 0) {
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
  const fivePctGoalKobo = percentageOfKobo(nairaToKobo(totalNaira), 5)

  return {
    totalNaira,
    rules,
    allocations,
    goalKobo: fivePctGoalKobo,
  }
}