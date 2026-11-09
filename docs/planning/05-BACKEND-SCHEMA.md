# 05-BACKEND-SCHEMA.md - Backend Schema Document

## Status: Draft v1
## Last updated: 2026-11-09
## Links: 01-PRD.md, 02-TRD.md, 03-APP-FLOW.md, 04-DESIGN-BRIEF.md, 06-IMPLEMENTATION-PLAN.md

## Tables with Fields, Types, Constraints, Relationships, Indexes

### 1. users / profiles

| Field | Type | Constraints | Relationships | Index |
|-------|------|-------------|---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `email` | TEXT | Not null, unique | - | Unique index |
| `phone` | TEXT | nullable, check: `~'^\\+234\\d{10}$'` (Nigerian format) | - | Index |
| `name` | TEXT | nullable | - | - |
| `role` | TEXT | default 'user', check: `IN ('user', 'owner')` | - | - |
| `created_at` | TIMESTAMPTZ | default now() | - | - |
| `updated_at` | TIMESTAMPTZ | default now(), on update now() | - | - |
| `demo_mode` | BOOLEAN | default false | - | - |
| `clerk_user_id` | TEXT | nullable, unique | - | Unique index |

### 2. wallets

| Field | Type | Constraints | Relationships | Index |
|-------|------|-------------|---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `user_id` | UUID | Not null, FK → users(id), ON DELETE cascade | users | Index |
| `balance_kobo` | BIGINT | Not null, default 0, check: `>= 0` | - | Index |
| `currency` | TEXT | default 'NGN' | - | - |
| `created_at` | TIMESTAMPTZ | default now() | - | - |
| `updated_at` | TIMESTAMPTZ | default now(), on update now() | - | - |

### 3. goals

| Field | Type | Constraints | Relationships | Index |
|-------|------|-------------|---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `user_id` | UUID | Not null, FK → users(id), ON DELETE cascade | users | Index |
| `name` | TEXT | Not null | - | - |
| `target_kobo` | BIGINT | Not null, check: `> 0` | - | Index |
| `current_kobo` | BIGINT | Not null, default 0, check: `>= 0` | - | Index |
| `deadline` | TIMESTAMPTZ | nullable | - | - |
| `category` | TEXT | default 'lifestyle' check: `IN ('rent', 'car', 'education', 'business', 'holiday')` | - | - |
| `created_at` | TIMESTAMPTZ | default now() | - | - |
| `updated_at` | TIMESTAMPTZ | default now(), on update now() | - | - |

### 4. salary_split_rules

| Field | Type | Constraints | Relationships | Index |
|-------|------|-------------|---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `user_id` | UUID | Not null, FK → users(id), ON DELETE cascade | users | Index |
| `category` | TEXT | Not null, `IN ('spending', 'savings', 'goal')` | - | - |
| `allocation_percentage` | INTEGER | Not null, check: `>= 0 AND <= 100` | - | - |
| `goal_id` | UUID | nullable, FK → goals(id), ON DELETE set null | goals | Index |
| `is_active` | BOOLEAN | default true | - | - |
| `created_at` | TIMESTAMPTZ | default now() | - | - |
| `updated_at` | TIMESTAMPTZ | default now(), on update now() | - | - |

**Constraint**: Per user, sum of all active allocation_percentage must equal exactly 100. Enforced by app logic + trigger or check constraint.

### 5. shop_save_rules

| Field | Type | Constraints | Relationships | Index |
|-------|------|-------------|---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `user_id` | UUID | Not null, FK → users(id), ON DELETE cascade | users | Index |
| `rule_type` | TEXT | Not null, `IN ('fixed', 'percentage', 'round_up')` | - | - |
| `rule_value` | INTEGER | Not null, check: `> 0` (fixed ₦ or % or round-up base) | - | - |
| `is_active` | BOOLEAN | default true | - | - |
| `created_at` | TIMESTAMPTZ | default now() | - | - |
| `updated_at` | TIMESTAMPTZ | default now(), on update now() | - | - |

### 6. contributions

| Field | Type | Constraints | Relationships | Index |
|-------|------|-------------|---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `user_id` | UUID | Not null, FK → users(id), ON DELETE cascade | users | Index |
| `amount_kobo` | BIGINT | Not null, check: `> 0` | - | Index |
| `type` | TEXT | Not null, `IN ('one_off', 'recurring_fixed', 'salary_split', 'shop_save')` | - | - |
| `source` | TEXT | nullable, e.g. `pot_id`, `merchant_name` | - | - |
| `created_at` | TIMESTAMPTZ | default now() | - | - |
| `updated_at` | TIMESTAMPTZ | default now(), on update now() | - | - |

### 7. transactions

