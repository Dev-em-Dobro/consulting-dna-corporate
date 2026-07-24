import Image from "next/image";
import Link from "next/link";
import type { CaseListEntry } from "@/lib/cms/map";

/** One case in the /cases library list (see the design spec). Presentational. */
export default function CaseRow({ entry }: { entry: CaseListEntry }) {
  const href = `/solutions/flagship-cases/${entry.slug}`;
  return (
    <article className="overflow-hidden border border-line bg-white">
      {/* Branded band: cover behind a dark overlay, or a solid dark band. */}
      <div className="relative isolate flex min-h-[132px] items-end overflow-hidden bg-ink px-6 py-5">
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
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
          </>
        )}
        <div>
          <h2 className="text-[22px] font-bold uppercase leading-tight tracking-[0.5px] text-white">
            {entry.client}
          </h2>
          {entry.tags.length > 0 && (
            <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-white/70">
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
