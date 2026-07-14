"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Counter from "./Counter";

const proofPoints = [
  { num: "18 yrs", label: "of practice advising senior leaders" },
  { num: "36", label: "countries of global delivery" },
  { num: "70+", label: "executive-team interventions" },
  { num: "1,000+", label: "coaching clients" },
];

export default function HeroV2() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          delay: 0.1,
        });
        tl.from(".h2-panel", {
          xPercent: (i) => (i === 0 ? -4 : 6),
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
        })
          .from(".h2-bar", { scaleX: 0, transformOrigin: "left", duration: 0.5 }, "-=0.6")
          .from(".h2-eyebrow", { autoAlpha: 0, x: -12, duration: 0.5 }, "-=0.3")
          .from(
            ".h2-title",
            { autoAlpha: 0, y: 44, skewY: 2, duration: 0.9 },
            "-=0.25"
          )
          .from(".h2-sub", { autoAlpha: 0, y: 24, duration: 0.7 }, "-=0.55")
          .from(
            ".h2-cta",
            { autoAlpha: 0, y: 20, stagger: 0.12, duration: 0.55 },
            "-=0.4"
          )
          .from(
            ".h2-proof",
            { autoAlpha: 0, y: 16, stagger: 0.1, duration: 0.5 },
            "-=0.5"
          );
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      id="top"
      className="grid grid-cols-1 md:grid-cols-[1.35fr_1fr]"
    >
      <div className="h2-panel flex min-h-[480px] flex-col justify-center bg-ink px-6 py-16 text-white sm:px-10 md:min-h-[560px] md:px-16 md:py-24">
        <div className="max-w-[640px]">
          <div className="mb-6 flex items-center gap-3 md:mb-7">
            <span className="h2-bar inline-block h-0.5 w-[34px] bg-brand" />
            <span className="h2-eyebrow text-[12px] font-semibold uppercase tracking-[1.5px] text-white/70 sm:text-[12.5px] sm:tracking-[2px]">
              Global leadership advisory &amp; executive coaching
            </span>
          </div>
          <h1 className="h2-title mb-6 text-[38px] font-bold leading-[1.05] tracking-[-1px] text-white [text-wrap:balance] sm:text-[48px] md:mb-[26px] md:text-[60px] md:leading-[1.03] md:tracking-[-1.5px]">
            When the stakes are high, leadership must become{" "}
            <span className="text-brand">real.</span>
          </h1>
          <p className="h2-sub mb-8 max-w-[560px] text-[17px] leading-[1.55] text-white/80 sm:text-[19px] md:mb-10">
            We help CEOs, CHROs and executive teams align leadership, accelerate
            decisions and build the talent required to deliver transformation.
          </p>
          <div className="flex flex-wrap items-center gap-3.5">
            <a
              href="#contact"
              className="h2-cta bg-brand px-[30px] py-4 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-brand-dark"
            >
              Discuss a leadership challenge
            </a>
            <a
              href="#impact"
              className="h2-cta border-[1.5px] border-white/35 px-[22px] py-4 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:border-white"
            >
              See client impact →
            </a>
          </div>
        </div>
      </div>
      <div className="h2-panel flex flex-col justify-center bg-brand px-6 py-12 text-white sm:px-10 md:px-12 md:py-14">
        <p className="h2-proof mb-2 text-[12px] font-semibold uppercase tracking-[2px] text-white/70">
          The proof, up front
        </p>
        {proofPoints.map((p) => (
          <div key={p.label} className="h2-proof border-b border-white/20 py-5 md:py-6">
            <div className="text-[36px] font-bold leading-none tracking-[-1px] sm:text-[40px]">
              <Counter value={p.num} />
            </div>
            <div className="mt-2 text-sm font-medium text-white/85">
              {p.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
