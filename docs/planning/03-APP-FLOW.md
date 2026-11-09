# 03-APP-FLOW.md - Application Flow Document

## Status: Draft v1
## Last updated: 2026-11-09
## Links: 01-PRD.md, 02-TRD.md, 04-DESIGN-BRIEF.md, 05-BACKEND-SCHEMA.md, 06-IMPLEMENTATION-PLAN.md

## Route-Map Diagram

```
(graph description)
( markenting )          ( auth )
     ↓                     ↓
   /                /login   /sign-up
  / /                ----------
 (app)              ----------
/dashboard    (protected, demo-mode aware)
/goals         (protected)
/save           (protected)
/joint           (protected)
/joint/new       (protected)
/joint/[potId]   (protected)
/invites         (protected)
/activity        (protected)
/cards           (protected)
/coach           (protected)
/settings        (protected)
/profile          (protected)
```

## Page-by-Page Flow

### 1. Sign-Up / Log In (`(auth)/login`, `(auth)/sign-up`)
- **Purpose**: User onboarding, demo-mode fallback
- **Who can see**: Anonymous users + authenticated
- **Entry points**: `/`, `/login`, `/sign-up` URLs
- **Elements**: Email/phone input, password, "Continue with Clerk" (conditional on keys), "Continue in demo mode"
- **Actions**:
  - Submit sign-up → create user profile, redirect to `/onboarding`
  - "Continue in demo mode" → set cookie, redirect to `/dashboard`
- **Empty state**: No account yet
- **Error**: Invalid email, password too weak, email already taken
- **Success**: User redirected to onboarding

### 2. Onboarding (`/onboarding` → first Salary Split)
- **Purpose**: Guide user to create first Salary Split rule
- **Who can see**: Authenticated users only
- **Entry points**: From auth flow
- **Elements**: Progress indicator, salary amount input, category cards (Spending, Savings, Goals)
- **Journey**: Sign-up → onboarding → first Salary Split
- **Actions**:
  - Set salary amount (₦)
  - Allocate percentages to Spending, Savings, named Goals
  - Total must equal 100% → "Continue" disabled until valid
  - Save rule → redirect to Dashboard
- **Empty state**: First-time user, no rules yet
- **Error**: Total ≠ 100%, invalid percentage
- **Success**: Salary Split created, redirect to Dashboard

### 3. Dashboard ( `/dashboard` )
- **Purpose**: Wealth overview, quick actions
- **Who can see**: Authenticated users only
- **Entry points**: Dashboard link in sidebar, direct URL
- **Elements**:
  - Kobo mascot (progress-based block stack)
  - "Available to Spend" + "Available to Save/Invest" cards
  - Quick actions: Send, Save, Joint Savings, Goals
  - Recent transactions list
  - Pending joint pot invites/votes badge
- **Journeys from dashboard**:
  - → Save & Allocate (edit Salary Split)
  - → Goals (view/create goals)
  - → Joint Savings (view/create pots)
  - → Send money
  - → Activity feed
- **Empty state**: No goals, no pots, no transactions
- **Error**: None (graceful degradation)
- **Success**: Overview loaded

### 4. Goals (`/goals`)
- **Purpose**: Lifestyle goals management (rent, car, education, business, holiday)
- **Who can see**: Authenticated users only
- **Entry points**: Dashboard → Goals, bottom nav on mobile
- **Elements**:
  - Goal cards: each with target, progress bar, deadline
  - "Add goal" CTA
  - Koba block-stack progress visual
- **Journeys**:
  - Create new goal → name, target ₦, deadline date → saved
  - Edit goal target/deadline
  - Delete goal
- **Empty state**: No goals yet (show Koba calm + "Add your first goal")
- **Error**: Invalid target, past deadline
- **Success**: Goal created/progress updated

### 5. Save & Allocate (`/save`)
- **Purpose**: Salary Split builder + Shop & Save rules with explicit opt-in
- **Who can see**: Authenticated users only
- **Entry points**: Dashboard → Save, bottom nav → Save
- **Elements**:
  - Salary Split builder: edit existing rules, add new categories
  - Shop & Save rules: toggle, configure fixed/percentage/round-up
  - "Explicit opt-in" toggle for each Shop & Save rule
  - Itemised contribution log
  - Koba celebrate animation on contribution
