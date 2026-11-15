# 04-DESIGN-BRIEF.md - Design Brief

## Brand Personality
**Mood:** premium, warm, confident — a lifestyle brand that happens to do money, not a bank.
- Target audience: Nigerian professionals, tech-savvy users who value style and functionality
- Positioning: between a fintech tool and a lifestyle brand; not a corporate bank, not a generic SaaS
- Tone: helpful, confident, inclusive, never intimidating or condescending
- Tagline: **Buy What You Love. Build Wealth As You Live.**

## Colour Tokens (CSS Variables / Tailwind)

**Visual language: refined glass on deep navy.** Frosted panels, 1px translucent borders, layered depth shadows. No gradients on interactive elements, no neon glows, no purple anywhere in the interface. Member-identity colours (block tower) may use a restrained palette including one steel blue, but never violet/magenta UI accents. Light mode is a first-class restyle of the same system, not an afterthought.

### Dark Mode (Primary)
- `ink`: `#0A0E1A` — background, deep navy
- `surface`: `#101623` — cards, panels (solid fallback below the frost)
- `raised`: `#182031` — elevated surfaces, modals
- `border`: `#24304A` — form borders, dividers
- `text`: `#E8ECF3` — soft white, primary text
- `muted`: `#8A94A8` — secondary text, captions
- `gold`: `#E3B452` — coins, rewards, "Build" moments; primary CTA fill (always paired with ink text)
- `gold-strong`: `#F2C06B` — gold text on dark, on-track pills
- `green-growth`: `#33D17A` — growth, positive amounts, progress
- `alert-coral`: `#E0605F` — alerts, errors, warnings
- `ring`: `#E3B452` — focus rings
- `glass-bg`: `rgba(255,255,255,0.04)` — frosted panel fill over ink
- `glass-border`: `rgba(232,236,243,0.10)` — 1px refined border
- `shadow-glass`: `0 16px 48px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)` — depth + top highlight
- Aurora backdrop (static, non-violet): `radial-gradient(1100px 560px at 78% -8%, #131F33 0%, transparent 60%)`

### Light Mode
- `ink-light`: `#F5F6FA` — background
- `surface-light`: `#FFFFFF` — cards, panels
- `raised-light`: `#ECEEF4` — elevated surfaces
- `border-light`: `#D5D9E4` — form borders
- `text-light`: `#131A2A` — deep navy text
- `muted-light`: `#55607A` — secondary text
- `gold`: `#E3B452` — CTA fill (ink text); `gold-text`: `#8A5A00` — gold text on white
- `green-growth-light`: `#137A45` — growth
- `alert-coral-light`: `#B42318` — alerts
- `glass-bg-light`: `rgba(255,255,255,0.72)` — frost over `#F5F6FA`
- `shadow-glass-light`: `0 16px 40px -20px rgba(19,26,42,0.35), inset 0 1px 0 rgba(255,255,255,0.9)`

### Glass system rules
- Blur: `blur(8px)` panels, `blur(14px)` max for sheets/overlays. Never stack more than two blurred layers.
- Surfaces must remain fully legible if `backdrop-filter` fails: the solid `surface` fill sits under every frost.
- Mobile and `prefers-reduced-transparency` get solid `raised` surfaces (no blur).
- No `background-clip: text` gradients. No glow shadows. No purple/violet/magenta hex anywhere in `src/`.

**Contrast ratios** (AA for normal text, AAA for large text):
- `ink` / `text`: 15:1 ✓
- `ink` / `gold` (CTA): 9.6:1 ✓
- `surface` / `muted`: 5.4:1 ✓
- `alert-coral` / `surface`: 4.9:1 ✓ (`#E0605F` on `#101623`) → white text on coral only for large text; use coral text + icon otherwise
- `gold` / `surface`: 8.8:1 ✓

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
- **Radius**: `radius-sm` (10px), `radius-md` (14px), `radius-lg` (18px), `radius-xl` (24px), `radius-full` (9999px)
- **Elevation** (glass shadow tokens):
  - `shadow-glass-sm` (0 4px 16px -8px rgba(0,0,0,0.5))
  - `shadow-glass` (0 16px 48px -16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06))
  - `shadow-glass-lg` (0 28px 80px -24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)) — sheets, modals
  - `shadow-raised-light` for light mode per the light tokens above
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
- **Strap**: small shopping-bag strap like a backpack, muted slate colour
- **Blocks**: stacking tiny building blocks (building blocks = "Buy + Back")
- **Origin**: at the feet

### Materials
- **Body**: Principled BSDF, gold metallic, 0.85 base color, 0.5 clearcoat, 0.3 metallic roughness
- **Strap**: Principled BSDF, muted slate (`#46536E`), matte finish (no clearcoat)
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
- **Different colour palette**: gold + slate vs NovaPay's distinct scheme
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