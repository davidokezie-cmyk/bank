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

import { nairaToKobo, koboToNaira, addKobo, subtractKobo } from './money'

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
  votesByUserId?: Record<string, Vote>
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
  ownerApprovalLimitKobo?: number
  ownerUserId: string
  maxMembers: number
  feeKobo: number  // withdrawal fee, demo
  members: JointPotMember[]
  contributions: JointContribution[]
  withdrawalRequests: WithdrawalRequest[]
  createdAt: number
  closedAt?: number
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
  type: 'invite' | 'contribution' | 'withdrawal_request' | 'withdrawal_vote' | 'milestone' | 'member_left' | 'pot_closed'
  title: string
  body: string
    data?: Record<string, unknown>
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
  feeKobo: number = 0,
  ownerApprovalLimitKobo?: number,
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
  if (approvalRule === 'owner_up_to_ngx' && (!Number.isSafeInteger(ownerApprovalLimitKobo) || (ownerApprovalLimitKobo ?? 0) <= 0)) {
    throw new Error('Owner approval limit must be a positive amount in kobo')
  }
  
  return {
    id: `pot_${Date.now()}`,
    name,
    goalName,
    targetKobo,
    currentKobo: 0,
    deadline,
    approvalRule,
    ownerApprovalLimitKobo,
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
  return time >= invite.expiresAt
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
  pot: JointPot,
  source?: string,
  memberColor?: string,
): { contribution: JointContribution; updatedPot: JointPot } {
  const now = Date.now()
  const member = pot.members.find((item) => item.userId === userId && !item.leftAt)
  if (!member) {
    throw new Error('Only active pot members can contribute')
  }
  if (!Number.isSafeInteger(amountKobo) || amountKobo <= 0) {
    throw new Error('Contribution amount must be greater than zero')
  }
  if (pot.closedAt) {
    throw new Error('Contributions cannot be made to a closed pot')
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
  const updatedPot: JointPot = {
    ...pot,
    currentKobo: addKobo(pot.currentKobo, amountKobo),
    members: pot.members.map((item) => item.userId === userId
      ? { ...item, contributionKobo: addKobo(item.contributionKobo, amountKobo) }
      : item),
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
export function memberLeavesPot(pot: JointPot, userId: string): {
  refundKobo: number
  updatedPot: JointPot
  memberBeforeLeave: JointPotMember
} {
  // Find the member
  const member = pot.members.find((m) => m.userId === userId && !m.leftAt)
  if (!member) {
    throw new Error('User is not a member of this pot')
  }
  const memberBeforeLeave = { ...member }
  const activeMembers = pot.members.filter((item) => !item.leftAt)
  const refunds = allocateProportionally(
    pot.currentKobo,
    activeMembers.map((item) => ({
      userId: item.userId,
      weightKobo: item.contributionKobo,
      joinedAt: item.joinedAt,
    })),
  )
  const refundKobo = refunds[userId] ?? 0
  const now = Date.now()
  const updatedMembers = pot.members.map((m) =>
    m.userId === userId
      ? { ...m, contributionKobo: 0, leftAt: now, leftReason: 'member_initiated' }
      : m
  )
  const notification: JointNotification = {
    id: `notif_${now}`,
    potId: pot.id,
    type: 'member_left',
    title: 'Member left the pot',
    body: `${userId} left and received a proportional demo refund.`,
    data: { userId, refundKobo },
    read: false,
    createdAt: now,
  }
  const updatedPot: JointPot = {
    ...pot,
    members: updatedMembers,
    currentKobo: subtractKobo(pot.currentKobo, refundKobo),
    notifications: [...pot.notifications, notification],
  }
  return { refundKobo, updatedPot, memberBeforeLeave }
}

/**
 * Helper to divide and multiply for proportional calculations.
 * Since we don't have a full math library, use this pattern:
 * (a / b) * c = round((a * c) / b)
 */
function allocateProportionally(
  amountKobo: number,
  members: Array<{ userId: string; weightKobo: number; joinedAt: number }>,
): Record<string, number> {
  if (!Number.isSafeInteger(amountKobo) || amountKobo < 0) {
    throw new Error('Amount must be a non-negative integer number of kobo')
  }
  const totalWeight = members.reduce((sum, member) => sum + member.weightKobo, 0)
  if (!Number.isSafeInteger(totalWeight) || totalWeight <= 0) {
    if (amountKobo === 0) return Object.fromEntries(members.map(({ userId }) => [userId, 0]))
    throw new Error('Cannot distribute pot balance without positive member contributions')
  }

  const total = BigInt(totalWeight)
  const amount = BigInt(amountKobo)
  const shares = members.map((member) => {
    const numerator = amount * BigInt(member.weightKobo)
    return {
      userId: member.userId,
      joinedAt: member.joinedAt,
      amount: Number(numerator / total),
      remainder: numerator % total,
    }
  })
  let remainder = amountKobo - shares.reduce((sum, share) => sum + share.amount, 0)
  const recipients = [...shares].sort((a, b) =>
    a.remainder === b.remainder
      ? a.joinedAt - b.joinedAt || a.userId.localeCompare(b.userId)
      : a.remainder > b.remainder ? -1 : 1,
  )
  for (let index = 0; remainder > 0; index += 1, remainder -= 1) {
    recipients[index % recipients.length].amount += 1
  }

  return Object.fromEntries(shares.map(({ userId, amount }) => [userId, amount]))
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
  reason?: string,
  destination: WithdrawalRequest['destination'] = 'member_wallet',
): { request: WithdrawalRequest; updatedPot: JointPot } {
  const now = Date.now()
  const requester = pot.members.find((m) => m.userId === requestingUserId && !m.leftAt)
  if (!requester) {
    throw new Error('User is not a member of this pot')
  }
  if (pot.closedAt) throw new Error('Cannot withdraw from a closed pot')
  if (!Number.isSafeInteger(amountKobo) || amountKobo <= 0) {
    throw new Error('Withdrawal amount must be a positive integer number of kobo')
  }
  const maxAllowed = pot.currentKobo - pot.feeKobo
  if (amountKobo > maxAllowed) {
    throw new Error(
      `Withdrawal amount exceeds available balance. ` +
      `Available: ₦${koboToNaira(maxAllowed)}, ` +
      `Requested: ₦${koboToNaira(amountKobo)}`
    )
  }
  if (pot.approvalRule === 'owner_up_to_ngx' && amountKobo > (pot.ownerApprovalLimitKobo ?? 0)) {
    throw new Error('Withdrawal amount exceeds the owner approval limit')
  }

  const request: WithdrawalRequest = {
    id: `withdrawal_${Date.now()}`,
    potId: pot.id,
    requestedByUserId: requestingUserId,
    amountKobo,
    reason,
    status: 'pending',
    votesYes: 0,
    votesNo: 0,
    votesByUserId: {},
    destination,
    createdAt: now,
    expiresAt: now + 72 * 60 * 60 * 1000,  // 72 hours
  }
  const notification: JointNotification = {
    id: `notif_${now}`,
    potId: pot.id,
    type: 'withdrawal_request',
    title: 'Withdrawal request',
    body: `${koboToNaira(amountKobo)} requested for withdrawal`,
    data: { requestId: request.id, amountKobo, reason, destination },
    read: false,
    createdAt: now,
  }
  const updatedPot: JointPot = {
    ...pot,
    withdrawalRequests: [...pot.withdrawalRequests, request],
    notifications: [...pot.notifications, notification],
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
  const requestIndex = pot.withdrawalRequests.findIndex(
    (r) => r.id === withdrawalRequestId
  )
  if (requestIndex === -1) {
    throw new Error('Withdrawal request not found')
  }
  const request = pot.withdrawalRequests[requestIndex]
  const activeMembers = pot.members.filter((member) => !member.leftAt)
  const voter = activeMembers.find((member) => member.userId === voterUserId)
  if (!voter) throw new Error('Only active pot members can vote')

  if (request.status !== 'pending') {
    throw new Error('This withdrawal request is no longer pending')
  }
  if (now >= request.expiresAt) {
    const updatedRequest = { ...request, status: 'expired' as const }
    const updatedRequests = [...pot.withdrawalRequests]
    updatedRequests[requestIndex] = updatedRequest
    return {
      updatedPot: { ...pot, withdrawalRequests: updatedRequests },
      yesVotes: request.votesYes,
      noVotes: request.votesNo,
      thresholdMet: false,
    }
  }
  if (request.votesByUserId?.[voterUserId]) {
    throw new Error('Each member may vote only once per withdrawal request')
  }
  if (pot.approvalRule === 'owner_up_to_ngx' && voterUserId !== pot.ownerUserId) {
    throw new Error('Only the pot owner can vote under this approval rule')
  }

  const votesByUserId = { ...request.votesByUserId, [voterUserId]: vote }
  const yesVotes = Object.values(votesByUserId).filter((value) => value === 'yes').length
  const noVotes = Object.values(votesByUserId).filter((value) => value === 'no').length
  let thresholdMet = false
  let rejected = false
  switch (pot.approvalRule) {
    case 'all':
      thresholdMet = yesVotes === activeMembers.length
      rejected = noVotes > 0
      break
    case 'majority':
      thresholdMet = yesVotes >= Math.floor(activeMembers.length / 2) + 1
      rejected = noVotes >= Math.floor(activeMembers.length / 2) + 1
      break
    case 'owner_up_to_ngx':
      thresholdMet = votesByUserId[pot.ownerUserId] === 'yes'
      rejected = votesByUserId[pot.ownerUserId] === 'no'
      break
  }

  const updatedRequest: WithdrawalRequest = {
    ...request,
    votesByUserId,
    votesYes: yesVotes,
    votesNo: noVotes,
    status: thresholdMet ? 'approved' : rejected ? 'rejected' : 'pending',
    approvedAt: thresholdMet ? now : undefined,
  }
  const updatedRequests = [...pot.withdrawalRequests]
  updatedRequests[requestIndex] = updatedRequest
  let members = pot.members
  let currentKobo = pot.currentKobo
  if (thresholdMet) {
    const debitKobo = request.amountKobo + pot.feeKobo
    const activeShares = allocateProportionally(
      debitKobo,
      activeMembers.map((member) => ({
        userId: member.userId,
        weightKobo: member.contributionKobo,
        joinedAt: member.joinedAt,
      })),
    )
    members = pot.members.map((member) => {
      const newContribution = member.contributionKobo - (activeShares[member.userId] ?? 0)
      if (newContribution < 0) throw new Error('Withdrawal exceeds member net contributions')
      return { ...member, contributionKobo: newContribution }
    })
    currentKobo = subtractKobo(currentKobo, debitKobo)
  }
  const notification: JointNotification = {
    id: `notif_${now}`,
    potId: pot.id,
    type: 'withdrawal_vote',
    title: thresholdMet ? 'Withdrawal approved' : rejected ? 'Withdrawal rejected' : 'Withdrawal vote recorded',
    body: `${yesVotes} yes, ${noVotes} no`,
    data: { requestId: request.id, voterUserId, vote },
    read: false,
    createdAt: now,
  }
  const updatedPot: JointPot = {
    ...pot,
    currentKobo,
    members,
    withdrawalRequests: updatedRequests,
    notifications: [...pot.notifications, notification],
  }
  return { updatedPot, yesVotes, noVotes, thresholdMet }
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
  ownerUserId: string,
  confirmedMemberUserIds: string[],
): {
  distributedMembers: JointPotMember[]
  payouts: Array<{ userId: string; amountKobo: number }>
  totalDistributedKobo: number
  roundingRemainderKobo: number
  updatedPot: JointPot
} {
  if (pot.ownerUserId !== ownerUserId) {
    throw new Error('Only the pot owner can close the pot')
  }
  if (pot.closedAt) throw new Error('This pot is already closed')
  if (pot.withdrawalRequests.some((request) => request.status === 'pending')) {
    throw new Error('Resolve pending withdrawal requests before closing this pot')
  }
  const activeMembers = pot.members.filter((member) => !member.leftAt)
  const confirmations = new Set(confirmedMemberUserIds)
  if (activeMembers.some((member) => !confirmations.has(member.userId))) {
    throw new Error('Every active member must confirm before the pot can close')
  }

  const now = Date.now()
  const totalBalance = pot.currentKobo
  const shares = allocateProportionally(
    totalBalance,
    activeMembers.map((member) => ({
      userId: member.userId,
      weightKobo: member.contributionKobo,
      joinedAt: member.joinedAt,
    })),
  )
  const payouts = activeMembers.map((member) => ({
    userId: member.userId,
    amountKobo: shares[member.userId] ?? 0,
  }))
  const totalDistributedKobo = payouts.reduce((sum, payout) => sum + payout.amountKobo, 0)
  const roundingRemainderKobo = totalBalance - totalDistributedKobo
  if (roundingRemainderKobo !== 0) {
    throw new Error('Pot distribution did not preserve the full balance')
  }
  const distributedMembers = activeMembers.map((member) => ({
    ...member,
    contributionKobo: shares[member.userId] ?? 0,
  }))
  const notification: JointNotification = {
    id: `notif_${now}`,
    potId: pot.id,
    type: 'pot_closed',
    title: 'Pot closed',
    body: `Pot "${pot.name}" closed. The full balance was distributed proportionally.`,
    data: { totalBalanceKobo: totalBalance, totalDistributedKobo },
    read: false,
    createdAt: now,
  }
  const updatedPot: JointPot = {
    ...pot,
    currentKobo: 0,
    closedAt: now,
    members: pot.members.map((member) => ({
      ...member,
      contributionKobo: 0,
      leftAt: member.leftAt ?? now,
      leftReason: member.leftReason ?? 'pot_closed',
    })),
    notifications: [...pot.notifications, notification],
  }
  return { distributedMembers, payouts, totalDistributedKobo, roundingRemainderKobo, updatedPot }
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
    0, // no fee
    nairaToKobo(50000),
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
    pot.currentKobo = nairaToKobo(75000)
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
    pot.currentKobo = nairaToKobo(150000)
  }
  
  return pot
}