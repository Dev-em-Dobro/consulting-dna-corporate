import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import {
  getSolutionCards,
  getCaseCards,
  getInsightCards,
  getRegionCards,
} from "@/lib/cms/map";

// Refresh hourly; CMS-driven entries are picked up on revalidation.
export const revalidate = 3600;

const url = (path: string) => `${SITE_URL}${path}`;

/**
 * sitemap.xml covering the public routes, including CMS-driven dynamic pages
 * (005 FR-305). Staging/utility routes (/v1, /preview/*) are excluded. If the
 * CMS is unreachable, the dynamic lists come back empty and the static routes
 * still ship — never a broken sitemap.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [solutions, cases, insights, regions] = await Promise.all([
    getSolutionCards(),
    getCaseCards(),
    getInsightCards(),
    getRegionCards(),
  ]);

  const staticRoutes = [
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

  return [
    ...staticRoutes.map((p) => ({
      url: url(p),
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...solutions.map((s) => ({ url: url(`/solutions/${s.slug}`), priority: 0.6 })),
    ...cases.map((c) => ({ url: url(`/cases/${c.slug}`), priority: 0.6 })),
    ...insights.map((i) => ({ url: url(`/insights/${i.slug}`), priority: 0.5 })),
    ...regions.map((r) => ({ url: url(`/solutions/regions/${r.slug}`), priority: 0.4 })),
  ];
}
