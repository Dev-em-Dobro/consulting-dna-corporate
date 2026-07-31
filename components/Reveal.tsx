"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Animate direct children with a stagger (true) or the whole block as one (false). */
  stagger?: boolean;
  /** Vertical travel distance in px. */
  y?: number;
  /** ScrollTrigger start position. */
  start?: string;
};

export default function Reveal({
  children,
  className,
  stagger = true,
  y = 44,
  start = "top 82%",
}: RevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const targets = stagger
        ? gsap.utils.toArray<HTMLElement>(":scope > *", scope.current!)
        : scope.current;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // fromTo (not from): the targets start hidden via CSS, so the visible
        // end state must be explicit or GSAP would animate hidden -> hidden.
        gsap.fromTo(
          targets,
          { autoAlpha: 0, y },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: stagger ? 0.12 : 0,
            scrollTrigger: {
              trigger: scope.current,
              start,
              once: true,
            },
          }
        );
      });

      // Reduce-motion: still reveal (targets start hidden via CSS), plain fade
      // with no vertical travel.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.fromTo(
          targets,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.5,
            ease: "power1.out",
            stagger: stagger ? 0.08 : 0,
            scrollTrigger: { trigger: scope.current, start, once: true },
          }
        );
      });

      return () => mm.revert();
    },
    { scope }
  );

  return (
    <div
      ref={scope}
      className={className}
      data-reveal={stagger ? "stagger" : "block"}
    >
      {children}
    </div>
  );
}
