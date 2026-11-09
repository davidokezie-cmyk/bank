/**
 * Lifestyle Goals pure functions.
 * 
 * Each goal has: target amount, current progress, deadline date.
 * Goals: rent, car, education, business, holiday, etc.
 * Progress visualised as percentage of target.
 * 
 * Test coverage required:
 * - add progress
 * - deadline check
 * - multiple goals concurrent
 * - target reached
 */

import { nairaToKobo, koboToNaira, addKobo, multiplyKobo } from './money'

export type GoalCategory = 'rent' | 'car' | 'education' | 'business' | 'holiday'

export interface Goal {
  id: string
  name: string
  category: GoalCategory
  targetKobo: number
  currentKobo: number
  deadline: Date | null
  isAchieved: boolean
  createdAt: number
}

export interface GoalState {
  goals: Goal[]
  totalTargetKobo: number
  totalCurrentKobo: number
  overallProgress: number
}

/**
 * Create a new goal.
 */
export function createGoal(
  name: string,
  category: GoalCategory,
  targetNaira: number,
  deadline: Date | null = null
): Goal {
  const targetKobo = nairaToKobo(targetNaira)
  return {
    id: `goal_${Date.now()}`,
    name,
    category,
    targetKobo,
    currentKobo: 0,
    deadline,
    isAchieved: false,
    createdAt: Date.now(),
  }
}

/**
 * Add contribution to a goal.
 * Returns updated goal and the new current amount.
 */
export function addContributionToGoal(
  goal: Goal,
  contributionKobo: number
): { goal: Goal; newCurrentKobo: number } {
  const newCurrent = addKobo(goal.currentKobo, contributionKobo)
  const isAchieved = newCurrent >= goal.targetKobo

  return {
    goal: {
      ...goal,
      currentKobo: newCurrent,
      isAchieved,
    },
    newCurrentKobo: newCurrent,
  }
}

/**
 * Check if a goal is past its deadline.
 */
export function isGoalPastDeadline(goal: Goal): boolean {
  if (!goal.deadline) return false
  const now = new Date()
  return now > goal.deadline
}

/**
 * Calculate overall progress across all goals.
 */
export function calculateOverallProgress(goals: Goal[]): {
  overallProgress: number  // 0-100
  achievedGoals: number
  totalGoals: number
  remainingKobo: number
} {
  const totalGoals = goals.length
  if (totalGoals === 0) {
    return { overallProgress: 0, achievedGoals: 0, totalGoals: 0, remainingKobo: 0 }
  }

  let achievedGoals = 0
  let totalTargetKobo = 0
  let totalCurrentKobo = 0

  for (const goal of goals) {
    totalTargetKobo += goal.targetKobo
    totalCurrentKobo += goal.currentKobo

    if (goal.isAchieved) {
      achievedGoals++
    }
  }

  const overallProgress = totalTargetKobo > 0
    ? Math.round((totalCurrentKobo / totalTargetKobo) * 100)
    : 0

  const remainingKobo = totalTargetKobo - totalCurrentKobo

  return { overallProgress, achievedGoals, totalGoals, remainingKobo }
}

/**
 * Validate a goal.
 */
export function validateGoal(goal: Goal): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (goal.targetKobo <= 0) {
    errors.push('Target amount must be greater than zero')
  }

  if (goal.currentKobo < 0) {
    errors.push('Current amount cannot be negative')
  }

  if (goal.name.trim().length === 0) {
    errors.push('Goal name cannot be empty')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Example: Create a rent goal for ₦200,000 with deadline.
 */
export function exampleRentGoal(): Goal {
  const deadline = new Date()
  deadline.setFullYear(deadline.getFullYear() + 1) // 1 year from now

  return createGoal('Lago Rent', 'rent', 200000, deadline)
}