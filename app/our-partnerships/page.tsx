import type { Metadata } from "next";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/Eyebrow";
import EmptyNotice from "@/components/EmptyNotice";
import RichText from "@/components/RichText";
import { localeAlternates } from "@/lib/seo/alternates";
import { getPartnerships } from "@/lib/cms/map";

export const revalidate = 300;

/**
 * Metadata is content-dependent: while the CMS has no published partnership the
 * page is real but empty, and an empty page should not be indexed. It returns to
 * the index by itself on the first publish — no code change, no redeploy.
 */
export async function generateMetadata(): Promise<Metadata> {
  const partnerships = await getPartnerships();
  return {
    title: "Our Partnerships | CorporateDNA",
    description:
      "The institutions and platforms CorporateDNA partners with, and what each partnership enables for our clients.",
    alternates: localeAlternates("/our-partnerships"),
    ...(partnerships.length === 0 && { robots: { index: false, follow: true } }),
  };
}

/**
 * Our Partnerships (27-08 brief, item 12).
 *
 * A new area, distinct from Insights — the brief's "Our News → Our Partnerships"
 * is understood as Partnerships being new, with the editorial library continuing
 * separately (open question 3 in the status tracker).
 *
 * Held OUT of the navigation until validated copy arrives: the brief lists
 * Harvard, Imperial, Emeld AI, Explore Performance and TerraGrin as working
 * examples but marks the names and final text as still to be validated, so
 * nothing is hard-coded here. Every partnership renders from the CMS, where
 * "what this partnership enables for our clients" is a REQUIRED field — the
 * brief is explicit that a logo or an announcement is not enough.
 */
export default async function OurPartnershipsPage() {
  const partnerships = await getPartnerships();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Our Partnerships"
        title="Who we build capability with."
        subtitle="Institutions and platforms that extend what we can put in front of our clients."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          {partnerships.length === 0 ? (
            <EmptyNotice>
              Partnership entries pending from CDNA, for each one, what it
              enables for our clients. Names and final text are still to be
              validated, so nothing is published here yet.
            </EmptyNotice>
          ) : (
            <div className="space-y-px bg-line">
              {partnerships.map((p) => (
                <article key={p.slug} className="bg-white py-10 first:pt-0">
                  <div className="flex flex-wrap items-center gap-5">
                    {p.logoUrl && (
                      <Image
                        src={p.logoUrl}
                        alt={`${p.title} logo`}
                        width={160}
                        height={64}
                        className="h-11 w-auto max-w-[150px] flex-none object-contain"
                      />
                    )}
                    <h2 className="text-[24px] font-bold leading-tight tracking-[-0.5px] text-ink">
                      {p.title}
                    </h2>
                  </div>

                  <div className="mt-7">
                    <Eyebrow>What this enables for our clients</Eyebrow>
                    <RichText html={p.enablesForClients} />
                  </div>

                  {p.websiteUrl && (
                    <a
                      href={p.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-block text-[15px] font-semibold text-brand underline underline-offset-4 hover:text-brand-dark"
                    >
                      Visit {p.title}
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
