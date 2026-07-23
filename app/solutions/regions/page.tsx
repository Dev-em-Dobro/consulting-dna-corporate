import Link from "next/link";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import { getRegionCards } from "@/lib/cms/map";
import { regions as staticRegions } from "@/lib/nav";

export const metadata: Metadata = { title: "Regions — Corporate DNA" };
export const revalidate = 300;

export default async function RegionsPage() {
  const cms = await getRegionCards();
  // Fall back to the known static regions until the CMS has region content.
  const regions =
    cms.length > 0 ? cms : staticRegions.map((r) => ({ slug: r.slug, name: r.name }));

  return (
    <SiteShell>
      <PageHero
        eyebrow="Region pages"
        title="Where we work."
        subtitle="Our presence across key markets."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24">
          <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {regions.map((r) => (
              <Link
                key={r.slug}
                href={`/solutions/regions/${r.slug}`}
                className="group flex items-center justify-between bg-white p-8 transition-colors hover:bg-paper"
              >
                <span className="text-[19px] font-semibold tracking-[-0.3px] text-ink group-hover:text-brand">
                  {r.name}
                </span>
                <span className="text-brand transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
