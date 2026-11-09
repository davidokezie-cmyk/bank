# 02-TRD.md - Technical Requirements Document

## Status: Draft v1
## Last updated: 2026-11-09
## Links: 01-PRD.md, 03-APP-FLOW.md, 04-DESIGN-BRIEF.md, 05-BACKEND-SCHEMA.md, 06-IMPLEMENTATION-PLAN.md

## Stack Table (Exact Installed Versions)

| Package | Version | Reason |
|---------|---------|--------|
| next | 16.4.5 | Latest stable App Router, Server Components |
| react | 19.3.0 | Latest React with Server Components support |
| react-dom | 19.3.0 | DOM rendering for React 19 |
| tailwindcss | ^4 | CSS v4 with JIT; `tw-animate-css` for motion |
| typescript | ^5 | Strict type checking |
| vitest | ^5.1.0 | Unit test runner, Node-native |
| @testing-library/react | ^16.3.3 | DOM testing utilities |
| eslint | ^9 | Flat config ESLint |
| eslint-config-next | 16.4.5 | Next.js ESLint config |
| prettier | ^3.3.2 | Code formatting |
| playwright | ^1.65.0 | End-to-end smoke tests |
| class-variance-authority | ^0.7.0 | CVA for component variants |
| date-fns | ^3.6.0 | Date formatting, formatting |
| lucide-react | ^0.433.0 | Accessible icon set |
| motion | ^11.0.0 | UI animation library (framer-motion) |
| recharts | ^2.12.3 | Charting for dashboards |
| tailwind-merge | ^0.3.0 | Tailwind class merging |
| zod | ^3.23.8 | Schema validation |
| react-hook-form | ^7.45.0 | Form management |
| @hookform/resolvers | ^3.0.0 | Zod integration for react-hook-form |
| @tanstack/react-query | ^5.51.0 | Data fetching & caching |
| gsap | ^3.12.2 | Homepage scroll sequences |
| @clerk/nextjs | Latest | Auth with demo-mode fallback |
| @supabase/supabase-js | Latest | Behind data-layer interface |

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXT.JS APP ROUTER                       │
│  (App Router) ← Server Components by default                     │
│  "use client" only where needed (3D, forms, motion)              │
└───────────────────────┬───────────────────────────────────────┘
                        │
            ┌───────────────▼───────────────┐
            │        LAYER: PRESENTATION     │
            │  - UI primitives (Button, Card) │
            │  - Forms (react-hook-form)      │
            │  - 3D/Kobo component            │
            │  - Sheets, Toasts, Progress     │
            └───────────────▼───────────────┘
                        │
            ┌───────────────▼───────────────┐
            │        LAYER: DOMAIN           │
            │  - lib/money.ts (kobo ↔ ₦)     │
            │  - lib/motion.ts (springs)     │
            │  - Pure function split rules    │
            │  - Joint pot logic              │
            └───────────────▼───────────────┘
                        │
            ┌───────────────▼───────────────┐
            │        LAYER: DATA             │
            │  - Mock repository (in-memory)  │
            │  - Supabase interface           │
            │  - LocalStorage fallback         │
            │  - zod schemas for all forms    │
            └───────────────▼───────────────┘
                        │
            ┌───────────────▼───────────────┐
            │        LAYER: PROVIDERS        │
            │  - payments.ts (interface + mock)│
            │  - banking.ts (interface + mock)│
            │  - investments.ts (interface + mock)│
            │  - joint.ts (interface + mock)   │
            │  - coach.ts (rule-based insights)│
            └─────────────────────────────────┘
```

## Folder Structure (Agreed)

```
src/
  app/                    # Next.js App Router
    (marketing)/          # Public pages
    (auth)/               # Auth routes
    (app)/layout.tsx      # Protected shell
    (app)/dashboard/      # Dashboard page
    (app)/goals/          # Goals page
    (app)/save/           # Save & Allocate
    (app)/joint/          # Joint Savings
    (app)/joint/[potId]/  # Individual pot
    (app)/invites/        # Invite management
    dev/kobo/             # Mascot preview
  components/ui/          # UI primitives
  components/app/         # App-level components
  components/marketing/   # Marketing hero, etc.
  components/three/       # 3D/Kobo
  lib/                    # Pure business logic
    money.ts              # kobo ↔ ₦ conversion
    utils.ts              # NUBAN + +234 validation
    motion.ts             # Spring constants, reduced-motion
    mascot-contract.ts    # Kobo GLB contract
  services/               # Provider interfaces + mocks
    payments.ts
    banking.ts
    investments.ts
    joint.ts
    coach.ts
  store/                  # Zustand (if needed)
  types/                  # TypeScript types
  tests/                  # Vitest + Playwright tests
