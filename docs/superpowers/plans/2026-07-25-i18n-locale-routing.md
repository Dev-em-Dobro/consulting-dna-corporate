# i18n Locale Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the site under locale-prefixed URLs (`/en`, `/pt`, `/es`) with `en` as default, a flag language switcher at the top, correct `hreflang`, and locale threaded into CMS detail fetches — content stays English-only (PT/ES fall back to EN via the CMS read API).

**Architecture:** Adopt `next-intl` with `localePrefix: 'always'` and `localeDetection: false`. All public routes move under `app/[locale]/`; a middleware redirects `/` → `/en` and validates locales. Static UI chrome stays English (message catalogs seeded identical across locales, ready to translate later); page content is fetched per-locale from the existing CMS client, which already accepts a `locale` param.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, TypeScript, `next-intl`, Tailwind v4.

**Note on verification:** This repo has **no test framework**. Each task is verified by `npm run build` (full typecheck + build) and, where behavior is observable, a manual dev-server check on `npm run dev` (http://localhost:3006). "Expected: PASS" for a build step means the command exits 0 with no type errors.

**Working branch:** `feat/correcoes-reuniao-24-07` (continue committing here — established workflow, no worktree).

**Task ordering:** Tasks 1, 2, 5, 6, 7 each end on a green build independently. **Tasks 3 → 4 are a consecutive pair**: the structural move (Task 3) leaves page `params` types red until Task 4 updates them, so execute Task 4 immediately after Task 3 before expecting a green build.

---

## File Structure

**New files**
- `lib/i18n/routing.ts` — locale config (`defineRouting`).
- `lib/i18n/navigation.ts` — locale-aware `Link`/`redirect`/`usePathname`/`useRouter` (`createNavigation`).
- `lib/i18n/request.ts` — `getRequestConfig` message loader.
- `lib/seo/alternates.ts` — canonical + `hreflang` builder.
- `messages/en.json`, `messages/pt.json`, `messages/es.json` — chrome message catalogs (identical for now).
- `middleware.ts` — next-intl middleware (repo root).
- `app/[locale]/layout.tsx` — the real HTML shell (`<html lang>`, fonts, providers, chrome).
- `components/LanguageSwitcher.tsx` — flag switcher.

**Moved** (via `git mv`, into `app/[locale]/`)
- `app/page.tsx`, and dirs: `book/`, `terms/`, `privacy/`, `cookies/`, `awards/`, `interviews/`, `insights/`, `cases/`, `solutions/` (all their subtrees).

**Modified**
- `app/layout.tsx` — reduced to a passthrough returning `children`.
- `next.config.mjs` — wrapped with the next-intl plugin.
- Each moved page — add `locale` param, `setRequestLocale`, `generateMetadata` alternates, pass locale to CMS.
- `components/NavV1.tsx`, `components/SiteFooter.tsx`, `components/PagePlaceholder.tsx`, `components/cases/CaseRow.tsx` — swap `next/link` → i18n `Link`.
- `lib/cms/map.ts` — add optional `locale` to detail/page fetchers.
- `app/sitemap.ts` — emit per-locale entries with `hreflang`.

**Untouched (stay outside `[locale]`):** `app/api/*`, `app/preview/*`, `app/v1/*`, `app/actions/*`, `app/robots.ts`, `app/globals.css`. `app/sitemap.ts` stays at `app/` (modified in place).

---

## Task 1: Install next-intl and create i18n config modules

**Files:**
- Modify: `package.json` (add dep)
- Create: `lib/i18n/routing.ts`, `lib/i18n/navigation.ts`, `lib/i18n/request.ts`
- Create: `messages/en.json`, `messages/pt.json`, `messages/es.json`
- Modify: `next.config.mjs`

- [ ] **Step 1: Install the dependency**

Run: `npm install next-intl`
Expected: adds `next-intl` to `dependencies`, exits 0.

- [ ] **Step 2: Create the routing config**

Create `lib/i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";

/**
 * i18n routing (005 FR-309/FR-312): locale URL prefixes with an explicit `en`
 * prefix, English default, and NO geolocation — the site always opens in EN and
 * only changes on explicit user selection via the flag switcher.
 */
export const routing = defineRouting({
  locales: ["en", "pt", "es"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: false,
});
```

- [ ] **Step 3: Create the navigation helpers**

Create `lib/i18n/navigation.ts`:

```ts
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation. `Link` auto-prefixes the active locale, so pages keep
 * writing relative hrefs (`/solutions`) and get `/pt/solutions` for free.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 4: Create the request/message loader**

Create `lib/i18n/request.ts`:

```ts
import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

// Loads the per-locale chrome messages. Unknown/absent locale → defaultLocale.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 5: Seed the message catalogs (chrome stays EN)**

Create `messages/en.json`:

```json
{
  "Nav": {
    "cta": "Start a Conversation"
  },
  "LanguageSwitcher": {
    "label": "Change language"
  }
}
```

Create `messages/pt.json` and `messages/es.json` with the **same content** as `en.json` (PT/ES chrome is English until translations are provided — the file is the seam to fill later, no code change needed).

- [ ] **Step 6: Wrap next.config with the plugin**

Replace `next.config.mjs` with:

```js
import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // CMS media is delivered from the Bunny.net CDN (BUNNY_CDN_URL).
    remotePatterns: [
      { protocol: "https", hostname: "corporate-dna.b-cdn.net" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

export default withNextIntl(nextConfig);
```

- [ ] **Step 7: Verify build still passes**

Run: `npm run build`
Expected: PASS (exit 0). Nothing consumes the config yet; this only proves install + config parse.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json next.config.mjs lib/i18n messages
git commit -m "feat(005): add next-intl config, routing and message seams"
```

---

## Task 2: Thread locale into CMS detail fetchers

Done first (before pages) so the page transforms in Task 4 can pass `locale` without an arity error. The `client.ts` layer already accepts `locale`; `map.ts` detail/page fetchers don't forward it. Add an optional `locale` (default `"en"`) to the getters the dynamic pages call. List getters stay EN for now (list endpoints return minimal cards; locale there is a later CMS concern — documented, not built).

**Files:**
- Modify: `lib/cms/map.ts`

- [ ] **Step 1: Add locale to the detail/page getters**

In `lib/cms/map.ts`, change these five function signatures and their `getEntry`/`getPage` calls:

```ts
export async function getCaseArticle(slug: string, locale = "en"): Promise<CaseArticle | null> {
  const raw = await getEntry("cases", slug, locale);
  return raw ? mapCase(raw) : null;
}

export async function getSolution(slug: string, locale = "en"): Promise<SolutionVM | null> {
  const raw = await getEntry("solutions", slug, locale);
  return raw ? mapSolution(raw) : null;
}

export async function getInsight(slug: string, locale = "en"): Promise<InsightVM | null> {
  const raw = await getEntry("insights", slug, locale);
  return raw ? mapInsight(raw) : null;
}

export async function getRegion(slug: string, locale = "en"): Promise<RegionVM | null> {
  const raw = await getEntry("regions", slug, locale);
  return raw ? mapRegion(raw) : null;
}

export async function getCmsPage(key: string, locale = "en"): Promise<CmsPage | null> {
  const raw = await getPage(key, locale);
  if (!raw) return null;
  const r = S.pageEntry.safeParse(raw);
  if (!r.success) return null;
  return { key: r.data.key, data: r.data.data };
}
```

> `getEntry`/`getPage` in `lib/cms/client.ts` already take `locale = "en"` as their last arg (no client change needed). Callers that don't pass `locale` keep working (default `"en"`). `getRegionLocations`/`getInsightListEntries`/`getCaseListEntries` call these getters without a locale → they keep EN, which is correct for now.

- [ ] **Step 2: Verify build passes**

Run: `npm run build`
Expected: PASS (default args mean existing callers are unaffected).

- [ ] **Step 3: Commit**

```bash
git add lib/cms/map.ts
git commit -m "feat(005): thread locale into CMS detail fetchers (EN fallback)"
```

---

## Task 3: Structural cutover — move routes under [locale], add layouts + middleware

Must land as a unit with Task 4: the middleware redirects `/` → `/en`, which only resolves once the routes live under `app/[locale]/` and the locale layout exists. After this task the build is expected **red** on page `params` typing until Task 4 — verify routing at runtime here, then immediately do Task 4.

**Files:**
- Create: `app/[locale]/layout.tsx`
- Modify: `app/layout.tsx`
- Create: `middleware.ts`
- Move: all public routes into `app/[locale]/`

- [ ] **Step 1: Move all public routes with git mv**

Run (from repo root, PowerShell — create the segment dir first, then move):

```powershell
New-Item -ItemType Directory "app/[locale]" -Force
git mv app/page.tsx "app/[locale]/page.tsx"
git mv app/book "app/[locale]/book"
git mv app/terms "app/[locale]/terms"
git mv app/privacy "app/[locale]/privacy"
git mv app/cookies "app/[locale]/cookies"
git mv app/awards "app/[locale]/awards"
git mv app/interviews "app/[locale]/interviews"
git mv app/insights "app/[locale]/insights"
git mv app/cases "app/[locale]/cases"
git mv app/solutions "app/[locale]/solutions"
```

Expected: `app/api`, `app/preview`, `app/v1`, `app/actions`, `app/layout.tsx`, `app/globals.css`, `app/robots.ts`, `app/sitemap.ts` remain at `app/`; everything else is now under `app/[locale]/`. Pages import via the `@/` alias, so moving them deeper does **not** break imports.

- [ ] **Step 2: Create the locale layout (the real HTML shell)**

Create `app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import "../globals.css";
import "leaflet/dist/leaflet.css";
import CookieConsent from "@/components/CookieConsent";
import TopProgress from "@/components/TopProgress";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_TITLE = "Corporate DNA — Making Leadership Real";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Enables static rendering for this locale segment.
  setRequestLocale(locale);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: `${SITE_URL}/cdna-logo.svg`,
  };

  return (
    <html lang={locale} className={poppins.variable}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <NextIntlClientProvider>
          <TopProgress />
          {children}
          <WhatsAppButton />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Reduce the root layout to a passthrough**

Replace `app/layout.tsx` entirely with:

```tsx
// The real <html>/<body> shell lives in app/[locale]/layout.tsx (next-intl
// documented pattern). This root layout only forwards children.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

- [ ] **Step 4: Create the middleware**

Create `middleware.ts` (repo root):

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on every path except API, staging/utility routes, Next internals, and
  // files with an extension (assets). `/` matches → redirected to `/en`.
  matcher: ["/((?!api|preview|v1|_next|_vercel|.*\\..*).*)"],
};
```

- [ ] **Step 5: Runtime smoke check (build not yet green)**

Run: `npm run dev`, open http://localhost:3006/
Expected: browser lands on `/en`; the home page renders with nav + footer. `/api/...` and `/v1` do **not** get an `/en` prefix. (A `next build` here will still error on page `params` types — that is fixed in Task 4. Do not commit until Task 4 lands the green build; commit Task 3 + Task 4 together in Step 6 of Task 4.)

---

## Task 4: Thread locale + setRequestLocale + hreflang into every page

Completes the cutover started in Task 3. Add the `hreflang` helper, then apply a uniform transform to each moved page: add `locale` to `params`, call `setRequestLocale(locale)`, and add/extend `generateMetadata` with per-locale canonical + alternates.

**Files:**
- Create: `lib/seo/alternates.ts`
- Modify: every page under `app/[locale]/` (enumerated below)

- [ ] **Step 1: Create the alternates helper**

Create `lib/seo/alternates.ts`:

```ts
import { routing } from "@/lib/i18n/routing";

/**
 * Canonical + hreflang alternates for a locale-relative path (005 FR-311).
 * `path` is the route WITHOUT the locale prefix, e.g. "/solutions/5h-framework"
 * or "/" for the home page. Values are root-relative; `metadataBase` (set in the
 * locale layout) resolves them to absolute URLs.
 */
export function localeAlternates(locale: string, path: string) {
  const clean = path === "/" ? "" : path;
  return {
    canonical: `/${locale}${clean}`,
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${clean}`])),
      "x-default": `/${routing.defaultLocale}${clean}`,
    },
  };
}
```

- [ ] **Step 2: Transform each static page (no existing params)**

For every page in the table below that currently takes **no** `params`, apply this exact transform. Example — `app/[locale]/book/page.tsx` gains a metadata export and reads locale in the component:

```tsx
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo/alternates";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: localeAlternates(locale, "/book") };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // ...existing body unchanged...
}
```

> If a page already exports a `metadata` object (e.g. a title), convert it to `generateMetadata` and merge: `return { ...existingFields, alternates: localeAlternates(locale, PATH) };`. If a page already exports `generateMetadata`, just add `alternates: localeAlternates(locale, PATH)` to its returned object and read `locale` from `params`. If a static page's component is currently non-`async` and takes no props, make it `async` and add the `params` arg as shown.

Apply to each page with its exact `PATH`:

| Page file (`app/[locale]/…`) | `PATH` for `localeAlternates` |
|---|---|
| `page.tsx` (home) | `/` |
| `book/page.tsx` | `/book` |
| `awards/page.tsx` | `/awards` |
| `interviews/page.tsx` | `/interviews` |
| `terms/page.tsx` | `/terms` |
| `privacy/page.tsx` | `/privacy` |
| `cookies/page.tsx` | `/cookies` |
| `insights/page.tsx` | `/insights` |
| `cases/page.tsx` | `/cases` |
| `solutions/page.tsx` | `/solutions` |
| `solutions/5h-framework/page.tsx` | `/solutions/5h-framework` |
| `solutions/leadership/page.tsx` | `/solutions/leadership` |
| `solutions/regions/page.tsx` | `/solutions/regions` |

- [ ] **Step 3: Transform each dynamic page (has a slug param)**

For dynamic pages, add `locale` alongside the existing param, call `setRequestLocale`, set alternates to the slug-specific path, and pass `locale` to the CMS getter (signatures added in Task 2). Example — `app/[locale]/solutions/[slug]/page.tsx`:

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = await getSolution(slug, locale);
  return {
    title: s ? `${s.title} — Corporate DNA` : "Solution — Corporate DNA",
    alternates: localeAlternates(locale, `/solutions/${slug}`),
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const s = await getSolution(slug, locale);
  if (!s) notFound();
  return (
    <SiteShell>
      <SolutionView s={s} />
    </SiteShell>
  );
}
```

