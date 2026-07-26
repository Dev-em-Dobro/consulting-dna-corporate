import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo/alternates";
import LegalView from "@/components/views/LegalView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Privacy Policy — Corporate DNA",
    description:
      "How Corporate DNA Consulting collects, uses and protects your personal data.",
    alternates: localeAlternates(locale, "/privacy"),
  };
}
export const revalidate = 300;

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalView cmsKey="privacy" eyebrow="Privacy" fallbackTitle="Privacy Policy" />
  );
}
