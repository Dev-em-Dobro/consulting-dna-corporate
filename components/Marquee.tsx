"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type MarqueeProps = {
  items: string[];
  itemClassName?: string;
  /** Seconds for one full loop. Lower = faster. */
  duration?: number;
};

export default function Marquee({
  items,
  itemClassName = "",
  duration = 26,
}: MarqueeProps) {
  const track = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The track renders two identical copies of the items, so moving it
        // left by exactly 50% of its width produces a seamless, gapless loop.
        tween.current = gsap.to(track.current, {
          xPercent: -50,
          duration,
          ease: "none",
          repeat: -1,
        });
      });
      return () => mm.revert();
    },
    { scope: track }
  );

  const sequence = [...items, ...items];
  const fade =
    "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)";

  return (
    <div
      className="w-full overflow-hidden"
      style={{ maskImage: fade, WebkitMaskImage: fade }}
      onMouseEnter={() => tween.current?.pause()}
      onMouseLeave={() => tween.current?.resume()}
    >
      <div ref={track} className="flex w-max items-center">
        {sequence.map((label, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length}
            className={`shrink-0 whitespace-nowrap px-8 ${itemClassName}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
