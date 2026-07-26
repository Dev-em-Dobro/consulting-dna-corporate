import { routing } from "@/lib/i18n/routing";

/**
 * Root-relative URL for a locale + locale-less path, honouring the
 * `localePrefix: "as-needed"` rule: the default locale has NO prefix
 * (`/solutions`), the others do (`/pt/solutions`). Home ("/") stays "/" for the
 * default locale and "/pt" for the others.
 */
export function localePath(locale: string, path: string) {
  const clean = path === "/" ? "" : path;
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${prefix}${clean}` || "/";
}

/**
 * Canonical + hreflang alternates for a locale-relative path (005 FR-311).
 * `path` is the route WITHOUT the locale prefix, e.g. "/solutions/5h-framework"
 * or "/" for the home page. Values are root-relative; `metadataBase` (set in the
 * locale layout) resolves them to absolute URLs.
 */
export function localeAlternates(locale: string, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, localePath(l, path)])),
      "x-default": localePath(routing.defaultLocale, path),
    },
  };
}