| Field | Type | Constraints | Relationships | Index |
|-------|------|-------------|---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `from_user_id` | UUID | nullable, FK → users(id) | users | Index |
| `to_user_id` | UUID | nullable, FK → users(id) | users | Index |
| `from_pot_id` | UUID | nullable, FK → joint_pots(id) | joint_pots | Index |
| `amount_kobo` | BIGINT | Not null, check: `> 0` | - | Index |
| `type` | TEXT | Not null, `IN ('spend', 'save', 'withdraw', 'contribute')` | - | - |
| `reason` | TEXT | nullable | - | - |
| `destination` | TEXT | Not null, `IN ('owner_wallet', 'member_wallet')` | - | - |
| `status` | TEXT | default 'completed', check: `IN ('completed', 'pending', 'failed')` | - | - |
| `created_at` | TIMESTAMPTZ | default now() | - | - |
| `updated_at` | TIMESTAMPTZ | default now(), on update now() | - | - |

### 8. cards

| Field | Type | Constraints | Relationships | Index |
|-------|------|------------- |---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `user_id` | UUID | Not null, FK → users(id), ON DELETE cascade | users | Index |
| `last_four` | TEXT | Not null, check: `~'\\d{4}$'` (NUBAN last 4) | - | - |
| `type` | TEXT | default 'debit', check: `IN ('debit', 'credit')` | - | - |
| `status` | TEXT | default 'active', check: `IN ('active', 'frozen', 'expired')` | - | - |
| `created_at` | TIMESTAMPTZ | default now() | - | - |
| `updated_at` | TIMESTAMPTZ | default now(), on update now() | - | - |

### 9. notifications

| Field | Type | Constraints | Relationships | Index |
|-------|------|------------- |---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `user_id` | UUID | Not null, FK → users(id), ON DELETE cascade | users | Index |
| `type` | TEXT | Not null, `IN ('invite', 'contribution', 'withdrawal_request', 'withdrawal_vote', 'milestone', 'member_left', 'pot_closed')` | - | - |
| `title` | TEXT | Not null | - | - |
| `body` | TEXT | Not null | - | - |
| `data` | JSONB | nullable, key-value for extra context | - | - |
| `read` | BOOLEAN | default false | - | Index |
| `created_at` | TIMESTAMPTZ | default now() | - | - |

### 10. consent_records

| Field | Type | Constraints | Relationships | Index |
|-------|------|------------- |---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `user_id` | UUID | Not null, FK → users(id), ON DELETE cascade | users | Index |
| `type` | TEXT | Not null, `IN ('shop_save_opt_in', 'joint_pot_terms', 'data_processing')` | - | - |
| `accepted_at` | TIMESTAMPTZ | default now() | - | - |
| `expires_at` | TIMESTAMPTZ | nullable | - | - |
| `ip_address` | INET | nullable | - | - |
| `user_agent` | TEXT | nullable | - | - |

### 11. audit_log

| Field | Type | Constraints | Relationships | Index |
|-------|------|------------- |---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `user_id` | UUID | nullable, FK → users(id) | users | Index |
| `action` | TEXT | Not null (e.g. 'salary_split_created', 'joint_pot_joined', 'contribution_made') | - | - |
| `entity_type` | TEXT | Not null (e.g. 'user', 'pot', 'rule') | - | - |
| `entity_id` | UUID | nullable | - | - |
| `old_value` | JSONB | nullable | - | - |
| `new_value` | JSONB | nullable | - | - |
| `created_at` | TIMESTAMPTZ | default now() | - | - |

### 12. joint_pots

| Field | Type | Constraints | Relationships | Index |
|-------|------|------------- |---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `name` | TEXT | Not null | - | - |
| `goal_name` | TEXT | Not null (e.g. "Lagos Rent") | - | - |
| `target_kobo` | BIGINT | Not null, check: `> 0` | - | Index |
| `current_kobo` | BIGINT | Not null, default 0, check: `>= 0` | - | Index |
| `deadline` | TIMESTAMPTZ | nullable | - | - |
| `approval_rule` | TEXT | Not null, `IN ('all', 'majority', 'owner_up_to_ngx')` | - | - |
| `owner_approval_limit_kobo` | BIGINT | nullable; required and `> 0` when `approval_rule = 'owner_up_to_ngx'` | - | - |
| `owner_user_id` | UUID | Not null, FK → users(id), ON DELETE cascade | users | Index |
| `max_members` | INTEGER | default 10, check: `>= 2 AND <= 10` | - | - |
| `fee_kobo` | BIGINT | default 0, check: `>= 0` (withdrawal fee, demo) | - | - |
| `created_at` | TIMESTAMPTZ | default now() | - | - |
| `updated_at` | TIMESTAMPTZ | default now(), on update now() | - | - |

