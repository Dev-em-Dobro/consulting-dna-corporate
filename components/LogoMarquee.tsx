"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

type LogoMarqueeProps = {
  /** File names inside /public/logos, e.g. "shell.png". */
  logos: string[];
  /** Seconds for one full loop. Lower = faster. */
  duration?: number;
  /** Scroll right-to-left by default; set true to reverse. */
  reverse?: boolean;
};

const label = (file: string) =>
  file.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");

export default function LogoMarquee({
  logos,
  duration = 42,
  reverse = false,
}: LogoMarqueeProps) {
  const track = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      // Intentionally ignore prefers-reduced-motion: this ambient logo loop is
      // a decorative brand element and must always animate (matching the hero
      // intro, which also always runs). iOS "reduce motion" would otherwise
      // freeze it.
      // Two identical copies render side by side; shifting the track by 50%
      // of its width produces a seamless, gapless loop.
      tween.current = gsap.fromTo(
        track.current,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration, ease: "none", repeat: -1 }
      );
      return () => {
        tween.current?.kill();
      };
    },
    { scope: track, dependencies: [duration, reverse] }
  );

  const sequence = [...logos, ...logos];
  const fade =
    "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)";

  return (
    <div
      className="w-full overflow-hidden"
      style={{ maskImage: fade, WebkitMaskImage: fade }}
    >
      <div ref={track} className="flex w-max items-center">
        {sequence.map((file, i) => (
          <div
            key={i}
            aria-hidden={i >= logos.length}
            className="mx-3 flex h-[84px] w-[190px] shrink-0 items-center justify-center rounded-xl bg-white px-6"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/logos/${file}`}
              alt={label(file)}
              loading="lazy"
              className="max-h-[52px] w-auto max-w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
