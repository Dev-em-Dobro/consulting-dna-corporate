"use client";

import { COOKIE_SETTINGS_EVENT } from "@/lib/analytics";

export default function CookieSettingsButton({ label, className = "hover:text-white" }: { label: string; className?: string }) {
  return <button type="button" className={`cursor-pointer border-0 bg-transparent p-0 text-left text-inherit ${className}`} onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT))}>{label}</button>;
}
