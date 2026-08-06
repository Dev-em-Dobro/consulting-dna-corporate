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

/** Detail body for a solution. Shared by the live page and the preview route. */
export default function SolutionView({ s }: { s: SolutionVM }) {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title={s.title}
        subtitle={s.problemStatement}
        bgImageUrl={s.bannerUrl ?? s.coverUrl}
        imageClassName="object-cover object-[center_15%]"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-20 md:px-10 md:py-24">
          <RichText html={s.body} />
          {s.cta?.href && (
            <a
              href={s.cta.href}
              className="mt-10 inline-block bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-brand-dark"
            >
              {s.cta.label ?? "Find out more"}
            </a>
          )}
        </div>
      </section>

      {s.proofRefs?.length ? <ClientPerspective proofRefs={s.proofRefs} /> : null}

      {s.resources?.length ? <ResourceDownloads resources={s.resources} /> : null}
    </>
  );
}
