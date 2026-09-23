import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo/alternates";
import LegalView from "@/components/views/LegalView";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Cookie Policy | CorporateDNA",
    description:
      "How CorporateDNA Consulting uses cookies and similar technologies on this website.",
    alternates: localeAlternates("/cookies"),
  };
}
export const revalidate = 300;

export default async function CookiesPage() {
  return (
    <LegalView cmsKey="cookies" eyebrow="Cookies" fallbackTitle="Cookie Policy" />
  );
}
