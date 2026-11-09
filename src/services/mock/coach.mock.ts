/**
 * Coach mock service.
 * Interface: coach.ts
 * Rule-based insight cards explaining "why" for financial decisions.
 * Each insight provides actionable guidance.
 */

import { getPendingInvites, getCoachInsights as getCoachInsightsFn } from './joint.mock'
import { JointPot } from '@/lib/joint-pot'

export interface CoachInsight {
  id: string
  title: string
  body: string
  type: 'contribution' | 'goal' | 'warning' | 'info'
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
  actionLabel?: string
}

// Generate rule-based insights for a user
export function getCoachInsights(
  userId: string,
  pots: JointPot[] = []
): CoachInsight[] {
  const insights: CoachInsight[] = []
  const now = Date.now()

  // Insight 1: Salary split not at 100%
  // (Would need salary split data - simplified)

  // Insight 2: Joint pot contribution
  if (userId) {
    const userPots = pots.filter((pot) => {
      const member = pot.members.find((m) => m.userId === userId)
      return member !== undefined
    })

    for (const pot of userPots) {
      const member = pot.members.find((m) => m.userId === userId)
      if (!member) continue

      const userContributions = pot.contributions.filter(
        (c) => c.userId === userId
      )

      if (userContributions.length > 0) {
        const totalContributed = userContributions.reduce(
          (sum, c) => addKobo(sum, c.amountKobo),
          0
        )

      insights.push({
        id: `insight_${pot.id}_${userId}_1`,
        title: 'Recent contribution',
        body: `You contributed ₦${koboToNaira(userContributions.reduce(
          (sum, c) => addKoba(sum, c.amountKobo), 0) / 100} recently toward ${pot.name}`,
        type: 'contribution',
        priority: 'medium',
        createdAt: now,
      })
      }
    }
  }

  // Insight 3: Pending withdrawal vote
  for (const pot of pots) {
    const withdrawalRequests = pot.withdrawalRequests.filter(
      (r) => r.status === 'pending' && now < r.expiresAt
    )

    for (const request of withdrawalRequests) {
      // Check if user has voted
      const hasVoted = request.votesYes > 0 || request.votesNo > 0
        // Simplified: just check if there are any votes

      if (hasVoted) {
        insights.push({
          id: `insight_${pot.id}_${request.id}_1`,
          title: 'Withdrawal vote',
          body: 'A withdrawal vote is in progress. Your vote has been recorded.',
          type: 'warning',
          priority: 'high',
          actionUrl: `/joint/${pot.id}`,
          actionLabel: 'View voting',
          createdAt: now,
        })
      }
    }
  }

  // Insight 4: Invite pending
  const pendingInvites = getPendingInvites()
  const userHasPendingInvite = pendingInvites.some(
    (invite) => invite.status === 'pending'
  )

  if (userHasPendingInvite) {
    insights.push({
      id: 'insight_pending_invite_1',
      title: 'Pending invite',
      body: 'You have a pending invitation to join a savings pot. Accept or decline within 7 days.',
      type: 'info',
      priority: 'medium',
      actionUrl: '/invites',
      actionLabel: 'View invites',
      createdAt: now,
    })
  }

  return insights
}

/**
 * Get all coach insights for the demo user.
 */
export function getAllCoachInsights(
  userId: string,
  pots: JointPot[] = []
): CoachInsight[] {
  return getCoachInsightsFn(userId, pots)
}