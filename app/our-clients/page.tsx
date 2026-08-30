import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import EmptyNotice from "@/components/EmptyNotice";
import LogoMarquee from "@/components/LogoMarquee";
import ClientBandCard from "@/components/clients/ClientBandCard";
import LocationsBlock from "@/components/LocationsBlock";
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
const FLAGSHIP_COUNT = 5;

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
      {/* ── Header ───────────────────────────────────────────────────────
          The mock opens on the page's name and a single line, on white, and
          goes straight into the wall — no dark band, no claim headline. The
          brief says nothing about a hero for this page; item 8 only asks for the
          wall first and the stories after, so dropping the band costs nothing it
          asks for and buys back the height item 16 wants back. */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1000px] px-6 pb-8 pt-14 md:px-10 md:pt-16">
          <h1 className="text-[32px] font-bold leading-[1.08] tracking-[-1px] text-ink sm:text-[40px]">
            Our Clients
          </h1>
          <p className="mt-3 max-w-[560px] text-[16px] leading-[1.55] text-muted md:text-[17px]">
            From energy and pharma to luxury and financial services — advisory
            delivered where the stakes are highest.
          </p>
        </div>
      </section>

      {/* ── The wall: immediate credibility, before any explanation ─────
          One caption line, the same one the homepage band carries. Cutting the
          eyebrow and the headline was right — they cost 205px to restate what
          the logos say. Cutting the caption too was not: with the branded client
          bands directly underneath, an uncaptioned strip of logos reads as
          decoration sitting above the section that actually names the clients.
          The line costs ~30px and gives the wall its job back. */}
      <section id="wall" className="bg-ink text-white">
        <div className="py-12 md:py-14">
          <p className="mb-8 text-center text-[12px] font-semibold uppercase tracking-[2.5px] text-white/70">
            Trusted by leadership teams at
          </p>
          <div className="flex flex-col gap-5">
            <LogoMarquee logos={logoRow1} duration={logoRowDuration(logoRow1)} />
            <LogoMarquee
              logos={logoRow2}
              duration={logoRowDuration(logoRow2)}
              reverse
            />
          </div>
        </div>
      </section>

      {/* ── Flagship stories, as branded bands ─────────────────────────
          Same reasoning: the mock goes straight from the header into the cards.
          Each band already names its client and its solution, so a heading above
          them adds height without adding information. */}
      <section id="stories" className="bg-white">
        <div className="mx-auto max-w-[1000px] px-6 py-12 md:px-10 md:py-16">
          {flagship.length === 0 ? (
            <EmptyNotice>No case studies published yet.</EmptyNotice>
          ) : (
            <div className="flex flex-col gap-1.5">
              {flagship.map((entry) => (
                <ClientBandCard key={entry.slug} entry={entry} />
              ))}
            </div>
          )}

          {/* Kept deliberately: /cases is not in the menu, so this is the only
              way through to the full library. */}
          {cases.length > flagship.length && (
            <Link
              href="/cases"
              className="mt-8 inline-flex items-center gap-2 border border-ink px-7 py-3.5 text-[14px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Explore all case studies
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </section>

      {/* ── Global footprint ──────────────────────────────────────────────
          The mock draws a flat street-map image, but Guli was explicit that it
          stands in for what we already built: "é um mapa que vocês já têm, que
          deve ter dado um trabalho do cão — é esse mapa que tem que colocar
          aqui" (08:02). LocationsBlock is that map, plus the city strip and the
          office details the mock shows underneath it. */}
      <LocationsBlock eyebrow="Global footprint" />

      {/* ── The work, in the room ─────────────────────────────────────────
          One black-and-white photograph with the closing line directly under it,
          the two touching, as the mock draws it. Guli had proposed a carousel
          here (08:34) — that was his fix for the three loose stills the old site
          left at the foot of the page, and a single frame does the same job
          without the machinery.

          ⚠️ The closing line is copy lifted from the old WordPress site, which
          is where Guli took it for the mock. It has NOT been through CDNA
          approval in this cycle — the 27-08 brief requires sign-off on anything
          that reaches production. Swap or delete before launch. */}
      <section id="in-the-room" className="bg-paper">
        {/* Same 1000px column as the bands above, so the page keeps one edge —
            and so the 800px source is never stretched more than 1.25×. */}
        <div className="mx-auto max-w-[1000px] px-6 py-12 md:px-10 md:py-16">
          <Image
            src="/clients-bottom-banner.jpg"
            alt="The Corporate DNA team and client group at a leadership programme"
            width={800}
            height={536}
            sizes="(min-width: 1024px) 920px, 100vw"
            className="h-auto w-full object-cover"
          />
          <blockquote className="bg-ink px-8 py-10 text-white md:px-12 md:py-12">
            <p className="max-w-[46ch] text-[20px] font-medium leading-[1.5] tracking-[-0.3px] md:text-[24px]">
              We cut cross cultural boundaries to release energy in leaders and
              teams by seeing them as real people with real personalities. We
              make leadership real.
            </p>
          </blockquote>
        </div>
      </section>
    </SiteShell>
  );
}
