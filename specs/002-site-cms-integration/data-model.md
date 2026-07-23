# Phase 1 Data Model (site side): view models & mapping

The site holds **no persistent data**. This documents the **view models** the components consume and
how validated CMS responses map to them. Source of truth for the wire shapes:
`contracts/site-consumption.md` + `001-custom-cms/contracts/read-api.md`.

Boundary flow: `client.ts` (fetch) → `schemas.ts` (Zod parse) → `map.ts` (→ view model) → component.

## Person (→ `components/PeopleGrid.tsx`)

Existing component prop (keep as-is; feed from CMS instead of the hardcoded array):

```ts
type Social = { type: "linkedin" | "x" | "instagram" | "email"; href: string };
type Person = {
  name: string; role: string; img: string; bio: string[];
  socials?: Social[];
  values?: string; strengths?: string; specialties?: string[];
  trackRecord?: string[]; clients?: string; languages?: string; skills?: string[];
};
```

**Mapping** (CMS `people` entry `data` → `Person`):

| Component field | CMS source | Notes |
|---|---|---|
| `name`, `role`, `bio` | `data.name`, `data.role`, `data.bio[]` | required |
| `img` | `data.photoUrl` (or `coverUrl`) | fallback to a placeholder if absent |
| `socials` | `data.socials[]` | already `{type, href}`; else omit (component shows none) |
| `values`…`skills` | same-named optional `data.*` | render only when present |

## Case article (→ `/solutions/flagship-cases/[slug]`)

```ts
type CaseArticle = {
  slug: string; tags: string[]; title: string; intro: string;
  quote?: { text: string; attribution?: string }; videoUrl?: string;
  coverUrl?: string;
  body: { challenge: string; approach: string; outcome: string; measurableResult: string };
};
```

**Mapping**: `tags` = flatten `data.facets` (industry+service+outcome); `title` = `data.title`;
`intro` = `data.challenge` summary or a dedicated `data.intro`; `quote.text` = `data.clientQuote`;
`videoUrl` = `data.videoUrl`; `body` = the four narrative fields.

## Case list item (→ flagship list & library cards)

```ts
type CaseCard = { slug: string; title: string; summary?: string; coverUrl?: string; tags: string[] };
```
From the list-item shape + facets.

## Region (→ `/solutions/regions/[region]`)

```ts
type Region = { slug: string; name: string; city?: string; body?: PageBlock[] };
```
Note: the site currently hardcodes 5 region slugs in `lib/nav.ts` for
`generateStaticParams`. When CMS-backed, derive params from `getList("regions")` (keep the static
list as a fallback if the API is unreachable at build).

## Insight (→ `/insights`, `/insights/[slug]`)

```ts
type InsightCard = { slug: string; title: string; summary?: string; coverUrl?: string; publishedAt: string };
type Insight = InsightCard & { body: PageBlock[] };
```

## Singleton page (→ `/solutions`, `/solutions/5h-framework`, `/book`, `/awards`)

```ts
type PageBlock =
  | { kind: "hero"; title: string; subtitle?: string }
  | { kind: "text"; heading?: string; body: string }
  | { kind: "image"; url: string; alt?: string; caption?: string }
  | { kind: "cta"; label: string; href: string };   // e.g. Book → "Buy on Amazon"

type CmsPage = { key: string; title: string; subtitle?: string; blocks: PageBlock[] };
```

**Mapping**: singleton `data` → `CmsPage`. The already-built `PageHero` + content sections consume
`title`/`subtitle`/`blocks`. `ImagePlaceholder` is replaced by `image` blocks (real `next/image`).
The Book page's purchase path is a `cta` block (`href` = Amazon URL).

## Validation & fail-safe rules

- Every schema marks only the **truly required** fields as required; everything else optional;
  `.passthrough()` so additive CMS fields don't break parsing (CG-2).
- **List**: items that fail parse are dropped (logged), the list still renders.
- **Detail**: a failed/absent parse → `notFound()` (FR-105). Never render partial `undefined`.
- **Media**: only render `next/image` for allow-listed hosts; otherwise skip/placeholder.
- **Locale**: pass `locale` through (default `en`); the API applies fallback (CG-3).
