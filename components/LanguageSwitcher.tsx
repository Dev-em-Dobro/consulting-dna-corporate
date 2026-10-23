"use client";

import { useEffect, useState } from "react";

type Locale = "en" | "pt-BR";

function Flag({ country }: { country: "br" | "gb" }) {
  return country === "br" ? (
    <svg aria-hidden="true" viewBox="0 0 20 14" width="20" height="14" className="mr-1 inline-block align-[-2px]" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="14" rx="1" fill="#169B45" />
      <path d="M10 1.5 18.5 7 10 12.5 1.5 7Z" fill="#FFDF00" />
      <circle cx="10" cy="7" r="3" fill="#002776" />
      <path d="M7.2 6.3c1.5-.3 3.6.1 5.5 1.1" fill="none" stroke="#fff" strokeWidth=".65" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 14" width="20" height="14" className="mr-1 inline-block align-[-2px]" xmlns="http://www.w3.org/2000/svg">
      <rect width="20" height="14" rx="1" fill="#012169" />
      <path d="M0 0 20 14M20 0 0 14" stroke="#fff" strokeWidth="3" />
      <path d="M0 0 20 14M20 0 0 14" stroke="#C8102E" strokeWidth="1.4" />
      <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4.2" />
      <path d="M10 0v14M0 7h20" stroke="#C8102E" strokeWidth="2.2" />
    </svg>
  );
}

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    setLocale(document.cookie.match(/(?:^|;\s*)site_locale=([^;]+)/)?.[1] === "pt-BR" ? "pt-BR" : "en");
  }, []);

  const select = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `site_locale=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  return (
    <div data-no-translate className={`inline-flex shrink-0 items-center gap-1 ${className}`} role="group" aria-label="Language / Idioma">
      <button
        type="button"
        aria-label="Português do Brasil"
        aria-pressed={locale === "pt-BR"}
        onClick={() => select("pt-BR")}
        className={`cursor-pointer rounded-sm border px-1.5 py-1 text-[11px] leading-none transition-opacity hover:opacity-100 ${locale === "pt-BR" ? "border-current opacity-100" : "border-current/40 opacity-65"}`}
      >
        <Flag country="br" />PT
      </button>
      <button
        type="button"
        aria-label="English"
        aria-pressed={locale === "en"}
        onClick={() => select("en")}
        className={`cursor-pointer rounded-sm border px-1.5 py-1 text-[11px] leading-none transition-opacity hover:opacity-100 ${locale === "en" ? "border-current opacity-100" : "border-current/40 opacity-65"}`}
      >
        <Flag country="gb" />EN
      </button>
    </div>
  );
}
