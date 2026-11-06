"use client";

import { COOKIE_SETTINGS_EVENT } from "@/lib/analytics";

export default function CookieSettingsButton({ label }: { label: string }) {
  return <button type="button" className="cursor-pointer text-left hover:underline" onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}>{label}</button>;
}
