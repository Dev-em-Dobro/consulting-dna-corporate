import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionView from "@/components/views/SolutionView";
import { localeAlternates } from "@/lib/seo/alternates";
import { firstDescription } from "@/lib/seo/description";
import { serviceLd, breadcrumbLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/JsonLd";
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
  const title = s ? `${s.title} — Corporate DNA` : "Solution — Corporate DNA";
  const description = firstDescription([s?.problemStatement, s?.body]);
  return {
    title,
    description,
    alternates: localeAlternates(`/solutions/${slug}`),
    openGraph: {
      title,
      description,
      ...(s?.coverUrl ? { images: [s.coverUrl] } : {}),
    },
    ...(s?.coverUrl ? { twitter: { images: [s.coverUrl] } } : {}),
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = await getSolution(slug);
  if (!s) notFound();

  const jsonLd = [
    breadcrumbLd([
      { name: "Solutions", path: "/solutions" },
      { name: s.title, path: `/solutions/${slug}` },
    ]),
    serviceLd({
      name: s.title,
      path: `/solutions/${slug}`,
      description: firstDescription([s.problemStatement, s.body]),
    }),
  ];

  return (
    <SiteShell footerTopBorder>
      <JsonLd data={jsonLd} />
      <SolutionView s={s} />
    </SiteShell>
  );
}
