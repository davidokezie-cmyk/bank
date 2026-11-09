# Decisions

## 2026-11-09 — Use npm scripts for the aggregate check

The repository has an npm lockfile and no pnpm lockfile, while the available pnpm shim did not return usable output. The `check` script therefore invokes the project checks through npm so the same validation sequence is runnable with the installed dependency tree.

## 2026-11-09 — Resolve joint-pot approval edge cases

- Majority approval means strictly more than half of active members; a tie does not approve.
- Under `owner_up_to_ngx`, requests above the configured limit are rejected at request time, and only the owner may vote on an in-limit request.
- Proportional payouts use integer kobo and distribute fractional remainders by largest fractional remainder, then earliest join time, then user ID.
- Closing requires every active member's explicit confirmation and no pending withdrawal request.
