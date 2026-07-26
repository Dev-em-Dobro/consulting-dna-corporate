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
    title: "Cookie Policy — Corporate DNA",
    description:
      "How Corporate DNA Consulting uses cookies and similar technologies on this website.",
    alternates: localeAlternates(locale, "/cookies"),
  };
}
export const revalidate = 300;

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <LegalView cmsKey="cookies" eyebrow="Cookies" fallbackTitle="Cookie Policy" />
  );
}
