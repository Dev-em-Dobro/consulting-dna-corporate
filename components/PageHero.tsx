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
  compact = false,
  imageClassName = "object-cover",
  overlayClassName = "bg-ink/70",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  bgImageUrl?: string;
  /**
   * Shorter band and smaller title, for pages whose job is to get out of the
   * way of what follows. Guli's Our Clients mock opens on a title and a single
   * line — roughly a quarter of the height this band takes by default — and the
   * 27-08 brief asks to cut "endless scrolling" and "excessive white space"
   * (item 16). Opt-in rather than the new default: the pages that lead with a
   * statement still want the full band.
   */
  compact?: boolean;
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
      <div
        className={`mx-auto max-w-[1200px] px-6 md:px-10 ${
          compact ? "py-11 md:py-14" : "py-20 md:py-28"
        }`}
      >
        {eyebrow && (
          <div className={`flex items-center gap-3 ${compact ? "mb-3" : "mb-5"}`}>
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">
              {eyebrow}
            </span>
          </div>
        )}
        <h1
          className={`max-w-[900px] font-bold leading-[1.05] tracking-[-1.2px] text-white [text-wrap:balance] ${
            compact
              ? "text-[28px] sm:text-[34px] md:text-[40px]"
              : "text-[38px] sm:text-[48px] md:text-[60px] leading-[1.03] tracking-[-1.5px]"
          }`}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`max-w-[620px] leading-[1.5] text-white/75 ${
              compact ? "mt-3 text-[16px] md:text-lg" : "mt-5 text-lg md:text-xl"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