Add the imports `import { setRequestLocale } from "next-intl/server";` and `import { localeAlternates } from "@/lib/seo/alternates";` to each. Apply to each dynamic page:

| Dynamic page | alternates path | CMS getter (pass `locale`) |
|---|---|---|
| `solutions/[slug]/page.tsx` | `/solutions/${slug}` | `getSolution(slug, locale)` |
| `insights/[slug]/page.tsx` | `/insights/${slug}` | `getInsight(slug, locale)` |
| `cases/[slug]/page.tsx` | `/cases/${slug}` | `getCaseArticle(slug, locale)` |
| `solutions/regions/[region]/page.tsx` | `/solutions/regions/${region}` | `getRegion(region, locale)` |

> Leave each dynamic page's existing `generateStaticParams` untouched — Next composes it with the parent locale params, generating locale×slug pages. `notFound()` from `next/navigation` stays as-is (not locale-specific).

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: PASS, no type errors about `locale`; the build output lists `en`/`pt`/`es` variants of each route.

- [ ] **Step 5: Manual check — hreflang present**

Run `npm run dev`, open http://localhost:3006/en, view source `<head>`.
Expected: `<link rel="canonical" href=".../en">`, three `<link rel="alternate" hreflang="en|pt|es">`, and one `hreflang="x-default"`.