- **Journeys**:
  - Create Salary Split rule (if not already done)
  - Add Shop & Save rule → configure → enable opt-in → save
  - Pause/edit/opt-out any rule
- **Empty state**: No rules yet (show setup guide)
- **Error**: Total ≠ 100%, invalid opt-in
- **Success**: Rule saved, Koba celebrate + aria-live announcement

### 6. Joint Savings (`/joint`)
- **Purpose**: View/create/manage joint savings pots
- **Who can see**: Authenticated users only
- **Entry points**: Dashboard → Joint Savings, bottom nav → Joint
- **Elements**:
  - Your pots: your share vs pot total, progress
  - Pending invites badge
  - Pending withdrawal votes badge
  - "Create new pot" CTA
- **Journeys**:
  - Create new pot → name, goal, target, deadline, approval rule → invite members
  - View pot details → member list, contributions, votes
  - Accept/decline invite
- **Empty state**: No pots yet (show "Start a joint pot with friends")
- **Error**: Pot full, invalid approval rule
- **Success**: Pot created or joined

### 7. Joint Pot Detail (`/joint/[potId]`)
- **Purpose**: Full pot management - contribute, vote on withdrawals, view members
- **Who can see**: Pot members only (privacy enforced)
- **Entry points**: From `/joint` list, deep link
- **Elements**:
  - Shared block tower: each member's blocks in their colour
  - Members + roles display (owner vs member)
  - Itemised contribution feed (who contributed what, when)
  - Contribute sheet: one-off, recurring, Salary Split %, Shop & Save routing
  - Withdrawal request + live voting with countdown
  - Pot terms (approval rule, fees, leave/close rules)
  - Leave flow showing exact refund before confirming
  - Owner-only controls (edit, close pot)
- **Journeys**:
  - Contribute → choose type → explicit opt-in → Koba celebrate
  - Request withdrawal → fill reason → votes needed → countdown
  - Vote on pending withdrawal (approve/decline)
  - Leave pot → show proportional refund amount → confirm
  - Close pot → all members confirm → proportional payout
- **Empty state**: No pots (handled at parent level)
- **Error**: Insufficient balance, not enough votes, member tries access non-pot data
- **Success**: Contribution recorded, withdrawal approved, member leaves, pot closed

### 8. Invites (`/invites`)
- **Purpose**: Manage pending invites for joint pots
- **Who can see**: Authenticated users only
- **Entry points**: From joint pot header, bottom nav sheet
- **Elements**:
  - List of pending invites
  - Each shows: pot name, goal, approval rule, expires in
  - Action: Accept (full terms visible) / Decline
- **Journeys**:
  - Accept invite → see pot terms → join as member
  - Decline invite → removed from list
  - Invite expires after 7 days → greyed out, auto-removed
- **Empty state**: No pending invites
- **Error**: Invite expired, already a member
- **Success**: Invite accepted, user joined pot

### 9. Send Money (`/send`)
- **Purpose**: Person-to-person send (mock)
- **Who can see**: Authenticated users only
- **Entry points**: Dashboard → Send, bottom nav → Send
- **Elements**:
  - Recipient input (username/phone/email)
  - Amount input
  - Note/reason field
  - Confirm step with `aria-live` announcement
- **Journeys**:
  - Input recipient + amount → confirm → send (mock success) → Koba celebrate
  - Error: invalid recipient, insufficient funds
- **Empty state**: No recent contacts
- **Error**: Invalid amount, recipient not found
- **Success**: Send complete, Koba celebrate + aria-live

### 10. Withdraw (`/withdraw`)
- **Purpose**: Pot withdrawal with voting
- **Who can see**: Pot members only
- **Entry points**: From `/joint/[potId]` withdrawal section
- **Elements**:
  - Request amount, reason, destination
  - Live voting display with countdown (72 hours)
  - Vote buttons: Approve / Decline
  - Balance display
- **Journeys**:
  - Owner/ members with appropriate role → request withdrawal → votes counted → payout after 72h
  - Member votes → count updates → payout if threshold met
- **Empty state**: No pending withdrawals
- **Error**: Amount exceeds balance, vote not in time
- **Success**: Withdrawal requested, voting started

