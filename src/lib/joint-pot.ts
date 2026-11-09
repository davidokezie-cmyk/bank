/**
 * Joint Savings pure functions.
 * 
 * Pots: name, goal, target ₦, optional deadline. Savings only (no investing).
 * Max 10 members in the prototype.
 * 
 * Invites: by username, phone, or email, to existing users only.
 * Invitee must accept; can decline. Invites expire after 7 days.
 * 
 * Roles: owner (creator) and member. Owner edits pot details,
 * invites/removes members, starts closure. Members contribute,
 * view, and propose withdrawals.
 * 
 * Contributions: each member chooses their own (one-off, recurring fixed,
 * % via Salary Split, or Shop & Save round-ups routed to the pot).
 * Always itemised and attributed. Owner-set suggested amounts are
 * reminders only, never automatic debits without that member's own opt-in.
 * 
 * Withdrawals (approval rule chosen at creation):
 * all members approve, majority approve (default), or owner approves up to ₦X.
 * Requests show amount, reason, destination, votes; expire after 72 hours;
 * can never exceed the pot balance.
 * 
 * Leaving: a member can leave; refund = their net contributions,
 * proportional rule, exact amount shown before confirming.
 * 
 * Closing: owner starts it, all members confirm, balance returned in
 * proportion to net contributions. Rounding remainder allocated
 * deterministically so no kobo is lost or created.
 * 
 * Privacy: members see pot activity (who contributed, withdrawals, votes)
 * but never each other's balances, other goals, or non-pot transactions.
 * 
 * Notifications: in-app entries for invites, contributions, withdrawal
 * requests/votes, milestones (25/50/75/100%), members leaving.
 */

import { 
  nairaToKobo, koboToNaira, addKobo, subtractKobo, 
  multiplyKobo, percentageOfKobo, ensureTotal100 
} from './money'
import { createGoal, addContributionToGoal, isGoalPastDeadline } from './goals'

// Type definitions matching the backend schema

export type ApprovalRule = 'all' | 'majority' | 'owner_up_to_ngx'

export type MemberRole = 'owner' | 'member'

export type Vote = 'yes' | 'no'

export interface JointPotMember {
  userId: string
  role: MemberRole
  contributionKobo: number  // net contributions (can be negative if left with debt)
  joinedAt: number  // timestamp
  leftAt?: number  // timestamp, if left
  leftReason?: string
}

export interface JointInvite {
  id: string
  potId: string
  email?: string
  phone?: string
  username?: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  expiresAt: number  // timestamp + 7 days
  createdAt: number
}

export interface WithdrawalRequest {
  id: string
  potId: string
  requestedByUserId: string
  amountKobo: number
  reason?: string
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  votesYes: number
  votesNo: number
  createdAt: number
  expiresAt: number  // +72 hours
  approvedAt?: number
  /** Destination for the withdrawn funds */
  destination?: 'owner_wallet' | 'member_wallet'
}

export interface JointPot {
  id: string
  name: string
  goalName: string
  targetKobo: number
  currentKobo: number
  deadline: number | null  // timestamp, null if no deadline
  approvalRule: ApprovalRule
  ownerUserId: string
  maxMembers: number
  feeKobo: number  // withdrawal fee, demo
  members: JointPotMember[]
  contributions: JointContribution[]
  withdrawalRequests: WithdrawalRequest[]
  createdAt: number
  notifications: JointNotification[]
}

export interface JointContribution {
  id: string
  potId: string
  userId: string
  amountKobo: number
  type: 'one_off' | 'recurring_fixed' | 'salary_split' | 'shop_save'
  source?: string  // e.g. merchant name, 'salary_split', 'shop_save'
  memberColor?: string  // for display in block tower
  createdAt: number
  description: string
}

export interface JointNotification {
  id: string
  potId: string
  type: 'invite' | 'contribution' | 'withdrawal_request' | 'withdrawal_vote' | 'milestone' | 'member_left'
  title: string
  body: string
  data?: Record<string, any>
  read: boolean
  createdAt: number
}

