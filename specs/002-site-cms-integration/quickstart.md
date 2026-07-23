# Quickstart: validate the site ↔ CMS read integration

Run guide to prove each route renders live CMS content. Details live in `plan.md`,
`data-model.md`, `contracts/site-consumption.md`.

## Prerequisites

- The CMS read API is deployed, reachable, and has published content (per `001`).
- `.env.local` (site) has:
  ```env
  CMS_URL="https://<cms-read-api-base>"
  CMS_READ_API_KEY="<read key>"        # currently present as READ_API_KEY — standardise the name
  CMS_WEBHOOK_SECRET="<shared secret>" # for /api/revalidate
  ```
  and **no** `DATABASE_URL` (that belongs to the CMS project — FR-108).
- `npm i` (includes the new `zod` dependency once tasks land).

## Smoke-test the API directly (before wiring UI)

```bash
# List endpoints return only published items
curl -s -H "x-api-key: $CMS_READ_API_KEY" "$CMS_URL/api/content/people"   | jq '.items | length'
curl -s -H "x-api-key: $CMS_READ_API_KEY" "$CMS_URL/api/content/cases"    | jq '.items[0]'
# Singleton page
curl -s -H "x-api-key: $CMS_READ_API_KEY" "$CMS_URL/api/content/pages/5h" | jq '.data | keys'
# Absent slug → 404 (no draft leak)
curl -s -o /dev/null -w "%{http_code}\n" -H "x-api-key: $CMS_READ_API_KEY" \
  "$CMS_URL/api/content/cases/__nope__"   # expect 404
```

Use the observed shapes to finalise `lib/cms/schemas.ts` and the media host for `remotePatterns`.

## Run the site

```bash
npm run dev   # http://localhost:3006 (or the printed port)
```

## Per-route validation checklist

| Route | Expected |
|---|---|
| `/v1` → People | Cards/pop-ups show CMS people (not the old hardcoded 6); photos load via `next/image` |
| `/solutions/leadership` | Same CMS people, full pop-ups incl. social links |
| `/solutions/5h-framework` | Hero + body from `pages/5h`; methodology image from CMS |
| `/solutions/flagship-cases` | Lists flagged cases; each links to its article |
| `/solutions/flagship-cases/<slug>` | Tags/headline/intro/quote/video CTA/body from the case; bad slug → 404 |
| `/solutions/case-library` | Faceted list; "< 10 cases" gate shows the documented empty state |
| `/solutions/regions` + `/<region>` | Regions from CMS; unknown region → 404 |
| `/book` | Copy + cover + "Buy on Amazon" CTA from `pages/book` |
| `/awards` | Awards & partnerships content from `pages/awards` |
| `/insights` + `/<slug>` | Insight list + article; bad slug → 404 |

## Degradation & security checks

- **CMS down**: stop/point `CMS_URL` at an unreachable host after a successful build → previously
  built routes still serve (SC-104); a cold detail fetch → `notFound()`/graceful, not a 500.
- **No key/DB leak (SC-102)**: `npm run build` then grep the client chunks — the API key and any DB
  string must **not** appear:
  ```bash
  grep -rInE "x-api-key|postgres(ql)?://|CMS_READ_API_KEY" .next/static || echo "clean"
  ```
- **Revalidation (SC-105)**: publish a change in the CMS → its signed webhook hits `/api/revalidate`
  → the affected route shows the new content within one cycle.

## Done when

- [ ] Every route in the table renders CMS content (no hardcoded arrays remain for them).
- [ ] Absent/unpublished slugs 404 on all detail routes (0 draft leaks).
- [ ] Build output is free of the API key and DB credentials.
- [ ] Cached routes survive a CMS outage.
