import PageHero from "@/components/PageHero";
import RichText from "@/components/RichText";
import type { InsightVM } from "@/lib/cms/map";

/** Detail body for an insight. Shared by the live page and the preview route. */
export default function InsightView({ i }: { i: InsightVM }) {
  return (
    <>
      <PageHero eyebrow="Insight" title={i.title} />

      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-20 md:px-10 md:py-24">
          <RichText html={i.body} />
        </div>
      </section>
    </>
  );
}
