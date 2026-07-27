import { getRequestConfig } from "next-intl/server";

/**
 * Single-locale site (English). next-intl runs WITHOUT i18n routing — there is no
 * `[locale]` segment and no middleware/proxy — so the locale is fixed here rather
 * than negotiated per request. To reintroduce locales, restore `lib/i18n/routing`
 * plus a proxy (Next 16) that calls `createMiddleware(routing)`.
 */
export default getRequestConfig(async () => {
  const locale = "en";
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
