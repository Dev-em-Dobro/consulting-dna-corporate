import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import PeopleGrid from "@/components/PeopleGrid";
import LocationsBlock from "@/components/LocationsBlock";
import { localeAlternates } from "@/lib/seo/alternates";
import { getPeople } from "@/lib/cms/map";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About — Corporate DNA",
    description:
      "Who we are, what we believe and the team behind Corporate DNA — a global leadership advisory making leadership real.",
    alternates: localeAlternates("/about"),
  };
}
export const revalidate = 300;

/** Small brand-red accent line + label used above section headings. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="inline-block h-0.5 w-9 bg-brand" />
      <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">
        {children}
      </span>
    </div>
  );
}

/** Placeholder marker for sections whose final copy is pending CDNA approval. */
function Pending({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-8 flex items-center gap-4 border border-dashed border-line bg-paper/60 px-7 py-6 text-[13.5px] text-muted">
      <span className="inline-block h-2 w-2 flex-none rounded-full bg-brand" />
      {children}
    </div>
  );
}

export default async function AboutPage() {
  const people = await getPeople();

  return (
    <SiteShell>
      <PageHero
        eyebrow="About"
        title="Who we are, and why leadership must become real."
        subtitle="Our identity, story and beliefs — and the leaders, faculty and global presence behind the work."
      />

      {/* ── Who We Are / Our Identity ─────────────────────────────────── */}
      <section id="identity" className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Who We Are / Our Identity</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            Corporate DNA — a global leadership advisory.
          </h2>
          <Pending>
            Identity copy to be provided by CDNA. This section will introduce who
            Corporate DNA is and what the firm stands for.
          </Pending>
        </div>
      </section>

      {/* ── Our Story ─────────────────────────────────────────────────── */}
      <section id="story" className="bg-paper">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Our Story</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            How we came to be.
          </h2>
          <Pending>
            Our Story copy to be provided by CDNA — the founding, growth and
            milestones of the firm.
          </Pending>
        </div>
      </section>

      {/* ── Our Values & "Keeping It Real" ────────────────────────────── */}
      <section id="values" className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Our Values &amp; “Keeping It Real”</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            What we believe, and how we work.
          </h2>
          <Pending>
            Values and “Keeping It Real” copy to be provided by CDNA.
          </Pending>
        </div>
      </section>

      {/* ── Why We Are Different ───────────────────────────────────────
          The final language is being developed by Rhea, JP, Nitin and G — per
          the 05-08 brief we hold a placeholder and do NOT invent the claim. */}
      <section id="why" className="bg-ink text-white">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">
              Why We Are Different
            </span>
          </div>
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

      {/* ── Leadership (real, from CMS) ───────────────────────────────── */}
      <section id="leadership" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 pt-16 md:px-10 md:pt-20">
          <Eyebrow>Leadership</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            The team behind the work.
          </h2>
        </div>
        <PeopleGrid people={people} />
      </section>

      {/* ── Global Faculty (placeholder mosaic) ───────────────────────── */}
      <section id="faculty" className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>Global Faculty</Eyebrow>
          <h2 className="max-w-[720px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            A faculty of 75 senior practitioners across 36 countries.
          </h2>
          <p className="mt-5 max-w-[620px] text-[17px] leading-[1.7] text-muted">
            Beyond our core leadership team, we deliver through a global faculty
            of senior practitioners — selected by region for local relevance.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {["Europe", "Middle East", "Asia Pacific", "Americas"].map(
              (region) => (
                <div
                  key={region}
                  className="flex aspect-[4/5] flex-col justify-end border border-line bg-white p-5"
                >
                  <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-brand">
                    {region}
                  </span>
                  <span className="mt-1 text-[13px] text-muted">
                    Faculty selection
                  </span>
                </div>
              ),
            )}
          </div>

          <Pending>
            Faculty selection and photos pending from CDNA / Guli — a regional
            selection or mosaic (not 75 individual profiles at launch).
          </Pending>
        </div>
      </section>

      {/* ── Global Presence (real map) ────────────────────────────────── */}
      <div id="presence">
        <LocationsBlock />
      </div>
    </SiteShell>
  );
}
