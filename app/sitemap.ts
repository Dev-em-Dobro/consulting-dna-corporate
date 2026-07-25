import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/lib/i18n/routing";
import { localePath } from "@/lib/seo/alternates";
import {
  getSolutionCards,
  getCaseCards,
  getInsightCards,
  getRegionCards,
} from "@/lib/cms/map";

export const revalidate = 3600;

// Absolute URL for a locale-relative path ("" = home). Honours the
// as-needed prefix rule (default locale unprefixed) via localePath.
const url = (locale: string, path: string) =>
  `${SITE_URL}${localePath(locale, path || "/")}`;

// hreflang alternates block for a locale-relative path (005 FR-311). Includes
// x-default pointing at the default locale, matching the per-page alternates.
function languages(path: string) {
  const entries: [string, string][] = routing.locales.map((l) => [l, url(l, path)]);
  entries.push(["x-default", url(routing.defaultLocale, path)]);
  return Object.fromEntries(entries) as Record<string, string>;
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
