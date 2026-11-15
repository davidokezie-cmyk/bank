# Decisions

## 2026-11-09 — Use npm scripts for the aggregate check

The repository has an npm lockfile and no pnpm lockfile, while the available pnpm shim did not return usable output. The `check` script therefore invokes the project checks through npm so the same validation sequence is runnable with the installed dependency tree.

## 2026-11-09 — Resolve joint-pot approval edge cases

- Majority approval means strictly more than half of active members; a tie does not approve.
- Under `owner_up_to_ngx`, requests above the configured limit are rejected at request time, and only the owner may vote on an in-limit request.
- Proportional payouts use integer kobo and distribute fractional remainders by largest fractional remainder, then earliest join time, then user ID.
- Closing requires every active member's explicit confirmation and no pending withdrawal request.

## 2026-11-14 — Keep shared demo data deterministic

Seed data lives in `src/lib/demo-data.ts` and is imported by every screen that shows pots, invitations, or the salary split. Dates are fixed ISO strings and money is integer kobo so prerendering produces stable HTML and pages never disagree with each other.

## 2026-11-14 — Correct Shop & Save test units

The Shop & Save tests compared a kobo result against a naira literal. The product rule is unchanged: ₦40,000 at 5% sets aside ₦2,000, which is 200,000 kobo. Tests now build expectations with `nairaToKobo(2000)`, and validation-message assertions match the lowercase wording the functions emit.

## 2026-11-14 — Vitest config uses `.mts`

`vitest.config.mts` keeps the config ESM-native, which avoids Vite's CommonJS config-loader warning while leaving the app itself on the standard Next.js TypeScript setup.

## 2026-11-14 — Dev server verification method

The dev server was started as a detached process and probed with `Invoke-WebRequest`. Every audited route returned HTTP 200. The aggregate `npm run check` command was interrupted by the shell timeout during its build stage even though typecheck, lint, tests, and a standalone `next build` had each passed; the individual commands remain the verified sequence.

## 2026-11-14 — Hide the Next.js dev indicator via `devIndicators: false`

The dev-mode indicator (the floating "N" badge, bottom-left by default) overlapped interactive UI during the local audit: the sidebar Log out button, the mobile Dashboard tab, and the marketing stats row. Setting `devIndicators: false` in `next.config.ts` hides only the indicator; compile and runtime errors are still surfaced. Trade-off: developers lose the static/dynamic route marker, which is acceptable for a demo-mode prototype.

## 2026-11-14 — Remove the visible "Kobo mascot" caption from KoboProcedural

The procedural fallback rendered a visible "Kobo mascot" label under the figure, which read as a debug string next to real copy. The container keeps `role="img"` and its aria-label, so the removal costs no accessibility.

## 2026-11-14 — `audit/` is gitignored

Playwright route screenshots (~150 MB of PNGs across 24 routes × light/dark × desktop/mobile) are regenerable artifacts, not source. The audit script `audit-screenshots.mjs` stays in the repo root so the sweep can be re-run any time.

## 2026-11-14 — Kill the violet/indigo brand; adopt refined glass on deep navy

The user re-directed the visual system: no purple/violet anywhere, glass morphism as the primary language, deep navy/charcoal with soft whites and muted accents. This supersedes the previous violet→indigo primary action colour, the `.surface-glow` radial hero glow, the `.brand-gradient` CTA fill, and the violet block-tower member colour. Tokens were re-specified in `04-DESIGN-BRIEF.md` before any code changed (docs-first). Primary actions are now solid gold with ink text; focus rings and the ring token stay gold; member-identity colours keep gold/green/coral and one steel blue — never violet/magenta. Light mode is restyled as a first-class citizen of the same glass system. Trade-off accepted: Nigerian low-end Android gets `prefers-reduced-transparency` / mobile solid surfaces instead of blur, and no screen stacks more than two blurred layers.

## 2026-11-14 — Unslop skill not installed; nine-pass process run with installed equivalents

The user specified the Unslop skill (Damir Sokolovsky). It is not installed on this machine (checked user skills, project skills, `~/.agents/skills`, and opencode plugin config — no match). Per the user's explicit instruction, the work runs the same nine-pass rigour using the installed `ui-ux-pro-max`, `ui-styling`, and `design-system` skills instead. No claim is made that Unslop itself was used.

## 2026-11-14 — `Tabs` cloneElement props type widened

`React.cloneElement` was given props (`role`, `aria-selected`, `tabIndex`, `className`, `onClick`) outside the child's declared `{ value: string }` type, failing `tsc --noEmit`. The child prop type is now an explicit `TabChildProps`. No runtime behavior change.

## 2026-11-14 � Homepage reveal is load-time, never scroll-gated

The IntersectionObserver reveal hid below-the-fold sections whenever no scroll event fired (e.g. fullPage captures, and any render where observation never ran). Reveals now fire in a single staggered rAF on mount � still skipped entirely under prefers-reduced-motion. Trade-off: scroll-linked one-shot reveals are gone; the cascade now plays on page load.
