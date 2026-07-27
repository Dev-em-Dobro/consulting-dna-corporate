import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo/alternates";
import LegalView from "@/components/views/LegalView";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Privacy Policy — Corporate DNA",
    description:
      "How Corporate DNA Consulting collects, uses and protects your personal data.",
    alternates: localeAlternates("/privacy"),
  };
}
export const revalidate = 300;

export default async function PrivacyPage() {
  return (
    <LegalView cmsKey="privacy" eyebrow="Privacy" fallbackTitle="Privacy Policy" />
  );
}
