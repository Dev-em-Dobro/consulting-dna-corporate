import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import EmptyNotice from "@/components/EmptyNotice";
import { localeAlternates } from "@/lib/seo/alternates";
import { getSolutionIndexEntries } from "@/lib/cms/map";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Solutions — Corporate DNA",
    description:
      "How Corporate DNA helps senior leaders and their organisations — CEO and executive performance, team alignment, succession and transformation, powered by the 5H® methodology.",
    alternates: localeAlternates("/solutions"),
  };
}
export const revalidate = 300;

/**
 * The Solutions index, led by the outcome (27-08 brief, item 5).
 *
 * The old index was a wall of service names, which asks the reader to already
 * know what each one delivers. Each card now leads with what changes for the
 * client and carries the solution name above it as the label.
 *
 * A solution with no `outcome` authored yet falls back to leading with its name
 * — the pre-brief behaviour — so the index degrades card by card as CDNA
 * re-authors the eight, with no visible placeholder in the meantime. The
 * problem statement is the second line when one exists.
 *
 * The visual system for these (the old site's black boxes / coloured bars in a
 * modern reading) is Guli's; this is structure, not treatment.
 */
export default async function SolutionsPage() {
  const solutions = await getSolutionIndexEntries();

  return (
    <SiteShell footerTopBorder>
      {/* Title follows the brief's rename only. Nothing else here is new copy:
          re-authoring the pages is CDNA's, and inventing a claim is exactly what
          the brief forbids. */}
      <PageHero
        eyebrow="Our Solutions"
        title="Our Solutions"
        subtitle="How we help senior leaders and their organisations."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24">
          {/* 5H is deliberately absent here: it is the methodology behind every
              solution, not one of them, and lives at /approach. */}
          {solutions.length === 0 ? (
            <EmptyNotice>No solutions published yet.</EmptyNotice>
          ) : (
            <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
              {solutions.map((s) => (
                <Link
                  key={s.slug}
                  href={`/solutions/${s.slug}`}
                  className="group flex flex-col bg-white p-8 transition-colors hover:bg-paper"
                >
                  {/* Outcome-led: the service name becomes the label above the
                      promise. Without an outcome, the name is the lead again. */}
                  {s.outcome ? (
                    <>
                      <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-brand">
                        {s.title}
                      </span>
                      <span className="mt-3 text-[21px] font-semibold leading-[1.3] tracking-[-0.4px] text-ink group-hover:text-brand">
                        {s.outcome}
                      </span>
                    </>
                  ) : (
                    <span className="text-[21px] font-semibold leading-[1.3] tracking-[-0.4px] text-ink group-hover:text-brand">
                      {s.title}
                    </span>
                  )}

                  {s.problemStatement && (
                    <span className="mt-3 line-clamp-3 text-[15px] leading-[1.6] text-muted">
                      {s.problemStatement}
                    </span>
                  )}

                  <span className="mt-6 text-brand transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
