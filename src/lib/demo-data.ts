/**
 * Shared seeded demo data.
 *
 * Every page reads the same defaults so the demo never tells two different
 * stories depending on where you landed first. Values are stored in integer
 * kobo and dates use fixed ISO strings so prerendering stays deterministic.
 */

export type DemoGoal = {
  id: string
  name: string
  category: string
  targetKobo: number
  currentKobo: number
  deadline?: string
}

export type DemoPot = {
  id: string
  name: string
  goal: string
  targetKobo: number
  balanceKobo: number
  deadline?: string
  rule: string
  ownerApprovalLimitKobo?: number
  members: string[]
}

export type DemoInvite = {
  id: string
  potId: string
  potName: string
  invitedBy: string
  contact: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  createdAt: string
  expiresAt: string
}

const naira = (value: number) => value * 100

export const defaultPots: DemoPot[] = [
  {
    id: 'lagos-rent',
    name: 'Lagos Rent Fund',
    goal: 'Shared rent goal',
    targetKobo: naira(250000),
    balanceKobo: naira(75000),
    deadline: '2026-12-31',
    rule: 'Majority approves',
    members: ['You', 'Aisha', 'Tunde'],
  },
  {
    id: 'family-trip',
    name: 'Family Trip',
    goal: 'Holiday savings',
    targetKobo: naira(180000),
    balanceKobo: naira(42000),
    deadline: '2027-06-30',
    rule: 'All members approve',
    members: ['You', 'Chioma'],
  },
]

export const defaultInvites: DemoInvite[] = [
  {
    id: 'invite-lagos-rent',
    potId: 'lagos-rent',
    potName: 'Lagos Rent Fund',
    invitedBy: 'Aisha',
    contact: 'you@demo.buyandbuild',
    status: 'pending',
    createdAt: '2026-11-08T09:00:00.000Z',
    expiresAt: '2026-11-15T09:00:00.000Z',
  },
]

export const defaultSalarySplit = {
  salaryNaira: 200000,
  spending: 50,
  savings: 30,
  goal: 20,
}
