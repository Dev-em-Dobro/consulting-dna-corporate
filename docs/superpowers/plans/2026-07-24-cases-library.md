# Cases Library page (`/cases`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new top-level `/cases` route: an editorial vertical list of case studies with client-side search, tag filter and date sort, sourced from the CMS read API.

**Architecture:** A server component (`app/cases/page.tsx`) fetches a rich case-list view model (`getCaseListEntries`, an N+1 over the CMS list + detail endpoints, mirroring the existing `getPeople` pattern) and renders a `PageHero` plus a client "island" (`CasesLibrary`) that owns search/filter/sort state and renders presentational `CaseRow` cards. Cards link to the existing detail route `/solutions/flagship-cases/[slug]`. Additive only — existing pages and nav are untouched.

**Tech Stack:** Next.js 16 App Router (RSC + client components), React 19, Tailwind CSS v4, Zod-validated CMS read API. Design ref: `docs/superpowers/specs/2026-07-24-cases-library-design.md`.

**Verification note:** This repo has **no test runner** (no vitest/jest). The established validation is `npx tsc --noEmit` (type check) plus a live render on `npm run dev` (port 3006). Pure logic (`splitMetric`) is checked with a throwaway `node -e` snippet. Plans below follow that convention instead of a framework-based TDD loop.

**Commit author:** commits in this repo must be authored by `impulseaisolutions@gmail.com` (already the configured git user). Use the co-author trailer shown in each commit step.

---

### Task 1: Data layer — `splitMetric`, `CaseListEntry`, `getCaseListEntries`

**Files:**
- Modify: `lib/cms/map.ts` (add to the `// ---- Cases ----` section, after `getCaseArticle`)

Context already in `map.ts`: `getCases(facets?)` → list result with `.items`; `parseItems<S.CaseListItem>(res.items, S.caseListItem)`; `caseTags(facets)`; `plainText(...)`; and `getCaseArticle(slug)` → `CaseArticle | null` whose shape is `{ slug, tags: string[], title, coverUrl?, body: { challenge?, approach?, outcome?, measurableResult? }, … }`. The list item `S.CaseListItem` carries `publishedAt`, `title`, `coverUrl?`, `facets?`.

- [ ] **Step 1: Add the metric parser (pure function)**

Add near the top of the Cases section in `lib/cms/map.ts`:

```ts
/**
 * Split a free-form `measurableResult` string into a big highlight number and a
 * label, for the /cases card. If the string starts with a token containing a
 * digit (e.g. "90%", "3x", "2.5M", "$4B"), that token is the value and the rest
 * is the label; otherwise the whole string is the label (no big number).
 */
export function splitMetric(text?: string): { value?: string; label?: string } {
  const t = text?.trim();
  if (!t) return {};
  const m = t.match(/^(\S*\d\S*)\s+([\s\S]*)$/);
  if (m) {
    const label = m[2].replace(/^[\s—–:-]+/, "").trim();
    return { value: m[1], label: label || undefined };
  }
  return { label: t };
}
```

- [ ] **Step 2: Verify the parser logic with node**

Run:

```bash
node -e "const re=/^(\S*\d\S*)\s+([\S\s]*)$/;const f=t=>{t=(t||'').trim();if(!t)return{};const m=t.match(re);return m?{value:m[1],label:m[2].replace(/^[\s—–:-]+/,'').trim()||undefined}:{label:t}};console.log(f('90% higher promotion rate for programme participants'));console.log(f('3x faster time to promotion'));console.log(f('Stronger leadership pipeline'));console.log(f(''));console.log(f(undefined));"
```

Expected output:

```
{ value: '90%', label: 'higher promotion rate for programme participants' }
{ value: '3x', label: 'faster time to promotion' }
{ label: 'Stronger leadership pipeline' }
{}
{}
```

- [ ] **Step 3: Add the `CaseListEntry` type**

Add beside the other case types (near `CaseCard` / `CaseArticle`) in `lib/cms/map.ts`:

```ts
export type CaseListEntry = {
  slug: string;
  client: string;        // case title, used as the client name
  tags: string[];        // free tags, else facet-derived
  coverUrl?: string;
  challenge?: string;    // plain text
  metricValue?: string;  // e.g. "90%"
  metricLabel?: string;  // remainder of measurableResult
  publishedAt: string;   // ISO — for date sort
};
```

- [ ] **Step 4: Add the `getCaseListEntries` fetcher**

Add at the end of the Cases section in `lib/cms/map.ts`. This does the N+1 (list, then per-case detail) so cards can show the challenge + metric that the list endpoint omits. A case whose detail fails still renders from its compact list fields.

