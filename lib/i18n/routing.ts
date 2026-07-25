import { defineRouting } from "next-intl/routing";

/**
 * i18n routing (005 FR-309/FR-312): locale URL prefixes with an explicit `en`
 * prefix, English default, and NO geolocation — the site always opens in EN and
 * only changes on explicit user selection via the flag switcher.
 */
export const routing = defineRouting({
  locales: ["en", "pt", "es"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: false,
});
