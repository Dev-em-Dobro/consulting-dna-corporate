import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/Eyebrow";
import EmptyNotice from "@/components/EmptyNotice";
import Counter from "@/components/Counter";
import Reveal from "@/components/Reveal";
import PhotoCarousel from "@/components/PhotoCarousel";
import AwardsMentions from "@/components/AwardsMentions";
import { localeAlternates } from "@/lib/seo/alternates";
import { getSiteStats } from "@/lib/stats";
import { getCaseListEntries } from "@/lib/cms/map";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Impact | CorporateDNA",
    description:
      "The measured outcomes of CorporateDNA's work, firm-level figures and the results behind individual client engagements.",
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
/** Event photography for the Social Impact carousel, same source as elsewhere. */
const SOCIAL_PHOTOS = Array.from({ length: 12 }, (_, i) => i + 13)
  .filter((n) => n !== 14)
  .map((n) => `/dna-time/dna-time-${String(n).padStart(2, "0")}.jpeg`);

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
                <span className="mt-[38px] h-[3px] w-8 flex-none bg-brand md:mt-[50px]" />
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

      {/* ── Our clients say: held, not filled (see the file header) ────── */}
      <section id="testimonials" className="bg-brand text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] sm:text-[34px]">
            Our clients say
          </h2>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-[1.7] text-white/85">
            Awaiting testimonials about CorporateDNA, in the John Murphy /
            Jorge Gardino mould, rather than generic corporate quotes, each
            approved by CDNA before publishing.
          </p>
        </div>
      </section>

      {/* ── Our Social Impact ─────────────────────────────────────────────
          Pulled across from the old site, as in Guli's mock. He deliberately
          did not bring the full copy: "nem vou pegar, porque eles estão falando
          'evitar o scroll em excesso' — e é um textaço" (14:41). This is the
          opening paragraph only, with the carousel treatment he gave the loose
          stills (14:17).

          ⚠️ Old-site copy, not re-approved in this cycle. */}
      <section id="social-impact" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Our Social Impact</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            A force for good, beyond the boardroom.
          </h2>
          <p className="mt-6 max-w-[68ch] text-[17px] leading-[1.7] text-muted">
            CorporateDNA is committed to being a force for good in the world.
            Our mission is to make transformative impact through humanity,
            honesty, and purpose. In acting on our deeply held values of social
            awareness, sustainability, and boldness, we have partnered with
            TERRAGRN, an organisation dedicated to sustainable community-led
            agroforestry.
          </p>
          <div className="mt-10">
            <PhotoCarousel images={SOCIAL_PHOTOS} />
          </div>
        </div>
      </section>

      {/* ── Per-engagement results — the mock's "impact stories" ───────── */}
      <section id="results" className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Measured outcomes</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            What changed, per engagement.
          </h2>

          {measured.length === 0 ? (
            <EmptyNotice className="mt-8">
              No published case carries a measured result yet, the figures
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

      {/* ── Our Awards ────────────────────────────────────────────────────
          Guli moved the awards band here from the homepage: "por último aqui no
          site tem o awards, também puxei o awards pra cá, na mesma disposição
          que a gente já tinha" (17:07). It still renders on the homepage too —
          the brief wants proof early there (item 2), and he never showed a
          homepage mock. Worth confirming whether they want it in both places. */}
      <AwardsMentions />
    </SiteShell>
  );
}
