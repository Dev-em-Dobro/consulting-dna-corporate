"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Counter from "./Counter";
import heroImg from "@/public/hero-bk-1.jpeg";

const proofPoints = [
  { num: "18 years", label: "of practice" },
  { num: "36 countries", label: "of delivery" },
  { num: "70+", label: "executive-team interventions" },
  { num: "1,000+", label: "coaching clients" },
];

export default function HeroV1() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power4.out" },
          delay: 0.1,
        });
        tl.from(
          ".h-bg",
          { autoAlpha: 0, scale: 1.12, duration: 1.6, ease: "power2.out" },
          0
        )
          .from(".h-bar", { scaleX: 0, transformOrigin: "left", duration: 0.6 }, 0.25)
          .from(".h-eyebrow", { autoAlpha: 0, x: -12, duration: 0.5 }, "-=0.3")
          .from(
            ".h-title",
            { autoAlpha: 0, y: 46, skewY: 2, duration: 1 },
            "-=0.15"
          )
          .from(".h-sub", { autoAlpha: 0, y: 26, duration: 0.8 }, "-=0.6")
          .from(
            ".h-cta",
            { autoAlpha: 0, y: 22, stagger: 0.12, duration: 0.6 },
            "-=0.5"
          )
          .from(
            ".h-proof",
            { autoAlpha: 0, y: 18, stagger: 0.1, duration: 0.5 },
            "-=0.25"
          );
      });
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section ref={scope} id="top" className="relative overflow-hidden bg-white">
      {/* background image + legibility overlay */}
      <div className="h-bg pointer-events-none absolute inset-0 z-0">
        <Image
          src={heroImg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 pb-24 pt-[110px] md:px-10">
        <div className="max-w-[880px]">
          <div className="mb-[26px] flex items-center gap-3">
            <span className="h-bar inline-block h-0.5 w-9 bg-brand" />
            <span className="h-eyebrow text-[13px] font-semibold uppercase tracking-[2px] text-brand">
              Global leadership advisory &amp; executive coaching
            </span>
          </div>
          <h1 className="h-title mb-7 text-[38px] sm:text-[48px] md:text-[64px] font-bold leading-[1.04] tracking-[-1.5px] text-white [text-wrap:balance]">
            When the stakes are high, leadership must become&nbsp;real.
          </h1>
          <p className="h-sub mb-10 max-w-[640px] text-xl font-normal leading-[1.55] text-white/85">
            We help CEOs, CHROs and executive teams align leadership, accelerate
            decisions and build the talent required to deliver transformation.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="h-cta bg-brand px-[30px] py-4 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-brand-dark"
            >
              Discuss a leadership challenge
            </a>
            <a
              href="#impact"
              className="h-cta border-[1.5px] border-white/35 px-6 py-4 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:border-white"
            >
              See client impact →
            </a>
          </div>
        </div>
      </div>
      {/* proof line */}
      <div className="relative z-10 border-y border-line bg-[#fafafa]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-10 gap-y-[14px] px-10 py-[22px]">
          {proofPoints.map((p) => (
            <span
              key={p.label}
              className="h-proof text-[15px] font-medium tracking-[0.2px] text-muted"
            >
              <Counter value={p.num} className="font-bold text-ink" /> {p.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