### 11. Activity (`/activity`)
- **Purpose**: Transaction feed and notifications
- **Who can see**: Authenticated users only
- **Entry points**: Dashboard → Activity, bottom nav → Activity
- **Elements**:
  - Recent contributions (itemised, attributed)
  - Withdrawal requests and votes
  - Invite notifications
  - Milestone notifications (25/50/75/100% goal progress)
  - Members leaving notifications
- **Journeys**: None (read-only feed)
- **Empty state**: No activity yet
- **Error**: None

### 12. Cards (`/cards`)
- **Purpose**: Card management (mock)
- **Who can see**: Authenticated users only
- **Entry points**: Dashboard → Cards, bottom nav → Cards
- **Elements**: Card list, issue new card, card controls
- **Empty state**: No cards yet
- **Error**: None
- **Success**: Card managed

### 13. AI Coach (`/coach`)
- **Purpose**: Rule-based insight cards explaining "why"
- **Who can see**: Authenticated users only
- **Entry points**: Dashboard → Coach, bottom nav → Coach
- **Elements**:
  - Insight cards: "Your salary split is 5% below recommended..." etc.
  - Each card explains why and suggests action
  - Dismissible
- **Journeys**: None (informational)
- **Empty state**: No insights yet (after initial setup)
- **Error**: None
- **Success**: User gains insight

### 14. Settings & Security (`/settings`)
- **Purpose**: Account settings, security, demo mode toggle
- **Who can see**: Authenticated users only
- **Entry points**: Dashboard → Settings, bottom nav → Settings
- **Elements**:
  - Demo mode on/off toggle
  - "How your money is handled" link
  - Data deletion request
  - Notification preferences
  - Connected providers
- **Journeys**: User updates preferences → saved
- **Empty state**: N/A
- **Error**: None
- **Success**: Preferences saved

### 15. Profile (`/profile`)
- **Purpose**: User profile management
- **Who can see**: Authenticated users only
- **Entry points**: Dashboard → Profile, bottom nav → Profile
- **Elements**: Username, display name, phone, email, profile picture
- **Journeys**: User updates profile → saved
- **Empty state**: Default values
- **Error**: Invalid email format
- **Success**: Profile updated

## Auth Redirects & Permission Behaviour

- **Unauthenticated access** to `(app)/*` → redirect to `/login` (or demo login)
- **Demo session**: cookie-based, works like real auth for all `(app)/*` routes
- **404/permission-denied**: if user tries to access pot they're not a member of → redirect to `/dashboard` with toast "Access denied"
- **Session expiry**: demo cookie persists until cleared; real Clerk session uses auth provider
- **Route protection**: `middleware.ts` checks `auth()` or demo cookie; if neither → login

## Journeys as Diagrams

### Sign-Up → Onboarding → First Salary Split
```
[/login] → [enter email/phone] → [set salary] → [allocate % → total=100%] → [save] → [/dashboard]
```

### Enabling Shop & Save (with consent)
```
[/save] → [toggle Shop & Save] → [configure rule: fixed/percentage/round-up] → [explicit opt-in modal] → [save] → [Koba celebrate + aria-live]
```

### Joint Pot: Create → Invite → Accept → Contribute → Withdrawal → Votes → Payout
```
[/joint/new] → [name pot, goal, target, deadline, approval rule] → [invite by username/phone/email] → [invitee accepts] → [members contribute] → [request withdrawal] → [votes count down 72h] → [threshold met → payout proportional]
```

### Joint Pot: Leaving
```
[member clicks "Leave"] → [show proportional refund amount exact] → [confirm] → [refund = net contributions proportional] → [removed from pot]
```

### Joint Pot: Closing
```
[owner clicks "Close"] → [all members confirm] → [balance returned proportional to net contributions] → [rounding remainder deterministic → smallest contributor gets remainder] → [pot closed, activity log entry]
```

### Auth Redirects & 404/Permission-Denied
```
[unauth → (app)/*] → [/login?redirect=/dashboard] → [demo cookie set] → [/dashboard] → [auth toast on protected routes]
[member accesses pot they don't belong to] → [/dashboard] → [toy "Access denied - you are not a member of this pot"]
```