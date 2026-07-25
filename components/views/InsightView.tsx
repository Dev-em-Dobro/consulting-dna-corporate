import PageHero from "@/components/PageHero";
import RichText from "@/components/RichText";
import type { InsightVM } from "@/lib/cms/map";

/**
 * Detail body for an insight. Shared by the live page and the preview route.
 * Follows the Solutions detail layout (title over a cover hero, rich-text body),
 * with the cover carrying a gradient overlay on top (007 FR-507). The Solutions
 * "banner" treatment is intentionally out of scope for now.
 */
export default function InsightView({ i }: { i: InsightVM }) {
  return (
    <>
      <PageHero
        eyebrow="Insight"
        title={i.title}
        bgImageUrl={i.coverUrl}
        overlayClassName="bg-gradient-to-t from-ink via-ink/80 to-ink/50"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-20 md:px-10 md:py-24">
          <RichText html={i.body} />
        </div>
      </section>
    </>
  );
}