- [ ] **Step 6: Commit (Task 3 + Task 4 together)**

```bash
git add -A
git commit -m "feat(005): locale-prefixed routing — shell, middleware, per-page hreflang"
```

---

## Task 5: Swap internal links to locale-aware Link

**Files:**
- Modify: `components/NavV1.tsx`, `components/SiteFooter.tsx`, `components/PagePlaceholder.tsx`, `components/cases/CaseRow.tsx`
- Modify: `app/[locale]/insights/page.tsx`, `app/[locale]/solutions/page.tsx`, `app/[locale]/solutions/regions/page.tsx`, `app/[locale]/solutions/5h-framework/page.tsx`

- [ ] **Step 1: Replace the import in each of the 8 files**

Change:

```tsx
import Link from "next/link";
```

to:

```tsx
import { Link } from "@/lib/i18n/navigation";
```

The `Link` API is the same (`href`, `className`, `onClick`, children). Relative hrefs like `/solutions` now auto-prefix the active locale.

- [ ] **Step 2: Convert raw hash anchors in NavV1 to Link**

In `components/NavV1.tsx`, the two `<a href="/#contact">…</a>` (desktop CTA and mobile CTA) become locale-aware. Replace each `<a href="/#contact" …>…</a>` with `<Link href="/#contact" …>…</Link>` (keep all existing className/onClick attributes). This keeps the contact CTA inside the current locale.

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Manual check — links carry the locale**

