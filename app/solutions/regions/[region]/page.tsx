import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import RegionView from "@/components/views/RegionView";
import { getRegion, getRegionCards } from "@/lib/cms/map";
import { regions as staticRegions } from "@/lib/nav";

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
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const cms = await getRegion(region);
  const name =
    cms?.name ?? staticRegions.find((r) => r.slug === region)?.name;
  return {
    title: name ? `${name} — Corporate DNA` : "Region — Corporate DNA",
    alternates: { canonical: `/solutions/regions/${region}` },
  };
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region } = await params;
  const cms = await getRegion(region);
  const fallback = staticRegions.find((r) => r.slug === region);

  if (!cms && !fallback) notFound();

  const name = cms?.name ?? fallback!.name;

  return (
    <SiteShell>
      <RegionView name={name} city={cms?.city} body={cms?.body} />
    </SiteShell>
  );
}