### 13. joint_members

| Field | Type | Constraints | Relationships | Index |
|-------|------|------------- |---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `pot_id` | UUID | Not null, FK → joint_pots(id), ON DELETE cascade | joint_pots | Index |
| `user_id` | UUID | Not null, FK → users(id), ON DELETE cascade | users | Index |
| `role` | TEXT | Not null, `IN ('owner', 'member')` | - | - |
| `contribution_kobo` | BIGINT | default 0, check: `>= 0` (net contributions) | - | - |
| `joined_at` | TIMESTAMPTZ | default now() | - | - |
| `left_at` | TIMESTAMPTZ | nullable | - | - |
| `left_reason` | TEXT | nullable | - | - |

**Constraint**: Per pot, max_members limit enforced by app logic (max 10).

### 14. joint_invites

| Field | Type | Constraints | Relationships | Index |
|-------|------|------------- |---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `pot_id` | UUID | Not null, FK → joint_pots(id), ON DELETE cascade | joint_pots | Index |
| `email` | TEXT | nullable | - | - |
| `phone` | TEXT | nullable, check: `~'^\\+234\\d{10}$'` | - | - |
| `username` | TEXT | nullable | - | - |
| `status` | TEXT | default 'pending', check: `IN ('pending', 'accepted', 'declined', 'expired')` | - | - |
| `expires_at` | TIMESTAMPTZ | default now() + interval '7 days' | - | - |
| `created_at` | TIMESTAMPTZ | default now() | - | - |

### 15. withdrawal_requests

| Field | Type | Constraints | Relationships | Index |
|-------|------|------------- |---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `pot_id` | UUID | Not null, FK → joint_pots(id), ON DELETE cascade | joint_pots | Index |
| `requested_by_user_id` | UUID | Not null, FK → users(id) | users | Index |
| `amount_kobo` | BIGINT | Not null, check: `> 0 AND <= pot_balance_kobo` | - | Index |
| `reason` | TEXT | nullable | - | - |
| `status` | TEXT | default 'pending', check: `IN ('pending', 'approved', 'rejected', 'expired')` | - | - |
| `votes_yes` | INTEGER | default 0, check: `>= 0` | - | - |
| `votes_no` | INTEGER | default 0, check: `>= 0` | - | - |
| `created_at` | TIMESTAMPTZ | default now() | - | - |
| `expires_at` | TIMESTAMPTZ | default now() + interval '72 hours' | - | - |
| `approved_at` | TIMESTAMPTZ | nullable | - | - |

### 16. withdrawal_votes

| Field | Type | Constraints | Relationships | Index |
|-------|------|------------- |---------------|-------|
| `id` | UUID | Primary Key, default gen_random_uuid() | - | Primary |
| `withdrawal_request_id` | UUID | Not null, FK → withdrawal_requests(id), ON DELETE cascade | withdrawal_requests | Index |
| `user_id` | UUID | Not null, FK → users(id) | users | Index |
| `vote` | TEXT | Not null, check: `IN ('yes', 'no')` | - | - |
| `created_at` | TIMESTAMPTZ | default now() | - | - |

**Constraint**: Per withdrawal request, unique(user_id) - one vote per user.

## ER Diagram (Text Representation)

```
users (1)-------(n) salaries
users (1)-------(n) wallets
users (1)-------(n) goals
users (1)-------(n) salary_split_rules
users (1)-------(n) shop_save_rules
users (1)-------(n) contributions
users (1)-------(n) transactions (from/to)
users (1)-------(n) cards
users (1)-------(n) notifications
users (1)-------(n) consent_records
users (1)-------(n) audit_log
users (1)-------(n) joint_members
users (1)-------(n) joint_invites (email/phone/username)
users (1)-------(n) withdrawal_requests (requested_by)
users (1)-------(n) withdrawal_votes (user)

joint_pots (1)-------(n) joint_members
joint_pots (1)-------(n) joint_invites
joint_pots (1)-------(n) transactions (from_pot)
joint_pots (1)-------(n) withdrawal_requests

goals (1)-------(n) salary_split_rules (goal_id)
```

## Access Matrix (Who Can Read/Write What)

