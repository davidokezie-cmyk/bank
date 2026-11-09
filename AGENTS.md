# Buy & Build — Agent Rules

## Role
You are a senior product engineer, technical artist, and designer building **Buy & Build**: a lifestyle money-management app for the Nigerian market. Tagline: **Buy What You Love. Build Wealth As You Live.**
Buy & Build is a **technology and customer-experience layer**. Regulated partners (banks, payment providers, licensed investment operators) provide the real financial services. In this codebase every integration is a **mock behind an interface** so a real provider (Paystack, Mono, etc.) can be swapped in later. This build is a **high-fidelity, demo-mode prototype** meant to be shown to users and partners for validation — not a production banking system.

## Honesty rules (for you, the agent)
- Never claim something is installed, built, rendered, or working unless you ran a command and saw it succeed. No theatrical checklists.
- After every phase run `pnpm check` (typecheck + lint + test + build). Fix every error before moving on. Report real output.
- If an API, package, or CLI flag behaves differently than expected, read the installed package's types/docs or run `--help` instead of guessing. This especially applies to Bforartists/Blender Python (`bpy`) calls and glTF exporter options, which change between versions.
- If something is impossible in this environment, say so and use the defined fallback.
- Work in small, reviewable steps. Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `test:`).
- Record any decision I did not specify in `DECISIONS.md` (date, decision, reason).

## Planning documents are the source of truth
Six documents live in `/docs/planning/` (written in Phase 1, right after dependencies are installed and BEFORE any app code): `01-PRD.md`, `02-TRD.md`, `03-APP-FLOW.md`, `04-DESIGN-BRIEF.md`, `05-BACKEND-SCHEMA.md`, `06-IMPLEMENTATION-PLAN.md`.
- Before each phase, re-read the docs that apply (screens → App Flow + Design Brief + PRD; data/services → Schema + TRD; order of work → Implementation Plan).
- To deviate, update the doc FIRST, log it in `DECISIONS.md`, then change code. Docs and code must never drift.
- Never invent a route, table, token, or feature that is not in the docs without adding it to them.
- Tick off tasks in `06-IMPLEMENTATION-PLAN.md` as milestones complete.

## Product truth (from the market research PDF — do not contradict)
1. **Salary Split** — users create rules dividing income between Spending, Savings, and named Goals. Totals must equal exactly 100%.
2. **Shop & Save** — when an eligible purchase happens, a user-chosen fixed amount, percentage, or round-up is set aside as a **separate** contribution.
   - Canonical example for UI and tests: a ₦40,000 purchase with a 5% rule triggers a separate ₦2,000 contribution.
   - It is **not a discount**. Never taken without explicit opt-in. Users can pause, change, or opt out any time. Every contribution is itemised.
3. **Spend & Invest** — contributions can be directed to investment products **through licensed partners**. Label "Partner-powered" and clearly demo.
4. **Lifestyle Goals** — rent, car, education, business, holiday, etc., each with target, progress, deadline.
5. **Wealth Dashboard** — Available to Spend vs Goals, contributions, balances, progress. **Savings and investments are always visually and textually separate.**
6. **Joint Savings** — two or more users save together toward one shared goal (rent, wedding, trip, family project, business fund, "ajo/esusu"-style pot). This goes beyond the PDF, so treat it as a hypothesis to validate with users.
   - **Pots:** name, goal, target ₦, optional deadline. Savings only (no investing inside a joint pot). Max 10 members in the prototype.
   - **Invites:** by username, phone, or email, to existing users only. Invitee must accept; can decline. Invites expire after 7 days.
   - **Roles:** `owner` (creator) and `member`. Owner edits pot details, invites/removes members, starts closure. Members contribute, view, and propose withdrawals.
   - **Contributions:** each member chooses their own (one-off, recurring fixed, % via Salary Split, or Shop & Save round-ups routed to the pot). Always itemised and attributed. Nobody is forced to contribute; nobody contributes from another member's account. Owner-set suggested amounts are reminders only, never automatic debits without that member's own opt-in.
   - **Withdrawals (approval rule chosen at creation):** `all members approve`, `majority approve` (default), or `owner approves up to ₦X`. Requests show amount, reason, destination, votes; expire after 72 hours; can never exceed the pot balance.
   - **Leaving:** a member can leave; refund = their net contributions, **proportional** rule, exact amount shown before confirming.
   - **Closing:** owner starts it, all members confirm, balance is returned in proportion to net contributions. Rounding remainder is allocated deterministically so no kobo is lost or created.
   - **Privacy:** members see pot activity (who contributed, withdrawals, votes) but **never** each other's balances, other goals, or non-pot transactions.
   - **Notifications:** in-app entries for invites, contributions, withdrawal requests/votes, milestones (25/50/75/100%), members leaving.

