# 04-DESIGN-BRIEF.md - Design Brief

## Brand Personality
**Mood:** premium, warm, confident — a lifestyle brand that happens to do money, not a bank.
- Target audience: Nigerian professionals, tech-savvy users who value style and functionality
- Positioning: between a fintech tool and a lifestyle brand; not a corporate bank, not a generic SaaS
- Tone: helpful, confident, inclusive, never intimidating or condescending
- Tagline: **Buy What You Love. Build Wealth As You Live.**

## Colour Tokens (CSS Variables / Tailwind)

### Dark Mode (Primary)
- `ink`: `#0B0A14` — background, deepest tone
- `surface`: `#14122A` — cards, panels, surfaces
- `raised`: `#1C1938` — elevated surfaces, modals
- `border`: `#2A2740` — form borders, dividers
- `text`: `#F4F3FF` — primary text
- `muted`: `#A5A3C4` — secondary text, captions
- `accent-violet`: `#8B5CF6` — primary actions, hero glow
- `accent-indigo`: `#6366F1` — secondary actions, depth
- `gold`: `#F5B83D` — coins, rewards, "Build" moments
- `green-growth`: `#2BD67B` — growth, positive amounts, progress
- `alert-coral`: `#FF6B6B` — alerts, errors, warnings

### Light Mode
- `ink-light`: `#F8F5F1` — background
- `surface-light`: `#FFFFFF` — cards, panels
- `raised-light`: `#F0EFF5` — elevated surfaces
- `border-light`: `#D1D5DB` — form borders
- `text-light`: `#111827` — primary text
- `muted-light`: `#6B7280` — secondary text
- `accent-violet-light`: `#A78bfa` — primary actions
- `gold-light`: `#FBBF24` — coins, rewards
- `green-growth-light`: `#14b8a6` — growth
- `alert-coral-light`: `#F87171` — alerts

**Contrast ratios** (AA for normal text, AAA for large text):
- `ink` / `text`: 8.5:1 ✓
- `surface` / `text`: 13:1 ✓
- `alert-coral` / `surface`: 3:1 → use white text on coral for alerts
- `gold` / `surface`: 3:1 → use dark text or icon-only

## Type Families / Scale / Numerals

- **Display face**: `Sora` via `next/font` (weight 400, 600, 700)
- **UI face**: `Inter` as fallback, or `Geist` if preferred
- **Tabular numerals** for ALL money amounts (proportional spacing disabled for currency fields)
- **Font sizes**:
  - `text-[0.875rem]` → 12px (caption, muted)
  - `text-[1rem]` → 16px (body, input labels)
  - `text-[1.125rem]` → 18px (headings)
  - `text-[1.5rem]` → 24px (section headers)
  - `text-[2.25rem]` → 36px (display hero)
  - `text-[3rem]` → 48px (page headers)
- **Line height**: `leading-relaxed` (1.6), `leading-tight` (1.25 for headers)
- **Letter tracking**: `tracking-wider` for display, `tracking-wider` for money amounts

**Tabular numerals enforcement**: `font-numeric` tailwind class on all money input/display elements; `font-[Sora] numeric` in CSS.

## Spacing, Radius, Elevation, Grid

- **Spacing scale** (step + unit): `0`, `0.5` (4px), `1` (8px), `2` (16px), `3` (24px), `4` (32px), `6` (48px), `8` (64px)
- **Radius**: `radius-sm` (8px), `radius-md` (12px), `radius-lg` (16px), `radius-full` (9999px)
- **Elevation** (shadow tokens):
  - `shadow-sm` (0 1px 2px rgba(0,0,0,0.3))
  - `shadow-md` (0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06))
  - `shadow-lg` (0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05))
  - `shadow-inset` for modals/panels
- **Grid**: 12-column, `gap-4` (16px), `gap-6` (24px)
- **Max-width**: `max-w-7xl` (1440px), `max-w-md` (medium screens)

## Iconography

