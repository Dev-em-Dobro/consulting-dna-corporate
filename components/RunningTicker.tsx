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
    "linear-gradient(to right, transparent, #000 3%, #000 97%, transparent)";

  return (
    <section
      aria-label="Corporate DNA milestones"
      className="w-full bg-ink-2 text-white"
    >
      <div
        className="w-full overflow-hidden py-3"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      >
        <div ref={track} className="flex w-max items-center">
          {sequence.map((e, i) => {
            const duplicate = i >= entries.length;
            // `category` and `date` are not rendered. Item 17 names Awards, new
            // regions, offices, partnerships and milestones as the *content* the
            // ticker should carry, not as labels to print: they drive the 2023
            // cut and the ordering in `getTickerEntries`. The old CDNA strip this
            // restores was plain text, underlined only where an item linked out.
            const body = (
              <span className="text-[14px] font-medium text-white/90">
                {e.text}
              </span>
            );
            return (
              <div
                key={`${e.slug}-${i}`}
                // The second copy exists only to make the loop seamless, so keep
                // it out of the accessibility tree and out of the tab order.
                aria-hidden={duplicate}
                className="flex shrink-0 items-center whitespace-nowrap px-8"
              >
                {e.linkUrl && !duplicate ? (
                  <Link
                    href={e.linkUrl}
                    className="underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
                  >
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
