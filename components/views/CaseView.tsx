import Image from "next/image";
import Reveal from "@/components/Reveal";
import RichText from "@/components/RichText";
import ResourceDownloads from "@/components/ResourceDownloads";
import type { CaseArticle } from "@/lib/cms/map";

/** Extract the 11-char YouTube id from any common YouTube URL shape. */
function youTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}

/** Autoplay-muted, looping showcase video (YouTube embed or direct file). */
function MutedVideo({ url, title }: { url: string; title: string }) {
  const id = youTubeId(url);
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[820px] px-6 pb-20 md:px-10 md:pb-24">
        <div className="relative aspect-video w-full overflow-hidden border border-line bg-ink">
          {id ? (
            <iframe
              // Starts muted so browsers allow autoplay; `controls=1` lets the
              // viewer unmute / play with sound. loop needs `playlist=<id>`.
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&modestbranding=1&playsinline=1&rel=0`}
              title={title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <video
              src={url}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}

/** Detail body for a case study. Shared by the live page and the preview route. */
export default function CaseView({ c }: { c: CaseArticle }) {
  // Legacy structured sections — only used when a case has no single `text` body.
  const legacyBody = [
    { label: "Challenge", value: c.body.challenge },
    { label: "Approach", value: c.body.approach },
    { label: "Outcome", value: c.body.outcome },
    { label: "Measurable result", value: c.body.measurableResult },
  ].filter((s) => s.value);

  return (
    <>
      {/* Article header: tags → title → introduction */}
      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 pt-20 pb-16 md:px-10 md:pt-28 md:pb-20">
          {c.tags.length > 0 && (
            <div className="mb-7 flex flex-wrap gap-x-3 gap-y-1.5 text-[12px] font-semibold uppercase tracking-[1.5px] text-brand">
              {c.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          )}
          {/* Guli's mock leads the case on its outcome — "SHELL Discovery
              Journey registered 200 millions in savings for the company" —
              rather than on the client's name. That is the `headline` field.
              `title` stays the client name because it also resolves the logo and
              the brand colour of the band (see lib/cms/map.ts), so a case with
              no headline authored yet keeps the behaviour it has today. */}
          <h1 className="text-[30px] sm:text-[38px] md:text-[44px] font-bold leading-[1.1] tracking-[-1px] text-ink [text-wrap:balance]">
            {c.headline || c.title}
          </h1>
          {/* Header band — the 27-08 brief (item 7) asks every case to open with
              Countries → Participants/Leaders → Reach/Scale → Intervention →
              Impact, and only then the story. Evidence before prose. Rendered on
              the existing bordered-grid pattern; the visual treatment is Guli's
              to revisit. Hidden entirely until the CMS has at least one value. */}
          {c.facts.length > 0 && (
            <dl className="mt-9 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 md:grid-cols-5">
              {c.facts.map((f) => (
                <div key={f.label} className="bg-white px-4 py-5">
                  <dt className="text-[10.5px] font-semibold uppercase leading-tight tracking-[1px] text-muted">
                    {f.label}
                  </dt>
                  <dd className="mt-2 text-[19px] font-bold leading-[1.2] tracking-[-0.4px] text-ink">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {c.intro && (
            <RichText
              html={c.intro}
              className="mt-7 !text-[18px] !leading-[1.65] [&_*]:!text-muted"
            />
          )}
        </div>
        {c.coverUrl && (
          <div className="mx-auto max-w-[820px] px-6 pb-4 md:px-10">
            <div className="relative aspect-[16/9] w-full overflow-hidden border border-line">
              <Image
                src={c.coverUrl}
                alt={c.title}
                fill
                sizes="(min-width: 820px) 820px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </section>

      {/* Quote block (quote + quoter) with optional video CTA */}
      {(c.quote || c.videoUrl) && (
        <section className="bg-ink text-white">
          <Reveal
            stagger={false}
            className="mx-auto max-w-[900px] px-6 py-16 text-center md:px-10 md:py-20"
          >
            {c.quote && (
              <>
                <blockquote className="text-[24px] sm:text-[28px] md:text-[32px] font-medium leading-[1.4] tracking-[-0.3px] text-white [text-wrap:balance]">
                  {c.quote}
                </blockquote>
                {c.quoter && (
                  <cite className="mt-6 block not-italic text-[13px] font-semibold uppercase tracking-[1.5px] text-brand">
                    {c.quoter}
                  </cite>
                )}
              </>
            )}
            {c.videoUrl && (
              <a
                href={c.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-block bg-brand px-8 py-4 text-[13px] font-bold uppercase tracking-[1px] text-white transition-colors hover:bg-brand-dark"
              >
                Hear the complete interview
              </a>
            )}
          </Reveal>
        </section>
      )}

      {/* Body: the single rich-text `text`, or the legacy structured sections */}
      {c.text ? (
        <section className="bg-white">
          <div className="mx-auto max-w-[820px] px-6 py-20 md:px-10 md:py-24">
            <RichText html={c.text} />
          </div>
        </section>
      ) : (
        legacyBody.length > 0 && (
          <section className="bg-white">
            <div className="mx-auto max-w-[820px] space-y-10 px-6 py-20 md:px-10 md:py-24">
              {legacyBody.map((s) => (
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
        )
      )}

      {/* Autoplay-muted showcase video from the CMS, at the very end */}
      {c.mutedVideoUrl && <MutedVideo url={c.mutedVideoUrl} title={c.title} />}

      {c.resources?.length ? <ResourceDownloads resources={c.resources} /> : null}
    </>
  );
}