```ts
/**
 * Rich case list for the /cases library: the compact list (for slug, cover,
 * facets, publishedAt) enriched per-case with the detail entry (challenge,
 * measurableResult, tags). Same N+1 shape as getPeople. A case whose detail
 * fails to load still appears, just without challenge/metric.
 */
export async function getCaseListEntries(): Promise<CaseListEntry[]> {
  const res = await getCases();
  if (!res) return [];
  const items = parseItems<S.CaseListItem>(res.items, S.caseListItem);
  return Promise.all(
    items.map(async (it) => {
      const art = await getCaseArticle(it.slug);
      const metric = splitMetric(art?.body.measurableResult);
      return {
        slug: it.slug,
        client: art?.title || plainText(it.title) || "",
        tags: art?.tags.length ? art.tags : caseTags(it.facets),
        coverUrl: art?.coverUrl ?? it.coverUrl,
        challenge: art?.body.challenge,
        metricValue: metric.value,
        metricLabel: metric.label,
        publishedAt: it.publishedAt,
      };
    }),
  );
}
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add lib/cms/map.ts
git commit -F - <<'EOF'
feat(cases): CaseListEntry view model + getCaseListEntries fetcher

Enriches the compact case list with per-case detail (challenge,
measurableResult→metric, tags) via the same N+1 shape as getPeople.
Adds splitMetric to parse a highlight number out of measurableResult.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
```

---

### Task 2: `CaseRow` presentational card

**Files:**
- Create: `components/cases/CaseRow.tsx`

Renders one case: a branded band (cover image + dark overlay, or solid `bg-ink`) with the client name + tags, then a white body with the challenge excerpt, the metric block, and a "read more here." link to the existing detail route. Sections with no data are omitted.

- [ ] **Step 1: Write the component**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { CaseListEntry } from "@/lib/cms/map";

/** One case in the /cases library list (see the design spec). Presentational. */
export default function CaseRow({ entry }: { entry: CaseListEntry }) {
  const href = `/solutions/flagship-cases/${entry.slug}`;
  return (
    <article className="overflow-hidden border border-line bg-white">
      {/* Branded band: cover behind a dark overlay, or a solid dark band. */}
      <div className="relative isolate flex min-h-[132px] items-end overflow-hidden bg-ink px-6 py-5">
        {entry.coverUrl && (
          <>
            <Image
              src={entry.coverUrl}
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 900px) 820px, 100vw"
              className="-z-10 object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
          </>
        )}
        <div>
          <h2 className="text-[22px] font-bold uppercase leading-tight tracking-[0.5px] text-white">
            {entry.client}
          </h2>
          {entry.tags.length > 0 && (
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-white/70">
              {entry.tags.join(" · ")}
            </p>
          )}
        </div>
      </div>

      {/* Body: challenge → metric → read more. */}
      <div className="px-6 py-7">
        {entry.challenge && (
          <>
            <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[1.5px] text-brand">
              Challenge
            </h3>
            <p className="max-w-[62ch] text-[16px] leading-[1.6] text-muted">
              {entry.challenge}
            </p>
          </>
        )}

        {(entry.metricValue || entry.metricLabel) && (
          <div className="mt-7">
            {entry.metricValue && (
              <p className="text-[40px] font-bold leading-none tracking-[-1px] text-brand">
                {entry.metricValue}
              </p>
            )}
            {entry.metricLabel && (
              <p className="mt-3 max-w-[48ch] text-[16px] leading-[1.5] text-muted">
                {entry.metricLabel}
              </p>
            )}
          </div>
        )}

        <Link
          href={href}
          className="mt-7 inline-block text-[15px] font-semibold text-brand underline underline-offset-4 hover:text-brand-dark"
        >
          read more here.
        </Link>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors (asserts `CaseListEntry` is exported and its fields match Task 1).

- [ ] **Step 3: Commit**

```bash
git add components/cases/CaseRow.tsx
git commit -F - <<'EOF'
feat(cases): CaseRow card — branded band, challenge, metric, read-more

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
```

---

### Task 3: `CasesLibrary` client island (search + filter + sort)

**Files:**
- Create: `components/cases/CasesLibrary.tsx`

Owns the search/filter/sort state and renders the filter bar + the filtered list of `CaseRow`s. All filtering is in-browser over the props.

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useMemo, useState } from "react";
import type { CaseListEntry } from "@/lib/cms/map";
import CaseRow from "./CaseRow";

type Sort = "newest" | "oldest";

/**
 * Client library island for /cases: a search box + a tag ("content") filter + a
 * date sort, over the case list from the server. Filtering/sorting is entirely
 * in-browser; the reference mockup drives the layout.
 */
