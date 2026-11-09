# Planning Documents Index

## 01-PRD.md - Product Requirements Document
Vision; problem hypothesis; segments & 3 personas; goals and non-goals; every feature with P0/P1/P2 priority, user stories, and testable acceptance criteria; compliance and trust as product requirements; success metrics; risks; Open Questions.

## 02-TRD.md - Technical Requirements Document
Stack table with exact installed versions; architecture diagram; folder structure; provider-interface pattern; auth and demo-mode design; route-protection approach; state/data conventions; money-as-kobo rules; testing strategy; performance budgets; accessibility and reduced-motion rules; env vars; security basics; Bforartists mascot pipeline; deployment target; coding standards; Open Questions.

## 03-APP-FLOW.md - Application Flow Document
Route-map diagram; for every page: purpose, who can see it, entry points, elements, each action → destination/state, and loading/empty/error/success states; journeys as diagrams: sign-up → onboarding → first Salary Split; enabling Shop & Save (with consent); send and withdraw; create a goal; joint pot: create → invite → accept → contribute → withdrawal request → votes → payout; leaving; closing; auth redirects and 404/permission-denied behaviour.

## 04-DESIGN-BRIEF.md - Design Brief
Brand personality; colour tokens (dark + light, hex, usage, contrast ratios); type families/scale/numerals; spacing, radius, elevation, grid; iconography; motion language incl. reduced-motion; component inventory with states; full Kobo spec; copy tone of voice with example microcopy; do's and don'ts; breakpoints; accessibility standards.

## 05-BACKEND-SCHEMA.md - Backend Schema
Every table with fields, types (money = integer kobo), constraints, relationships, indexes: users/profiles, wallets, goals, salary_split_rules, shop_save_rules, contributions, transactions, cards, notifications, consent_records, audit_log, joint_pots, joint_members, joint_invites, withdrawal_requests, withdrawal_votes; ER diagram; access matrix; ready-to-use Postgres/Supabase SQL with Row Level Security matching the matrix; mapping to mock repository and zod schemas; data-protection notes with legal-review caveat; Open Questions.

## 06-IMPLEMENTATION-PLAN.md - Implementation Plan
Ordered milestones matching Phases 2-8, each with goal, task checklist, dependencies, size (S/M/L), areas touched, tests required, acceptance checks, definition of done; risk register with mitigations; prototype launch-readiness checklist; separate list of what a real launch would additionally need (licensed partners, KYC, legal review).