# Phase 0 Research: Site ↔ CMS read integration

Decisions for the site-side integration. Format: Decision / Rationale / Alternatives.

## D1 — Consume the CMS via its HTTP read API (not the DB)

- **Decision**: The site reads only through the CMS **published read API** (`lib/cms/client.ts`).
  No Supabase/pg driver is added to the site.
- **Rationale**: Upholds 001 FR-001/FR-004 (security-by-separation; the breached surface stays off
  the visitor-facing project). Confirmed by the user (2026-07-22).
- **Alternatives**: Direct Supabase Postgres read (`DATABASE_URL`) or Supabase PostgREST — both
  rejected because they put DB coupling/credentials in the site, violating FR-004.

## D2 — Server-side fetching with tag-based caching

- **Decision**: Fetch in Server Components (and the client's `cmsGet`) with
  `next: { tags: ["cms", "cms:<type>", "cms:<type>:<slug>"] }`. Invalidate via the existing
  `app/api/revalidate` webhook (`revalidateTag`/`revalidatePath`). Add a modest time-based
  `revalidate` as a safety net for missed webhooks.
- **Rationale**: Visitor traffic hits the Next cache, not the CMS; publishes refresh within one
  cycle; the site survives brief CMS downtime by serving last-good (FR-107).
- **Alternatives**: `no-store` (per-request) — rejected, hammers the CMS and breaks offline-tolerance.
  Pure time-based ISR — kept as fallback, but webhook tags give near-instant freshness.

## D3 — Validate CMS responses at the boundary with Zod

- **Decision**: Add `zod`; define one schema per content type in `lib/cms/schemas.ts`; parse every
  response before mapping. On parse failure: skip the item (lists) or `notFound()` (detail), and log.
- **Rationale**: The CMS is a separate, independently-evolving project; the site must fail safe on
  shape drift and never render `undefined` (FR-104). Also yields end-to-end types for free.
- **Alternatives**: Trust `as T` casts (current `client.ts`) — rejected; no runtime safety at a
  cross-service boundary.

## D4 — Isolate CMS coupling in `lib/cms/*`; keep components presentational

- **Decision**: `lib/cms/map.ts` converts validated API objects into the exact props the existing
  components already use (e.g. the `Person` shape `PeopleGrid` renders). Refactor `PeopleGrid` to
  accept `people` as a prop rather than importing a hardcoded array.
- **Rationale**: Minimises churn to the freshly-built UI; all API knowledge lives behind one module;
  swapping/mocking the source is trivial for tests.
- **Alternatives**: Fetch inside components — rejected; couples presentation to the API and forces
  client-side fetching (would leak the key).

## D5 — Environment & secrets

- **Decision**: Site uses `CMS_URL`, `CMS_READ_API_KEY`, `CMS_WEBHOOK_SECRET`. Update `client.ts`
  to read `CMS_READ_API_KEY ?? READ_API_KEY` (back-compat with the current `.env.local`), and
  standardise on `CMS_READ_API_KEY`. **Remove `DATABASE_URL` from the site `.env.local`** (FR-108) —
  it belongs to the CMS project; if it was exposed, rotate it there.
- **Rationale**: Keeps DB credentials out of the site (FR-004); one canonical key name.
- **Open input**: `CMS_URL` value and the media delivery domain(s) — to be provided by the user or
  discovered by probing a sample entry's `coverUrl`.

## D6 — `next/image` allow-listing

- **Decision**: Add the CMS/CDN media host(s) to `next.config.mjs` `images.remotePatterns`.
- **Rationale**: Without it, `next/image` refuses remote media and pages break.
- **Open input**: exact host (e.g. `*.b-cdn.net` for Bunny.net, or the CMS delivery domain).

## D7 — Flagship vs library cases

- **Decision (to confirm in probing)**: Treat "flagship" as a facet/flag on `cases` (e.g.
  `outcome`/a `flagship` boolean) — `/solutions/flagship-cases` lists flagged ones;
  `/solutions/case-library` lists all with facet filters and is gated behind a "≥ 10 cases" check.
- **Rationale**: Matches the client's request to hold the library until 10+ cases exist.
- **Alternatives**: Separate content type — rejected unless the API models it that way.

## Open inputs summary

| # | Input | Status |
|---|---|---|
| 1 | `CMS_URL` (read-API base URL) | ✅ `http://localhost:3010/api` |
| 2 | Key env name (`CMS_READ_API_KEY`) | ✅ standardised in `.env.local` |
| 3 | Media host | ✅ `BUNNY_CDN_URL=https://corporate-dna.b-cdn.net` |
| 4 | Flagship flag/facet on cases | ⚠️ facets empty on live cases; library gated at ≥10 (D8) |
| 5 | Remove `DATABASE_URL` from site env | ✅ removed |
| 6 | **Media ID → URL resolution** | ✅ **decided (D9)** — resolve inline in the CMS read API |
| 7 | `/solutions` collection vs page | ✅ **decided (D10)** — list 7 offerings + `/solutions/[slug]` |

## Phase 0 live-probe results (2026-07-22)

Probed the running CMS read API at `http://localhost:3010/api` with the key. Reachable; root
redirects to `/login` (admin protected); `/api/content/*` returns JSON with the key.

### D8 — Correct base path (client fix)

- **Finding**: endpoints are `${CMS_URL}/content/{type}` (i.e. `http://localhost:3010/api/content/...`).
  The current `client.ts` prepends `/api/content/...`, which with a `CMS_URL` already ending in
  `/api` yields a double `/api/api/...`.
- **Decision**: make `client.ts` normalise the base — strip a trailing `/api` and trailing slash —
  and keep building `/api/content/...`. Works whether `CMS_URL` is the origin or ends in `/api`.

### D9 — Media is returned as an ID, not a URL (**blocker for images**)

- **Finding**: list/detail return `coverMediaId` (a UUID), **not** `coverUrl`. The 001 read-API
  contract promised `coverUrl`/`videoUrl`. The site has no `bunny_path` to build a URL from.
- **DECIDED (2026-07-22)**: resolve **inline in the CMS read API** — list/detail responses add a
  resolved `coverUrl` (and `videoUrl` passthrough) computed as `${BUNNY_CDN_URL}/${bunny_path}` from
  the media asset. Keeps the site dumb and upholds FR-004. **Cross-repo task**: implemented in
  `E:\projetos\corporate-dna-cms` (read-API media resolver); the site then reads `coverUrl`
  directly. Until deployed, site image slots fall back to `ImagePlaceholder`.

### Current published content inventory (for expectations, not fixtures)

| Type | Count | Notes |
|---|---|---|
| `solutions` | 7 | real: Executive Coaching, Leadership Development, Culture Transformations, High Performing Teams, Women in Leadership, Inclusion & Diversity, Asian Talent Development |
| `cases` | 2 | test data; `facets` empty; has `coverMediaId` |
| `insights` | 1 | test data |
| `people` | 0 | empty → pages render empty until authored |
| `regions` | 0 | empty → keep `lib/nav.ts` static slugs as build fallback |
| `pages/5h`, `pages/book`, `pages/awards` | 404 | singletons not created yet; `pages/solutions` = "Unknown page" (solutions is a **collection**, not a singleton) |

### Verified shapes (live)

- **case.data**: `{ title, summary(html), challenge, approach, outcome, measurableResult,
  clientQuote, facets{industry,service,region,outcome}, coverMediaId, videoUrl? }`
- **solution.data**: `{ title, problemStatement, body(html), cta{label,href}, proofRefs[] }`
- **insight.data**: `{ title, excerpt, body(html) }`
- **person.data / region.data**: unknown (0 published) — use 001 data-model expectations, validate
  when content exists.
- List items carry `title, slug, locale, publishedAt` (+ `summary`, `coverMediaId`, `facets` for
  cases). Body fields are **HTML strings** → render via sanitised HTML, not plain text.

### D10 — `/solutions` route vs the `solutions` collection

- **Finding**: the CMS models `solutions` as a 7-item collection (each with its own slug + cta to
  `/solutions/{slug}`), not a singleton editorial page. Our current `/solutions` is a wireframe
  editorial page.
- **DECIDED (2026-07-22)**: `/solutions` **lists the 7 offerings** from the `solutions` collection,
  and add **`/solutions/[slug]`** detail pages (title, `problemStatement`, `body` HTML, `cta`). The
  wireframe editorial layout is repurposed as the listing/detail styling.
