import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import InsightView from "@/components/views/InsightView";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo/alternates";
import { getInsight, getInsightCards } from "@/lib/cms/map";

export const revalidate = 300;

export async function generateStaticParams() {
  const insights = await getInsightCards();
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const i = await getInsight(slug, locale);
  return {
    title: i ? `${i.title} — Corporate DNA` : "Insight — Corporate DNA",
    alternates: localeAlternates(locale, `/insights/${slug}`),
  };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const insight = await getInsight(slug, locale);
  if (!insight) notFound();

  return (
    <SiteShell>
      <InsightView i={insight} />
    </SiteShell>
  );
}
