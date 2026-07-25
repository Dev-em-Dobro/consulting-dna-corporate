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
    title: "Terms of Service — Corporate DNA",
    alternates: localeAlternates(locale, "/terms"),
  };
}
export const revalidate = 300;

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalView cmsKey="terms" eyebrow="Terms" fallbackTitle="Terms of Service" />
  );
}
