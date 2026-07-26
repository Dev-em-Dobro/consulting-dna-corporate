import { defineRouting } from "next-intl/routing";

/**
 * i18n routing (005 FR-309/FR-312). English is currently the ONLY published
 * locale and is served WITHOUT a prefix (`/solutions`). pt/es were retired from
 * the routing set because their content was never translated (the pages served
 * duplicate English), which is a scaled-content / duplicate SEO risk. The
 * retired prefixes are 308-redirected to their English equivalent in
 * `middleware.ts`. To bring a locale back: add it here AND ship real
 * translations for all page content, then drop it from RETIRED_LOCALES.
 */
export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});

/** Locale prefixes we used to serve and now permanently redirect away. */
export const RETIRED_LOCALES = ["pt", "es"];
