# Contract: Admin / Authoring API (internal)

Session-guarded API behind the admin UI. **Not** exposed to the marketing site. Every mutation is
RBAC-checked and audit-logged (FR-014/FR-016). All routes require an authenticated Auth.js session;
admin-only routes additionally require `role = admin`.

- **Auth**: session cookie (Auth.js). Admin login requires a valid TOTP second factor (FR-015).
- **Errors**: `401` unauthenticated, `403` unauthorized (role), `409` edit conflict (stale write),
  `422` validation failure (with field-level detail).

## Auth

### POST /api/auth/login  → step 1: email + password
- **200** with `{ mfaRequired: true, challengeId }` for admins → proceed to TOTP step.
- **200** session established for non-MFA editors (if allowed) — admins always continue to step 2.

### POST /api/auth/mfa  → step 2: TOTP code
- Body `{ challengeId, code }`. **200** establishes session; **401** on bad/expired code
  (rate-limited, audited as `auth.mfa_fail`).

## Content authoring (editor + admin)

### GET /api/admin/{type}
List entries of a type including drafts (for the editing UI), paginated, with status filter.

### POST /api/admin/{type}
Create a new draft entry. Body validated by the type's Zod schema.
- **201** → created entry (status `draft`). Writes version 1 + `audit_log(entry.create)`.

### PUT /api/admin/{type}/{id}
Update an entry. Body includes `expectedVersionId` for concurrency.
- **200** → updated entry + new version + `audit_log(entry.update)`.
- **409** → `expectedVersionId` stale (concurrent edit) — no silent overwrite (edge case).
- **422** → validation errors (field list).

### POST /api/admin/{type}/{id}/publish
- Validates required fields + referenced media exist, sets `status=published`, `published_at`,
  fires revalidation webhook, writes `audit_log(entry.publish)`.
- **200** on success; **422** if publish gate fails (lists missing fields / broken media refs).

### POST /api/admin/{type}/{id}/unpublish
- Sets `status=draft`, fires webhook, audits `entry.unpublish`.

### DELETE /api/admin/{type}/{id}
- Soft delete (`deleted_at`), audits `entry.delete`. Excluded from all reads afterward.

### GET /api/admin/{type}/{id}/versions
- **200** → list of versions `[{ id, authorEmail, createdAt, statusAtSave }]` (FR-009).

### POST /api/admin/{type}/{id}/restore
- Body `{ versionId }`. Copies that version's data into the entry, writes a **new** version, audits
  `version.restore`. **200** → restored entry (User Story 4).

## Media (editor + admin)

### POST /api/media
- Multipart upload. Validates MIME allowlist + max size (FR-013), stores to Bunny.net, persists
  metadata, returns `{ id, deliveryUrl, mimeType, width, height }`. Audits `media.upload`.
- **422** → unsupported type or oversized.

### GET /api/media
- Paginated media library for reuse (FR-011).

## Users & audit (admin only — 403 for editors)

### GET /api/admin/users · POST /api/admin/users · PUT /api/admin/users/{id}
- Manage accounts + roles. Editors receive **403** (FR-014). Guards prevent removing the last admin
  and prevent activating an admin without MFA. Audits `user.*`.

### GET /api/admin/audit
- **200** → filterable audit log `[{ actor, action, targetType, targetId, at, metadata }]`
  (FR-016). Admin-only.

## Webhook config (admin only)

### GET/POST/PUT /api/admin/webhooks
- Manage revalidation endpoints (url, secret, events) targeting the site (D7).

## Contract guarantees (tested)

- CG-A1: every mutation route produces exactly one `audit_log` row (SC-005).
- CG-A2: editor role receives 403 on all `/api/admin/users/**` and `/api/admin/webhooks/**` routes.
- CG-A3: admin session cannot be established without a valid TOTP factor (SC-008).
- CG-A4: publish is refused (422) when required fields are missing or referenced media is absent.
- CG-A5: a stale `expectedVersionId` yields 409, never a silent overwrite.
