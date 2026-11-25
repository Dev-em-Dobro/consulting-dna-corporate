import { SITE_NAME } from "@/lib/site";

/**
 * Canonical URL for a route on this single-locale (English) site. With one locale
 * and no locale prefix there are no hreflang alternates, so page metadata simply
 * points a route at itself. `path` is root-relative, e.g. "/approach"
 * or "/" for the home page; `metadataBase` (set in the root layout) resolves it to
 * an absolute URL.
 */
export function localeAlternates(path: string) {
  return { canonical: path || "/" };
}

/**
 * Fills a page's Open Graph and Twitter tags from its own title, description
 * and canonical path. Without this, pages that set only `title`/`description`
 * inherit the root layout's social tags, so every LinkedIn share showed the
 * home page's URL and the generic site title (SEO review, Nov 2026).
 */
export function withPageSocial<T extends { title?: unknown; description?: unknown; alternates?: { canonical?: unknown } | null }>(meta: T) {
  const title = typeof meta.title === "string" ? meta.title : undefined;
  const description = typeof meta.description === "string" ? meta.description : undefined;
  const url = typeof meta.alternates?.canonical === "string" ? meta.alternates.canonical : undefined;
  const image = { url: "/og-share.png", width: 1200, height: 630, alt: "CorporateDNA: Global Leadership Advisory & Executive Coaching" };
  return {
    ...meta,
    openGraph: { type: "website" as const, siteName: SITE_NAME, url, title, description, images: [image] },
    twitter: { card: "summary_large_image" as const, title, description, images: [image.url] },
  };
}
