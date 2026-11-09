# 01-PRD.md - Product Requirements Document

## Status: Draft v1
## Last updated: 2026-11-09
## Links: 02-TRD.md, 03-APP-FLOW.md, 04-DESIGN-BRIEF.md, 05-BACKEND-SCHEMA.md, 06-IMPLEMENTATION-PLAN.md

## Vision
Build a lifestyle money-management app for the Nigerian market that helps users **Buy What They Love** (spending, shopping, daily expenses) and **Build Wealth As They Live** (saving, investing, goal-based financial planning). The app sits as a technology and customer-experience layer above regulated financial partners (banks, payment providers, licensed investment operators).

## Problem Hypothesis
Nigerian professionals lack an integrated, culturally relevant tool for managing split income, saving for multiple lifestyle goals, and participating in joint savings groups (ajo/esusu-style). Existing apps are either generic foreign fintech products or lack the features needed for Nigerian salary structures, market purchases, and communal saving practices.

## Segments & Personas

| Segment | Persona | Goals | Pain Points |
|---------|---------|-------|-------------|
| Salaried professional | **Alex, 28, Lagos** - product manager, regular salary | Save for travel, start a business, rent deposit | No integrated saving tools; salary disappears before month-end |
| Freelancer/irregular income | **Chioma, 24, Port Harcourt** - freelance designer | Flexible salary split; emergency fund | Income varies; fixed budgeting rules don't apply |
| Family contributor | **Tunde, 35, Abuja** - finance analyst | Family rent contribution; joint savings with spouse | No shared pot mechanism; trust in joint saving |

## Goals & Non-Goals

### Goals (P0)
- Salary Split: divide income between Spending, Savings, and named Goals (totals = 100%)
- Shop & Save: purchase-linked contributions (fixed/percentage/round-up) with explicit opt-in
- Lifestyle Goals: rent, car, education, business, holiday with target/progress/deadline
- Wealth Dashboard: visual separation of Savings vs Investments
- Joint Savings: create/pot, invite members, contribute, withdraw/close with approval rules
- Send/Withdraw: person-to-person and pot withdrawals

### Non-Goals (P2 or later)
- Real investment account holding (partner-powered demo only)
- FDIC/NDIC insured products
- Real currency exchange or forex
- Business accounting or invoicing
- Cryptocurrency functionality

## Features & Acceptance Criteria

### Salary Split (P0)
- User creates rules dividing income among Spending, Savings, and named Goal categories
- Total across all categories must equal exactly 100%
- Each rule can be: percentage of net salary, fixed amount per period, or remaining after others
- **Test**: ₦100,000 salary split 50% Spending, 30% Savings, 20% Laptop Goal → ₦50,000, ₦30,000, ₦20,000

### Shop & Save (P0)
- User enables a rule: fixed amount, percentage of purchase, or round-up to nearest ₦100
- Every contribution is itemised and attributed to the user
- **Canonical test**: ₦40,000 purchase with 5% rule → separate ₦2,000 contribution
- Explicit opt-in required before any purchase-linked contribution is enabled
- User can pause, change, or opt out at any time

### Spend & Invest (P1)
- Contributions directed to investment products through licensed partners
- Label "Partner-powered" clearly
- Investment value shown separately from savings balance
- Risk note displayed on investment screens

### Lifestyle Goals (P0)
- Each goal has: target amount, current progress, deadline date
- Progress visualised as percentage of target
- Multiple goals can run concurrently

### Wealth Dashboard (P0)
- Shows Available to Spend vs Available to Save/Invest
- Contributions, balances, progress displayed
- Savings and investments always visually and textually separate
- Demo mode indicator visible

### Joint Savings (P1 - beyond PDF hypothesis)
- **Pots**: name, goal, target ₦, optional deadline. Savings only (no investing). Max 10 members.
- **Invites**: by username, phone, or email to existing users only. Invitee must accept; can decline. Invites expire after 7 days.
- **Roles**: `owner` (creator) and `member`. Owner edits pot details, invites/removes members, starts closure.
- **Contributions**: each member chooses their own (one-off, recurring fixed, % via Salary Split, or Shop & Save round-ups routed to the pot). Always itemised and attributed. Owner-set suggested amounts are reminders only, never automatic debits.
- **Withdrawals** (approval rule chosen at creation): `all members approve`, `majority approve` (default), or `owner approves up to ₦X`. Requests show amount, reason, destination, votes; expire after 72 hours; can never exceed the pot balance.
- **Leaving**: a member can leave; refund = their net contributions, proportional rule, exact amount shown before confirming.
- **Closing**: owner starts it, all members confirm, balance returned in proportion to net contributions. Rounding remainder allocated deterministically so no kobo is lost or created.
- **Privacy**: members see pot activity (who contributed, withdrawals, votes) but never each other's balances, other goals, or non-pot transactions.
- **Notifications**: in-app entries for invites, contributions, withdrawal requests/votes, milestones (25/50/75/100%), members leaving.

### Compliance & Trust (P0)
- Never promise or imply guaranteed returns
- Investment screens show risk note and difference between savings balance and investment value
- Show fees and withdrawal conditions plainly (demo values, labelled demo)
- Visible **"Demo mode — no real money moves"** indicator wherever money actions occur
- Explicit opt-in before any purchase-linked contribution is enabled
- Never use customer funds as working capital in logic or copy
- In-app "How your money is handled" page explaining the partner model
- **Joint Savings**: every member individually accepts the pot's terms (approval rule, leave/close refund rule, fees) in plain language before joining; roles visible at all times; savings only; note that a real launch needs a regulated partner to hold pooled funds and verify every member; never imply insurance or returns; in-app report/dispute form (demo is fine)
- **Data**: do not collect or store real BVN, NIN, card numbers, or passwords. Account numbers use NUBAN format (10 digits) validation only. Phone numbers use Nigerian format (+234). Data-protection note: data minimisation, consent, retention, deletion. Nigerian data-protection and financial regulations need legal review before any real launch.

## Success Metrics (from PDF)
- **Activation rate**: onboarding completion (create first salary split)
- **Repeat use frequency**: weekly/Monthly contribution activity
- **Contribution frequency**: per-user, per-pot
- **Opt-out rate**: salary split, shop & save
- **Trust score**: post-session surveys

## Risks
1. Regulatory compliance with Nigerian financial regulations (CBSEC, data protection)
2. Trust in digital financial services among unbanked/underbanked populations
3. Data minimisation and privacy concerns with joint pot members
4. Rounding errors in proportional payouts
5. Demo-mode auth edge cases

## Open Questions
1. Default approval rule for new joint pots: majority vs owner-up-to-₦X
2. Rounding strategy for proportional payouts (allocate remainders to smallest contributor?)
3. Opt-in flow design for purchase-linked contributions (modal vs toggle?)
4. Frequency of notifications for joint pot activity
5. Currency formatting for kobo vs naira display in different contexts

---
**Open Questions** section maintained throughout development. No unexplained TBDs.