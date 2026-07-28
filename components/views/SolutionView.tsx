import PageHero from "@/components/PageHero";
import RichText from "@/components/RichText";
import type { SolutionVM } from "@/lib/cms/map";

/** Detail body for a solution. Shared by the live page and the preview route. */
export default function SolutionView({ s }: { s: SolutionVM }) {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title={s.title}
        subtitle={s.problemStatement}
        bgImageUrl={s.bannerUrl ?? s.coverUrl}
        imageClassName="object-cover object-[center_15%]"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-20 md:px-10 md:py-24">
          <RichText html={s.body} />
          {s.cta?.href && (
            <a
              href={s.cta.href}
              className="mt-10 inline-block bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-brand-dark"
            >
              {s.cta.label ?? "Find out more"}
            </a>
          )}
        </div>
      </section>
    </>
  );
}
