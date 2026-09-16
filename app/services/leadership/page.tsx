import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import EmptyNotice from "@/components/EmptyNotice";
import PeopleGrid from "@/components/PeopleGrid";
import { localeAlternates } from "@/lib/seo/alternates";
import { getPeople } from "@/lib/cms/map";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Leadership profiles — Corporate DNA",
    description:
      "The senior advisory team behind Corporate DNA — leaders who have sat where our clients sit, delivering across 36 countries with a 75-strong faculty.",
    alternates: localeAlternates("/services/leadership"),
  };
}
export const revalidate = 300;

export default async function LeadershipPage() {
  const people = await getPeople();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Leadership profiles"
        title="The people behind the method."
        subtitle="Senior advisors who have sat where our clients sit."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24">
          {people.length === 0 ? (
            <EmptyNotice>No leadership profiles published yet.</EmptyNotice>
          ) : (
            <PeopleGrid people={people} />
          )}
        </div>
      </section>
    </SiteShell>
  );
}
