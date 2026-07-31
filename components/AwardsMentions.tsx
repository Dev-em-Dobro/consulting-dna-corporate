"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Awards and Mentions" — the awards & credentials that until now lived only in
 * the sales presentation (spec 009). Logos are local assets under
 * /public/awards; the copy follows the client's `docs/Group 2.png` design.
 *
 * Rows animate in from opposite sides (copy from the left, logo from the right)
 * as each scrolls into view. Motion is gated on `prefers-reduced-motion`, so
 * this component owns its animation instead of using the shared <Reveal>.
 */

type Award = {
  name: string;
  /** The distinction earned, e.g. "Finalist". Rendered uppercase. */
  distinction: string;
  year: string;
  logo: string;
};

const awards: Award[] = [
  {
    name: "Women of the Future Awards",
    distinction: "Finalist",
    year: "2008",
    logo: "/awards/women-of-the-future.png",
  },
  {
    name: "HSBC Start-up Stars",
    distinction: "Semi finalist",
    year: "2009",
    logo: "/awards/hsbc-start-up-stars.png",
  },
  {
    name: "British Indian Awards",
    distinction: "Finalist",
    year: "2008",
    logo: "/awards/british-indian-awards.png",
  },
  {
    name: "Women Entrepreneur",
    distinction: "Top 10 Indian women leader in the UK",
    year: "2021",
    logo: "/awards/women-entrepreneur-india.png",
  },
  {
    name: "Corporate Excellence Awards",
    distinction: "Best international leadership consulting firm",
    year: "2022",
    logo: "/awards/corporate-excellence-awards.png",
  },
];

export default function AwardsMentions() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Title sweeps in from the left as the band reaches the viewport.
        gsap.from("[data-awards-title]", {
          autoAlpha: 0,
          x: -64,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-awards-band]", start: "top 85%", once: true },
        });

        // Each row gets its own trigger, so the list reveals progressively
        // instead of firing all at once when the section appears.
        gsap.utils.toArray<HTMLElement>("[data-award-row]").forEach((row) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
          });

          const rule = row.querySelector("[data-award-rule]");
          if (rule) {
            tl.from(rule, {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.55,
              ease: "power2.out",
            });
          }

          tl.from(
            row.querySelector("[data-award-copy]"),
            { autoAlpha: 0, x: -56, duration: 0.75, ease: "power3.out" },
            rule ? "<0.1" : 0,
          ).from(
            row.querySelector("[data-award-logo]"),
            { autoAlpha: 0, x: 56, duration: 0.75, ease: "power3.out" },
            "<0.08",
          );
        });
      });

      // Reduce-motion: skip the directional sweeps and just fade each row/title
      // in as it scrolls into view.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.from("[data-awards-title]", {
          autoAlpha: 0,
          duration: 0.5,
          ease: "power1.out",
          scrollTrigger: { trigger: "[data-awards-band]", start: "top 85%", once: true },
        });

        gsap.utils.toArray<HTMLElement>("[data-award-row]").forEach((row) => {
          gsap.from(row, {
            autoAlpha: 0,
            duration: 0.5,
            ease: "power1.out",
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
          });
        });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section id="awards" ref={scope} className="bg-white">
      {/* Same box as the `#book` section: constrained on desktop, full-bleed on
          mobile (no horizontal padding below `md`). */}
      <div className="mx-auto max-w-[1200px] pb-14 md:px-10 md:py-24">
        <div data-awards-band className="overflow-hidden bg-brand px-6 py-12 md:px-14 md:py-16">
          <h2
            data-awards-title
            className="text-[38px] font-bold leading-[1.05] tracking-[-1px] text-white sm:text-[44px] md:text-[52px]"
          >
            {/* On mobile the title breaks as "Awards and" / "Mentions", per the
                design — so the break is explicit rather than left to wrapping. */}
            Awards and{" "}
            <span className="block sm:inline">Mentions</span>
          </h2>
        </div>

        <div className="overflow-hidden px-6 pt-6 md:px-14 md:pt-8">
          <ul>
            {awards.map((a, i) => (
              <li key={a.name} data-award-row>
                {/* Short brand-red rule, left-aligned — the separator from the
                    design, not a full-width hairline. */}
                {i > 0 && (
                  <span
                    data-award-rule
                    aria-hidden="true"
                    className="block h-0.5 w-[10%] min-w-[56px] bg-brand"
                  />
                )}
                <div className="grid grid-cols-[1fr_auto] items-center gap-6 py-8 sm:gap-10 md:py-10">
                  <div data-award-copy>
                    <h3 className="text-[22px] font-bold leading-[1.15] tracking-[-0.6px] text-ink sm:text-[26px] md:text-[30px]">
                      {a.name}
                    </h3>
                    <p className="mt-2.5 text-[13px] font-semibold uppercase leading-[1.5] tracking-[1.2px] text-brand">
                      {a.distinction} <span className="text-muted">{a.year}</span>
                    </p>
                  </div>
                  <div
                    data-award-logo
                    className="relative h-[84px] w-[84px] flex-none sm:h-[104px] sm:w-[104px]"
                  >
                    <Image
                      src={a.logo}
                      alt={`${a.name} logo`}
                      fill
                      sizes="104px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
