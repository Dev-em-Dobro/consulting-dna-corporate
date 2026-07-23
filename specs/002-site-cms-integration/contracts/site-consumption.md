# Contract: Site consumption of the CMS read API

Which read-API endpoint each site route calls, and the shape it expects. Endpoints and response
shapes are owned by `001-custom-cms/contracts/read-api.md`; this file is the **site's usage map**.
All calls go through `lib/cms/client.ts` (server-side, `x-api-key`, tag-cached).

## Route → endpoint map

| Site route | Client call | Read-API endpoint | Cache tags | On missing |
|---|---|---|---|---|
| `/v1` (People section) | `getList("people")` | `GET /api/content/people` | `cms:people` | render empty section |
| `/solutions/leadership` | `getList("people")` | `GET /api/content/people` | `cms:people` | empty state |
| `/solutions` (editorial) | `getPage("solutions")` *or* `getList("solutions")` | `GET /api/content/pages/solutions` / `GET /api/content/solutions` | `cms:page:solutions` | empty state |
| `/solutions/5h-framework` | `getPage("5h")` | `GET /api/content/pages/5h` | `cms:page:5h` | `notFound()` |
| `/solutions/flagship-cases` | `getCases({ flagship })` | `GET /api/content/cases?...` | `cms:case` | empty state |
| `/solutions/flagship-cases/[slug]` | `getEntry("cases", slug)` | `GET /api/content/cases/{slug}` | `cms:case:{slug}` | `notFound()` |
| `/solutions/case-library` | `getCases(facets)` | `GET /api/content/cases?industry=&service=&region=&outcome=` | `cms:case` | empty / "< 10" gate |
| `/solutions/regions` | `getList("regions")` | `GET /api/content/regions` | `cms:regions` | empty state |
| `/solutions/regions/[region]` | `getEntry("regions", slug)` | `GET /api/content/regions/{slug}` | `cms:regions:{slug}` | `notFound()` |
| `/book` | `getPage("book")` | `GET /api/content/pages/book` | `cms:page:book` | `notFound()` |
| `/awards` | `getPage("awards")` | `GET /api/content/pages/awards` | `cms:page:awards` | `notFound()` |
| `/insights` | `getList("insights")` | `GET /api/content/insights` | `cms:insights` | empty state |
| `/insights/[slug]` | `getEntry("insights", slug)` | `GET /api/content/insights/{slug}` | `cms:insights:{slug}` | `notFound()` |

> `getList("regions")` / `("people")` reuse the generic `getList`; `client.ts` already tags
> `cms:<type>`. Detail calls add `cms:<type>:<slug>` for per-entry invalidation.

## Expected shapes (validated by `lib/cms/schemas.ts`)

Authoritative shapes: `read-api.md`. The site depends on these fields (superset tolerated,
missing-required → fail safe):

**List item** (people / insights / regions / cases list):
`{ id, type, slug, locale, title, summary?, coverUrl?, publishedAt }`

**Case detail** (`data`): `{ title, challenge, approach, outcome, measurableResult, clientQuote,
videoUrl?, coverUrl?, facets: { industry[], service[], region[], outcome[] } }`
→ mapped to the article template (tags = facets, headline = title, quote = clientQuote,
video CTA = videoUrl, body = challenge/approach/outcome/measurableResult).

**Person detail/list** (`data` expected): `{ name, role, bio[], photoUrl?, socials?: [{type, href}],
region?, values?, strengths?, specialties?, clients?, languages?, skills? }`
→ mapped to `PeopleGrid`'s `Person` prop (see `data-model.md`). Fields beyond name/role/bio are
optional and only render when present.

**Region detail** (`data`): `{ name, city, ... }` → region page.

**Singleton page** (`5h` / `book` / `awards` / `solutions`): `{ key, locale, data, publishedAt }`
where `data` holds the page's blocks (hero title/subtitle, body sections, media, CTA/purchase link).

## Guarantees the site relies on (from 001)

- CG-1: no non-`published` entry is ever returned (SC-003) — the site does **not** re-filter status.
- CG-2: additive-only shape changes — the site's Zod schemas use `.passthrough()`/optionals so
  additive fields don't break parsing.
- CG-3/4: locale fallback + facet OR-within/AND-across semantics are the API's responsibility; the
  site just forwards `locale` and facet params.

## Webhook (already implemented, pre-existing)

`POST /api/revalidate` verifies `x-cms-signature` (HMAC via `CMS_WEBHOOK_SECRET`) and revalidates.
This feature only ensures fetches are **tagged** so revalidation is targeted (upgrade the handler
to `revalidateTag` per `{type, slug}` in tasks; today it does `revalidatePath("/", "layout")`).
