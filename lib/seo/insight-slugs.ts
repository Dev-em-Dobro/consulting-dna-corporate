/**
 * Public URL slug -> CMS slug, for insights whose CMS slug was cut off when it
 * was created. The site publishes the full slug and 308s the old one to it
 * (next.config.mjs); the CMS keeps its own key, so nothing has to change there.
 * SEO review, Nov 2026: "...systems-navigati" looked like a broken URL.
 */
export const INSIGHT_SLUG_ALIASES: Record<string, string> = {
  "why-leadership-development-must-now-teach-systems-awareness-and-systems-navigation":
    "why-leadership-development-must-now-teach-systems-awareness-and-systems-navigati",
};

/** The slug the site links to for a CMS insight slug. */
export function insightPublicSlug(cmsSlug: string) {
  return Object.keys(INSIGHT_SLUG_ALIASES).find((key) => INSIGHT_SLUG_ALIASES[key] === cmsSlug) ?? cmsSlug;
}

/** The CMS slug behind a public insight slug. */
export function insightCmsSlug(publicSlug: string) {
  return INSIGHT_SLUG_ALIASES[publicSlug] ?? publicSlug;
}
