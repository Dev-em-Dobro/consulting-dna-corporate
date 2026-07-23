import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { CaseArticle } from "@/lib/cms/map";

/** Detail body for a case study. Shared by the live page and the preview route. */
export default function CaseView({ c }: { c: CaseArticle }) {
  const body = [
    { label: "Challenge", value: c.body.challenge },
    { label: "Approach", value: c.body.approach },
    { label: "Outcome", value: c.body.outcome },
    { label: "Measurable result", value: c.body.measurableResult },
  ].filter((s) => s.value);

  return (
    <>
      {/* Article header */}
      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 pt-16 pb-12 md:px-10 md:pt-20">
          {c.tags.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-x-2 gap-y-1 text-[12px] font-semibold uppercase tracking-[1.5px] text-brand">
              {c.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          )}
          <h1 className="mb-6 text-[30px] sm:text-[38px] md:text-[44px] font-bold leading-[1.1] tracking-[-1px] text-ink [text-wrap:balance]">
            {c.title}
          </h1>
          {c.intro && (
            <p className="text-[18px] leading-[1.65] text-muted">{c.intro}</p>
          )}
        </div>
        {c.coverUrl && (
          <div className="mx-auto max-w-[1000px] px-6 md:px-10">
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-line">
              <Image
                src={c.coverUrl}
                alt={c.title}
                fill
                sizes="(min-width: 1000px) 1000px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </section>

      {/* Quote block with video CTA */}
      {(c.quote || c.videoUrl) && (
        <section className="bg-ink text-white">
          <Reveal
            stagger={false}
            className="mx-auto max-w-[900px] px-6 py-16 text-center md:px-10 md:py-20"
          >
            {c.quote && (
              <>
                <div className="mb-3 text-[56px] font-extrabold leading-none text-brand">
                  &ldquo;
                </div>
                <blockquote className="mb-8 text-[24px] sm:text-[28px] md:text-[32px] font-medium leading-[1.4] tracking-[-0.3px] text-white [text-wrap:balance]">
                  {c.quote}
                </blockquote>
              </>
            )}
            {c.videoUrl && (
              <a
                href={c.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-brand px-8 py-4 text-[13px] font-bold uppercase tracking-[1px] text-white transition-colors hover:bg-brand-dark"
              >
                Hear the complete interview
              </a>
            )}
          </Reveal>
        </section>
      )}

      {/* Body */}
      {body.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-[820px] space-y-10 px-6 py-20 md:px-10 md:py-24">
            {body.map((s) => (
              <div key={s.label}>
                <h2 className="mb-3 text-[13px] font-bold uppercase tracking-[1.5px] text-brand">
                  {s.label}
                </h2>
                <p className="max-w-[62ch] text-[17px] leading-[1.7] text-muted">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
