/**
 * Joint Savings mock service.
 * Interface: joint.ts
 * Mock implementation for demo mode.
 * All pot logic is in lib/joint-pot.ts (pure functions).
 * This service provides seeded demo data and state management.
 */

import { 
  createJointPot, inviteMember, acceptInvite, declineInvite,
  contributeToPot, memberLeavesPot, requestWithdrawal,
  voteOnWithdrawal, closeJointPot, JointPot, JointInvite,
  JointPotMember, WithdrawalRequest, JointContribution,
  ApprovalRule, MemberRole
} from '@/lib/joint-pot'
import { addKobo, koboToNaira, nairaToKobo } from '@/lib/money'

// Demo users
export const DEMO_USERS = [
  {
    id: 'user_1',
    name: 'Aisha Bello',
    email: 'aisha.bello@example.com',
    phone: '+2348012345678',
    username: 'aisha_b',
  },
  {
    id: 'user_2',
    name: 'Tunde Oladipo',
    email: 'tunde.oladipo@example.com',
    phone: '+2348023456789',
    username: 'tunde_o',
  },
  {
    id: 'user_3',
    name: 'Chioma Udeh',
    email: 'chioma.udeh@example.com',
    phone: '+2348034567890',
    username: 'chioma_u',
  },
]

// Seeded demo data: 3 demo users + 2 joint pots with pending states

// Pot 1: 3-person "Lagos Rent Fund" with majority approval
export const LAGOS_RENT_FUND = (() => {
  const pot = createJointPot(
    'Lagos Rent Fund',
    'Lagos Rent',
    nairaToKobo(100000), // ₦100,000 target
    null, // no deadline
    'majority', // majority approval
    'user_1', // owner
    5, // max 5 members
    0 // no fee
  )

  // Add members
  pot.members.push(
    { userId: 'user_2', role: 'member', contributionKobo: 0, joinedAt: Date.now() },
    { userId: 'user_3', role: 'member', contributionKobo: 0, joinedAt: Date.now() }
  )

  // Add contributions (₦30,000 + ₦25,000 + ₦20,000 = ₦75,000 total)
  // Tunde (user_2) contributes ₦30,000
  // Ada (user_3) contributes ₦25,000  
  // Chidi (user_1, owner) contributes ₦20,000
  // But we need to use the contribute function... for the demo, just set balances

  // Set current balance to ₦75,000 (₦30k + ₦25k + ₦20k)
  pot.currentKobo = nairaToKobo(75000)

  // Add contributions manually for demo
  pot.contributions = [
    {
      id: 'contrib_1',
      potId: pot.id,
      userId: 'user_1',
      amountKobo: nairaToKobo(20000),
      type: 'one_off',
      source: 'salary_split',
      memberColor: '#8B5CF6', // violet
      description: 'Owner contribution',
      createdAt: Date.now() - 86400000, // 1 day ago
    },
    {
      id: 'contrib_2',
      potId: pot.id,
      userId: 'user_2',
      amountKobo: nairaToKobo(30000),
      type: 'one_off',
      source: 'salary_split',
      memberColor: '#F5B83D', // gold
      description: 'Salary split contribution',
      createdAt: Date.now() - 72000000, // 2 days ago
    },
    {
      id: 'contrib_3',
      potId: pot.id,
      userId: 'user_3',
      amountKobo: nairaToKobo(25000),
      type: 'one_off',
      source: 'salary_split',
      memberColor: '#2BD67B', // green
      description: 'Salary split contribution',
      createdAt: Date.now() - 48000000, // 3 days ago
    },
  ]
  pot.members = pot.members.map((member) => ({
    ...member,
    contributionKobo: member.userId === 'user_1'
      ? nairaToKobo(20000)
      : member.userId === 'user_2'
        ? nairaToKobo(30000)
        : nairaToKobo(25000),
  }))

  // Add a pending withdrawal request (majority approval needed)
  // ₦20,000 withdrawal, needs votes from 2 of 3 members
  const withdrawalRequest: WithdrawalRequest = {
    id: 'withdrawal_1',
    potId: pot.id,
    requestedByUserId: 'user_1',
    amountKobo: nairaToKobo(20000),
    reason: 'Paying rent',
    status: 'pending',
    votesYes: 1, // owner voted yes
    votesNo: 0,
    votesByUserId: { user_1: 'yes' },
    createdAt: Date.now() - 24000000, // 24 hours ago (within 72h window)
    expiresAt: Date.now() + 48000000, // 48 hours from now (within 72h)
  }

  pot.withdrawalRequests = [withdrawalRequest]

  // Add notification about the pending withdrawal
  pot.notifications = [
    {
      id: 'notif_1',
      potId: pot.id,
      type: 'withdrawal_request',
      title: 'Withdrawal request',
      body: '₦20,000 requested for paying rent',
      data: { requestId: withdrawalRequest.id, amountKobo: nairaToKobo(20000) },
      read: false,
      createdAt: Date.now() - 24000000,
    },
  ]

  return pot
})()

