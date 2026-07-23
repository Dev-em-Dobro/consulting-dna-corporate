import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import InsightView from "@/components/views/InsightView";
import { getInsight, getInsightCards } from "@/lib/cms/map";

export const revalidate = 300;

export async function generateStaticParams() {
  const insights = await getInsightCards();
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const i = await getInsight(slug);
  return { title: i ? `${i.title} — Corporate DNA` : "Insight — Corporate DNA" };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const insight = await getInsight(slug);
  if (!insight) notFound();

  return (
    <SiteShell>
      <InsightView i={insight} />
    </SiteShell>
  );
}
