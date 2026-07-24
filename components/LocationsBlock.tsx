"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { offices as defaultOffices, type Office } from "@/lib/offices";
import LocationsCarousel from "./LocationsCarousel";

// Keep Leaflet out of the initial homepage bundle — it only loads when the
// section scrolls into view (see the IntersectionObserver below).
const LocationsMap = dynamic(() => import("./LocationsMap"), { ssr: false });

/**
 * Homepage "Our offices" block (feature 003): a non-interactive Leaflet map with a
 * pin, a city carousel, and the active office's contact details. Falls back to a
 * plain office list when the map can't load (network / tile error).
 */
export default function LocationsBlock({
  offices = defaultOffices,
  eyebrow = "Our offices",
}: {
  offices?: Office[];
  eyebrow?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  // Leaflet + CARTO Voyager tiles need no token; fallback is used only on a real error.
  const [mapFailed, setMapFailed] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const active = offices[activeIndex];

  // Swipe left/right on the map itself (mobile) → change office, wrapping around,
  // reusing the same camera + pin animation as the carousel.
  const touch = useRef<{ x: number; y: number } | null>(null);
  const go = (delta: number) =>
    setActiveIndex((i) => (i + delta + offices.length) % offices.length);

  // Lazy-mount the map only when the section is near the viewport (protect LCP).
  useEffect(() => {
    if (!sectionRef.current) return;
    const el = sectionRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Honor the OS reduced-motion preference (jump instead of fly).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <section ref={sectionRef} id="offices" className="bg-paper">
      <div className="py-24">
        <div className="mx-auto mb-12 max-w-[1200px] px-6 md:px-10">
          <div className="flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">
              {eyebrow}
            </span>
          </div>
        </div>

        {mapFailed ? (
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <OfficeGrid offices={offices} />
          </div>
        ) : (
          <>
            {/* Map — full-bleed on mobile (no side gaps), centered + contained on
                desktop. Fixed height avoids layout shift when it lazily mounts.
                Horizontal swipe changes office; `touch-pan-y` keeps the page
                scrolling vertically. */}
            <div
              className="relative h-[340px] w-full touch-pan-y overflow-hidden border-y border-line bg-[#e9e6e3] md:mx-auto md:h-[360px] md:max-w-[560px] md:border"
              onTouchStart={(e) => {
                touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
              }}
              onTouchEnd={(e) => {
                if (!touch.current) return;
                const dx = e.changedTouches[0].clientX - touch.current.x;
                const dy = e.changedTouches[0].clientY - touch.current.y;
                if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
                  go(dx < 0 ? 1 : -1);
                }
                touch.current = null;
              }}
            >
              {inView && (
                <LocationsMap
                  office={active}
                  animate={!reduceMotion}
                  onError={() => setMapFailed(true)}
                  className="h-full w-full"
                />
              )}
            </div>

            <div className="mx-auto mt-8 max-w-[560px] px-6">
              <LocationsCarousel
                offices={offices}
                activeIndex={activeIndex}
                onChange={setActiveIndex}
              />

              <div className="mt-8 text-center">
                <p className="text-[15px] leading-[1.7] text-muted">
                  {active.addressLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                {active.tel && (
                  <p className="mt-1 text-[15px] leading-[1.7] text-muted">Tel: {active.tel}</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/** Static fallback used when the map can't load — mirrors the previous grid. */
function OfficeGrid({ offices }: { offices: Office[] }) {
  return (
    <div className="grid grid-cols-1 gap-x-20 gap-y-4 sm:grid-cols-2">
      {offices.map((o) => (
        <div key={o.slug} className="py-8">
          <h3 className="mb-4 text-[22px] font-bold uppercase tracking-[0.5px] text-ink">
            {o.city}
          </h3>
          <p className="text-[15px] leading-[1.7] text-muted">
            {o.addressLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
          {o.tel && (
            <p className="mt-1 text-[15px] leading-[1.7] text-muted">Tel: {o.tel}</p>
          )}
          <span className="mt-6 block h-[3px] w-8 bg-brand" />
        </div>
      ))}
    </div>
  );
}
