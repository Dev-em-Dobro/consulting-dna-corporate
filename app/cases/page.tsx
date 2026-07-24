import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import EmptyNotice from "@/components/EmptyNotice";
import CasesLibrary from "@/components/cases/CasesLibrary";
import { getCaseListEntries } from "@/lib/cms/map";

export const metadata: Metadata = {
  title: "Cases — Corporate DNA",
};
export const revalidate = 300;

export default async function CasesPage() {
  const cases = await getCaseListEntries();

  return (
    <SiteShell>
      <PageHero
        title="We were created to deliver results."
        subtitle="Please feel free to see the impact that we have been creating."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
          {cases.length === 0 ? (
            <EmptyNotice>No case studies published yet.</EmptyNotice>
          ) : (
            <CasesLibrary cases={cases} />
          )}
        </div>
      </section>
    </SiteShell>
  );
}
