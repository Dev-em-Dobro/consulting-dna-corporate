import Image from "next/image";
import Link from "next/link";
import type { CaseListEntry } from "@/lib/cms/map";

/** One case in the /cases library list (see the design spec). Presentational. */
export default function CaseRow({ entry }: { entry: CaseListEntry }) {
  const href = `/cases/${entry.slug}`;
  return (
    <article className="overflow-hidden border border-line bg-white">
      {/* Branded band (per topocase reference): client name + tags on the left.
          When the client has a brand logo, the band fades from dark to the logo's
          predominant colour and shows the logo on the right; without a logo it
          stays flat dark. */}
      <div
        className={
          "relative isolate flex min-h-[132px] items-center justify-between gap-6 overflow-hidden px-6 py-5 " +
          (entry.logoUrl && !entry.logoColor
            ? "bg-gradient-to-r from-neutral-900 via-neutral-900 to-brand "
            : "bg-neutral-900 ")
        }
        style={
          entry.logoColor
            ? { backgroundImage: `linear-gradient(to right, #141414 0%, #141414 30%, ${entry.logoColor} 100%)` }
            : undefined
        }
      >
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

        {entry.logoUrl && (
          <Image
            src={entry.logoUrl}
            alt={`${entry.client} logo`}
            width={160}
            height={64}
            className="h-12 w-auto max-w-[150px] flex-none object-contain md:h-14 md:max-w-[180px]"
          />
        )}
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
