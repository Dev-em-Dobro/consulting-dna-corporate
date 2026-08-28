import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/Eyebrow";
import EmptyNotice from "@/components/EmptyNotice";
import { localeAlternates } from "@/lib/seo/alternates";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Identity — Corporate DNA",
    description:
      "Who Corporate DNA is, how the firm came to be, what it believes and the difference it makes — the identity behind a global leadership advisory.",
    alternates: localeAlternates("/our-identity"),
  };
}
export const revalidate = 300;

/**
 * Our Identity (27-08 brief, item 4).
 *
 * The brief splits the old single `About` area into **Our Identity** and
 * **Our Team**. These four sections moved here from `/about` unchanged, keeping
 * their anchors (#identity, #story, #values, #why) so any existing deep link
 * still lands on the right block; `/about` now 308s to this page.
 *
 * The copy is still the CDNA placeholder it has been since the 05-08 cycle —
 * the brief forbids inventing identity claims, so the split moves the sections,
 * it does not fill them. The 5H sits here only as an identity reference; the
 * full explanation stays on Our Approach, as the brief asks.
 *
 * Visual treatment is Guli's (items 1 and 16); this runs on the current system.
 */
export default async function OurIdentityPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Our Identity"
        title="Who we are, and why leadership must become real."
        subtitle="Our purpose, our story, what we believe — and the difference that only we can make."
      />

      {/* ── Who We Are / Our Identity ─────────────────────────────────── */}
      <section id="identity" className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Who We Are / Our Identity</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            Corporate DNA — a global leadership advisory.
          </h2>
          <EmptyNotice className="mt-8">
            Identity copy to be provided by CDNA. This section will introduce who
            Corporate DNA is and what the firm stands for.
          </EmptyNotice>
        </div>
      </section>

      {/* ── Our Story ─────────────────────────────────────────────────── */}
      <section id="story" className="bg-paper">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Our Story</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            How we came to be.
          </h2>
          <EmptyNotice className="mt-8">
            Our Story copy to be provided by CDNA — the founding, growth and
            milestones of the firm.
          </EmptyNotice>
        </div>
      </section>

      {/* ── Our Values & "Keeping It Real" ────────────────────────────── */}
      <section id="values" className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Our Values &amp; “Keeping It Real”</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            What we believe, and how we work.
          </h2>
          <EmptyNotice className="mt-8">
            Values and “Keeping It Real” copy to be provided by CDNA.
          </EmptyNotice>
        </div>
      </section>

      {/* ── Why We Are Different ───────────────────────────────────────
          The final language is being developed by Rhea, JP, Nitin and G — per
          the 05-08 brief we hold a placeholder and do NOT invent the claim. */}
      <section id="why" className="bg-ink text-white">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Why We Are Different</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] sm:text-[34px]">
            The difference that only we can make.
          </h2>
          <div className="mt-8 flex items-center gap-4 border border-dashed border-white/25 bg-white/5 px-7 py-6 text-[13.5px] text-white/70">
            <span className="inline-block h-2 w-2 flex-none rounded-full bg-brand" />
            Final “Why We Are Different” language is in development with Rhea, JP
            and Nitin. Placeholder only — no claim has been written here.
          </div>
        </div>
      </section>

      {/* ── Where the rest of the old About area went ──────────────────
          The team, faculty and global presence now have their own page, so a
          visitor landing here from an /about link can still reach them. */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>The people behind it</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            Identity is what the team does under pressure.
          </h2>
          <p className="mt-5 max-w-[620px] text-[17px] leading-[1.7] text-muted">
            Our leadership, our global faculty and the regions we deliver from
            now have an area of their own.
          </p>
          <Link
            href="/our-team"
            className="mt-8 inline-flex items-center gap-2 border border-ink px-7 py-3.5 text-[14px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            Meet the team
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
