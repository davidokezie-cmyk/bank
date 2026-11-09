# 06-IMPLEMENTATION-PLAN.md - Implementation Plan

## Status: Draft v1
## Last updated: 2026-11-09
## Links: 01-PRD.md, 02-TRD.md, 03-APP-FLOW.md, 04-DESIGN-BRIEF.md, 05-BACKEND-SCHEMA.md

## Milestones (Phases 2-8)

### Phase 2 — Foundation (Current)
**Goal**: Design tokens, fonts, global motion helpers, UI primitives, dark/light theme, demo-mode auth layer.

- [ ] Create `src/lib/money.ts` (kobo ↔ ₦ conversion)
- [ ] Create `src/lib/motion.ts` (spring constants, reduced-motion flag)
- [ ] Create UI primitives: Button, Card, Input, Sheet, Tabs, Toast, Progress, Skeleton, EmptyState
- [ ] Implement dark/light theme using Tailwind v4 `dark:` variant
- [ ] Add `next/font` Sora + Inter
- [ ] Set up Tailwind v4 config with custom tokens (ink, surface, raised, gold, green-growth, alert-coral)
- [ ] Demo-mode auth layer: cookie-based fallback when no Clerk keys
- [ ] Commit: `foundation: add tokens, primitives, auth`

### Phase 3 — Core Logic First (with tests)
**Goal**: Implement and unit-test salary split, Shop & Save, goal allocation, available-to-spend, savings-vs-investments separation, and ALL Joint Savings logic. Then mock services and seeded demo data.

- [ ] Implement `lib/salary-split.ts` — percentage, fixed, remaining rules
- [ ] Implement `lib/shop-save.ts` — fixed/percentage/round-up rules
- [ ] Implement `lib/goals.ts` — add progress, deadline check
- [ ] Implement `lib/joint-pot.ts` — ALL logic:
  - [ ] Create pot with approval rule
  - [ ] Invite members (username/phone/email)
  - [ ] Accept/decline invite, expiry after 7 days
  - [ ] Member contributes (one-off, recurring, Salary Split %, Shop & Save routing)
  - [ ] Attributions: each contribution attributed to member
  - [ ] Approval rules: all / majority / owner-up-to-₦X
  - [ ] Ties in majority vote resolved by earliest vote
  - [ ] 72-hour expiry on withdrawal requests
  - [ ] Withdrawal never exceeds pot balance
  - [ ] Member leaves → proportional refund, exact amount shown before confirming
  - [ ] Owner closes pot → balance returned proportional to net contributions
  - [ ] Rounding remainder allocated deterministically (smallest contributor gets remainder, or last contributor if tie)
  - [ ] Privacy: members never see each other's non-pot data
- [ ] Unit tests (Vitest) for all pure functions:
  - [ ] Percentage split rules
  - [ ] Fixed amount rules
  - [ ] Round-up to nearest ₦100
  - [ ] Salary split = exactly 100%
  - [ ] No negative balances
  - [ ] ₦40,000 @ 5% = ₦2,000
  - [ ] Invite accept/decline/expiry
  - [ ] Max 10 members
  - [ ] Contributions attributed correctly
  - [ ] Pot total = sum of net contributions
  - [ ] Approval rules (all / majority / owner-up-to-₦X) incl. ties and 72-hour expiry
  - [ ] Withdrawal never exceeds balance
  - [ ] Leaving returns exact proportional amount
  - [ ] Closing distributes full balance with no kobo lost or created
  - [ ] Non-members can never read or act on a pot
  - [ ] Members never see each other's non-pot data
- [ ] Mock services: payments.mock, banking.mock, investments.mock, joint.mock, coach.mock
- [ ] Seeded demo data:
  - [ ] 1 main Nigerian user (salary ₦200,000, rent goal, laptop/car/holiday goals)
  - [ ] 2 demo users
  - [ ] 2 joint pots:
    - [ ] 3-person "Lagos Rent Fund" (majority approval)
    - [ ] 2-person "Zanzibar Trip" (owner-up-to-₦50,000)
  - [ ] Pending invite on one pot
  - [ ] Pending withdrawal vote on another pot
- [ ] NUBAN and +234 validation helpers with tests
- [ ] Commit: `core-logic: implement + test all rules + demo data`

### Phase 4 — Kobo the Mascot (Bforartists pipeline)
**Goal**: Bforartists pipeline or procedural fallback; Kobo runtime components; `/dev/kobo` page.

- [ ] Re-check Bforartists binary availability
- [ ] If found: write scripts in `tools/mascot/`, run `pnpm mascot`, verify output
- [ ] If not found: build `KoboProcedural.tsx`, mark pipeline pending
- [ ] Write `src/lib/mascot-contract.ts` + Vitest test `tests/mascot-contract.test.ts`
- [ ] Implement `components/three/Kobo.tsx` (useGLTF + useAnimations)
- [ ] Implement `components/three/KoboFallback.tsx` (poster WebP)
- [ ] Implement `components/three/KoboProcedural.tsx` (R3F primitives fallback)
- [ ] Implement `/dev/kobo` page (all moods, both models, poster fallback, FPS, file sizes)
- [ ] Playwright: `/dev/kobo` loads, all moods switch, reduced-motion shows static frame, lite model on mobile viewport
- [ ] Visual review: render posters, judge against Design Brief (silhouette, friendliness, originality vs reference)
- [ ] Iterate up to 3 times if needed
- [ ] Commit: `mascot: Kobo built + runtime + contract + /dev/kobo page`

### Phase 5 — Public Pages
**Goal**: Marketing homepage, /login, /sign-up with Kobo cinematic.

