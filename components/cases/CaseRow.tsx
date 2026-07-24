import Image from "next/image";
import Link from "next/link";
import type { CaseListEntry } from "@/lib/cms/map";

/** One case in the /cases library list (see the design spec). Presentational. */
export default function CaseRow({ entry }: { entry: CaseListEntry }) {
  const href = `/solutions/flagship-cases/${entry.slug}`;
  return (
    <article className="overflow-hidden border border-line bg-white">
      {/* Branded band. With a cover, show it full-bleed so the client's own
          brand colour + logo fill the right (per the reference); a left scrim
          keeps the overlaid name/tags readable. Without a cover, a plain white
          band with dark text. */}
      <div
        className={
          "relative isolate flex min-h-[132px] items-end overflow-hidden px-6 py-5 " +
          (entry.coverUrl ? "" : "border-b border-line bg-white")
        }
      >
        {entry.coverUrl && (
          <>
            <Image
              src={entry.coverUrl}
              alt=""
              aria-hidden
              fill
              sizes="(min-width: 900px) 820px, 100vw"
              className="-z-10 object-cover"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
          </>
        )}
        <div>
          <h2
            className={
              "text-[22px] font-bold uppercase leading-tight tracking-[0.5px] " +
              (entry.coverUrl ? "text-white" : "text-ink")
            }
          >
            {entry.client}
          </h2>
          {entry.tags.length > 0 && (
            <p
              className={
                "mt-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] " +
                (entry.coverUrl ? "text-white/70" : "text-muted")
              }
            >
              {entry.tags.join(" · ")}
            </p>
          )}
        </div>
      </div>

      {/* Body: challenge → metric → read more. */}
      <div className="px-6 py-7">
        {entry.challenge && (
          <>
            <h3 className="mb-2 text-[12px] font-bold uppercase tracking-[1.5px] text-brand">
              Challenge
            </h3>
            <p className="max-w-[62ch] text-[16px] leading-[1.6] text-muted">
              {entry.challenge}
            </p>
          </>
        )}

        {(entry.metricValue || entry.metricLabel) && (
          <div className="mt-7">
            {entry.metricValue && (
              <p className="text-[40px] font-bold leading-none tracking-[-1px] text-brand">
                {entry.metricValue}
              </p>
            )}
            {entry.metricLabel && (
              <p className="mt-3 max-w-[48ch] text-[16px] leading-[1.5] text-muted">
                {entry.metricLabel}
              </p>
            )}
          </div>
        )}

        <Link
          href={href}
          className="mt-7 inline-block text-[15px] font-semibold text-brand underline underline-offset-4 hover:text-brand-dark"
        >
          read more here.
        </Link>
      </div>
    </article>
  );
}