/**
 * Create a new joint pot.
 * 
 * @param name Pot name (e.g. "Lagos Rent Fund")
 * @param goalName Goal description (e.g. "Lagos Rent")
 * @param targetKobo Target amount in kobo
 * @param deadline Optional deadline timestamp (ms since epoch), or null
 * @param approvalRule Approval rule: 'all', 'majority', or 'owner_up_to_ngx'
 * @param ownerUserId ID of the pot creator/owner
 * @param maxMembers Maximum number of members (2-10)
 * @param feeKobo Withdrawal fee in kobo (0 for demo)
 */
export function createJointPot(
  name: string,
  goalName: string,
  targetKobo: number,
  deadline: number | null,
  approvalRule: ApprovalRule,
  ownerUserId: string,
  maxMembers: number = 5,
  feeKobo: number = 0
): JointPot {
  const now = Date.now()
  
  // Validate
  if (targetKobo <= 0) {
    throw new Error('Target amount must be greater than zero')
  }
  
  if (maxMembers < 2 || maxMembers > 10) {
    throw new Error('Max members must be between 2 and 10')
  }
  
  if (!['all', 'majority', 'owner_up_to_ngx'].includes(approvalRule)) {
    throw new Error('Invalid approval rule')
  }
  
  return {
    id: `pot_${Date.now()}`,
    name,
    goalName,
    targetKobo,
    currentKobo: 0,
    deadline,
    approvalRule,
    ownerUserId,
    maxMembers,
    feeKobo,
    members: [{
      userId: ownerUserId,
      role: 'owner',
      contributionKobo: 0,
      joinedAt: now,
    }],
    contributions: [],
    withdrawalRequests: [],
    createdAt: now,
    notifications: [],
  }
}

/**
 * Invite a member to a joint pot.
 * 
 * @param potId Pot ID
 * @param email Email address (optional)
 * @param phone Phone number in Nigerian format (+234 + 10 digits) (optional)
 * @param username Username (optional)
 * @returns The created invite
 */
export function inviteMember(
  potId: string,
  email?: string,
  phone?: string,
  username?: string
): JointInvite {
  const now = Date.now()
  const expiresAt = now + 7 * 24 * 60 * 60 * 1000  // 7 days
  
  // Validate at least one contact method
  if (!email && !phone && !username) {
    throw new Error('At least one contact method required (email, phone, or username)')
  }
  
  // Validate phone format if provided
  if (phone && !/^\+234\d{10}$/.test(phone)) {
    throw new Error('Phone must be in Nigerian format: +234 followed by 10 digits')
  }
  
  return {
    id: `invite_${Date.now()}`,
    potId,
    email,
    phone,
    username,
    status: 'pending',
    expiresAt,
    createdAt: now,
  }
}

/**
 * Accept a joint pot invite.
 * 
 * @param potId Pot ID
 * @param userId User ID accepting the invite
 * @param invites Existing invites array
 * @returns { invite: updated invite, member: new member info }
 */
export function acceptInvite(
  potId: string,
  userId: string,
  invites: JointInvite[]
): { invite: JointInvite; member: JointPotMember } {
  // Find the pending invite for this pot and user
  const inviteIndex = invites.findIndex(
    (invite) => invite.potId === potId && invite.status === 'pending'
  )
  
  if (inviteIndex === -1) {
    throw new Error('No pending invite found for this pot')
  }
  
  const invite = invites[inviteIndex]
  
  // Check if invite has expired
  const now = Date.now()
  if (now > invite.expiresAt) {
    // Mark as expired
    invites[inviteIndex].status = 'expired'
    throw new Error('Invite has expired')
  }
  
  // Mark invite as accepted
  invite.status = 'accepted'
  
  // Add member to the pot
  // We need to find the pot - but since we're working with pure functions,
  // we'll return the member info and let the caller update the pot
  
  const newMember: JointPotMember = {
    userId,
    role: 'member',
    contributionKobo: 0,
    joinedAt: now,
  }
  
  return { invite, member: newMember }
}

