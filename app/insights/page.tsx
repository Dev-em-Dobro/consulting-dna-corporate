import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import EmptyNotice from "@/components/EmptyNotice";
import InsightsLibrary from "@/components/insights/InsightsLibrary";
import { localeAlternates } from "@/lib/seo/alternates";
import { getInsightListEntries } from "@/lib/cms/map";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Insights — Corporate DNA",
    description:
      "Perspectives on leadership, executive-team alignment, succession and enterprise transformation from Corporate DNA's senior advisory faculty.",
    alternates: localeAlternates("/insights"),
  };
}
export const revalidate = 300;

export default async function InsightsPage() {
  const insights = await getInsightListEntries();

  return (
    <SiteShell footerTopBorder>
      {/* White hero, per the reference: heavy dark title. Container width is
          kept identical to /cases so the two library pages line up. */}
      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 pt-14 pb-6 md:px-10 md:pt-20 md:pb-8">
          <h1 className="max-w-[720px] text-[34px] font-bold leading-[1.05] tracking-[-1px] text-ink [text-wrap:balance] sm:text-[44px] md:text-[52px]">
            Let&rsquo;s share some insights.
          </h1>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 pb-16 md:px-10 md:pb-20">
          {insights.length === 0 ? (
            <EmptyNotice>No insights published yet.</EmptyNotice>
          ) : (
            <InsightsLibrary insights={insights} />
          )}
        </div>
      </section>
    </SiteShell>
  );
}
