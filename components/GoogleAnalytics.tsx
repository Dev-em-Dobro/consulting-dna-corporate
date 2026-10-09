"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import {
  COOKIE_ACCEPTED_EVENT,
  COOKIE_CONSENT_KEY,
  GA_MEASUREMENT_ID,
} from "@/lib/analytics";

/**
 * Loads GA4 only after cookie consent is accepted. Same-tab accept fires a
 * custom event; returning visitors with consent already stored load on mount.
 */
export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted") {
        setEnabled(true);
      }
    } catch {
      /* localStorage unavailable */
    }

    const onAccepted = () => setEnabled(true);
    window.addEventListener(COOKIE_ACCEPTED_EVENT, onAccepted);
    return () => window.removeEventListener(COOKIE_ACCEPTED_EVENT, onAccepted);
  }, []);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