// Pot 2: 2-person "Zanzibar Trip" with owner-up-to-₦50,000
export const ZANZIBAR_TRIP = (() => {
  const pot = createJointPot(
    'Zanzibar Trip',
    'Zanzibar Trip',
    nairaToKobo(500000), // ₦500,000 target
    null, // no deadline
    'owner_up_to_ngx', // owner approves up to ₦X
    'user_2', // owner (Tunde)
    3, // max 3 members
    0, // no fee
    nairaToKobo(50000)
  )

  // Add members
  pot.members.push(
    { userId: 'user_3', role: 'member', contributionKobo: 0, joinedAt: Date.now() }
  )

  // Set some contributions
  // Chioma contributes ₦100,000
  // Tunde (owner) contributes ₦50,000
  pot.currentKobo = nairaToKobo(150000)

  // Add contributions
  pot.contributions = [
    {
      id: 'contrib_4',
      potId: pot.id,
      userId: 'user_2',
      amountKobo: nairaToKobo(50000),
      type: 'one_off',
      source: 'one_off',
      memberColor: '#F5B83D', // gold
      description: 'Owner contribution',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'contrib_5',
      potId: pot.id,
      userId: 'user_3',
      amountKobo: nairaToKobo(100000),
      type: 'one_off',
      source: 'one_off',
      memberColor: '#2BD67B', // green
      description: 'Contribution',
      createdAt: Date.now() - 86400000,
    },
  ]
  pot.members = pot.members.map((member) => ({
    ...member,
    contributionKobo: member.userId === 'user_2'
      ? nairaToKobo(50000)
      : nairaToKobo(100000),
  }))

  // Add a pending withdrawal request (owner-up-to-₦50,000 rule)
  // ₦80,000 requested - but owner (Tunde) can approve up to ₦50,000
  // Since non-owner Chioma requested ₦80,000, this needs majority approval
  // Actually for owner-up-to-ngx, only the owner can approve amounts up to ₦50,000
  // For non-owner requests, we use majority rule
  const withdrawalRequest: WithdrawalRequest = {
    id: 'withdrawal_2',
    potId: pot.id,
    requestedByUserId: 'user_3', // Chioma requested
    amountKobo: nairaToKobo(80000),
    reason: 'Paying for flights and accommodation',
    status: 'pending',
    votesYes: 0,
    votesNo: 0,
    votesByUserId: {},
    createdAt: Date.now() - 12000000, // 12 hours ago (within 72h window)
    expiresAt: Date.now() + 72000000, // 72 hours from now
  }

  pot.withdrawalRequests = [withdrawalRequest]

  // Add notification
  pot.notifications = [
    {
      id: 'notif_2',
      potId: pot.id,
      type: 'withdrawal_request',
      title: 'Withdrawal request',
      body: '₦80,000 requested for paying for flights and accommodation',
      data: { requestId: withdrawalRequest.id, amountKobo: nairaToKobo(80000) },
      read: false,
      createdAt: Date.now() - 12000000,
    },
  ]

  return pot
})()

/**
 * Get all demo joint pots.
 */
export function getDemoPots(): JointPot[] {
  return [LAGOS_RENT_FUND, ZANZIBAR_TRIP]
}

/**
 * Get a demo pot by ID.
 */
export function getDemoPotById(potId: string): JointPot | undefined {
  return [LAGOS_RENT_FUND, ZANZIBAR_TRIP].find((pot) => pot.id === potId)
}

/**
 * Get pending invites for demo pots.
 * In a real app, these would come from the invite system.
 * For demo: return any pending invites.
 */
export function getPendingInvites(): JointInvite[] {
  const invites: JointInvite[] = []

  // Add a pending invite to the Lagos Rent Fund for user_3
  // (sent by user_1, but user_3 hasn't accepted yet - or rather, this is an old invite)
  const oldInvite: JointInvite = {
    id: 'invite_1',
    potId: LAGOS_RENT_FUND.id,
    email: 'chioma.pending@example.com',
    username: 'chioma_u',
    status: 'pending',
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now (not expired yet)
    createdAt: Date.now() - 100000000, // ~1 day ago
  }

  // Add a pending invite to Zanzibar Trip for a new user
  const newInvite: JointInvite = {
    id: 'invite_2',
    potId: ZANZIBAR_TRIP.id,
    email: 'new.user@example.com',
    username: '',
    status: 'pending',
    expiresAt: Date.now() + 2000000000, // far future - won't expire for demo
    createdAt: Date.now(),
  }

  invites.push(oldInvite, newInvite)
  return invites
}

function divideKoboMultiplyTotal(a: number, b: number, c: number): number {
  if (b === 0) return 0
  return Math.round((a * c) / b)
}

/**
 * Get coach insights (rule-based).
 */
export function getCoachInsights(userId: string, pots: JointPot[]): {
  insights: CoachInsight[]
  lastUpdated: number
} {
  const insights: CoachInsight[] = []
  const now = Date.now()

  // Check salary split balance
  // Check pot contributions
  // Check goal progress
  // etc.

  // Example insight: "Your rent contribution is 30% of the Lagos Rent Fund goal"
  const rentFund = pots.find((p) => p.name === 'Lagos Rent Fund')
  if (rentFund) {
    const memberContributions = rentFund.contributions.filter(
      (c) => c.userId === userId
    )
    const totalUserContributed = memberContributions.reduce(
      (sum, c) => addKobo(sum, c.amountKobo),
      0
    )
    const totalPotBalance = rentFund.currentKobo

    if (totalUserContributed > 0 && totalPotBalance > 0) {
      const percentage = Math.round(
        (divideKoboMultiplyTotal(totalUserContributed, totalPotBalance, 100) / 100)
      )
      if (percentage > 0) {
        insights.push({
          id: 'insight_1',
          title: 'Your contribution progress',
          body: `You've contributed ₦${koboToNaira(totalUserContributed)} toward the ${rentFund.name} (${percentage}% of total)`,
          type: 'contribution',
          priority: 'medium',
          createdAt: now,
        })
      }
    }
  }

  // Example insight: "You're 40% toward your holiday goal"
  // (Would need goal data - simplified for demo)

  return {
    insights,
    lastUpdated: now,
  }
}

/** Coach insight type */
export interface CoachInsight {
  id: string
  title: string
  body: string
  type: 'contribution' | 'goal' | 'warning' | 'info'
  priority: 'low' | 'medium' | 'high'
  createdAt: number
}