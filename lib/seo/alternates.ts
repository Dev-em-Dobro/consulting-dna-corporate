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
