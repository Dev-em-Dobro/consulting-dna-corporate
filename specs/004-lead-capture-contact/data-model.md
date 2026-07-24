# Phase 1 Data Model: Lead capture

Store: **Supabase Postgres** (the site's own lead store — separate from the CMS Neon DB).

## Entity: `leads`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK, default `gen_random_uuid()` | |
| `created_at` | `timestamptz` default `now()` | Server time — authoritative (FR-203) |
| `name` | `text` NOT NULL | Required (FR-202) |
| `email` | `text` NOT NULL | Required, format-validated server-side |
| `organisation` | `text` NULL | Optional |
| `message` | `text` NOT NULL | Required; length-bounded (e.g. ≤ 5000) |
| `source` | `text` NOT NULL default `'homepage-contact'` | Which form/page (FR-203) |
| `referrer` | `text` NULL | Marketing attribution (D8) |
| `utm` | `jsonb` NULL | `{source,medium,campaign,term,content}` when present |
| `user_agent` | `text` NULL | Coarse UA for triage |
| `crm_status` | `text` NOT NULL default `'pending'` | `pending \| synced \| failed \| skipped` |
| `crm_synced_at` | `timestamptz` NULL | When handoff succeeded |
| `crm_error` | `text` NULL | Last handoff error (for retry/triage) |

Indexes: `created_at desc` (triage), `crm_status` (find un-synced for retry).

### Validation rules (enforced in the Server Action, `lib/leads/schema.ts`)

- `name`: non-empty after trim.
- `email`: matches a standard email pattern (mirror the client `EMAIL_RE`), lowercased on store.
- `message`: non-empty after trim, ≤ 5000 chars.
- `organisation`: optional, ≤ 200 chars.
- Honeypot field (e.g. `company_url`): MUST be empty; non-empty → reject silently as spam.

## Entity: `lead_events` (optional, for handoff auditability/retry)

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | |
| `lead_id` | `uuid` FK → `leads.id` | |
| `kind` | `text` | `crm_handoff \| email_notify` |
| `status` | `text` | `success \| failure` |
| `detail` | `text` NULL | Response code / error message |
| `created_at` | `timestamptz` default `now()` | |

If retries are kept simple (re-POST unsynced leads by `crm_status`), `lead_events` can be deferred.

## Normalized CRM payload (Lead → CRM), `lib/leads/mapping.ts`

Documented mapping so any CRM/automation target can ingest a lead (FR-206). See
[`contracts/contact-api.md`](./contracts/contact-api.md) for the exact JSON shape.

| Lead field | CRM-standard field |
|---|---|
| `name` | contact full name |
| `email` | contact email |
| `organisation` | company / account name |
| `message` | note / description |
| `source` | lead source |
| `utm`, `referrer` | marketing attribution |
| `created_at` | created date |

## State transitions

`crm_status`: `pending` → (`synced` \| `failed`); `failed` → `synced` on successful retry;
`skipped` when no CRM target is configured (FR-209). Capture is complete and durable regardless of
`crm_status`.
