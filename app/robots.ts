import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * robots policy (005 FR-305/FR-307): allow everything (incl. reputable AI
 * crawlers, for GEO) except the staging/utility routes, and point at the
 * sitemap. Excluded: /v1 (legacy) and /preview/* (draft preview).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/v1", "/preview/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
