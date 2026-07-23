import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionView from "@/components/views/SolutionView";
import { getSolution, getSolutionCards } from "@/lib/cms/map";

export const revalidate = 300;

export async function generateStaticParams() {
  const solutions = await getSolutionCards();
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = await getSolution(slug);
  return { title: s ? `${s.title} — Corporate DNA` : "Solution — Corporate DNA" };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = await getSolution(slug);
  if (!s) notFound();

  return (
    <SiteShell>
      <SolutionView s={s} />
    </SiteShell>
  );
}