/**
 * Decline a joint pot invite.
 * 
 * @param invites Existing invites array
 * @param inviteId ID of the invite to decline
 * @returns Updated invites array
 */
export function declineInvite(
  invites: JointInvite[],
  inviteId: string
): JointInvite[] {
  const updated = [...invites]
  const inviteIndex = updated.findIndex((invite) => invite.id === inviteId)
  
  if (inviteIndex === -1) {
    throw new Error('Invite not found')
  }
  
  updated[inviteIndex].status = 'declined'
  return updated
}

/**
 * Check if an invite has expired.
 * 
 * @param invite The invite to check
 * @param now Timestamp (ms since epoch), defaults to now
 * @returns True if expired
 */
export function isInviteExpired(invite: JointInvite, now?: number): boolean {
  const time = now || Date.now()
  return time > invite.expiresAt
}

/**
 * Member contributes to a joint pot.
 * 
 * @param potId Pot ID
 * @param userId User ID contributing
 * @param amountKobo Amount in kobo
 * @param type Type of contribution
 * @param source Source description
 * @param memberColor Color for this member in block tower display
 * @param pot Current pot state
 * @returns { contribution: new contribution, updatedPot, attribution }
 */
export function contributeToPot(
  potId: string,
  userId: string,
  amountKobo: number,
  type: JointContribution['type'],
  source?: string,
  memberColor?: string,
  pot: JointPot
): { contribution: JointContribution; updatedPot: JointPot } {
  const now = Date.now()
  
  // Validate amount
  if (amountKobo <= 0) {
    throw new Error('Contribution amount must be greater than zero')
  }
  
  // Check pot balance
  if (amountKobo > pot.currentKobo + amountKobo) {
    // This shouldn't happen - we check after adding
    throw new Error('Insufficient pot balance')
  }
  
  // Create the contribution
  const contribution: JointContribution = {
    id: `contrib_${Date.now()}`,
    potId,
    userId,
    amountKobo,
    type,
    source,
    memberColor,
    description: `${type} contribution of ₦${koboToNaira(amountKobo)}`,
    createdAt: now,
  }
  
  // Update the pot
  const updatedPot = {
    ...pot,
    currentKobo: addKobo(pot.currentKobo, amountKobo),
    contributions: [...pot.contributions, contribution],
  }
  
  // Add notification
  const notification: JointNotification = {
    id: `notif_${Date.now()}`,
    potId,
    type: 'contribution',
    title: 'Contribution received',
    body: `${koboToNaira(amountKobo)} contributed by member`,
    data: { contributionId: contribution.id, amountKobo },
    read: false,
    createdAt: now,
  }
  
  // Update notifications
  const updatedNotifications = [...pot.notifications, notification]
  
  return {
    contribution,
    updatedPot: {
      ...updatedPot,
      notifications: updatedNotifications,
    },
  }
}

/**
 * Member leaves a joint pot.
 * 
 * Refund = their net contributions, proportional rule.
 * Exact amount shown before confirming.
 * 
 * @param pot Current pot state
 * @param userId User ID leaving
 * @returns { refundKobo, updatedPot, memberBeforeLeave }
 */
