# Contract: Published Read API (site-facing)

This is the **only** interface the marketing site uses. It returns **published content only**
(D5, SC-003). Base URL: the CMS deployment (e.g. `https://api.<domain>` or `https://<cms>/api`),
which is a **separate origin** from the marketing site (FR-001/FR-004).

- **Auth**: read access is authorized via an API key header (`x-api-key`) OR public-but-cached,
  per launch decision; either way it is **read-only** and returns nothing non-published.
- **Format**: JSON. All responses conform to the shapes below (mirrored as Zod/OpenAPI in the CMS
  repo `contracts/`). Contract tests assert conformance.
- **Caching**: responses are cacheable at the edge; freshness maintained by publish webhooks (D7).

## Common query params

| Param | Applies to | Notes |
|---|---|---|
| `locale` | all | default `en`; fallback rule applied when translation absent (FR-020) |
| `page`, `pageSize` | list endpoints | pagination; default pageSize 20, max 100 |

## Endpoints

### GET /api/content/{type}
List published entries of a content type.
`{type}` ∈ `cases | solutions | people | regions | insights`.

- **200** →
  ```json
  {
    "items": [ { "id": "...", "type": "case", "slug": "...", "locale": "en",
                 "title": "...", "summary": "...", "coverUrl": "...", "publishedAt": "..." } ],
    "page": 1, "pageSize": 20, "total": 42
  }
  ```
- Never includes `draft`/`archived`/soft-deleted entries.

### GET /api/content/cases
Case-study library with **faceted filters** (FR-003/FR-010). In addition to common params:

| Param | Type | Notes |
|---|---|---|
| `industry` | string (repeatable) | facet |
| `service` | string (repeatable) | facet |
| `region` | slug (repeatable) | facet |
| `outcome` | string (repeatable) | facet |

- **200** → same list shape; each item includes facets. Multiple facet values are OR within a
  facet, AND across facets.

### GET /api/content/{type}/{slug}
Single published entry by slug (+ optional `locale`).

- **200** → full entry:
  ```json
  {
    "id": "...", "type": "case", "slug": "...", "locale": "en",
    "data": {
      "title": "...", "challenge": "...", "approach": "...", "outcome": "...",
      "measurableResult": "...", "clientQuote": "...", "videoUrl": "https://youtube.com/...",
      "coverUrl": "https://cdn.bunny.net/...", "facets": { "industry": ["..."], "service": ["..."],
      "region": ["london"], "outcome": ["..."] }
    },
    "publishedAt": "..."
  }
  ```
- **404** → entry not found, unpublished, or deleted (no draft leakage — SC-003).

### GET /api/content/pages/{key}
Singleton pages: `{key}` ∈ `5h | book | awards | legal/privacy | legal/cookies | legal/terms`.

- **200** → `{ "key": "...", "locale": "en", "data": { ... }, "publishedAt": "..." }`
- **404** → not published.

### GET /api/content/{type}/{slug}?preview={token}  *(preview only — not for site prod use)*
Draft-aware read guarded by a signed, short-lived preview token (D5). Used by the CMS preview
renderer and, optionally, the site's preview environment. Public site production **must not** send
preview tokens.

## Webhook: content change → site revalidation (outbound from CMS)

The CMS POSTs to the site's registered revalidation endpoint on publish/unpublish (FR-021, D7).

- **Headers**: `x-cms-signature: <HMAC-SHA256 of body using endpoint secret>`
- **Body**:
  ```json
  { "event": "entry.published", "type": "case", "slug": "...", "locale": "en", "at": "..." }
  ```
- Site verifies the signature, then revalidates the affected path(s). Invalid signature → 401,
  no revalidation.

## Contract guarantees (tested)

- CG-1: no endpoint under `/api/content/**` (without a valid preview token) ever returns an entry
  whose status ≠ `published` (SC-003).
- CG-2: response shapes match the published schemas exactly; additive changes only (backward
  compatible) so the site does not break.
- CG-3: `locale` fallback behavior is deterministic and documented (FR-020).
- CG-4: facet filtering semantics are OR-within / AND-across facets (FR-010).
