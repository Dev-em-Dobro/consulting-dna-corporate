import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import {
  getSolutionCards,
  getCaseCards,
  getInsightCards,
  getRegionCards,
} from "@/lib/cms/map";

export const revalidate = 3600;

// Absolute URL for a root-relative path ("" or "/" = home). Single locale, no
// locale prefix, so paths map 1:1 to the live URLs.
const abs = (path: string) => `${SITE_URL}${path || "/"}`;

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

  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: abs(path),
    changeFrequency: "monthly" as const,
    priority,
  });

  return [
    ...staticPaths.map((p) => entry(p, p === "" ? 1 : 0.7)),
    ...dynamicPaths.map((p) => entry(p, 0.6)),
  ];
}
