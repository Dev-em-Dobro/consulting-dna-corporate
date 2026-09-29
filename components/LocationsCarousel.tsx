"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Office } from "@/lib/offices";

/**
 * Controlled city-name carousel (feature 003). The active city is centered, bold
 * and dark; neighbours are faded and peek in from the sides. Navigation via
 * arrows, clicking a city, swipe, or keyboard. See contracts/components.md.
 */
export default function LocationsCarousel({
  offices,
  activeIndex,
  onChange,
  tone = "paper",
}: {
  offices: Office[];
  activeIndex: number;
  onChange: (index: number) => void;
  /** Mirrors `LocationsBlock`'s own `tone` — see the note on that prop. */
  tone?: "paper" | "dark";
}) {
  const dark = tone === "dark";
  const n = offices.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [offset, setOffset] = useState(0);
  const touchX = useRef<number | null>(null);

  const go = (delta: number) => onChange((activeIndex + delta + n) % n);

  // Center the active item exactly in the viewport. `offsetLeft`/`offsetWidth`
  // ignore the track's transform, so this is an absolute target that's correct
  // whether or not a transition is mid-flight.
  const recenter = useCallback(() => {
    const vp = viewportRef.current;
    const item = itemRefs.current[activeIndex];
    if (!vp || !item) return;
    setOffset(vp.clientWidth / 2 - (item.offsetLeft + item.offsetWidth / 2));
  }, [activeIndex]);

  useLayoutEffect(() => {
    recenter();
  }, [recenter, n]);

  // Re-center once the web font has loaded (it changes the name widths) and on
  // any resize — both would otherwise leave the active name slightly off-center.
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) recenter();
    });
    const ro = new ResizeObserver(() => recenter());
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [recenter]);

  return (
    <div className="relative">
      {/* Edge fades. These have to track the section's ground exactly — a
          `from-paper` fade left on a dark block reads as two grey smudges
          bracketing the city name, not as a fade. */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 z-[5] w-16 bg-gradient-to-r to-transparent ${
          dark ? "from-ink-2" : "from-paper"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 z-[5] w-16 bg-gradient-to-l to-transparent ${
          dark ? "from-ink-2" : "from-paper"
        }`}
      />

      <div
        ref={viewportRef}
        className="overflow-hidden"
        role="tablist"
        aria-label="Offices"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
          if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <div
          className="flex items-center gap-10 whitespace-nowrap transition-transform duration-500 ease-out will-change-transform"
          style={{ transform: `translateX(${offset}px)` }}
        >
          {offices.map((o, i) => {
            const active = i === activeIndex;
            return (
              <button
                key={o.slug}
                ref={(el) => { itemRefs.current[i] = el; }}
                type="button"
                role="tab"
                aria-selected={active}
                aria-current={active ? "true" : undefined}
                tabIndex={active ? 0 : -1}
                onClick={() => onChange(i)}
                className={
                  "shrink-0 cursor-pointer text-[34px] font-bold uppercase tracking-[1px] transition-colors sm:text-[42px] " +
                  (active
                    ? dark
                      ? "text-white"
                      : "text-ink"
                    : dark
                      ? "text-white/25 hover:text-white/50"
                      : "text-ink/25 hover:text-ink/50")
                }
              >
                {o.city}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
