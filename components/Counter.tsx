"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Matches the first number in the string (supports thousands "," and decimals "."). */
const NUM_RE = /\d[\d.,]*/;

function parse(value: string) {
  const match = value.match(NUM_RE);
  if (!match) return null;
  const raw = match[0];
  const start = match.index ?? 0;
  const dot = raw.indexOf(".");
  return {
    prefix: value.slice(0, start),
    suffix: value.slice(start + raw.length),
    grouping: raw.includes(","),
    decimals: dot === -1 ? 0 : raw.length - dot - 1,
    target: parseFloat(raw.replace(/,/g, "")),
  };
}

function format(n: number, decimals: number, grouping: boolean) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: grouping,
  });
}

type CounterProps = {
  value: string;
  className?: string;
  /** Seconds for the count-up. */
  duration?: number;
};

export default function Counter({ value, className, duration = 1.6 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const parsed = parse(value);

  useGSAP(
    () => {
      if (!parsed || !ref.current) return;
      const el = ref.current;
      const render = (n: number) =>
        (el.textContent =
          parsed.prefix + format(n, parsed.decimals, parsed.grouping) + parsed.suffix);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Start from zero before first paint (this runs in a layout effect), then
        // count up when the number scrolls into view.
        render(0);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: parsed.target,
          duration,
          ease: "power2.out",
          onUpdate: () => render(obj.val),
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