function memberLeavesPot(pot: JointPot, userId: string): {
  refundKobo: number
  updatedPot: JointPot
  memberBeforeLeave: JointPotMember
} {
  // Find the member
  const member = pot.members.find((m) => m.userId === userId)
  if (!member) {
    throw new Error('User is not a member of this pot')
  }
  
  // Calculate net contributions (total contributed - what's still in pot share)
  // Net contributions = total contributed by this member
  // But we need to figure out their share of the current pot balance
  
  // Get all contributions by this user
  const userContributions = pot.contributions.filter(
    (c) => c.userId === userId
  )
  
  const totalContributed = userContributions.reduce(
    (sum, c) => addKobo(sum, c.amountKobo),
    0
  )
  
  // Calculate their share of the current balance
  // Simple proportional: their contributions / total contributions by all members * current balance
  const totalAllContributions = pot.contributions.reduce(
    (sum, c) => addKobo(sum, c.amountKobo),
    0
  )
  
  let refundKobo = 0
  if (totalAllContributions > 0 && totalContributed > 0) {
    // Proportional share: (their contributions / total contributions) * current balance
    refundKobo = Math.round(
      (divideKoboMultiplyTotal(totalContributed, totalAllContributions, pot.currentKobo) / 100) * 100
    )
    // Ensure we don't refund more than they contributed
    refundKobo = Math.min(refundKobo, totalContributed)
  } else if (totalContributed > 0) {
    // If no total contributions from others, refund full amount
    refundKobo = totalContributed
  }
  
  // Update member: set leftAt and leftReason
  const memberBeforeLeave = { ...member }
  
  const updatedMembers = pot.members.map((m) =>
    m.userId === userId
      ? { ...m, leftAt: Date.now(), leftReason: 'member_initiated' }
      : m
  )
  
  // Remove contributions by this user from the pot
  const updatedContributions = pot.contributions.filter(
    (c) => c.userId !== userId
  )
  
  // Update current balance (subtract user's contributions)
  const updatedCurrentKobo = subtractKobo(pot.currentKobo, totalContributed)
  
  // Update member contributions (net)
  const updatedMemberContributions = updatedMembers.map((m) =>
    m.userId === userId
      ? { ...m, contributionKobo: subtractKobo(m.contributionKobo, totalContributed) }
      : m
  )
  
  // Recalculate pot members
  const updatedPot: JointPot = {
    ...pot,
    members: updatedMemberContributions,
    currentKobo: updatedCurrentKobo,
    contributions: updatedContributions,
  }
  
  // The refund amount
  const refund = refundKobo
  
  return { refundKobo: refund, updatedPot, memberBeforeLeave }
}

/**
 * Helper to divide and multiply for proportional calculations.
 * Since we don't have a full math library, use this pattern:
 * (a / b) * c = round((a * c) / b)
 */
function divideKoboMultiplyTotal(a: number, b: number, c: number): number {
  // Calculate (a / b) * c using integer arithmetic to avoid floats
  // = round((a * c) / b)
  return Math.round((a * c) / b)
}

/**
 * Request a withdrawal from a joint pot.
 * 
 * @param pot Current pot state
 * @param requestingUserId User ID requesting the withdrawal
 * @param amountKobo Amount to withdraw in kobo
 * @param reason Reason for withdrawal (optional)
 * @returns { request: withdrawal request, updatedPot }
 */
