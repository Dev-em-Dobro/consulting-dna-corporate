import Image from "next/image";
import { plainText } from "@/lib/cms/text";

/**
 * Dark hero band used by content pages (Solutions, 5H Framework, …).
 * The sticky red nav sits above it, matching the wireframes.
 *
 * When `bgImageUrl` is set (e.g. a solution's CMS cover), it fills the band
 * behind a dark overlay so the eyebrow/title/subtitle stay legible; without it
 * the band is the plain dark `bg-ink`, exactly as before.
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  bgImageUrl,
  imageClassName = "object-cover",
  overlayClassName = "bg-ink/70",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  bgImageUrl?: string;
  /** Object-fit/position for the background image (defaults to centred cover). */
  imageClassName?: string;
  /** Overlay tint over the image; override for a stronger/directional darken. */
  overlayClassName?: string;
}) {
  // The subtitle is a plain-text slot. Some callers pass it straight from the
  // CMS (book/5h/awards singletons), where the field may carry rich-text markup;
  // strip it here so tags never render literally.
  subtitle = plainText(subtitle);
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      {bgImageUrl && (
        <>
          <Image
            src={bgImageUrl}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className={`-z-10 ${imageClassName}`}
          />
          {/* Darken the image so light text keeps its contrast. */}
          <div className={`absolute inset-0 -z-10 ${overlayClassName}`} />
        </>
      )}
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
        {eyebrow && (
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="max-w-[900px] text-[38px] sm:text-[48px] md:text-[60px] font-bold leading-[1.03] tracking-[-1.5px] text-white [text-wrap:balance]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-[620px] text-lg leading-[1.5] text-white/75 md:text-xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