tools/mascot/             # Bforartists scripts
assets/mascot/            # kobo.blend + renders
public/models/            # kobo.glb, kobo-lite.glb
public/images/            # kobo poster WebPs
docs/                     # Planning documents
docs/planning/            # 01-PRD through 06-IMPLEMENTATION-PLAN
docs/reference/           # novapay.jpg, etc.
```

## Provider-Interface Pattern & Mock Swapping

Each financial provider follows the same pattern:

```typescript
// services/payments.ts
export interface PaymentProvider {
  initiateTransfer(amount: number, recipient: string): Promise<TransferResult>
  linkBankAccount(accountNumber: string): Promise<LinkResult>
  getBalance(): Promise<BalanceResult>
}

// Mock implementation (default)
export class StripeMock implements PaymentProvider {
  async initiateTransfer(...) { /* demo logic */ }
  async linkBankAccount(...) { /* demo logic */ }
  async getBalance(...) { /* demo logic */ }
}

// Swap for real: import { PaystackProvider } from './payments'
// Real provider instantiated based on env var: NEXT_PAYMENT_PROVIDER=paystack
```

**Default**: in-memory/localStorage mock repository (no external APIs called).
**Swap**: one place (`src/services/index.ts`) changes which provider class is instantiated.

## Auth & Demo-Mode Design

- **Clerk keys optional**: if `NEXT_PUBLIC_CLERK_KEY_EXISTS=false`, demo mode activates
- **Cookie-based fake session**: sets `clerk-session-id` cookie on login
- **Every protected route works offline**: middleware checks for valid demo cookie
- **Logout**: clears cookie, shows "You've been logged out" in demo mode
- **Demo indicator**: "Demo mode — no real money moves" banner on all money screens

## Route-Protection Approach (Next.js 16.4.5)

Check installed Next.js docs for correct convention. For Next.js 16.x with App Router:
- Use `middleware.ts` at root for route protection
- Protect `(app)/*` routes
- Fallback to cookie-based demo session when no Clerk keys exist
- Public routes: `(marketing)/*`, `(auth)/*`, `/`

**Implementation**: `src/middleware.ts` checks for authenticated session (real Clerk or demo cookie). Unauthenticated access to `(app)/*` redirects to `/login`.

## State/Data Conventions

- **Money**: always stored as integer kobo, never floats
- **Format**: `Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })`
- **Tabular numerals** for all money display
- **Percentage**: 0–100 with 2 decimal places where relevant
- **Dates**: `date-fns` format, consistent timezone handling
- **Joint pot IDs**: `pot_${potId}` format, unique per creator+goal

## Testing Strategy

- **Unit tests** (Vitest): pure functions in `lib/` - percentage splits, round-ups, salary split = 100%, no negative balances, ₦40,000 @ 5% = ₦2,000
- **Joint Savings tests**: invite accept/decline/expiry; max 10 members; contributions attributed; approval rules; withdrawal never exceeds balance; leaving proportional payout; closing with no kobo lost; privacy checks
- **Integration tests** (Playwright): core journeys - sign-up/demo login, create Salary Split, enable Shop & Save, create + vote in joint pot, send money
- **Test coverage**: ≥ 80% for pure functions in `lib/`

## Performance Budgets

- **Lighthouse performance**: 90+ on homepage
- **3D canvas**: dynamic-import, cap `dpr` at 2, poster image while loading
- **Lite model** on mobile: `kobo-lite.glb` ≤ 8k tris
- **Mascot GLB budgets**: full ≤ 1.2 MB, lite ≤ 500 KB after compression
- **24 fps clips**: each under 4 s
- **Dynamic import**: 3D canvas only loads when component mounts

## Accessibility & Reduced-Motion Rules

- **Semantic HTML**, focus rings, labelled inputs, 4.5:1 contrast minimum
- **Keyboard navigable** every control
- **`prefers-reduced-motion`** respected everywhere:
  - 3D goes static or poster
  - Page transitions become fades only
  - No auto-animating carousels without user gesture
- **Money-moment confirmations** announced via `aria-live` region

## Env Vars (Optional, with Comments)

| Var | Default | Description |
|-----|---------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | - | Clerk keys; empty = demo mode |
| `NEXT_PRIVATE_CLERK_SECRET_KEY` | - | Clerk secret key |
| `NEXT_PAYMENT_PROVIDER` | `stripe_mock` | Which provider to instantiate |
| `NEXT_PAYSTACK_PUBLIC_KEY` | - | Paystack public key |
| `NEXT_SUPABASE_URL` | - | Supabase project URL |
| `NEXT_SUPABASE_ANON_KEY` | - | Supabase anon key |
| `BFORARTISTS_PATH` | - | Path to Bforartists binary; empty = procedural fallback |
| `NEXT_PUBLIC_DEMO_MODE` | `true` | Force demo mode on |

## Security Basics

- No secrets in client code (all env vars accessed server-side or via Next.js `dotenv` safely)
- `allow-scripts: true` in package.json only for build steps
- CSP headers: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self'; connect-self`
- No real BVN, NIN, card numbers, or passwords stored in prototype
- NUBAN format validation: 10 digits only
- Phone format validation: `+234` prefix required

## Bforartists Mascot Pipeline (Binary Discovery, Headless Commands, Scripts, Optimisation, Verification, Fallback)

- **Binary location**: env var `BFORARTISTS_PATH`; try `bforartists` on PATH; Windows `C:\Program Files\Bforartists*\bforartists.exe`; macOS `/Applications/Bforartists.app/Contents/MacOS/Bforartists`; Linux common dirs/Flatpak
- **Verify**: `<binary> --version` → output logged, path saved in `.env.local` (git-ignored)
- **If not found**: instruct to install from https://www.bforartists.de/download; continue with procedural fallback; mark pipeline "pending"
- **Headless commands**: `<binary> --background --factory-startup --python-exit-code 1 --python tools/mascot/<script>.py -- <args>`
- **Scripts** (in `tools/mascot/`):
  1. `build_kobo.py` → build Kobo from primitives, modifiers, materials, rig, shape keys, BlockStack
  2. `animate_kobo.py` → 24 fps actions: Idle, Wave, Celebrate, Think, HopIn
  3. `export_kobo.py` → full GLB (≤ 25k tris) + lite GLB (≤ 8k tris via Decimate)
  4. `render_posters.py` → Eevee renders to WebP + Og image
- **Optimisation**: `gltf-transform optimize` (meshopt compression, prune, dedup) via `pnpm mascot:optimize`
- **Budgets**: full ≤ 1.2 MB, lite ≤ 500 KB after compression, ≤ 8 materials, 24 fps clips < 4 s
- **Scripts in package.json**: `mascot:build`, `mascot:posters`, `mascot:optimize`, `mascot:verify`, `mascot`
- **Verification**: `gltf-transform validate` + asset contract check (animations, morph targets, nodes)
- **Fallback**: `KoboProcedural.tsx` builds simplified Kobo from R3F primitives; app never breaks without Bforartists

## Deployment Target

- **Platform**: Vercel (recommended) or any Node.js host
- **Build**: `next build` → serverless functions + static assets
- **Environment**: `.env.example` included; all keys optional
- **Domain**: `bank.buybuild.ng` or custom domain

## Coding Standards

- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `chore:`, `test:`
- **TypeScript strict**: no `any`, proper types everywhere
- **Component structure**: `src/components/ui/` primitives, `src/components/app/` composites
- **Naming**: camelCase for functions/variables, PascalCase for components, UPPER_SNAKE_CASE for constants
- **File ordering**: imports sorted, `zod` schemas before component usage
- **No dead buttons**: every control works in demo mode or marked "Coming soon"

## Open Questions
1. Exact middleware location: `src/middleware.ts` vs `src/app/middleware.ts`
2. Demo cookie name: `clerk-session-id` vs custom name
3. Joint pot rounding: floor vs truncate vs nearest kobo for remainders
4. Whether `@tanstack/react-query` stale-time should be per-resource or global

---
**Open Questions** section maintained. No unexplained TBDs.