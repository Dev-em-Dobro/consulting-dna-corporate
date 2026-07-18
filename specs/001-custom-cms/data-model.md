# Phase 1 Data Model: Custom Headless CMS

Derived from the spec's Key Entities and the research decisions (esp. D4 content model, D5
draft/publish, D8 audit). Persistence: Neon Postgres via Drizzle. Media binaries live in Bunny.net;
only metadata is stored here. Types below are conceptual; exact SQL/Drizzle definitions live in the
CMS repo's `db/schema/`.

## Conventions

- All ids are UUID (`uuid` default `gen_random_uuid()`).
- All tables have `created_at` / `updated_at` timestamptz.
- Soft state via `status` and `deleted_at` where relevant; the published API never returns
  non-`published` or soft-deleted rows.
- Per-type structured fields are stored in validated `jsonb` (`data`) plus first-class columns for
  anything the read API must **filter or sort** on.

## Entities

### users

| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| email | citext unique | login identity |
| password_hash | text | argon2/bcrypt |
| role | enum('admin','editor') | RBAC; editors cannot manage users (FR-014) |
| mfa_enabled | boolean | admins MUST be true (FR-015) |
| totp_secret | text (encrypted) | present when MFA enabled |
| status | enum('active','invited','disabled') | |
| last_login_at | timestamptz | |

- **Rules**: an `admin` cannot be saved without MFA once activated; last active admin cannot be
  demoted/disabled (guard against lockout).

### content_entries  *(base table for all content types)*

| Field | Type | Notes |
|---|---|---|
| id | uuid PK | identity of this locale variant |
| type | enum(content_type) | case, solution, person, region, insight, page_5h, page_book, page_awards, page_legal |
| slug | text | unique per (type, locale) |
| locale | text | e.g. 'en'; Phase 1 = 'en' only (FR-019) |
| translation_group_id | uuid | shared across locale variants of the same logical entry |
| status | enum('draft','published','archived') | published = site-visible (D5) |
| current_version_id | uuid FK → content_versions | pointer to live snapshot |
| data | jsonb | type-specific fields, Zod-validated at write (FR-006) |
| published_at | timestamptz null | |
| deleted_at | timestamptz null | soft delete |
| created_by / updated_by | uuid FK → users | |

- **Indexes/uniques**: unique (`type`,`slug`,`locale`); index (`type`,`status`,`locale`); index
  `translation_group_id`.
- **Rules**: publish is blocked unless `data` passes the content type's required-field validation
  (FR-006) and all referenced media exist (edge case). Adding a translation = new row, same
  `translation_group_id`, different `locale` — no migration (SC-007).

### Per-type facet/relation columns

Case-study facets must be filterable (FR-010), so they are **not** JSONB-only:

#### case_study_facets  *(1:1 with a `case` entry)*

| Field | Type | Notes |
|---|---|---|
| entry_id | uuid FK → content_entries (unique) | |
| industry | text[] | filter facet |
| service | text[] | filter facet |
| region_id | uuid[] FK → content_entries(region) | filter facet |
| outcome | text[] | filter facet |

> `case` structured body (challenge, approach, outcome, measurable_result, client_quote,
> video_url, cover_media_id) lives in `content_entries.data`, validated by the case Zod schema
> (FR-007).

### content_versions  *(append-only history)*

| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| entry_id | uuid FK → content_entries | |
| data | jsonb | full snapshot of the entry's fields at save time |
| status_at_save | enum | draft/published |
| author_id | uuid FK → users | |
| created_at | timestamptz | version timestamp (FR-009) |

- **Rules**: every save/publish writes a new version; **restore** copies a chosen version's `data`
  into the entry and writes a *new* version recording the restore (User Story 4 scenario 2).

### media_assets

| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| filename | text | |
| mime_type | text | validated allowlist (FR-013) |
| size_bytes | bigint | max-size enforced |
| width / height | int null | images |
| bunny_path | text | object key in Bunny storage |
| delivery_url | text | stable CDN URL (FR-011) |
| alt_text | text | accessibility |
| uploaded_by | uuid FK → users | |

- Entries reference media by `media_asset.id` (e.g. `cover_media_id` in `data`). Videos are **not**
  here — they are YouTube URLs in `data` (FR-012).

### audit_log  *(append-only)*

| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| actor_id | uuid FK → users null | null for anonymous/failed auth |
| action | text | e.g. entry.publish, entry.delete, version.restore, user.create, auth.login, auth.mfa_fail |
| target_type | text | entry / user / media |
| target_id | uuid null | |
| metadata | jsonb | ip, request context, before/after summary |
| created_at | timestamptz | |

- **Rule**: written through a single `lib/audit` writer on every mutation + auth event (SC-005 =
  100% coverage).

### webhook_endpoints  *(revalidation targets)*

| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| url | text | site revalidation route |
| secret | text | HMAC signing key (D7) |
| active | boolean | |
| events | text[] | e.g. ['entry.published','entry.unpublished'] |

- On publish/unpublish, a signed POST fires to active endpoints with `{type, slug, locale}` so the
  site revalidates affected paths (FR-021).

### sessions / auth tables

Managed by Auth.js (sessions, accounts, verification tokens) plus a `totp_challenges` helper table
for pending second-factor state during login.

## Relationships (summary)

```text
users 1──* content_entries        (created_by / updated_by)
users 1──* content_versions       (author_id)
users 1──* audit_log              (actor_id)
users 1──* media_assets           (uploaded_by)

content_entries 1──* content_versions
content_entries 1──1 case_study_facets        (only for type = case)
content_entries *──* media_assets             (via ids referenced in data / cover_media_id)
content_entries *──* content_entries          (translation_group_id groups locale variants;
                                               region_id links cases→regions, person→region, etc.)
webhook_endpoints                              (fired on entry publish/unpublish)
```

## State transitions — content entry

```text
(new) → draft ──publish──▶ published ──unpublish──▶ draft
                              │
              archive ◀───────┘        restore(version) can occur from any state,
                                       producing a new version + (optionally) draft
delete: any → soft-deleted (deleted_at set); excluded from all read APIs
```

- Publish gate: required-field validation passes AND referenced media exist.
- Concurrent-edit guard: saves are checked against the entry's `current_version_id` /
  `updated_at`; a stale write is rejected with a conflict rather than silently overwriting
  (edge case).

## Validation rules (application layer, Zod per type)

- **case**: challenge, approach, outcome, measurable_result, client_quote required; cover_media_id
  must reference an existing `media_asset`; video_url optional, must be a YouTube URL.
- **person**: name, role, bio required; photo_media_id optional but recommended; region link
  optional.
- **region**: name, city required; may link people and related content.
- **solution**: title, problem_statement, cta required; proof references optional.
- **insight**: title, body, published_at required to publish.
- **singleton pages** (5H/book/awards/legal): exactly one published entry per (type, locale);
  fields per page.
