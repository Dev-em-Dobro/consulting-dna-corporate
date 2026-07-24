import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import CaseView from "@/components/views/CaseView";
import { getCaseArticle, getCaseCards } from "@/lib/cms/map";

export const revalidate = 300;

export async function generateStaticParams() {
  const cases = await getCaseCards();
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCaseArticle(slug);
  return { title: c ? `${c.title} — Corporate DNA` : "Case study — Corporate DNA" };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await getCaseArticle(slug);
  if (!c) notFound();

  return (
    <SiteShell>
      <CaseView c={c} />
    </SiteShell>
  );
}