### Compliance and trust (required)
- Never promise or imply guaranteed returns. Investment screens show a risk note and the difference between a savings balance and an investment value.
- Show fees and withdrawal conditions plainly (demo values are fine, labelled demo).
- Show a visible **"Demo mode — no real money moves"** indicator wherever money actions occur.
- Explicit opt-in before any purchase-linked contribution is enabled.
- Never use customer funds as working capital in logic or copy.
- In-app "How your money is handled" page explaining the partner model.
- **Joint Savings:** every member individually accepts the pot's terms (approval rule, leave/close refund rule, fees) in plain language before joining; roles visible at all times; savings only; a note that a real launch needs a regulated partner to hold pooled funds and verify every member; never imply insurance or returns; an in-app report/dispute form (demo is fine).
- **Data:** do not collect or store real BVN, NIN, card numbers, or passwords in the prototype. Account numbers use NUBAN format (10 digits) validation only. Phone numbers use Nigerian format (+234). Add a data-protection note (data minimisation, consent, retention, deletion) and state that Nigerian data-protection and financial regulations need legal review before any real launch.

## Tech stack
- Next.js (latest stable) App Router, TypeScript strict, **pnpm**
- Tailwind CSS v4 + `tw-animate-css` (NOT `tailwindcss-animate`, which is a v3 plugin)
- `motion` (import from `motion/react`) for UI motion; `gsap` + ScrollTrigger only for homepage scroll sequences
- `three`, `@react-three/fiber`, `@react-three/drei` for 3D
- `@clerk/nextjs` with a working **demo-mode fallback** when no Clerk keys exist (cookie-based fake session so every protected route works offline)
- `@supabase/supabase-js` only behind a data-layer interface; default to an in-memory/localStorage mock repository
- `zustand`, `@tanstack/react-query`, `zod`, `react-hook-form` + `@hookform/resolvers`
- `recharts`, `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`, `date-fns`
- Dev: `vitest`, `@testing-library/react`, `playwright` (smoke tests), `eslint`, `prettier`, `@gltf-transform/cli`, `gltfjsx`
- Money is stored as **integer kobo**, never floats. Format with `Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' })`.
- Check the installed Next.js docs for the correct route-protection convention (`middleware.ts` vs `proxy.ts`) before writing it.
- Add a single `pnpm check` script = typecheck + lint + test + build. Add `.env.example` (all optional keys, with comments), basic security headers, and no secrets in client code.

## Architecture
```
src/
  app/
    (marketing)/page.tsx            # /
    (auth)/login/ (auth)/sign-up/
    (app)/layout.tsx                # protected shell: sidebar + bottom nav
    (app)/dashboard goals joint activity send withdraw save cards coach settings profile
    (app)/joint/new/ (app)/joint/[potId]/ (app)/invites/
    dev/kobo/                       # mascot preview (all moods, both models)
  components/ui/  components/app/  components/marketing/  components/three/
  lib/ (money.ts, utils.ts, motion.ts, mascot-contract.ts)
  services/   payments.ts banking.ts investments.ts joint.ts coach.ts  # interface + mock each
  store/  types/  tests/
tools/mascot/                       # Bforartists pipeline (scripts only)
assets/mascot/                      # kobo.blend source + renders
public/models/  public/images/
docs/  docs/planning/  docs/reference/
```
- Server Components by default; `"use client"` only where needed (3D, motion, forms).
- Each provider = interface + mock + one place to swap.
- Business logic (split rules, round-ups, contributions, joint pots) lives in pure functions in `lib/` with **unit tests**. Test at least: percentage, fixed, round-up to nearest ₦100, salary split = exactly 100%, no negative balances, ₦40,000 @ 5% = ₦2,000.
- Joint Savings tests: invite accept/decline/expiry; max 10 members; contributions attributed correctly; pot total = sum of net contributions; approval rules (all / majority / owner-up-to-₦X) incl. ties and 72-hour expiry; withdrawal never exceeds balance; leaving returns exact proportional amount; closing distributes the full balance with no kobo lost or created; non-members can never read or act on a pot; members never see each other's non-pot data.
- No dead buttons: every control works in demo mode or is clearly marked "Coming soon".
- Accessibility: semantic HTML, focus rings, labelled inputs, 4.5:1 contrast, keyboard navigable, `prefers-reduced-motion` respected everywhere (3D goes static or poster; page transitions become fades). Money-moment confirmations also announced via `aria-live`.
- Performance: dynamic-import the 3D canvas, cap `dpr` at 2, pause rendering off-screen, poster image while loading, lite model on mobile. Target Lighthouse performance 90+ on the homepage.

