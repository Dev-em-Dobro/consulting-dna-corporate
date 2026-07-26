import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import RegionView from "@/components/views/RegionView";
import { getRegion, getRegionCards } from "@/lib/cms/map";
import { regions as staticRegions } from "@/lib/nav";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo/alternates";
import { firstDescription } from "@/lib/seo/description";

export const revalidate = 300;

export async function generateStaticParams() {
  const cms = await getRegionCards();
  const slugs = new Set([
    ...staticRegions.map((r) => r.slug),
    ...cms.map((r) => r.slug),
  ]);
  return [...slugs].map((region) => ({ region }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; region: string }>;
}): Promise<Metadata> {
  const { locale, region } = await params;
  const cms = await getRegion(region, locale);
  const name =
    cms?.name ?? staticRegions.find((r) => r.slug === region)?.name;
  const title = name ? `${name} — Corporate DNA` : "Region — Corporate DNA";
  const description =
    firstDescription([cms?.body]) ??
    (name
      ? `Corporate DNA's leadership advisory and executive coaching in ${name} — global insight with local delivery.`
      : undefined);
  return {
    title,
    description,
    alternates: localeAlternates(locale, `/solutions/regions/${region}`),
    openGraph: {
      title,
      description,
      ...(cms?.coverUrl ? { images: [cms.coverUrl] } : {}),
    },
    ...(cms?.coverUrl ? { twitter: { images: [cms.coverUrl] } } : {}),
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ locale: string; region: string }>;
}) {
  const { locale, region } = await params;
  setRequestLocale(locale);
  const cms = await getRegion(region, locale);
  const fallback = staticRegions.find((r) => r.slug === region);

  if (!cms && !fallback) notFound();

  const name = cms?.name ?? fallback!.name;

  return (
    <SiteShell>
      <RegionView name={name} city={cms?.city} body={cms?.body} />
    </SiteShell>
  );
}
