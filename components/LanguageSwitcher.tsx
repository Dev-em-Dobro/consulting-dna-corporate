"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";

// Text codes instead of flags — a flag never maps cleanly to a language
// (English isn't "owned" by one country). `code` is what's shown; `label` is
// the accessible name. No geolocation, no cookie auto-redirect (005 FR-312):
// changing language only happens on an explicit click here.
const LOCALES: Record<string, { label: string; code: string }> = {
  en: { label: "English", code: "EN" },
  pt: { label: "Português", code: "PT" },
  es: { label: "Español", code: "ES" },
};

export default function LanguageSwitcher() {
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Language">
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
              "cursor-pointer text-[11.5px] font-semibold uppercase leading-none tracking-[0.6px] transition-opacity duration-200 " +
              (isActive
                ? "underline underline-offset-[6px] opacity-100"
                : "opacity-55 hover:opacity-90")
            }
          >
            {LOCALES[l].code}
          </button>
        );
      })}
    </div>
  );
}