## Design direction
**Mood:** premium, warm, confident — a lifestyle brand that happens to do money, not a bank. Dark mode primary; light mode supported.
**Palette (CSS variables / Tailwind tokens):** ink `#0B0A14` → surface `#14122A` → raised `#1C1938`; brand violet→indigo gradient for primary actions and hero glow; gold `#F5B83D` for coins, rewards, "Build" moments; Naira green `#2BD67B` for growth; coral `#FF6B6B` for alerts; text `#F4F3FF`, muted `#A5A3C4`.
**Type:** one distinctive display face (e.g. Sora or Bricolage Grotesque via `next/font`) + Inter/Geist for UI. Tabular numerals for all money.
**Don'ts:** no generic purple-card-grid SaaS look, no emoji as icons, no lorem ipsum, and do NOT copy NovaPay's layout, colours, copy, or character.
**Motion language (defined once in `lib/motion.ts`):** springs (stiffness ~260, damping ~24); 150–250 ms micro-interactions; 400–600 ms page/section moves. Money moments (send, save, allocate, contribute) get a satisfying coin/progress animation plus text confirmation.

## Mascot — "Kobo" (original character, built with Bforartists)
**Reference:** `/docs/reference/novapay.jpg` is a MOOD reference only. Take: the friendly, glossy, slightly chunky 3D-illustration look; floating gold coins and notes; a warm, confident, helpful pose; soft rim light against deep violet. Do NOT copy the NovaPay character, glasses, chain, pose, or layout.
**Concept:** Kobo is a rounded, gold-trimmed coin-bodied character (kobo = Nigeria's currency subunit) wearing a small shopping-bag strap like a backpack and stacking tiny building blocks — literally *Buy* and *Build*. Big expressive eyes, warm smile, stubby arms, a stack of blocks that grows with goal progress.

**Tool: Bforartists** (free, open-source Blender fork; same `bpy` Python API and `.blend` format as Blender; current release 5.2.x). Pipeline is **scripted and headless** so it is reproducible and you can run it yourself — I do not have to click anything.
- **Locate the binary** (try in order): env var `BFORARTISTS_PATH`; `bforartists` / `Bforartists` on PATH; Windows `C:\Program Files\Bforartists*\bforartists.exe`; macOS `/Applications/Bforartists.app/Contents/MacOS/Bforartists`; Linux common install dirs / Flatpak. Verify with `<binary> --version` and print the real output. Save the resolved path in `.env.local` as `BFORARTISTS_PATH` (git-ignored).
- **If not found:** do not block the project. Tell me to install it from https://www.bforartists.de/download (and set `BFORARTISTS_PATH`), continue with all other phases using the procedural fallback below, and mark the mascot pipeline "pending" in the Implementation Plan. Re-check at the start of Phase 4.
- **Run headless:** `<binary> --background --factory-startup --python-exit-code 1 --python tools/mascot/<script>.py -- <args>`. Use `--factory-startup` so my personal preferences never affect output. Read `bpy.app.version_string` at runtime and log it.
- **Scripts to write in `tools/mascot/`** (pure Python, deterministic, re-runnable, commented):
  1. `build_kobo.py` — clears the scene and builds Kobo from primitives with Bevel/Subdivision/Mirror modifiers; Principled BSDF materials (gold metallic body with clearcoat, violet strap, cream eyes, soft emissive highlights); **no image textures** (flat colours/procedural only) to keep files tiny; origin at the feet; faces +Z in glTF space (Y-up); 1 unit ≈ 1 metre-ish, Kobo ~1.0 tall. Includes a rig (armature: `Root`, `Body`, `Head`, `Arm_L`, `Arm_R`, optional `Brow`/`Bag`), a `BlockStack` empty with `Block_01`…`Block_12` mesh children (in kobo's colour set), and **shape keys**: `blink`, `smile`, `surprised`, `think`.
  2. `animate_kobo.py` (or inside the build script) — creates looping 24 fps actions: `Idle` (breathing + subtle sway), `Wave`, `Celebrate` (hop + arms up), `Think`, `HopIn` (entrance). Push each to the NLA (or otherwise ensure all export). Use squash-and-stretch and ease curves for a premium feel. Idle must loop seamlessly.
  3. `export_kobo.py` — saves `assets/mascot/kobo.blend` and exports `.glb` via `bpy.ops.export_scene.gltf` for: **full** (`public/models/kobo.glb`, ≤ 25k tris) and **lite** (`public/models/kobo-lite.glb`, ≤ 8k tris via Decimate, for mobile). Before hard-coding exporter arguments, list the installed exporter's real options with `bpy.ops.export_scene.gltf.get_rna_type().properties.keys()` and use what exists (GLB format, apply modifiers, skins, morph targets, all animations, +Y up, no cameras/lights). Make sure the glTF exporter add-on is available/enabled.
  4. `render_posters.py` — headless Eevee renders (transparent background, soft violet rim light) to `public/images/kobo-{idle,wave,celebrate,think}.webp` and a 1200×630 `public/images/kobo-og.png` for social sharing. These double as `<KoboFallback />` images.
- **Optimise:** after export run `gltf-transform optimize` (meshopt compression, prune, dedup) via `pnpm mascot:optimize`. Budgets: full ≤ 1.2 MB, lite ≤ 500 KB after compression, ≤ 8 materials, 24 fps clips each under 4 s.
- **Scripts in package.json:** `mascot:build` (run Bforartists headless: build + animate + export), `mascot:posters`, `mascot:optimize`, `mascot:verify`, and `mascot` (all four in order). `mascot:verify` validates the GLB with `gltf-transform validate` and asserts the asset contract below.

**Mascot asset contract** (document it in `04-DESIGN-BRIEF.md` and encode it in `src/lib/mascot-contract.ts`; add a Vitest test `tests/mascot-contract.test.ts` that parses the GLB's JSON chunk — no WebGL needed — and fails if anything is missing):
- Animations: `Idle`, `Wave`, `Celebrate`, `Think`, `HopIn`
- Morph targets: `blink`, `smile`, `surprised`, `think`
- Nodes: `Kobo_Root`, `Head`, `BlockStack`, `Block_01`…`Block_12`
- Both `kobo.glb` and `kobo-lite.glb` satisfy the same contract.

**Runtime (`components/three/Kobo.tsx`):** loads the GLB with drei `useGLTF` + `useAnimations`; props `mood: 'idle' | 'wave' | 'celebrate' | 'thinking`, `progress: 0–1` (shows `Block_01…n` accordingly), `memberColors?: string[]` (joint pots: recolour blocks per member), `reducedMotion`. Crossfade clips by mood; auto-blink and drive expression morph targets; gentle head-follow of cursor/touch; preload; Suspense → `<KoboFallback />` (the rendered poster WebP). Mobile uses `kobo-lite.glb`. No WebGL or reduced motion → static poster or frozen first frame.
**Procedural fallback:** `KoboProcedural.tsx` builds a simplified Kobo from R3F primitives and is used automatically if the GLB is missing/failed, so the app never breaks and the project is unblocked even without Bforartists.
**Placement:** homepage hero, login/sign-up (calm cinematic: slow camera dolly + soft light sweep), empty states, success states, Goals progress, and Joint Pot screens (shared block tower where each member's blocks are a different colour; Kobo celebrates milestones and teammate contributions).
**Preview page:** `/dev/kobo` shows every mood, both models, the poster fallback, FPS and file sizes.

## Navigation
- Desktop: persistent left sidebar (icons + labels, animated active indicator via shared `layoutId`, profile + logout pinned at bottom). **Joint Savings** has its own item with a badge for pending invites/votes.
- Mobile: bottom tab bar (Dashboard, Goals, Save, Activity, More) + a sheet for Joint Savings, Send, Withdraw, Cards, Coach, Settings, Profile. Pending invites/votes also show as a Dashboard card.
- Smooth route transitions (shared layout, fade/slide; fade-only under reduced motion).

## Definition of done
- All routes exist and are navigable; demo mode works with **zero** environment variables (and without Bforartists installed, via the procedural fallback).
- `pnpm check` passes; `pnpm mascot` passes when Bforartists is available.
- All six planning documents exist, are consistent, and match the shipped code.
- README covers: concept, demo mode, env vars (Clerk, Supabase, Paystack/Mono placeholders, `BFORARTISTS_PATH`), how to swap a provider, **how to install Bforartists, regenerate the mascot, and replace it with a hand-made model**, scripts, architecture, and the compliance stance.
- Clean git history with conventional commits.