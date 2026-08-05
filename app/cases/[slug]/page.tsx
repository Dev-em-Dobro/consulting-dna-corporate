import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import CaseView from "@/components/views/CaseView";
import { localeAlternates } from "@/lib/seo/alternates";
import { firstDescription } from "@/lib/seo/description";
import { articleLd, breadcrumbLd } from "@/lib/seo/jsonld";
import JsonLd from "@/components/JsonLd";
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
  const title = c ? `${c.title} — Corporate DNA` : "Case study — Corporate DNA";
  const description = firstDescription([c?.intro]);
  return {
    title,
    description,
    alternates: localeAlternates(`/cases/${slug}`),
    openGraph: {
      title,
      description,
      type: "article",
      ...(c?.coverUrl ? { images: [c.coverUrl] } : {}),
    },
    ...(c?.coverUrl ? { twitter: { images: [c.coverUrl] } } : {}),
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = await getCaseArticle(slug);
  if (!c) notFound();

  const jsonLd = [
    breadcrumbLd([
      { name: "Client Impact", path: "/cases" },
      { name: c.title, path: `/cases/${slug}` },
    ]),
    articleLd({
      headline: c.title,
      path: `/cases/${slug}`,
      description: firstDescription([c.intro]),
      image: c.coverUrl,
    }),
  ];

  return (
    <SiteShell footerTopBorder>
      <JsonLd data={jsonLd} />
      <CaseView c={c} />
    </SiteShell>
  );
}
