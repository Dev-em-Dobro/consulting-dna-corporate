import { defineRouting } from "next-intl/routing";

/**
 * i18n routing (005 FR-309/FR-312). English is the default and is served
 * WITHOUT a locale prefix (`/solutions`); the other locales are prefixed
 * (`/pt/...`, `/es/...`) and ready for when their content lands. No
 * geolocation — the site always opens in English and only changes on explicit
 * user selection via the language switcher.
 */
export const routing = defineRouting({
  locales: ["en", "pt", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});
