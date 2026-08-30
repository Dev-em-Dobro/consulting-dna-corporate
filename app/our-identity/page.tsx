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
 * **Our Team**, and lists seven things this page has to carry: Our Purpose, Our
 * Story, Our Values, Keeping Leadership Real, the London origin story, the
 * founder point of view, and the 5H as part of who we are. Three of those had
 * no section at all; they do now, so the page is the shape the brief describes
 * even while the words are still with CDNA.
 *
 * Anchors from the old /about are kept (#identity, #story, #values, #why) so
 * existing deep links still land on the right block; /about 308s here.
 *
 * **Every block is deliberately empty.** The brief forbids inventing identity
 * claims, so each placeholder states what CDNA has to supply and any constraint
 * the brief puts on it — the London story has to sit inside the company story
 * rather than stand as an isolated founder quote, and the 5H is a reference here
 * with the full explanation staying on Our Approach.
 *
 * Guli did not design this page in the 29-08 pass; it runs on the current
 * system, and items 1 and 16 still apply to it whenever he gets to it.
 */
export default async function OurIdentityPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Our Identity"
        title="Who we are, and why leadership must become real."
        subtitle="Our purpose, our story, what we believe — and the difference that only we can make."
      />

      {/* ── Our Purpose ───────────────────────────────────────────────── */}
      <section id="identity" className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Our Purpose</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            Why Corporate DNA exists.
          </h2>
          <EmptyNotice className="mt-8">
            Purpose statement to be provided by CDNA. The brief asks that it
            preserve the firm’s role as consultants — “cut through complexity,
            connect the present and deliver the truth: real problems and real
            solutions” — which appears nowhere on the site today.
          </EmptyNotice>
        </div>
      </section>

      {/* ── Our Story, with London and the founder inside it ───────────
          Not three sections. The brief is explicit that the London origin story
          "deve entrar naturalmente na company story, não como founder quote
          isolada", so it and the founder's point of view belong in this copy
          rather than in blocks of their own. */}
      <section id="story" className="bg-paper">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Our Story</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            How we came to be.
          </h2>
          <EmptyNotice className="mt-8">
            Our Story copy to be provided by CDNA — the founding, growth and
            milestones of the firm. Two things belong inside this narrative
            rather than beside it: the <strong>London origin story</strong>,
            which the brief asks to be woven into the company story and not left
            as an isolated founder quote, and the{" "}
            <strong>founder’s point of view</strong>.
          </EmptyNotice>
        </div>
      </section>

      {/* ── Our Values ─────────────────────────────────────────────────── */}
      <section id="values" className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Our Values</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            What we believe, and how we work.
          </h2>
          <EmptyNotice className="mt-8">
            Values copy to be provided by CDNA.
          </EmptyNotice>
        </div>
      </section>

      {/* ── Keeping Leadership Real ────────────────────────────────────
          Its own block, and under its own name. The brief lists it separately
          from Our Values, and item 1 makes "Keeping Leadership Real" the site's
          primary proposition — the section used to be called "Keeping It Real",
          which no longer matches the headline the homepage now leads with. */}
      <section id="keeping-leadership-real" className="bg-paper">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Keeping Leadership Real</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            What it means when we say it.
          </h2>
          <EmptyNotice className="mt-8">
            To be provided by CDNA. The homepage now leads on this line; this is
            where it gets explained as part of who the firm is — the brief frames
            it through real pressures, real politics, real choices, real
            judgement, real people and real consequences.
          </EmptyNotice>
        </div>
      </section>

      {/* ── The 5H, as part of who we are ──────────────────────────────
          A reference, not the framework. "O 5H pode ser referenciado aqui como
          parte de who we are, mas a explicação completa permanece em Our
          Approach" — so this block links across rather than repeating the
          explorer that lives there. */}
      <section id="five-h" className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>The 5H®, as part of who we are</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            Our own method, not a borrowed one.
          </h2>
          <EmptyNotice className="mt-8">
            A short identity-level reference to be provided by CDNA — what owning
            the 5H says about the firm. The framework itself is explained on Our
            Approach and is not repeated here.
          </EmptyNotice>
          <Link
            href="/approach"
            className="mt-8 inline-flex items-center gap-2 text-[15px] font-semibold text-brand underline underline-offset-4 hover:text-brand-dark"
          >
            See the 5H® in full
            <span aria-hidden>→</span>
          </Link>
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
