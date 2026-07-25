"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";

// Flags are cosmetic and can be swapped (EN could be 🇺🇸). PT uses 🇧🇷 (the
// client is Brazilian). No geolocation, no cookie auto-redirect (005 FR-312):
// changing language only happens on an explicit click here.
const LOCALES: Record<string, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇬🇧" },
  pt: { label: "Português", flag: "🇧🇷" },
  es: { label: "Español", flag: "🇪🇸" },
};

export default function LanguageSwitcher() {
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Language">
      {routing.locales.map((l) => {
        const isActive = l === active;
        return (
          <button
            key={l}
            type="button"
            aria-label={LOCALES[l].label}
            aria-current={isActive ? "true" : undefined}
            onClick={() => router.replace(pathname, { locale: l })}
            className={
              "cursor-pointer rounded-sm px-1 text-base leading-none transition-opacity duration-200 " +
              (isActive ? "opacity-100" : "opacity-45 hover:opacity-80")
            }
          >
            <span aria-hidden>{LOCALES[l].flag}</span>
          </button>
        );
      })}
    </div>
  );
}
