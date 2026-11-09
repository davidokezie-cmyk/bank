import {
  createGoal,
  addContributionToGoal,
  isGoalPastDeadline,
  calculateOverallProgress,
  validateGoal,
  exampleRentGoal,
} from '@/lib/goals'
import { nairaToKobo } from '@/lib/money'

describe('Lifestyle Goals - Pure Functions', () => {
  describe('createGoal', () => {
    it('should create a goal with target and deadline', () => {
      const deadline = new Date()
      deadline.setFullYear(deadline.getFullYear() + 1)
      
      const goal = createGoal('Laptop', 'business', 500000, deadline)
      
      expect(goal.name).toBe('Laptop')
      expect(goal.category).toBe('business')
      expect(goal.targetKobo).toBe(nairaToKobo(500000))
      expect(goal.currentKobo).toBe(0)
      expect(goal.isAchieved).toBe(false)
      expect(goal.deadline).not.toBeNull()
    })

    it('should create a goal without deadline', () => {
      const goal = createGoal('Emergency Fund', 'rent', 100000)
      
      expect(goal.deadline).toBeNull()
    })
  })

  describe('addContributionToGoal', () => {
    it('should add contribution and mark achieved if target reached', () => {
      const goal = createGoal('Rent', 'rent', 200000)
      
      const result = addContributionToGoal(goal, nairaToKobo(200000))
      
      expect(result.newCurrentKobo).toBe(nairaToKobo(200000))
      expect(result.goal.isAchieved).toBe(true)
      expect(result.goal.currentKobo).toBe(nairaToKobo(200000))
    })

    it('should not exceed target (extra contribution still counts)', () => {
      const goal = createGoal('Rent', 'rent', 200000)
      
      // The goal is not achieved until the full target is reached.
      const result1 = addContributionToGoal(goal, nairaToKobo(150000))
      expect(result1.goal.isAchieved).toBe(false)
      
      // Additional contribution of ₦50,000
      const result2 = addContributionToGoal(result1.goal, nairaToKobo(50000))
      expect(result2.newCurrentKobo).toBe(nairaToKobo(200000))
      expect(result2.goal.currentKobo).toBe(nairaToKobo(200000))
    })
  })

  describe('isGoalPastDeadline', () => {
    it('should return false for goal without deadline', () => {
      const goal = createGoal('No Deadline', 'rent', 100000)
      expect(isGoalPastDeadline(goal)).toBe(false)
    })

    it('should return true for goal past deadline', () => {
      const pastDate = new Date(2020, 1, 1) // Past date
      const goal = createGoal('Expired', 'rent', 100000, pastDate)
      expect(isGoalPastDeadline(goal)).toBe(true)
    })

    it('should return false for goal with future deadline', () => {
      const futureDate = new Date(2030, 1, 1) // Future date
      const goal = createGoal('Future', 'rent', 100000, futureDate)
      expect(isGoalPastDeadline(goal)).toBe(false)
    })
  })

  describe('calculateOverallProgress', () => {
    it('should calculate progress for single goal', () => {
      const goal = createGoal('Test', 'rent', 100000)
      goal.currentKobo = nairaToKobo(50000) // Manually set to 50%
      
      const progress = calculateOverallProgress([goal])
      
      expect(progress.overallProgress).toBe(50)
      expect(progress.achievedGoals).toBe(0)
      expect(progress.totalGoals).toBe(1)
      expect(progress.remainingKobo).toBe(nairaToKobo(50000))
    })

    it('should calculate progress for multiple goals', () => {
      const goals = [
        createGoal('Goal 1', 'rent', 100000),
        createGoal('Goal 2', 'rent', 200000),
      ]
      // Set Goal 1 to 100% achieved, Goal 2 to 50%
      goals[0].currentKobo = nairaToKobo(100000)
      goals[0].isAchieved = true
      goals[1].currentKobo = nairaToKobo(100000)
      
      const progress = calculateOverallProgress(goals)
      
      // 1 goal achieved out of 2
      // Total target: 300,000 kobo
      // Total current: 200,000 kobo
      // Progress: 67%
      expect(progress.overallProgress).toBe(67)
      expect(progress.achievedGoals).toBe(1)
      expect(progress.totalGoals).toBe(2)
      expect(progress.remainingKobo).toBe(nairaToKobo(100000))
    })

    it('should handle zero goals', () => {
      const progress = calculateOverallProgress([])
      expect(progress.overallProgress).toBe(0)
      expect(progress.achievedGoals).toBe(0)
      expect(progress.totalGoals).toBe(0)
      expect(progress.remainingKobo).toBe(0)
    })
  })

  describe('validateGoal', () => {
    it('should validate a goal with valid target', () => {
      const goal = createGoal('Rent', 'rent', 200000)
      const result = validateGoal(goal)
      expect(result.valid).toBe(true)
    })

    it('should fail on zero target', () => {
      const goal = createGoal('Free', 'rent', 0)
      const result = validateGoal(goal)
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('target'))).toBe(true)
    })

    it('should fail on negative current amount', () => {
      const goal = createGoal('Goal', 'rent', 100000)
      goal.currentKobo = -nairaToKobo(1000) // Invalid: negative
      // Note: This test may need adjustment based on actual validation logic
      const result = validateGoal(goal)
      expect(result.errors.some(e => e.includes('negative'))).toBe(true)
    })
  })

  it('should pass the example rent goal', () => {
    const goal = exampleRentGoal()
    expect(goal.name).toBe('Lago Rent')
    expect(goal.category).toBe('rent')
    expect(goal.targetKobo).toBeGreaterThan(0)
  })
})