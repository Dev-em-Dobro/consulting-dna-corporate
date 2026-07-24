import type { Metadata } from "next";
import LegalView from "@/components/views/LegalView";

export const metadata: Metadata = { title: "Cookie Policy — Corporate DNA" };
export const revalidate = 300;

export default function CookiesPage() {
  return (
    <LegalView cmsKey="cookies" eyebrow="Cookies" fallbackTitle="Cookie Policy" />
  );
}
