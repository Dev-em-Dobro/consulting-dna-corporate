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