| Resource | Owner (creator) | Joint Member | Other Users | System |
|----------|----------------|--------------|-------------|--------|
| **own wallet** | Read/write | Never | Never | Maintain balance |
| **own goals** | Read/write | Never | Never | Track progress |
| **own salary_split_rules** | Read/write | Never | Never | Enforce 100% |
| **own shop_save_rules** | Read/write | Never | Never | Enforce opt-in |
| **own contributions** | Read/write | Never | Never | Itemise attribution |
| **own transactions** | Read/write | Never | Never | Full history |
| **own cards** | Read/write | Never | Never | Mock status |
| **own notifications** | Read/write | Never | Never | - |
| **own consent_records** | Read/write | Never | Never | - |
| **joint pot details** | Read/write | Read pot activity (contributions, votes, withdrawals) | Never see other members' balances, other goals, or non-pot transactions | Enforce rules |
| **joint member list** | Read/write | See own role only; never see other members' net contributions or financial data outside pot | Never | - |
| **joint invites** | Create/manage | See pending invites for pots they're in | Never see invites for pots they're not in | Auto-expire after 7 days |
| **withdrawal requests** | Create, vote (if majority/all rule) | Vote only (see amount, reason, votes count) | Never initiate or approve | 72h expiry, balance limit |
| **withdrawal votes** | Cast vote | Cast vote (yes/no) | Never vote on behalf of another | One vote per user per request |
| **leaving a pot** | N/A | Proportional refund, exact amount shown before confirming | N/A | Deterministic payout |
| **closing a pot** | Start closure | Confirm closure (all members) | N/A | Balance distributed proportionally, rounding remainder deterministic |

## Postgres/Supabase SQL with RLS (Row Level Security)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
-- ... repeat for all tables

-- Users can only see their own data
CREATE POLICY "Users see own data" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users see own wallet" ON wallets
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own goals" ON goals
  FOR ALL USING (auth.uid() = user_id);

-- Joint pot RLS (complex)
-- Members can read pot activity but not other members' balances
CREATE POLICY "Pot members read activity" ON joint_pots
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM joint_members
      WHERE pot_id = id AND user_id = auth.uid()
    )
  );

-- Members can read their own contributions to pot
CREATE POLICY "Members read own contributions" ON contributions
  FOR SELECT USING (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM joint_members
      WHERE pot_id = contributions.source AND user_id = auth.uid()
    )
  );

-- Owner can manage pot
CREATE POLICY "Owner manages pot" ON joint_pots
  FOR ALL USING (
    owner_user_id = auth.uid()
  );

-- Withdrawal RLS
CREATE POLICY "Users see own withdrawal requests" ON withdrawal_requests
  FOR SELECT USING (
    requested_by_user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM joint_members WHERE pot_id = joint_pots.id AND user_id = auth.uid())
  );
```

## Mapping to Mock Repository & Zod Schemas

Each table maps to a TypeScript interface in `src/types/` and a Zod schema in `src/lib/schemas.ts`. The mock repository (`src/store/memory-repository.ts`) implements the same interface using `Map`/`Store` patterns, so swapping to Supabase is a matter of replacing the repository implementation.

**Example Zod schema** (salary split rule):
```typescript
import { z } from 'zod';

export const salarySplitRuleSchema = z.object({
  category: z.enum(['spending', 'savings', 'goal']),
  allocation_percentage: z.number().int().min(0).max(100),
  is_active: z.boolean().default(true),
});

export type SalarySplitRule = z.infer<typeof salarySplitRuleSchema>;
```

**Example Zod schema** (joint pot invite):
```typescript
export const jointInviteSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().regex(/^\+234\d{10}$/).optional(),
  username: z.string().optional(),
});

export type JointInvite = z.infer<typeof jointInviteSchema>;
```

## Data-Protection Notes (Legal-Review Caveat)

- **Data minimisation**: Only store what's needed for the app's functionality. No BVN, NIN, full card numbers, or passwords in prototype.
- **Account numbers**: NUBAN format validation only (10 digits, starts with 0-9). No bank account number storage beyond last 4 digits for card display.
- **Phone numbers**: Nigerian format `+234` + 10 digits validated on sign-up. Stored with `+` prefix.
- **Consent**: `consent_records` table tracks explicit opt-ins (shop_save, joint_pot_terms, data_processing). Each consent has optional `expires_at`.
- **Retention**: Personal data retained while user account is active; anonymised after account deletion.
- **Deletion**: User can request data deletion via Settings → "Request data deletion". All personal data anonymised or removed; joint pot contributions recorded remain attributed to user ID but name/phone/email cleared.
- **Nigerian data-protection and financial regulations**: Need legal review before any real launch. This prototype is for demonstration only. Real launch requires: CBN licensing, data protection compliance (NDPB), KYC/AML procedures, regulated partner agreements.

## Open Questions
1. Exact trigger implementation for salary_split_rules = 100% check (database vs app logic)
2. Whether `joint_members.contribution_kobo` stores gross or net contributions
3. Default fee_kobo value for joint pots (0 for demo, or small percentage?)
4. Whether `withdrawal_requests.amount_kobo` upper bound check is DB constraint or app logic
5. Audit log entity_type enum values: pre-defined set or dynamic?

---
**Open Questions** section maintained. No unexplained TBDs.