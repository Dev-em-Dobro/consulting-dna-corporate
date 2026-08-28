import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/Eyebrow";
import EmptyNotice from "@/components/EmptyNotice";
import PeopleGrid from "@/components/PeopleGrid";
import LocationsBlock from "@/components/LocationsBlock";
import { localeAlternates } from "@/lib/seo/alternates";
import { getPeople } from "@/lib/cms/map";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Team — Corporate DNA",
    description:
      "The leadership team and global faculty behind Corporate DNA — senior practitioners delivering across 36 countries.",
    alternates: localeAlternates("/our-team"),
  };
}
export const revalidate = 300;

/**
 * Our Team (27-08 brief, item 15).
 *
 * The other half of the old `/about` split. Leadership and faculty moved here
 * unchanged, keeping their #leadership / #faculty / #presence anchors.
 *
 * Held OUT of the navigation on purpose until the assets the brief asks for
 * arrive: the group photograph, the black-and-white portraits and the final
 * list of who appears. The route exists so that publishing it is a one-line nav
 * change rather than a build. Per the brief, portraits must keep natural
 * expressions — no treatment that makes people look uniform or AI-generated.
 */
export default async function OurTeamPage() {
  const people = await getPeople();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Our Team"
        title="The people who sit where our clients sit."
        subtitle="A senior leadership team, backed by a global faculty of 75 practitioners delivering across 36 countries."
      />

      {/* ── Leadership (real, from CMS) ───────────────────────────────── */}
      <section id="leadership" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 pt-16 md:px-10 md:pt-20">
          <Eyebrow>Leadership</Eyebrow>
          <h2 className="max-w-[680px] text-[28px] font-bold leading-[1.12] tracking-[-0.6px] text-ink sm:text-[34px]">
            The team behind the work.
          </h2>
        </div>
        {people.length === 0 ? (
          <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-8 md:px-10">
            <EmptyNotice>No team members published yet.</EmptyNotice>
          </div>
        ) : (
          <PeopleGrid people={people} />
        )}
      </section>

      {/* ── Group photograph (brief item 15) ───────────────────────────
          Explicitly requested, explicitly not yet delivered. The slot is held
          rather than filled with a stand-in, so the gap stays visible. */}
      <section id="group" className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 pb-16 md:px-10 md:pb-20">
          <EmptyNotice>
            Group photograph and black-and-white portraits pending from CDNA,
            together with the final list of who appears.
          </EmptyNotice>
        </div>
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

          <EmptyNotice className="mt-8">
            Faculty selection and photos pending from CDNA / Guli — a regional
            selection or mosaic (not 75 individual profiles at launch).
          </EmptyNotice>
        </div>
      </section>

      {/* ── Global Presence (real map) ────────────────────────────────── */}
      <div id="presence">
        <LocationsBlock />
      </div>
    </SiteShell>
  );
}
