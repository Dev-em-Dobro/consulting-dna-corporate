import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import {
  getSolutionCards,
  getCaseCards,
  getInsightCards,
  getRegionCards,
  getPartnerships,
} from "@/lib/cms/map";

export const revalidate = 3600;

// Absolute URL for a root-relative path ("" or "/" = home). Single locale, no
// locale prefix, so paths map 1:1 to the live URLs.
const abs = (path: string) => `${SITE_URL}${path || "/"}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [solutions, cases, insights, regions, partnerships] = await Promise.all([
    getSolutionCards(),
    getCaseCards(),
    getInsightCards(),
    getRegionCards(),
    getPartnerships(),
  ]);

  const staticPaths = [
    "",
    "/our-identity",
    "/approach",
    "/solutions",
    "/solutions/leadership",
    "/solutions/regions",
    "/our-clients",
    "/our-impact",
    "/our-team",
    "/cases",
    "/insights",
    "/awards",
    "/privacy",
    "/cookies",
    "/terms",
    // `/our-partnerships` is added below, only once it has content.
    // `/about` is gone — it 308s to /our-identity (next.config.mjs).
    // `/interviews` is a placeholder and carries `noindex`, so it is not listed.
  ];

  // Our Partnerships is a real route with no content until CDNA validates the
  // copy. It carries `noindex` while empty (see its generateMetadata), so it
  // must stay out of the sitemap until then — the two have to agree.
  if (partnerships.length > 0) staticPaths.push("/our-partnerships");

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
