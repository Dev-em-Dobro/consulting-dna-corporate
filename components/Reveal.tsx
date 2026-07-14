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
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const targets = stagger
          ? gsap.utils.toArray<HTMLElement>(":scope > *", scope.current!)
          : scope.current;

        gsap.from(targets, {
          autoAlpha: 0,
          y,
          duration: 0.9,
          ease: "power3.out",
          stagger: stagger ? 0.12 : 0,
          scrollTrigger: {
            trigger: scope.current,
            start,
            once: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
