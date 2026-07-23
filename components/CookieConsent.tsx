"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cdna-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* localStorage unavailable — don't block the page */
    }
  }, []);

  const decide = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[9999] border-t border-white/10 bg-ink text-white"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-10">
        <p className="max-w-[720px] text-[13.5px] leading-relaxed text-white/80">
          We use cookies to improve your experience and analyse site usage. By
          clicking “Accept”, you consent to our use of cookies.
        </p>
        <div className="flex flex-none gap-3">
          <button
            type="button"
            onClick={() => decide("declined")}
            className="cursor-pointer border border-white/30 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:border-white/60"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="cursor-pointer bg-brand px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[1px] text-white transition-colors hover:bg-brand-dark"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