- **Icon set**: `lucide-react` (replacing emoji, generic icons)
- **Style**: outline → fill on hover/focus, 24px grid, `stroke-current` color
- **Prohibited**: no emoji as icons, no NovaPay character elements
- **Custom icons**: Kobo-specific (money bag, building block, progress chart) drawn from lucide set

## Motion Language (Defined Once in `lib/motion.ts`)

- **Springs**: stiffness ~260, damping ~24 (for all motion: entering, exiting, hovers)
- **Micro-interactions**: 150–250 ms (button press, input focus, hover)
- **Page/section moves**: 400–600 ms (route transitions, section fades)
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` for springs, `ease-out` for micro-interactions
- **Reduced motion**: `prefers-reduced-motion` → all motion becomes fade/opacity only, no spring/GSAP animations
- **Crossfade**: route transitions use shared layout fade/slide; fade-only under reduced motion

**Money moments** (send, save, allocate, contribute) get a satisfying coin/progress animation plus text confirmation via `aria-live`.

## Component Inventory with States

| Component | States |
|-----------|--------|
| Button | default, primary, secondary, disabled, loading, ghost |
| Card | default, elevated, with header, with footer, disabled |
| Input | default, error, success, disabled, focused |
| Sheet | open, closed, with form, with list |
| Tabs | default, single, with indicator |
| Progress | determinate, indeterminate, with label |
| Skeleton | portrait, paragraph, image, avatar |
| EmptyState | illustration, title, description, CTA |
| Toast | success, error, info, with aria-live |
| Kobo3D | idle, wave, celebrate, thinking, reduced-motion |

## Full Kobo Spec

### Silhouette & Proportions
- **Rounded, gold-trimmed coin body** (kobo = Nigeria's currency subunit)
- **Height**: ~1.0 metre in glTF units (Y-up, faces +Z)
- **Width**: proportionally smaller, circular-ish torso
- **Strap**: small shopping-bag strap like a backpack, violet colour
- **Blocks**: stacking tiny building blocks (building blocks = "Buy + Back")
- **Origin**: at the feet

### Materials
- **Body**: Principled BSDF, gold metallic, 0.85 base color, 0.5 clearcoat, 0.3 metallic roughness
- **Strap**: Principled BSDF, violet hue, matte finish (no clearcoat)
- **Eyes**: cream colour (`#FFF5E6`), slight emissive highlight for "alive" look
- **Blocks**: pastel colour set, one colour per joint pot member

### Expressions (Shape Keys)
- `blink`: eye closure, loops seamlessly
- `smile`: lip corners rise, shows warmth
- `surprised`: eyebrows raise, mouth opens slightly
- `think`: slight frown, gaze downward

### Moods
- `idle`: breathing + subtle sway (loops seamlessly, 24 fps)
- `wave`: hand wave + slight body lean
- `celebrate`: hop + arms up + block stack jiggle
- `thinking`: head tilt, hand on chin

### Block-Tower Behaviour (Joint Pots)
- Each member's blocks rendered in their assigned colour
- Kobo stands near the tower, celebrates milestones
- When a contribution is made: Koba does a small celebratory animation, block count increases
- When a milestone hit (25/50/75/100%): Koba does a special celebration
- Reduced motion: Koba frozen in idle pose, block tower static

### How It Differs from NovaPay Reference
- **No glasses** on Kobo (NovaPay character had glasses)
- **No chain** around neck
- **Different pose**: Kobo stands confidently, not leaning
- **Different colour palette**: gold + violet vs NovaPay's distinct scheme
- **No NovaPay logo or branding anywhere**
- **Block tower** is unique to Buy & Build joint pots concept

## Copy Tone of Voice

### General Principles
- **Clear over clever**: money is serious; don't confuse
- **Warm, not corporate**: "You" not "User"; "Oops" not "Error"
- **Action-oriented**: tell people what to do, not what they did wrong
- **Naira/kobo first**: always show ₦ or ₦kobo alongside numbers
- **Never promise guaranteed returns**: even in copy

### Microcopy Examples

