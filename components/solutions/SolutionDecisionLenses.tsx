import Reveal from "@/components/Reveal";
import { stepIcon } from "@/components/solutions/SolutionSteps";
import type { ServiceDecisionLens } from "@/lib/services";

export default function SolutionDecisionLenses({ items }: { items?: ServiceDecisionLens[] }) {
  if (!items?.length) return null;

  return (
    <section className="bg-white" aria-labelledby="decision-lenses-title">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">How leaders decide</p>
        <h2 id="decision-lenses-title" className="mt-6 font-serif text-[30px] font-semibold leading-[1.15] tracking-[-0.4px] text-ink md:text-[42px] lg:text-[50px]">
          Six lenses. One decision you own.
        </h2>
        <p className="mt-4 font-serif text-[17px] leading-[1.6] text-muted md:text-[18px]">
          Our decision canvas takes one real decision from the evidence, to the call, to action within 30 days.
        </p>
        <Reveal className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" stagger={false}>
          {items.map((item) => {
            const Icon = stepIcon(item.icon);
            return (
              <article key={item.title} className="flex min-h-[220px] flex-col border-t-2 border-brand bg-paper p-5 md:min-h-[245px] md:p-6">
                {Icon ? <Icon aria-hidden size={31} strokeWidth={1.5} className="mt-2 text-brand" /> : null}
                <h3 className="mt-5 text-[13px] font-semibold uppercase tracking-[1.2px] text-ink">{item.title}</h3>
                <p className="mt-3 font-serif text-[15px] leading-[1.5] text-muted">{item.question}</p>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