- [ ] Marketing homepage (hero with Kobo; how it works section; ₦40,000 @ 5% example; trust/partner model; FAQ; CTAs; GSAP scroll sequences)
- [ ] /login with calm cinematic Kobo sequence (slow dolly + soft light sweep)
- [ ] /sign-up with validation and demo-mode option
- [ ] Commit: `public-pages: marketing + auth`

### Phase 6 — Authenticated Shell
**Goal**: Protected layout, sidebar, bottom nav, route transitions, profile menu, logout.

- [ ] Protected layout `app/layout.tsx` with sidebar + bottom nav
- [ ] Shared `layoutId` for animated active indicator
- [ ] Profile menu + logout
- [ ] Clerk when keys exist; demo session otherwise
- [ ] Route transitions (shared layout, fade/slide; fade-only under reduced motion)
- [ ] Commit: `auth-shell: protected layout + nav + transitions`

### Phase 7 — Product Screens
**Goal**: Dashboard, Goals, Save & Allocate, Joint Savings, Send, Withdraw, Activity, Cards, AI Coach, Settings & Security, Profile, "How your money is handled".

- [ ] Dashboard → Koba block-stack progress, quick actions
- [ ] Goals → Koba block-stack progress, add/edit goals
- [ ] Save & Allocate → Salary Split builder + Shop & Save rules with explicit opt-in, pause, itemised contribution log
- [ ] Joint Savings → all screens: /joint, /joint/new, /joint/[potId], /invites
- [ ] Send → person-to-person mock send
- [ ] Withdraw → pot withdrawal + live voting
- [ ] Activity → transaction feed + notifications
- [ ] Cards → mock card management
- [ ] AI Coach → rule-based insight cards
- [ ] Settings & Security → demo mode toggle, data deletion, notification prefs
- [ ] Profile → user profile management
- [ ] "How your money is handled" page
- [ ] Every money flow: validation, confirm step, loading, success (Koba celebrate + aria-live), error, empty states, "Demo mode" indicator
- [ ] Commit: `product-screens: all pages built + flows + demo-mode`

### Phase 8 — Polish and Hardening
**Goal**: Accessibility audit, reduced-motion pass, responsive pass, Playwright smoke tests, Lighthouse, bundle check, remove dead code, finish README, planning docs match code, final commit.

- [ ] Accessibility audit (a11y react, axe-core or manual 4.5:1 checks)
- [ ] Reduced-motion pass: verify all motion respects `prefers-reduced-motion`
- [ ] Responsive at 360 / 768 / 1280 px
- [ ] Playwright smoke tests: sign-up/demo login, create Salary Split, enable Shop & Save, create + vote in joint pot, send money
- [ ] Lighthouse run: target performance 90+ on homepage
- [ ] Bundle size check: mascot GLB sizes, code splitting
- [ ] Remove dead code, commented-out sections
- [ ] Finish README (concept, demo mode, env vars, how to swap provider, how to install Bforartists, regenerate mascot, replace with hand-made model, scripts, architecture, compliance)
- [ ] Verify planning docs match shipped code (consistency check)
- [ ] Final commit: `polish: all checks passed + docs aligned + final commit`

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| 3D performance on low-end phones | Medium | High | Cap dpr at 2, lite model, dynamic import, poster while loading |
| Bforartists/`bpy` version drift | Low | Medium | Procedural fallback `KoboProcedural.tsx`; scripted pipeline |
| Demo-mode auth edge cases | Medium | Medium | Cookie-based session; thorough test coverage |
| Joint-pot rounding and approval logic | High | High | Deterministic remainder algorithm; unit tests for all edge cases |
| Scope creep (features beyond P0) | Medium | Medium | Strict P0/P1/P2 classification in PRD; tick-off in implementation plan |
| Nigerian regulatory compliance | Low | High | Legal review caveat in docs; demo-mode only; no real money movement |
| Tailwind CSS v4 breaking changes | Medium | Medium | Pin exact version in package.json; test lint after each change |
| TypeScript strict migration | Medium | Medium | Run `pnpm typecheck` after each phase; fix before moving on |

## Prototype Launch-Readiness Checklist

- [ ] All routes exist and are navigable
- [ ] Demo mode works with zero environment variables
- [ ] `pnpm check` passes (typecheck + lint + test + build)
- [ ] Mascot GLB files exist and pass `gltf-transform validate`
- [ ] Unit tests cover all pure functions (≥80%)
- [ ] Joint pot logic tested for all approval rules and edge cases
- [ ] Accessibility: 4.5:1 contrast, keyboard nav, reduced-motion
- [ ] Lighthouse performance 90+ on homepage
- [ ] "Demo mode — no real money moves" indicator visible on all money screens
- [ ] "How your money is handled" page present
- [ ] NUBAN + +234 validation helpers working
- [ ] No real BVN, NIN, card numbers, or passwords stored

## Real Launch Additional Needs

- [ ] Licensed partners (Paystack/Mono for payments, investment platform for Spend & Invest)
- [ ] KYC/AML verification (BVN, NIN collection with consent)
- [ ] Full legal review of Nigerian data-protection and financial regulations
- [ ] Regulated partner contracts (terms, fee structures, revenue share)
- [ ] Insurance/returns disclosure framework
- [ ] Real database with encryption at rest
- [ ] Audit logging for regulatory compliance
- [ ] Customer support infrastructure
- [ ] SLA for transaction processing
- [ ] KYC compliance documentation
- [ ] Insurance partnerships for savings products
- [ ] Real-time notification service (Twilio/FCM)
- [ ] Multi-currency support (future phase after NGN)
- [ ] Internationalization (beyond en-NG locale)