**Salary Split setup**:
- "Your income, split your way" → heading
- "Divide your salary between Spending, Savings, and named Goals. Total must equal 100%." → helper text
- "Allocate" → button
- "Total must equal 100%" → error

**Shop & Save**:
- "Save as you spend" → heading
- "Enable a rule to set aside money when you make eligible purchases" → description
- "5% of ₦40,000 = ₦2,000" → example
- "Opt-in required" → toggle label
- "You can pause or change this anytime" → helper text

**Goal creation**:
- "What are you saving for?" → heading
- "Target amount" → label
- "Deadline" → label
- "Add laptop goal" → button

**Joint pot creation**:
- "Save together toward a shared goal" → heading
- "Name your pot" → label (e.g., "Lagos Rent Fund")
- "Target amount & deadline" → label
- "Approval rule:" → section
  - "All members must approve" → option
  - "Majority approves" → option (default)
  - "Owner approves up to ₦X" → option
- "Suggested contribution: ₦X per member" → reminder (opt-in required)
- "Invite members" → section

**Withdrawal request**:
- "Request a withdrawal" → button
- "Amount" → label
- "Reason (optional)" → label
- "Votes needed: X of Y" → display
- "72-hour countdown" → display
- "Your refund: ₦X (proportional to your net contributions)" → leave flow

**Error states**:
- "Something went wrong, try again" → generic
- "Total must equal 100%" → salary split
- "Opt-in required before contributions can be enabled" → shop save
- "Insufficient balance" → withdraw
- "You are not a member of this pot" → access denied

**Success states**:
- "₦2,000 saved" → toast
- "Contribution received" → toast
- "Withdrawal requested" → toast
- "Pot closed, funds returned" → toast

**Demo mode indicator**:
- "Demo mode — no real money moves" → banner at top of money screens

### Do's and Don'ts
- ✅ Do use ₦ and ₦kobo formatting consistently
- ✅ Do show tabular numerals for money
- ✅ Do show demo mode indicator where money actions occur
- ✅ Do use warm, confident copy tone
- ✅ Do make consent opt-in explicit and obvious
- ❌ Don't use generic purple-card-grid SaaS look
- ❌ Don't use emoji as icons
- ❌ Don't copy NovaPay's layout, colours, copy, or character
- ❌ Don't promise guaranteed returns
- ❌ Don't take purchase-linked contributions without explicit opt-in
- ❌ Don't use customer funds as working capital in logic or copy

## Breakpoints
- **Mobile**: 360px, 375px, 425px (one-column layout, bottom nav, sheet modal)
- **Tablet**: 768px (two-column layout where appropriate, sidebar collapsed)
- **Desktop**: 1024px, 1280px (sidebar visible, two-column layout)
- **Wide**: 1440px (max-width, full-width hero)

**At 360px**: bottom nav full-width, sidebar collapsed to icons-only, sheets fill width
**At 768px**: sidebar appears as icons+labels on desktop, hidden on mobile; Koba poster smaller
**At 1280px**: full sidebar, Koba 3D visible in hero
**At 1440px**: max-width constraints activate, generous spacing

## Accessibility Standards
- **4.5:1 contrast minimum** for normal text, 3:1 for large text (UI components)
- **Focus rings** on all interactive elements (`outline-2 outline-offset-2` custom)
- **Labelled inputs** with `aria-describedby` for error messages
- **Keyboard navigable** every control (Tab order, `Enter/Space` activates)
- **`prefers-reduced-motion`** respected everywhere (3D static, fades only)
- **`aria-live`** region for money-moment confirmations (polite, then assertive on retry)
- **Touch target minimum**: 48×48 dp
- **Skip links** for navigation on protected routes

## Open Questions
1. Exact colour values for light mode vs dark mode transition breakpoint
2. Whether Koba's block tower colours use member-assigned palette or fixed set
3. Microcopy refinement after usability testing with Nigerian users
4. Whether "Sora" display font licensing allows web embedding or needs fallback strategy
5. Exact spring configuration values for micro-interactions vs page transitions

---
**Open Questions** section maintained. No unexplained TBDs.