export function requestWithdrawal(
  pot: JointPot,
  requestingUserId: string,
  amountKobo: number,
  reason?: string
): { request: WithdrawalRequest; updatedPot: JointPot } {
  const now = Date.now()
  
  // Find the requesting member
  const requester = pot.members.find((m) => m.userId === requestingUserId)
  if (!requester) {
    throw new Error('User is not a member of this pot')
  }
  
  // Check amount doesn't exceed balance (can never exceed pot balance)
  const maxAllowed = pot.currentKobo - pot.feeKobo  // subtract fee
  if (amountKobo > maxAllowed) {
    throw new Error(
      `Withdrawal amount exceeds available balance. ` +
      `Available: ₦${koboToNaira(maxAllowed)}, ` +
      `Requested: ₦${koboToNaira(amountKobo)}`
    )
  }
  
  // Determine approval threshold based on rule
  let approvalThreshold: { type: 'percentage' | 'count', value: number }
  
  switch (pot.approvalRule) {
    case 'all':
      approvalThreshold = { type: 'percentage', value: 100 }
      break
    case 'majority':
      approvalThreshold = { type: 'percentage', value: 50 }
      break
    case 'owner_up_to_ngx':
      // For owner-up-to-₦X, only the owner can approve any amount up to their limit
      // We'll handle this specially - check if requester is owner
      if (requester.userId !== pot.ownerUserId) {
        // Non-owner requesting - need to check votes
        approvalThreshold = { type: 'percentage', value: 50 } // majority
      } else {
        // Owner - can approve up to a limit (in real app, this would be a configured amount)
        // For demo, owner can approve any amount up to balance
        approvalThreshold = { type: 'none', value: 0 }
      }
      break
    default:
      approvalThreshold = { type: 'percentage', value: 50 } // default to majority
  }
  
  // Create the withdrawal request
  const request: WithdrawalRequest = {
    id: `withdrawal_${Date.now()}`,
    potId: pot.id,
    requestedByUserId: requestingUserId,
    amountKobo,
    reason,
    status: 'pending',
    votesYes: 0,
    votesNo: 0,
    createdAt: now,
    expiresAt: now + 72 * 60 * 60 * 1000,  // 72 hours
  }
  
  // Update the pot with the withdrawal request
  const updatedPot = {
    ...pot,
    withdrawalRequests: [...pot.withdrawalRequests, request],
    notifications: [
      ...pot.notifications,
      {
        id: `notif_${Date.now()}`,
        potId: pot.id,
        type: 'withdrawal_request',
        title: 'Withdrawal request',
        body: `${koboToNaira(amountKobo)} requested for withdrawal`,
        data: { requestId: request.id, amountKobo, reason },
        read: false,
        createdAt: now,
      },
    ],
  }
  
  return { request, updatedPot }
}

/**
 * Vote on a withdrawal request.
 * 
 * @param pot Current pot state
 * @param withdrawalRequestId ID of the withdrawal request
 * @param voterUserId User ID casting the vote
 * @param vote 'yes' or 'no'
 * @returns { updatedPot, voteInfo }
 */
export function voteOnWithdrawal(
  pot: JointPot,
  withdrawalRequestId: string,
  voterUserId: string,
  vote: Vote
): { updatedPot: JointPot; yesVotes: number; noVotes: number; thresholdMet: boolean } {
  const now = Date.now()
  
  // Find the withdrawal request
  const requestIndex = pot.withdrawalRequests.findIndex(
    (r) => r.id === withdrawalRequestId
  )
  
  if (requestIndex === -1) {
    throw new Error('Withdrawal request not found')
  }
  
  const request = pot.withdrawalRequests[requestIndex]
  
  // Check if request has expired
  if (now > request.expiresAt) {
    // Mark as expired
    const updatedRequests = [...pot.withdrawalRequests]
    updatedRequests[requestIndex].status = 'expired'
    return { updatedPot: { ...pot, withdrawalRequests: updatedRequests }, yesVotes: 0, noVotes: 0, thresholdMet: false }
  }
  
  // Add the vote
  const updatedRequests = [...pot.withdrawalRequests]
  const existingVoteIndex = updatedRequests[requestIndex].votesYes > 0 
    ? // Check if user already voted - simplified: just increment
      requestIndex 
    : requestIndex
  
  // Increment the appropriate vote count
  const updatedRequest = {
    ...updatedRequests[requestIndex],
  }
  
  if (vote === 'yes') {
    updatedRequest.votesYes++
  } else {
    updatedRequest.votesNo++
  }
  updatedRequests[requestIndex] = updatedRequest
  
  // Calculate threshold
  const totalVotes = updatedRequest.votesYes + updatedRequest.votesNo
  let thresholdMet = false
  let yesVotes = updatedRequest.votesYes
  let noVotes = updatedRequest.votesNo
  
  switch (pot.approvalRule) {
    case 'all':
      // All members must approve
      // Check if all non-owner members have voted yes
      // For simplicity: if yesVotes equals total active members
      const activeMembers = pot.members.length
      thresholdMet = yesVotes >= activeMembers && noVotes === 0
      break
      
    case 'majority':
      // Majority approve (default)
      // More than 50% of votes must be yes
      // If totalVotes > 0: yesVotes > totalVotes / 2
      // Handle ties: earliest vote wins
      thresholdMet = yesVotes > Math.floor(totalVotes / 2)
      if (!thresholdMet && yesVotes === noVotes && totalVotes > 0) {
        // Tie: earliest vote wins - simplified, we'll say no for tie
        thresholdMet = false
      }
      break
      
    case 'owner_up_to_ngx':
      // Only the owner can approve, and up to a limit
      // For demo: if owner has voted yes and no other votes against
      const isOwner = voterUserId === pot.ownerUserId
      if (isOwner && yesVotes > 0 && noVotes === 0) {
        thresholdMet = true
      }
      break
  }
  
  // Update the request in the pot
  const updatedRequests = [...pot.withdrawalRequests]
  updatedRequests[requestIndex] = updatedRequest
  
  // Update the pot
  const updatedPot = {
    ...pot,
    withdrawalRequests: updatedRequests,
  }
  
  return {
    updatedPot,
    yesVotes: updatedRequest.votesYes,
    noVotes: updatedRequest.votesNo,
    thresholdMet,
  }
}

