import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/Eyebrow";
import EmptyNotice from "@/components/EmptyNotice";
import LogoMarquee from "@/components/LogoMarquee";
import CaseRow from "@/components/cases/CaseRow";
import { localeAlternates } from "@/lib/seo/alternates";
import { clientLogoRows, logoRowDuration } from "@/lib/logos";
import { getCaseListEntries } from "@/lib/cms/map";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Clients — Corporate DNA",
    description:
      "The organisations Corporate DNA advises — a global client wall and the flagship stories behind the work.",
    alternates: localeAlternates("/our-clients"),
  };
}
export const revalidate = 300;

/** How many flagship stories lead the page before the full library link. */
const FLAGSHIP_COUNT = 3;

/**
 * Our Clients (27-08 brief, item 8).
 *
 * The first half of the old single `Client Impact` area, which the brief splits
 * into **Our Clients** (the logo wall for immediate credibility, then the
 * flagship stories) and **Our Impact** (the numbers and proof).
 *
 * The wall reads from `lib/logos.ts`, the same source the homepage band uses —
 * the brief asks for the wall in both places, and two hand-kept arrays would
 * drift. The full faceted library stays at /cases; this page leads with the
 * strongest few and links onward rather than duplicating the filter UI.
 *
 * The visual treatment of the wall is Guli's (item 8); this is the current
 * system, built so his pass is application rather than construction.
 */
export default async function OurClientsPage() {
  const cases = await getCaseListEntries();
  const flagship = cases.slice(0, FLAGSHIP_COUNT);
  const [logoRow1, logoRow2] = clientLogoRows;

  return (
    <SiteShell>
      <PageHero
        eyebrow="Our Clients"
        title="The organisations that trust us with their leadership."
        subtitle="From energy and pharma to luxury and financial services — advisory delivered where the stakes are highest."
      />

      {/* ── The wall: immediate credibility, before any explanation ───── */}
      <section id="wall" className="bg-ink text-white">
        <div className="mx-auto max-w-[1200px] px-6 pb-10 pt-16 md:px-10 md:pt-20">
          <Eyebrow>Client wall</Eyebrow>
          <h2 className="max-w-[720px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] sm:text-[34px]">
            Trusted by organisations operating at global scale.
          </h2>
        </div>
        <div className="flex flex-col gap-5 pb-16 md:pb-20">
          <LogoMarquee logos={logoRow1} duration={logoRowDuration(logoRow1)} />
          <LogoMarquee
            logos={logoRow2}
            duration={logoRowDuration(logoRow2)}
            reverse
          />
        </div>
      </section>

      {/* ── Flagship stories ──────────────────────────────────────────── */}
      <section id="stories" className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Flagship stories</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            What the work looks like in practice.
          </h2>

          {flagship.length === 0 ? (
            <EmptyNotice className="mt-8">
              No case studies published yet.
            </EmptyNotice>
          ) : (
            <div className="mt-10 space-y-8">
              {flagship.map((entry) => (
                <CaseRow key={entry.slug} entry={entry} />
              ))}
            </div>
          )}

          {cases.length > flagship.length && (
            <Link
              href="/cases"
              className="mt-10 inline-flex items-center gap-2 border border-ink px-7 py-3.5 text-[14px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Explore all case studies
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