Run `npm run dev`, open http://localhost:3006/pt. Click a nav link (e.g. Insights).
Expected: URL stays under `/pt` (e.g. `/pt/insights`), not `/insights`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(005): route internal links through locale-aware Link"
```

---

## Task 6: Language switcher (flags) in the header

**Files:**
- Create: `components/LanguageSwitcher.tsx`
- Modify: `components/NavV1.tsx`

- [ ] **Step 1: Create the switcher**

Create `components/LanguageSwitcher.tsx`:

```tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";

// Flags are cosmetic and can be swapped (EN could be 🇺🇸). PT uses 🇧🇷 (the
// client is Brazilian). No geolocation, no cookie auto-redirect (005 FR-312):
// changing language only happens on an explicit click here.
const LOCALES: Record<string, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇬🇧" },
  pt: { label: "Português", flag: "🇧🇷" },
  es: { label: "Español", flag: "🇪🇸" },
};

export default function LanguageSwitcher() {
  const active = useLocale();
  const pathname = usePathname(); // locale-less path (next-intl)
  const router = useRouter();

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Language">
      {routing.locales.map((l) => {
        const isActive = l === active;
        return (
          <button
            key={l}
            type="button"
            aria-label={LOCALES[l].label}
            aria-current={isActive ? "true" : undefined}
            onClick={() => router.replace(pathname, { locale: l })}
            className={
              "cursor-pointer rounded-sm px-1 text-base leading-none transition-opacity duration-200 " +
              (isActive ? "opacity-100" : "opacity-45 hover:opacity-80")
            }
          >
            <span aria-hidden>{LOCALES[l].flag}</span>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Mount it in the desktop nav**

In `components/NavV1.tsx`, add the import:

```tsx
import LanguageSwitcher from "@/components/LanguageSwitcher";
```

Then, inside the desktop `<nav className="hidden … md:flex">`, immediately after the closing tag of the "Start a Conversation" CTA (still inside the `<nav>`), add:

```tsx
<LanguageSwitcher />
```

- [ ] **Step 3: Mount it in the mobile panel**

In the mobile `<nav id="v1-mobile-nav" …>`, after the mobile CTA element, add inside the same container:

```tsx
<div className="mt-4 flex justify-center">
  <LanguageSwitcher />
</div>
```

- [ ] **Step 4: Verify build passes**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 5: Manual check — switching works**

Run `npm run dev`, open http://localhost:3006/en/insights. Click the 🇧🇷 flag.
Expected: URL becomes `/pt/insights`, page still renders, active flag is now PT (others dimmed). Click 🇪🇸 → `/es/insights`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat(005): flag language switcher in the header"
```

---

## Task 7: Per-locale sitemap with hreflang

**Files:**
- Modify: `app/sitemap.ts`
- Verify (no change expected): `app/robots.ts`

- [ ] **Step 1: Emit each route once per locale with hreflang alternates**

Replace `app/sitemap.ts` with:

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/lib/i18n/routing";
import {
  getSolutionCards,
  getCaseCards,
  getInsightCards,
  getRegionCards,
} from "@/lib/cms/map";

export const revalidate = 3600;

// Absolute URL for a locale-relative path ("" = home).
const url = (locale: string, path: string) => `${SITE_URL}/${locale}${path}`;

// hreflang alternates block for a locale-relative path (005 FR-311).
function languages(path: string) {
  return Object.fromEntries(
    routing.locales.map((l) => [l, url(l, path)]),
  ) as Record<string, string>;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [solutions, cases, insights, regions] = await Promise.all([
    getSolutionCards(),
    getCaseCards(),
    getInsightCards(),
    getRegionCards(),
  ]);

  const staticPaths = [
    "",
    "/solutions",
    "/solutions/5h-framework",
    "/solutions/leadership",
    "/solutions/regions",
    "/cases",
    "/insights",
    "/book",
    "/awards",
    "/privacy",
    "/cookies",
    "/terms",
  ];

  const dynamicPaths = [
    ...solutions.map((s) => `/solutions/${s.slug}`),
    ...cases.map((c) => `/cases/${c.slug}`),
    ...insights.map((i) => `/insights/${i.slug}`),
    ...regions.map((r) => `/solutions/regions/${r.slug}`),
  ];

  const entryFor = (path: string, priority: number): MetadataRoute.Sitemap =>
    routing.locales.map((locale) => ({
      url: url(locale, path),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: languages(path) },
    }));

  return [
    ...staticPaths.flatMap((p) => entryFor(p, p === "" ? 1 : 0.7)),
    ...dynamicPaths.flatMap((p) => entryFor(p, 0.6)),
  ];
}
```

- [ ] **Step 2: Confirm robots is still correct**

Read `app/robots.ts`. Expected: no change needed — `disallow: ["/v1", "/preview/"]` still holds (those routes never gained a locale prefix), and the sitemap ref is unchanged.

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: PASS.

- [ ] **Step 4: Manual check — sitemap**

Run `npm run dev`, open http://localhost:3006/sitemap.xml.
Expected: every route appears 3× (`/en/...`, `/pt/...`, `/es/...`), each with `<xhtml:link rel="alternate" hreflang=…>` entries; `/v1` and `/preview` absent.

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts
git commit -m "feat(005): per-locale sitemap with hreflang alternates"
```

---

## Task 8: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Clean production build**

Run: `npm run build`
Expected: PASS, 0 type errors, all `[locale]` routes listed in the build output for `en`/`pt`/`es`.

- [ ] **Step 2: Runtime checklist on `npm run dev`**

Confirm each:
- `/` → redirect to `/en` (single hop).
- `/en`, `/pt`, `/es` all render the home page (PT/ES with English content).
- `<html lang>` reflects the active locale (`en`/`pt`/`es`) in each.
- `<head>` on any page has canonical + 3 `hreflang` + `x-default`.
- Flag switcher changes locale and preserves the current path.
- `/api/*`, `/v1`, `/preview/*` have **no** locale prefix and still resolve/redirect as before.
- A dynamic page (e.g. `/en/insights/<a-real-slug>`) renders; the same slug under `/pt/...` renders (EN fallback).

- [ ] **Step 3: Update the status doc**

In `docs/CORRECOES-24-07-STATUS.md`, move the i18n item from "🟢 Falta" to "✅ Feito" with a one-line note (next-intl prefix routing + flag switcher + hreflang; content translation still pending CMS). Commit:

```bash
git add docs/CORRECOES-24-07-STATUS.md
git commit -m "docs: mark i18n prefix routing done"
```

---

## Out of scope (explicitly deferred)

- Translating chrome strings to PT/ES (`messages/pt.json`, `messages/es.json` are the ready seams).
- Translated content in the CMS (`corporate-dna-cms`, see `specs/cms-tarefas.md`).
- The 301 redirect map (awaits the client's old-URL list — `specs/005 … research.md` D2).
- Locale on CMS **list** endpoints (cards are minimal; revisit with `010`).