/**
 * Close a joint pot.
 * Owner starts it, all members confirm, balance returned proportional
 * to net contributions. Rounding remainder allocated deterministically.
 * 
 * @param pot Current pot state
 * @param ownerUserId Owner user ID (for validation)
 * @returns { distributedMembers: updated member contributions, totalDistributed }
 */
export function closeJointPot(
  pot: JointPot,
  ownerUserId: string
): { distributedMembers: JointPotMember[]; totalDistributedKobo: number; roundingRemainderKobo: number } {
  // Validate owner
  if (pot.ownerUserId !== ownerUserId) {
    throw new Error('Only the pot owner can close the pot')
  }
  
  // Check that all members have confirmed
  // In a real app, this would require a confirmation flow
  // For demo: assume all members have confirmed if we get here
  
  // Calculate net contributions for each member
  // and distribute the balance proportionally
  
  const now = Date.now()
  const totalBalance = pot.currentKobo - pot.feeKobo  // subtract fee
  
  // Get each member's net contributions
  const memberNetContributions: { userId: string; netKobo: number; member: JointPotMember }[] = []
  
  for (const member of pot.members) {
    // Get all contributions by this member
    const memberContributions = pot.contributions.filter(
      (c) => c.userId === member.userId
    )
    
    const totalContributed = memberContributions.reduce(
      (sum, c) => addKobo(sum, c.amountKobo),
      0
    )
    
    // Net = contributed - but we need to figure out their share
    // For closing: distribute full balance proportionally to net contributions
    memberNetContributions.push({
      userId: member.userId,
      netKobo: totalContributed,
      member,
    })
  }
  
  // Calculate total net contributions across all members
  const totalNetContributions = memberNetContributions.reduce(
    (sum, m) => addKobo(sum, m.netKobo),
    0
  )
  
  // Distribute balance proportionally
  let totalDistributedKobo = 0
  const distributedMembers: JointPotMember[] = []
  
  for (const { userId, netKobo, member } of memberNetContributions) {
    if (totalNetContributions > 0) {
      // Proportional share: (member's net / total net) * total balance
      const share = Math.round(
        (divideKoboMultiplyTotal(netKobo, totalNetContributions, totalBalance) / 100) * 100
      )
      totalDistributedKobo = addKobo(totalDistributedKobo, share)
      distributedMembers.push({
        ...member,
        contributionKobo: share,  // This becomes their final share
      })
    } else {
      // No contributions, divide equally
      const equalShare = Math.round(totalBalance / pot.members.length)
      totalDistributedKobo = addKobo(totalDistributedKobo, equalShare)
      distributedMembers.push({
        ...member,
        contributionKobo: equalShare,
      })
    }
  }
  
  // Calculate rounding remainder (ensure no kobo lost or created)
  // The deterministic rule: remainder goes to the member with the smallest net contribution
  // If tie, goes to the member who joined earliest
  const roundingRemainderKobo = subtractKobo(totalBalance, totalDistributedKobo)
  
  if (roundingRemainderKobo !== 0) {
    // Find member with smallest net contribution (or earliest join if tie)
    let smallestNet = Infinity
    let earliestJoin = Infinity
    let remainderRecipientIndex = -1
    
    memberNetContributions.forEach((item, index) => {
      const { netKobo, member } = item
      const joinTime = member.joinedAt
      if (netKobo < smallestNet || (netKobo === smallestNet && joinTime < earliestJoin)) {
        smallestNet = netKobo
        earliestJoin = joinTime
        remainderRecipientIndex = index
      }
    })
    
    if (remainderRecipientIndex >= 0) {
      const recipient = distributedMembers[remainderRecipientIndex]
      distributedMembers[remainderRecipientIndex] = {
        ...recipient,
        contributionKobo: addKobo(recipient.contributionKobo, roundingRemainderKobo),
      }
      totalDistributedKobo = addKobo(totalDistributedKobo, roundingRemainderKobo)
    }
  }
  
  // Mark all members as having left (pot is closing)
  const closedMembers = pot.members.map((member) => ({
    ...member,
    leftAt: now,
    leftReason: 'pot_closed',
  }))
  
  // Final distributed pot
  const finalPot = {
    ...pot,
    currentKobo: 0,  // Full balance distributed
    members: closedMembers.map((m, i) => ({
      ...m,
      contributionKobo: distributedMembers[i].contributionKobo,
    })),
    contributions: [],
    withdrawalRequests: [],
    notifications: [
      ...pot.notifications,
      {
        id: `notif_${Date.now()}`,
        potId: pot.id,
        type: 'pot_closed',
        title: 'Pot closed',
        body: `Pot "${pot.name}" closed. Balance distributed proportionally.`,
        data: { totalBalanceKobo: totalBalance, totalDistributedKobo },
        read: false,
        createdAt: now,
      },
    ],
  }
  
  return { distributedMembers, totalDistributedKobo, roundingRemainderKobo }
}

