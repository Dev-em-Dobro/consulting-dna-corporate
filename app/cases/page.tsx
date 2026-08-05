import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import EmptyNotice from "@/components/EmptyNotice";
import CasesLibrary from "@/components/cases/CasesLibrary";
import { localeAlternates } from "@/lib/seo/alternates";
import { getCaseListEntries } from "@/lib/cms/map";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Client Impact — Corporate DNA",
    description:
      "Measured leadership outcomes for global enterprises — how Corporate DNA's advisory and 5H® methodology moved the metrics that matter for clients like Shell and Heineken.",
    alternates: localeAlternates("/cases"),
  };
}
export const revalidate = 300;

export default async function CasesPage() {
  const cases = await getCaseListEntries();

  return (
    <SiteShell footerTopBorder>
      {/* White hero, per the reference: heavy dark title + muted subtitle. */}
      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 pt-14 pb-6 md:px-10 md:pt-20 md:pb-8">
          <h1 className="text-[34px] font-bold leading-[1.05] tracking-[-1px] text-ink [text-wrap:balance] sm:text-[44px] md:text-[52px]">
            Leadership change, measured where it matters.
          </h1>
          <p className="mt-5 max-w-[560px] text-[17px] leading-[1.5] text-muted md:text-[19px]">
            Explore how Corporate DNA helps leaders and organisations improve
            alignment, readiness, decision quality, execution and performance.
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
