import Link from "next/link";
import PageHero from "@/components/PageHero";
import RichText from "@/components/RichText";
import ResourceDownloads from "@/components/ResourceDownloads";
import type { ProofRef, SolutionVM } from "@/lib/cms/map";

/** Attribution line: "Author, Role" — either part optional. */
function attribution(p: ProofRef): string | undefined {
  return [p.author, p.role].filter(Boolean).join(", ") || undefined;
}

/**
 * "Client Perspective" proof block — surfaces the solution's CMS `proofRefs`
 * as attributed client quotes, each optionally linking to its case study.
 * Renders nothing when a solution has no proof (the common case today).
 */
function ClientPerspective({ proofRefs }: { proofRefs: ProofRef[] }) {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-[900px] px-6 py-20 md:px-10 md:py-24">
        <p className="text-[13px] font-semibold uppercase tracking-[1.5px] text-brand">
          Client Perspective
        </p>
        <div className="mt-12 space-y-14">
          {proofRefs.map((p, i) => {
            const cite = attribution(p);
            return (
              <figure key={i}>
                <blockquote className="text-[22px] sm:text-[26px] md:text-[30px] font-medium leading-[1.45] tracking-[-0.3px] text-white [text-wrap:balance]">
                  “{p.quote}”
                </blockquote>
                {(cite || p.caseSlug) && (
                  <figcaption className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {cite && (
                      <cite className="not-italic text-[13px] font-semibold uppercase tracking-[1.5px] text-brand">
                        {cite}
                      </cite>
                    )}
                    {p.caseSlug && (
                      <Link
                        href={`/cases/${p.caseSlug}`}
                        className="text-[13px] font-semibold uppercase tracking-[1.5px] text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
                      >
                        Read the story
                      </Link>
                    )}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * One of the brief's named blocks — a labelled heading over rich text. Renders
 * nothing when the CMS has not authored that block yet, so a partially-filled
 * solution never shows an empty section.
 */
function Block({ label, html }: { label: string; html?: string }) {
  if (!html?.trim()) return null;
  return (
    <div className="border-t border-line pt-10 first:border-t-0 first:pt-0">
      <p className="text-[13px] font-semibold uppercase tracking-[1.5px] text-brand">
        {label}
      </p>
      <RichText html={html} className="mt-5" />
    </div>
  );
}

/**
 * Detail body for a solution. Shared by the live page and the preview route.
 *
 * The 27-08 brief (item 5) fixes the same five blocks for every Solution page,
 * so it answers "Is this the solution to my problem?" without long roadmaps,
 * tool inventories or scoping methodology:
 *
 *   1. The Challenge        — the hero subtitle (`problemStatement`)
 *   2. The Outcome          — `outcome`
 *   3. How CDNA Helps       — `howWeHelp`
 *   4. Evidence             — flagship case + client quotes
 *   5. Start a Conversation — the closing CTA
 */
export default function SolutionView({ s }: { s: SolutionVM }) {
  // Block 5 is a standing element of the structure, not authored copy: when the
  // CMS has no CTA we fall back to the brief's own label and the contact section.
  const ctaHref = s.cta?.href ?? "/#contact";
  const ctaLabel = s.cta?.label ?? "Start a Conversation";
  const hasBody =
    !!s.outcome?.trim() || !!s.howWeHelp?.trim() || !!s.body?.trim();

  return (
    <>
      <PageHero
        // Renamed with the area (27-08 brief, item 3).
        eyebrow="Our Solutions"
        title={s.title}
        subtitle={s.problemStatement}
        bgImageUrl={s.bannerUrl ?? s.coverUrl}
        imageClassName="object-cover object-[center_15%]"
      />

      {hasBody && (
        <section className="bg-white">
          <div className="mx-auto max-w-[820px] space-y-10 px-6 py-20 md:px-10 md:py-24">
            <Block label="The Outcome" html={s.outcome} />
            <Block label="How Corporate DNA Helps" html={s.howWeHelp} />
            {/* Legacy / overflow narrative — unlabelled so it reads as part of
                the page rather than a sixth block the brief did not ask for. */}
            {s.body?.trim() && (
              <div className="border-t border-line pt-10 first:border-t-0 first:pt-0">
                <RichText html={s.body} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Block 4 — Evidence: the flagship case for this solution, then quotes. */}
      {s.flagshipCaseSlug && (
        <section className="bg-paper">
          <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
            <p className="text-[13px] font-semibold uppercase tracking-[1.5px] text-brand">
              Evidence
            </p>
            <Link
              href={`/cases/${s.flagshipCaseSlug}`}
              className="mt-5 inline-block text-[22px] font-bold leading-[1.25] tracking-[-0.5px] text-ink underline-offset-[6px] transition-colors hover:text-brand hover:underline sm:text-[26px]"
            >
              Read the flagship client story →
            </Link>
          </div>
        </section>
      )}

      {s.proofRefs?.length ? <ClientPerspective proofRefs={s.proofRefs} /> : null}

      {/* Block 5 — Start a Conversation. */}
      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 pb-20 md:px-10 md:pb-24">
          <a
            href={ctaHref}
            className="inline-block bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-brand-dark"
          >
            {ctaLabel}
          </a>
        </div>
      </section>

      {s.resources?.length ? <ResourceDownloads resources={s.resources} /> : null}
    </>
  );
}