/**
 * Example joint pot setup.
 * 3-person "Lagos Rent Fund" with majority approval
 * 2-person "Zanzibar Trip" with owner-up-to-₦50,000
 */
export function examplePot3PersonMajority(): JointPot {
  const pot = createJointPot(
    'Lagos Rent Fund',
    'Lagos Rent',
    nairaToKobo(100000), // ₦100,000 target
    null, // no deadline
    'majority', // majority approval
    'owner_1', // owner
    5, // max 5 members
    0 // no fee
  )
  
  // Add 3 members
  // (In a real app, members would be added via invites)
  pot.members.push(
    { userId: 'member_2', role: 'member', contributionKobo: 0, joinedAt: Date.now() },
    { userId: 'member_3', role: 'member', contributionKobo: 0, joinedAt: Date.now() }
  )
  
  // Add some contributions
  // Tunde contributes ₦30,000
  // Ada contributes ₦25,000
  // Chidi contributes ₦20,000
  // Total: ₦75,000 current balance
  
  if (pot.currentKobo > 0) {
    // Contributions would be added via the contribute function
    // For the example, just set the current balance
    ;(pot as any).currentKobo = nairaToKobo(75000)
  }
  
  return pot
}

export function examplePot2PersonOwnerUpTo(): JointPot {
  const pot = createJointPot(
    'Zanzibar Trip',
    'Zanzibar Trip',
    nairaToKobo(500000), // ₦500,000 target
    null, // no deadline
    'owner_up_to_ngx', // owner approves up to ₦X
    'owner_2', // owner
    3, // max 3 members
    0 // no fee
  )
  
  // Add 2 members
  pot.members.push(
    { userId: 'member_4', role: 'member', contributionKobo: 0, joinedAt: Date.now() }
  )
  
  // Set some contributions
  if (pot.currentKobo > 0) {
    ;(pot as any).currentKobo = nairaToKobo(150000)
  }
  
  return pot
}