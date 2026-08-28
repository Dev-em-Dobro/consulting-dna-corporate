"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { TickerEntry } from "@/lib/cms/map";

/**
 * Running ticker of awards, new regions and offices, new partnerships and
 * milestones — 27-08 brief, item 17. Content is CMS-managed (`ticker` segment)
 * and covers 2023 onwards; the filtering and ordering happen in
 * `getTickerEntries`, so this component just loops whatever it is handed.
 *
 * Built on the same seamless-loop technique as `LogoMarquee` (two identical
 * copies of the track, shifted 50%) rather than a new animation approach.
 */
export default function RunningTicker({
  entries,
  duration,
}: {
  entries: TickerEntry[];
  duration?: number;
}) {
  const track = useRef<HTMLDivElement>(null);
  // Scale the loop to the amount of content so a short ticker does not sprint.
  const seconds = duration ?? Math.max(24, entries.length * 7);

  useGSAP(
    () => {
      // Matches LogoMarquee: this ambient loop always animates, since freezing
      // it under iOS "reduce motion" would leave a truncated line of text.
      const tween = gsap.fromTo(
        track.current,
        { xPercent: 0 },
        { xPercent: -50, duration: seconds, ease: "none", repeat: -1 },
      );
      return () => {
        tween.kill();
      };
    },
    { scope: track, dependencies: [seconds] },
  );

  if (entries.length === 0) return null;

  const sequence = [...entries, ...entries];
  const fade =
    "linear-gradient(to right, transparent, #000 4%, #000 96%, transparent)";

  return (
    <section aria-label="Corporate DNA milestones" className="border-y border-line bg-paper">
      <div
        className="w-full overflow-hidden py-4"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      >
        <div ref={track} className="flex w-max items-center">
          {sequence.map((e, i) => {
            const duplicate = i >= entries.length;
            const body = (
              <>
                {e.category && (
                  <span className="mr-3 text-[11px] font-bold uppercase tracking-[1.5px] text-brand">
                    {e.category}
                  </span>
                )}
                <span className="text-[15px] font-medium text-ink">{e.text}</span>
              </>
            );
            return (
              <div
                key={`${e.slug}-${i}`}
                // The second copy exists only to make the loop seamless, so keep
                // it out of the accessibility tree and out of the tab order.
                aria-hidden={duplicate}
                className="flex shrink-0 items-center whitespace-nowrap px-7"
              >
                <span className="mr-7 inline-block h-1.5 w-1.5 rounded-full bg-brand" />
                {e.linkUrl && !duplicate ? (
                  <Link
                    href={e.linkUrl}
                    className="inline-flex items-center underline-offset-4 hover:underline"
                  >
                    {body}
                  </Link>
                ) : (
                  <span className="inline-flex items-center">{body}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
