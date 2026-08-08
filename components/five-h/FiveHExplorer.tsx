"use client";

import { useState } from "react";
import { FIVE_H } from "./five-h-data";

/**
 * The "Inner and Outer Game" selector. Five faculties sit on a tablist; picking
 * one crossfades a detail panel below. Perspective/People/Perception belong to the Inner
 * Game, Performance/Persistence to the Outer Game — the divider makes that split visible.
 */
export default function FiveHExplorer() {
  const [active, setActive] = useState(0);
  const current = FIVE_H[active];
  const Icon = current.icon;

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % FIVE_H.length);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + FIVE_H.length) % FIVE_H.length);
    }
  }

  return (
    <div>
      {/* Tablist */}
      <div
        role="tablist"
        aria-label="The five faculties of the 5P Framework"
        onKeyDown={onKeyDown}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        {FIVE_H.map((h, i) => {
          const selected = i === active;
          const Glyph = h.icon;
          return (
            <button
              key={h.key}
              role="tab"
              id={`fh-tab-${h.key}`}
              aria-selected={selected}
              aria-controls="fh-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`group flex flex-col items-center gap-3 rounded-lg border px-4 py-6 text-center transition-all duration-200 outline-none ${
                selected
                  ? "border-transparent"
                  : "border-white/12 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]"
              }`}
              style={
                selected
                  ? { backgroundColor: h.color, color: "#fff" }
                  : undefined
              }
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full transition-colors"
                style={{
                  backgroundColor: selected ? "rgba(255,255,255,0.18)" : `${h.color}1f`,
                  color: selected ? "#fff" : h.color,
                }}
              >
                <Glyph className="h-7 w-7" />
              </span>
              <span className="text-[15px] font-bold tracking-[1.5px]">
                {h.label}
              </span>
              <span
                className={`text-[11px] font-semibold uppercase tracking-[1.5px] ${
                  selected ? "text-white/80" : "text-white/45"
                }`}
              >
                {h.verb}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail panel — re-keyed on `active` so the fade replays each switch. */}
      <div
        key={current.key}
        id="fh-panel"
        role="tabpanel"
        aria-labelledby={`fh-tab-${current.key}`}
        className="fh-fade mt-8 flex flex-col items-start gap-6 rounded-xl border border-white/12 bg-white/[0.04] p-8 sm:flex-row sm:items-center md:p-10"
      >
        <span
          className="flex h-20 w-20 flex-none items-center justify-center rounded-full"
          style={{ backgroundColor: `${current.color}26`, color: current.color }}
        >
          <Icon className="h-10 w-10" />
        </span>
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h3
              className="text-[26px] font-bold tracking-[2px]"
              style={{ color: current.color }}
            >
              {current.label}
            </h3>
            <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[1.5px] text-white/70">
              {current.game}
            </span>
          </div>
          <p className="max-w-[54ch] text-[17px] leading-[1.7] text-white/80">
            {current.description}
          </p>
        </div>
      </div>
    </div>
  );
}
