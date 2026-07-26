import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionView from "@/components/views/SolutionView";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo/alternates";
import { getSolution, getSolutionCards } from "@/lib/cms/map";

export const revalidate = 300;

export async function generateStaticParams() {
  const solutions = await getSolutionCards();
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = await getSolution(slug, locale);
  return {
    title: s ? `${s.title} — Corporate DNA` : "Solution — Corporate DNA",
    alternates: localeAlternates(locale, `/solutions/${slug}`),
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const s = await getSolution(slug, locale);
  if (!s) notFound();

  return (
    <SiteShell>
      <SolutionView s={s} />
    </SiteShell>
  );
}
