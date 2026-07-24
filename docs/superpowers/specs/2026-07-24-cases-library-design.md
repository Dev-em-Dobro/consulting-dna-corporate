# Design: Cases Library page (`/cases`)

**Date:** 2026-07-24
**Branch:** `feat/cases-library`
**Status:** Approved (brainstorming)
**Reference design:** `Desktop/Web 1920 – 10.jpg` (mobile mockup — editorial vertical list of cases with search + filters)

## Summary

A new top-level route **`/cases`** that serves as the canonical, browsable
library of client case studies. It renders a hero, a search + filter bar, and a
vertical list of rich case cards. Each card shows the client name, tags, a
"Challenge" excerpt, a highlighted result metric, and a "read more here." link to
the existing case detail page.

This route is **additive**: the existing `/solutions/case-library` and
`/solutions/flagship-cases` pages are left untouched, and the site nav is not
changed (per the scoping decision).

## Goals

- A faithful implementation of the reference mockup's editorial-list style.
- Client-side search + tag filter + date sort over the published cases.
- Reuse existing CMS data and the existing case detail route for "read more".

## Non-goals (YAGNI)

- No changes to the CMS content model (the CMS is a separate project).
- No new case detail page — cards link to `/solutions/flagship-cases/[slug]`.
- No removal/redirect of the existing case-library / flagship-cases pages.
- No nav/menu changes.
- No server-side / URL-param filtering — filtering is in-browser only.

## Data

### Source
Cases come from the CMS read API via `lib/cms/map.ts`. Two existing shapes:

- **List item** (`caseListItem`): `slug, title, summary?, coverUrl?, publishedAt,
  facets{ industry, service, region, outcome }`.
- **Detail** (`caseData` → `getCaseArticle`): adds `tags[], challenge,
  measurableResult, …`.

The list endpoint does **not** carry `challenge` or `measurableResult`, which the
card needs. So we fetch detail per case (N+1), mirroring the existing
`getPeople` / `getRegionLocations` pattern already in `map.ts`.

### New view model + mapper
Add to `lib/cms/map.ts`:

```ts
export type CaseListEntry = {
  slug: string;
  client: string;        // = case title
  tags: string[];        // free tags, else facet-derived
  coverUrl?: string;
  challenge?: string;    // plain text
  metricValue?: string;  // e.g. "90%" parsed from measurableResult
  metricLabel?: string;  // remainder of measurableResult
  publishedAt: string;   // ISO — for date sort
};

export async function getCaseListEntries(): Promise<CaseListEntry[]>;
```

`getCaseListEntries()`:
1. `getCases()` → compact list (gives slug, coverUrl, facets, publishedAt).
2. For each item, `getCaseArticle(slug)` for `challenge`, `measurableResult`, `tags`.
3. A case whose detail fails to load still renders from its list fields
   (client + tags + cover), just without challenge/metric (graceful, like `getPeople`).

### Metric parsing
`measurableResult` is a single string. `splitMetric(text)`:
- If the text begins with a short leading token containing a digit (e.g. `"90%"`,
  `"3x"`, `"2.5M"`), that token → `metricValue`; the rest (trimmed, stripped of a
  leading dash/colon) → `metricLabel`.
- Otherwise → `metricValue` undefined, whole string → `metricLabel`.

## Components

### `app/cases/page.tsx` (server component)
- `export const revalidate = 300;` and `metadata` title.
- `const cases = await getCaseListEntries();`
- Renders `SiteShell` → `PageHero` (title "We were created to deliver results.",
  subtitle "Please feel free to see the impact that we have been creating") →
  `CasesLibrary` island → `EmptyNotice` when `cases.length === 0`.

### `components/cases/CasesLibrary.tsx` (client component)
- Props: `{ cases: CaseListEntry[] }`.
- State: `query` (search text), `tag` (selected tag/facet or "all"), `sort`
  (`"newest" | "oldest"`).
- Derives the tag option list from the union of all `cases[].tags`.
- Renders the filter bar: a search input (magnifier icon), a "content" tag
  `<select>`, and a "date" sort `<select>` — matching the mockup's layout.
- Computes the filtered + sorted list with `useMemo`:
  - search matches client/tags/challenge (case-insensitive);
  - tag filter keeps cases containing the selected tag;
  - sort by `publishedAt`.
- Renders `CaseRow` per result; a small "no results" line when the filter empties.

### `components/cases/CaseRow.tsx` (presentational)
- Props: `{ entry: CaseListEntry }`.
- **Band** (top): if `coverUrl`, a `next/image` fill background with a dark
  gradient overlay; else `bg-ink`. Overlaid left: client name (bold, white,
  uppercase) + tags joined `" · "` (uppercase, small). Fixed aspect/height so
  every row's band is consistent.
- **Body** (white): `CHALLENGE` label (brand red, uppercase) + challenge text;
  then the metric block — `metricValue` big/brand-red when present, `metricLabel`
  beneath; then `read more here.` linking to `/solutions/flagship-cases/${slug}`.
- Sections whose data is missing are omitted (no empty labels).

## Data flow

```
app/cases/page.tsx (server)
  → getCaseListEntries()               // CMS read API, N+1 detail fetch, cached 300s
  → <CasesLibrary cases=…>             // client island
      state: query / tag / sort
      → useMemo filter+sort
      → <CaseRow entry=…> per result   // links to /solutions/flagship-cases/[slug]
```

## Error / empty handling

- No published cases → `EmptyNotice` (consistent with the other listing pages).
- Filters exclude everything → inline "No cases match your filters." line.
- A case's detail fetch fails → still listed from its compact fields.
- Missing `coverUrl` → solid `bg-ink` band. Missing `challenge`/metric → omitted.

## Known gaps vs. the mockup (accepted)

- **Per-brand band gradient** (e.g. Shell red): not a CMS field. We use a neutral
  dark overlay over the cover so any client logo/cover stays legible.
- **Structured metric**: the CMS has only a single `measurableResult` string, so
  the big-number/label split relies on `splitMetric` parsing rather than discrete
  fields.

## Testing / validation

- `npx tsc --noEmit` clean.
- `/cases` renders 200; with CMS content, cards show client/tags/challenge/metric;
  search, tag filter, and date sort all work in-browser; "read more" reaches the
  detail page; empty state renders when there are no cases.
- Responsive from 375px (mockup is mobile) through desktop.

## Files

| File | Change |
|------|--------|
| `app/cases/page.tsx` | NEW — route, hero, data fetch, library island |
| `components/cases/CasesLibrary.tsx` | NEW — client filter/search/sort + list |
| `components/cases/CaseRow.tsx` | NEW — presentational case card |
| `lib/cms/map.ts` | EDIT — add `CaseListEntry`, `getCaseListEntries()`, `splitMetric()` |
