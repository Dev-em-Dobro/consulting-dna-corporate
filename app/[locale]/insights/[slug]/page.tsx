import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import InsightView from "@/components/views/InsightView";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo/alternates";
import { firstDescription } from "@/lib/seo/description";
import { articleLd, breadcrumbLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/JsonLd";
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
  const title = i ? `${i.title} — Corporate DNA` : "Insight — Corporate DNA";
  const description = firstDescription([i?.body]);
  return {
    title,
    description,
    alternates: localeAlternates(locale, `/insights/${slug}`),
    openGraph: {
      title,
      description,
      type: "article",
      ...(i?.coverUrl ? { images: [i.coverUrl] } : {}),
    },
    ...(i?.coverUrl ? { twitter: { images: [i.coverUrl] } } : {}),
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

  const jsonLd = [
    breadcrumbLd([
      { name: "Insights", path: "/insights" },
      { name: insight.title, path: `/insights/${slug}` },
    ]),
    articleLd({
      headline: insight.title,
      path: `/insights/${slug}`,
      description: firstDescription([insight.body]),
      image: insight.coverUrl,
      author: insight.author,
      datePublished: insight.publishedAt,
    }),
  ];

  return (
    <SiteShell>
      <JsonLd data={jsonLd} />
      <InsightView i={insight} />
    </SiteShell>
  );
}
