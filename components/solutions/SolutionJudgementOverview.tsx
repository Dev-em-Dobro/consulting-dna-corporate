import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { ServiceFormat } from "@/lib/services";

export default function SolutionJudgementOverview({
  headline,
  body,
  formats,
}: {
  headline: string;
  body: string;
  formats: ServiceFormat[];
}) {
  return (
    <section className="bg-white" aria-labelledby="judgement-what-we-do">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 md:px-10 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.35fr)] lg:gap-10">
        <Reveal className="lg:pr-4">
          <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">What we do</p>
          <h2 id="judgement-what-we-do" className="mt-6 font-serif text-[30px] font-semibold leading-[1.15] tracking-[-0.4px] text-ink md:text-[38px] xl:text-[42px]">
            {headline}
          </h2>
          <p className="mt-8 font-serif text-[17px] leading-[1.7] text-muted md:text-[18px]">
            {body}
          </p>
        </Reveal>
        <Reveal className="grid gap-5 md:grid-cols-3" stagger={false}>
          {formats.map((format) => (
            <article key={format.title} className="flex h-full flex-col bg-paper">
              <div className="relative aspect-[2/1] overflow-hidden bg-ink md:aspect-[1.5/1]">
                <Image src={format.image} alt="" fill sizes="(min-width: 1024px) 21vw, (min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col px-5 pb-6 pt-6 lg:px-6">
                <p className="text-[11px] font-semibold uppercase leading-[1.4] tracking-[1.2px] text-brand">{format.audience}</p>
                <h3 className="mt-4 font-serif text-[21px] font-semibold leading-[1.2] text-ink lg:text-[23px]">{format.title}</h3>
                <p className="mt-2 font-serif text-[16px] italic leading-[1.4] text-ink/80">{format.tagline}</p>
                <p className="mt-5 flex-1 font-serif text-[15px] leading-[1.6] text-muted">{format.body}</p>
                <div className="mt-7 border-t border-line pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[1.3px] text-brand">Focus on</p>
                  <p className="mt-2 font-serif text-[14px] leading-[1.5] text-muted">{format.focus.join(" · ")}</p>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