export default function CasesLibrary({ cases }: { cases: CaseListEntry[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState<Sort>("newest");

  // Unique tag list for the "content" dropdown, alphabetical.
  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of cases) for (const t of c.tags) set.add(t);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [cases]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = cases.filter((c) => {
      if (tag !== "all" && !c.tags.includes(tag)) return false;
      if (!q) return true;
      const hay = [c.client, c.challenge ?? "", c.tags.join(" ")].join(" ").toLowerCase();
      return hay.includes(q);
    });
    const sorted = [...filtered].sort((a, b) => {
      const cmp = a.publishedAt.localeCompare(b.publishedAt);
      return sort === "newest" ? -cmp : cmp;
    });
    return sorted;
  }, [cases, query, tag, sort]);

  return (
    <div>
      {/* Filter bar: search, then the two dropdowns (content / date). */}
      <div className="mb-10 space-y-3">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases"
            aria-label="Search cases"
            className="w-full border border-line bg-paper px-4 py-3 pr-11 text-[15px] text-ink outline-none placeholder:text-muted focus:border-brand"
          />
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            aria-label="Filter by content"
            className="w-full appearance-none border border-line bg-paper px-4 py-3 text-[15px] text-ink outline-none focus:border-brand"
          >
            <option value="all">content</option>
            {tagOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort by date"
            className="w-full appearance-none border border-line bg-paper px-4 py-3 text-[15px] text-ink outline-none focus:border-brand"
          >
            <option value="newest">date — newest</option>
            <option value="oldest">date — oldest</option>
          </select>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="text-[14px] text-muted">No cases match your filters.</p>
      ) : (
        <div className="space-y-8">
          {results.map((c) => (
            <CaseRow key={c.slug} entry={c} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/cases/CasesLibrary.tsx
git commit -F - <<'EOF'
feat(cases): CasesLibrary island — search, tag filter, date sort

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
```

---

### Task 4: `/cases` route

**Files:**
- Create: `app/cases/page.tsx`

Server component: fetches the entries, renders `SiteShell` → `PageHero` → `CasesLibrary` (or `EmptyNotice` when there is no content).

- [ ] **Step 1: Write the route**

```tsx
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import EmptyNotice from "@/components/EmptyNotice";
import CasesLibrary from "@/components/cases/CasesLibrary";
import { getCaseListEntries } from "@/lib/cms/map";

export const metadata: Metadata = {
  title: "Cases — Corporate DNA",
};
export const revalidate = 300;

export default async function CasesPage() {
  const cases = await getCaseListEntries();

  return (
    <SiteShell>
      <PageHero
        title="We were created to deliver results."
        subtitle="Please feel free to see the impact that we have been creating."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          {cases.length === 0 ? (
            <EmptyNotice>No case studies published yet.</EmptyNotice>
          ) : (
            <CasesLibrary cases={cases} />
          )}
        </div>
      </section>
    </SiteShell>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify the route renders**

Run: `npm run dev` (port 3006), then in another shell:

```bash
curl -s -o NUL -w "%{http_code}\n" http://localhost:3006/cases
```

Expected: `200`. (With the CMS running the list is populated; without it, the page still returns 200 and shows the empty notice.)

- [ ] **Step 4: Commit**

```bash
git add app/cases/page.tsx
git commit -F - <<'EOF'
feat(cases): /cases library route with hero + library island

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
EOF
```

---

### Task 5: Manual validation pass

**Files:** none (verification only).

- [ ] **Step 1: Full type check + build**

Run: `npx tsc --noEmit` then `npm run build`
Expected: both succeed; `/cases` appears in the route list.

- [ ] **Step 2: Manual checks against the spec (with the CMS running at the `.env.local` `CMS_URL`)**

On `http://localhost:3006/cases`, confirm:
- Hero shows the title + subtitle.
- Each card: client name + tags on the band; "Challenge" + text; the metric (big number when `measurableResult` starts with one, else just the label); "read more here." → opens `/solutions/flagship-cases/<slug>`.
- Search filters the list live; the "content" dropdown filters by tag; the "date" dropdown reorders newest/oldest.
- A filter combination with no matches shows "No cases match your filters."
- Resize to 375px: layout stays readable (bands, text, filter bar wrap sensibly).
- A case with no cover shows a solid dark band (not a broken image).

- [ ] **Step 3: Note any deviations**

If a check fails, capture it and fix in the relevant task's file before finishing. No commit needed for a clean pass.

---

## Self-Review

**Spec coverage:**
- New `/cases` route → Task 4. ✅
- Editorial vertical list / `CaseRow` band+challenge+metric+read-more → Task 2. ✅
- Search + tag ("content") filter + date sort → Task 3. ✅
- `getCaseListEntries` N+1 + `CaseListEntry` + `splitMetric` → Task 1. ✅
- Empty state / graceful detail-failure / missing cover / missing metric → Tasks 1, 2, 4. ✅
- Links to existing detail route; no nav/existing-page changes (additive) → Tasks 2 & 4 only. ✅
- Known gaps (neutral band overlay instead of per-brand gradient; parsed metric) → implemented as designed in Tasks 1 & 2. ✅

**Placeholder scan:** none — every code step contains complete code and exact commands.

**Type consistency:** `CaseListEntry` fields (`slug, client, tags, coverUrl?, challenge?, metricValue?, metricLabel?, publishedAt`) are defined in Task 1 and consumed identically in Tasks 2–4. `splitMetric` returns `{ value?, label? }`, mapped to `metricValue`/`metricLabel` in Task 1. `getCaseListEntries` returns `Promise<CaseListEntry[]>`, consumed by `CasesLibrary`'s `cases` prop and the route. ✅
