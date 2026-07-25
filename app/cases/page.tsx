import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import EmptyNotice from "@/components/EmptyNotice";
import CasesLibrary from "@/components/cases/CasesLibrary";
import { getCaseListEntries } from "@/lib/cms/map";

export const metadata: Metadata = {
  title: "Cases — Corporate DNA",
  alternates: { canonical: "/cases" },
};
export const revalidate = 300;

export default async function CasesPage() {
  const cases = await getCaseListEntries();

  return (
    <SiteShell>
      {/* White hero, per the reference: heavy dark title + muted subtitle. */}
      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 pt-14 pb-6 md:px-10 md:pt-20 md:pb-8">
          <h1 className="text-[34px] font-bold leading-[1.05] tracking-[-1px] text-ink [text-wrap:balance] sm:text-[44px] md:text-[52px]">
            We were created to deliver results.
          </h1>
          <p className="mt-5 max-w-[560px] text-[17px] leading-[1.5] text-muted md:text-[19px]">
            Please feel free to see the impact that we have been creating.
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 pb-16 md:px-10 md:pb-20">
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
