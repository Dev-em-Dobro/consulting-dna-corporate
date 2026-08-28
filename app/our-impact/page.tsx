import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/Eyebrow";
import EmptyNotice from "@/components/EmptyNotice";
import Counter from "@/components/Counter";
import Reveal from "@/components/Reveal";
import { localeAlternates } from "@/lib/seo/alternates";
import { getSiteStats } from "@/lib/stats";
import { getCaseListEntries } from "@/lib/cms/map";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Impact — Corporate DNA",
    description:
      "The measured outcomes of Corporate DNA's work — firm-level figures and the results behind individual client engagements.",
    alternates: localeAlternates("/our-impact"),
  };
}
export const revalidate = 300;

/**
 * Our Impact (27-08 brief, item 9).
 *
 * The second half of the `Client Impact` split: Our Clients carries the wall and
 * the stories, this page carries the proof — firm-level statistics and the
 * per-engagement numbers already published on the cases.
 *
 * Two deliberate omissions:
 *
 * 1. **No testimonials yet.** The brief is explicit that quotes must be
 *    testimonials about Corporate DNA, not generic client corporate quotes, and
 *    that the existing ones need re-authoring. Surfacing today's quotes on a new
 *    proof page would amplify exactly what the brief asks us to fix, so the slot
 *    is held instead of filled.
 * 2. **No dashboards.** If "dashboards" in the brief means live data
 *    visualisation (filtering by region, industry or year), that is a new build
 *    beyond the agreed scope and is flagged in Part H of the status tracker. If
 *    it means a strong visual treatment of static numbers, it is Guli's pass
 *    over what is already here.
 */
export default async function OurImpactPage() {
  const [stats, cases] = await Promise.all([
    getSiteStats(),
    getCaseListEntries(),
  ]);
  // Only engagements that actually carry a published figure — a proof page that
  // renders blank metrics proves nothing.
  const measured = cases.filter((c) => c.metricValue);

  return (
    <SiteShell>
      <PageHero
        eyebrow="Our Impact"
        title="Leadership change, measured where it matters."
        subtitle="The figures behind the firm, and the results behind individual engagements."
      />

      {/* ── Firm-level figures (editable statistics, from the CMS) ────── */}
      <section id="figures" className="bg-ink text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>By the numbers</Eyebrow>
          <h2 className="max-w-[720px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] sm:text-[34px]">
            Eighteen years of senior leadership advisory.
          </h2>
          <Reveal className="mt-12 grid max-w-[860px] grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            {stats.map((s) => (
              <div key={s.label} className="flex items-start gap-5">
                <span className="mt-[42px] h-[3px] w-8 flex-none bg-brand" />
                <div>
                  <div className="text-[44px] font-bold leading-none tracking-[-1.5px] text-brand md:text-[56px]">
                    <Counter value={s.value} />
                  </div>
                  <div className="mt-2 text-[16px] font-medium leading-snug text-white/80">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Per-engagement results ────────────────────────────────────── */}
      <section id="results" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Measured outcomes</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            What changed, per engagement.
          </h2>

          {measured.length === 0 ? (
            <EmptyNotice className="mt-8">
              No published case carries a measured result yet — the figures
              appear here as cases are authored.
            </EmptyNotice>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {measured.map((c) => (
                <Link
                  key={c.slug}
                  href={`/cases/${c.slug}`}
                  className="group flex flex-col bg-white p-7 transition-colors hover:bg-paper"
                >
                  <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-brand">
                    {c.client}
                  </span>
                  <span className="mt-4 text-[40px] font-bold leading-none tracking-[-1px] text-ink">
                    {c.metricValue}
                  </span>
                  {c.metricLabel && (
                    <span className="mt-3 flex-1 text-[15px] leading-[1.55] text-muted">
                      {c.metricLabel}
                    </span>
                  )}
                  <span className="mt-6 text-[14px] font-semibold text-brand underline underline-offset-4">
                    Read the case
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Testimonials: held, not filled (see the file header) ──────── */}
      <section id="testimonials" className="bg-paper">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>In their words</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            What clients say about working with us.
          </h2>
          <EmptyNotice className="mt-8">
            Awaiting testimonials about Corporate DNA — in the John Murphy /
            Jorge Gardino mould — rather than generic corporate quotes, each
            approved by CDNA before publishing.
          </EmptyNotice>
        </div>
      </section>
    </SiteShell>
  );
}
