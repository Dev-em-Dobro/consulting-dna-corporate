import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import CaseView from "@/components/views/CaseView";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo/alternates";
import { getCaseArticle, getCaseCards } from "@/lib/cms/map";

export const revalidate = 300;

export async function generateStaticParams() {
  const cases = await getCaseCards();
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const c = await getCaseArticle(slug, locale);
  return {
    title: c ? `${c.title} — Corporate DNA` : "Case study — Corporate DNA",
    alternates: localeAlternates(locale, `/cases/${slug}`),
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const c = await getCaseArticle(slug, locale);
  if (!c) notFound();

  return (
    <SiteShell>
      <CaseView c={c} />
    </SiteShell>
  );
}
