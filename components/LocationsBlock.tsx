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
  eyebrow = "Our Global Presence",
  context = "From our established hubs in London, Singapore, Dubai and Riyadh, together with our Americas presence, Corporate DNA brings global perspective and locally relevant delivery to leadership challenges across 36 countries.",
}: {
  offices?: Office[];
  eyebrow?: string;
  context?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  // Leaflet + Esri World Light Gray tiles need no token; fallback is used only on a real error.
  const [mapFailed, setMapFailed] = useState(false);
  // Auto-advance pauses permanently once the visitor takes control, and while hovered.
  const [userTook, setUserTook] = useState(false);
  const [hovered, setHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const active = offices[activeIndex];

  // A visitor-driven office change: take over from the auto-advance.
  const selectOffice = (i: number) => {
    setUserTook(true);
    setActiveIndex(i);
  };
  // Swipe left/right on the map itself (mobile) → change office, wrapping around,
  // reusing the same camera + pin animation as the carousel.
  const touch = useRef<{ x: number; y: number } | null>(null);
  const go = (delta: number) => {
    setUserTook(true);
    setActiveIndex((i) => (i + delta + offices.length) % offices.length);
  };

  // Auto-advance through the offices to convey global reach (FR-602). Runs only
  // while the section is in view, motion is allowed, the visitor hasn't taken
  // over, and the block isn't hovered. Wraps infinitely (last → London).
  useEffect(() => {
    if (!inView || reduceMotion || userTook || hovered || offices.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % offices.length);
    }, 6000);
    return () => clearInterval(id);
  }, [inView, reduceMotion, userTook, hovered, offices.length]);

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
          {context ? (
            <p className="mt-4 max-w-[640px] text-[15px] leading-[1.6] text-muted md:text-[16px]">
              {context}
            </p>
          ) : null}
        </div>

        {mapFailed ? (
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <OfficeGrid offices={offices} />
          </div>
        ) : (
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
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
              {/* All-office index strip + divider — mirrors the legacy "our
                  offices" header so every city is visible at a glance, not just
                  the active one in the carousel. Each name selects its office. */}
              <div className="mb-8 border-b border-muted/30 pb-6">
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] font-semibold uppercase tracking-[2px]">
                  {offices.map((o, i) => (
                    <span key={o.slug} className="flex items-center gap-x-3">
                      {i > 0 && (
                        <span aria-hidden className="text-muted/40">
                          ·
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => selectOffice(i)}
                        aria-current={i === activeIndex ? "true" : undefined}
                        className={
                          "cursor-pointer transition-colors " +
                          (i === activeIndex
                            ? "text-ink"
                            : "text-muted hover:text-ink")
                        }
                      >
                        {o.city}
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <LocationsCarousel
                offices={offices}
                activeIndex={activeIndex}
                onChange={selectOffice}
              />

              {/* Divider above the address mirrors the one under the office
                  strip, so the active city name sits framed between two lines.
                  Fixed min-height so switching offices (2–3 address lines ± tel)
                  never shifts the surrounding page — the "dancing footer" fix. */}
              <div className="mt-8 min-h-[128px] border-t border-muted/30 pt-8 text-center">
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
          </div>
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
