# Quickstart & Validation Guide: Custom Headless CMS

This guide proves the feature works end-to-end. It targets the **separate CMS repository**
(`corporate-dna-cms`), not this marketing-site repo. Implementation details (schema, handlers)
live in `tasks.md` / the CMS codebase — this is a run/validation reference.

## Prerequisites

- Node.js 24 LTS, pnpm (or npm)
- A Neon Postgres database (connection string) — the client's own account
- A Bunny.net storage zone + CDN pull zone (keys)
- A Resend API key (for invites/reset)
- Vercel account for deployment (CMS is a **separate Vercel project** from the site)

## One-time setup (in the CMS repo)

```bash
# in corporate-dna-cms/ (separate repo)
pnpm install
cp .env.example .env.local        # fill DATABASE_URL, AUTH_SECRET, BUNNY_*, RESEND_API_KEY, READ_API_KEY
pnpm drizzle-kit migrate          # apply schema (see data-model.md)
pnpm seed:admin                   # create first admin (prompts email + password + TOTP enrolment)
pnpm dev                          # admin at http://localhost:3000, API under /api
```

## Validation scenarios

Each scenario maps to a spec user story / success criterion. Run them after setup; automated
equivalents live in the CMS repo's `tests/`.

### V1 — Editor create → preview → publish (User Story 1, SC-001)

1. Log in at `/login` as the seeded admin (complete TOTP).
2. Go to Cases → New. Fill challenge, approach, outcome, measurable result, client quote; upload a
   cover image; save draft.
3. Open Preview — confirm the case renders as it will on the site.
4. Click Publish.
- **Expected**: publish succeeds; `GET /api/content/cases/{slug}` returns the entry; the draft was
  visible only in preview beforehand. (Acceptance US1.1–1.3)

### V2 — Published API returns no drafts (User Story 2, SC-003)

```bash
# Create a second case but leave it as draft, then:
curl -s "$CMS_URL/api/content/cases" -H "x-api-key: $READ_API_KEY" | jq '.items[].slug'
curl -s -o /dev/null -w "%{http_code}\n" "$CMS_URL/api/content/cases/<draft-slug>" -H "x-api-key: $READ_API_KEY"
```
- **Expected**: list omits the draft; the draft slug returns **404**. (CG-1)

### V3 — Faceted case-study filtering (FR-010, CG-4)

```bash
curl -s "$CMS_URL/api/content/cases?industry=finance&region=london" -H "x-api-key: $READ_API_KEY" | jq '.total'
```
- **Expected**: only cases tagged finance AND london are returned.

### V4 — RBAC + audit (User Story 3, SC-005, CG-A2)

1. As admin, create an editor account; log in as that editor.
2. Navigate to `/users` (or `GET /api/admin/users`).
- **Expected**: **403**. Then perform an edit as the editor and check `GET /api/admin/audit` (as
  admin) — the edit appears with actor, action, target, timestamp.

### V5 — Admin MFA enforced (SC-008, CG-A3)

- Attempt admin login and skip/enter a wrong TOTP code.
- **Expected**: session is **not** established; `auth.mfa_fail` is audited; attempts are
  rate-limited.

### V6 — Version restore (User Story 4, SC-006)

1. Edit a published case twice.
2. Open its Versions list; restore the first version.
- **Expected**: entry content matches the restored version exactly; a new version records the
  restore. (CG — restore writes a new version)

### V7 — Media upload + reference (User Story 5)

```bash
curl -s -X POST "$CMS_URL/api/media" -H "Cookie: <admin session>" -F "file=@photo.jpg" | jq '.deliveryUrl'
```
- **Expected**: returns a stable Bunny CDN URL; the asset appears in the media library and can be
  attached to an entry; unsupported type/oversized upload returns **422**. (FR-011/FR-013)

### V8 — Multilingual-ready (User Story 6, SC-007)

- Add an `es` (or `pt`) translation to an existing English entry via the UI (same
  `translation_group_id`).
- **Expected**: no migration needed; `GET /api/content/cases/{slug}?locale=es` returns the ES
  variant; requesting a missing locale applies the documented fallback without error. (FR-019/020)

### V9 — Site consumption + revalidation (User Story 2, D7)

1. In **this** repo (marketing site), configure `lib/cms/client.ts` with `$CMS_URL` + `READ_API_KEY`
   and register the site's revalidation route as a webhook endpoint in the CMS.
2. Publish an entry in the CMS.
- **Expected**: the CMS fires a signed webhook; the site's revalidation handler verifies the
  signature and revalidates the affected path within ~5s; the site never queried the CMS database
  or admin directly. (FR-002/FR-004/FR-021)

## Definition of done (validation)

All of V1–V9 pass, plus the automated suites in the CMS repo:
`pnpm test` (unit + contract, incl. the draft-leak test) and `pnpm test:e2e` (Playwright:
login+MFA, create→preview→publish, restore). These map 1:1 to the spec's Success Criteria
SC-001..SC-008.
