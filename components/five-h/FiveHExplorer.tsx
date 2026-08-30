"use client";

import { useEffect, useRef, useState } from "react";
import { FIVE_H } from "./five-h-data";

/**
 * The Inner & Outer Game explorer, rebuilt to Guli's 29-08 design.
 *
 * **Why the layout is upside down from before.** The panel sits above the
 * selector, not below it. That is the whole point of his pass: "antes, com os
 * botões em cima, o usuário podia clicar nos botões e não ver o que estava
 * acontecendo embaixo" (01:20). The controls are now the last thing on screen
 * and the thing they change is above them, in view.
 *
 * **Why the panel can't reflow.** Once the buttons are underneath, any height
 * change in the panel moves them out from under the cursor: "se esse container
 * de cima começa a balançar, o botão se perde" (01:56). So every variant of the
 * copy — five descriptions, twenty-five dimension names — is rendered stacked in
 * a single grid cell and faded between. The block is sized by its tallest state
 * at every breakpoint, with no magic pixel height to drift.
 *
 * **The rotation.** Each faculty carries five of the wheel's twenty-five
 * dimensions, cycling like Instagram stories (04:07). One second each until the
 * visitor takes control, three seconds after (04:53). Guli knows a second is not
 * long enough to read and chose it deliberately: "não vamos nos importar tanto
 * com o tempo de leitura no momento, vamos atiçar a curiosidade" (04:43). The
 * active dot is the same size as the rest — the fill changes, not the scale
 * (04:14). None of it links anywhere; asked, he said "não pensei nisso, pensei
 * só no sistema de cards" (06:00).
 *
 * **Screen readers get the set, not the carousel.** A live region ticking every
 * second would be hostile, so the rotating line is `aria-hidden` and the panel
 * carries all five names at once in a visually-hidden list.
 */

/** Milliseconds per dimension before the visitor has touched anything. */
const IDLE_MS = 1000;
/** And after — a readable pace, once they have shown they are reading. */
const ENGAGED_MS = 3000;

/**
 * Row height. Every other measurement in the selector is a ratio of it, taken
 * from `docs/design-guli-29-08/SPEC-5h-explorer.md` — the swatch is a square of
 * exactly this size, so the two cannot drift apart.
 */
const ROW_H = 56;
/** Square swatch, flush to the row's left edge, no padding of its own. */
const SWATCH = ROW_H;
const GAP_AFTER_SWATCH = Math.round(ROW_H * 0.53);
const PAD_RIGHT = Math.round(ROW_H * 0.53);
const DOT_GAP = Math.round(ROW_H * 0.32);
const DOT_IDLE = Math.round(ROW_H * 0.08);
/** The selected dot is more than twice the others — and matches the card's. */
const DOT_ACTIVE = Math.round(ROW_H * 0.18);
const BULLET = Math.round(ROW_H * 0.21);

/** Card and inactive rows share this fill — read off the Figma inspector (03:10). */
const SURFACE = "#353334";

function GameRail({
  label,
  active,
  style,
}: {
  label: string;
  active: boolean;
  style: React.CSSProperties;
}) {
  return (
    <div style={style} className="flex items-center gap-2">
      <span
        className={`text-[9px] font-semibold uppercase tracking-[2px] transition-colors ${
          active ? "text-white/75" : "text-white/35"
        }`}
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        {label}
      </span>
      {/* Solid for the game the selected faculty belongs to, dotted for the
          other — and the two swap as soon as Hands or Habits is picked (02:58). */}
      <span
        aria-hidden
        className="self-stretch border-l-2 transition-colors"
        style={{
          borderLeftStyle: active ? "solid" : "dashed",
          borderLeftColor: active ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.22)",
        }}
      />
    </div>
  );
}

export default function FiveHExplorer() {
  const [active, setActive] = useState(0);
  const [dim, setDim] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const current = FIVE_H[active];
  const Icon = current.icon;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  // Off-screen the rotation is a timer burning for nobody.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || hovered || !inView) return;
    const id = window.setInterval(
      () => setDim((d) => (d + 1) % FIVE_H[active].dimensions.length),
      engaged ? ENGAGED_MS : IDLE_MS,
    );
    return () => window.clearInterval(id);
    // `active` restarts the interval so a freshly picked faculty gets a full
    // beat on its first dimension rather than the tail of the previous one.
  }, [reduceMotion, hovered, inView, engaged, active]);

  function select(i: number) {
    setActive(i);
    setDim(0);
    setEngaged(true);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      select((active + 1) % FIVE_H.length);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      select((active - 1 + FIVE_H.length) % FIVE_H.length);
    }
  }

  return (
    <div ref={rootRef}>
      {/* ── The panel, above the controls and fixed in height ─────────────
          The hover pause lives here and not on the whole component. The
          selector is what you click, so pausing on hover over it froze the
          rotation the moment anyone used it: click a faculty, leave the cursor
          where the click landed, and nothing ever moves again. Reading happens
          in this panel, so this is the only surface where holding still helps. */}
      <div
        id="fh-panel"
        role="tabpanel"
        aria-labelledby={`fh-tab-${current.key}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="rounded-xl p-6 md:p-8"
        style={{ backgroundColor: SURFACE }}
      >
        <div className="flex items-start gap-4">
          <span
            className="flex h-14 w-14 flex-none items-center justify-center rounded-lg transition-colors"
            style={{ backgroundColor: `${current.color}2e`, color: current.color }}
          >
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[2px] text-white/45">
              {current.game}
            </div>
            <div className="mt-0.5 text-[22px] font-bold leading-none tracking-[1.5px] text-white">
              {current.label}
            </div>
            <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[2px] text-white/55">
              {current.verb}
            </div>
          </div>
        </div>

        {/* All five descriptions share one cell, so the block is as tall as the
            longest of them and never resizes on switch. */}
        <div className="mt-6 grid">
          {FIVE_H.map((h, i) => (
            <p
              key={h.key}
              aria-hidden={i !== active}
              className="col-start-1 row-start-1 max-w-[54ch] text-[17px] leading-[1.65] text-white/85 transition-opacity duration-300"
              style={{ opacity: i === active ? 1 : 0 }}
            >
              {h.description}
            </p>
          ))}
        </div>

        {/* Same trick for the rotating line: all twenty-five stacked. */}
        <div className="mt-5 grid">
          {FIVE_H.flatMap((h, hi) =>
            h.dimensions.map((name, di) => {
              const showing = hi === active && di === dim;
              return (
                <span
                  key={`${h.key}-${di}`}
                  aria-hidden
                  className="col-start-1 row-start-1 flex items-center gap-2.5 text-[14px] font-medium transition-opacity duration-300"
                  style={{ color: h.color, opacity: showing ? 1 : 0 }}
                >
                  {/* White, and the same size as the selected dot in the row
                      below — the pairing Guli asked for at 04:14. */}
                  <span
                    className="flex-none rounded-full bg-white"
                    style={{ width: BULLET, height: BULLET }}
                  />
                  {name}
                </span>
              );
            }),
          )}
        </div>

        <ul className="sr-only">
          {current.dimensions.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>

      {/* ── The controls, underneath ────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="The five faculties of 5H"
        onKeyDown={onKeyDown}
        className="mt-4 grid grid-cols-[30px_1fr] gap-x-3 sm:grid-cols-[34px_1fr] sm:gap-x-4"
        style={{ gridTemplateRows: `repeat(5, ${ROW_H}px)`, rowGap: "3px" }}
      >
        <GameRail
          label="Inner Game"
          active={current.game === "Inner Game"}
          style={{ gridColumn: 1, gridRow: "1 / span 3" }}
        />
        <GameRail
          label="Outer Game"
          active={current.game === "Outer Game"}
          style={{ gridColumn: 1, gridRow: "4 / span 2" }}
        />

        {FIVE_H.map((h, i) => {
          const selected = i === active;
          return (
            <button
              key={h.key}
              type="button"
              role="tab"
              id={`fh-tab-${h.key}`}
              aria-selected={selected}
              aria-controls="fh-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              style={{
                gridColumn: 2,
                gridRow: i + 1,
                height: ROW_H,
                paddingRight: PAD_RIGHT,
                backgroundColor: selected ? h.color : SURFACE,
              }}
              // No left padding: the swatch is flush to the edge and the row's
              // radius is what clips its corners.
              className="flex cursor-pointer items-center overflow-hidden rounded-md text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2b2929]"
            >
              {/* Square, the full height of the row. Lighter than the row when
                  selected, a tint of the faculty colour when not. */}
              <span
                aria-hidden
                className="flex-none self-stretch transition-colors"
                style={{
                  width: SWATCH,
                  backgroundColor: selected
                    ? "rgba(255,255,255,0.19)"
                    : `${h.color}2e`,
                }}
              />
              <span
                className="flex-1 text-[14px] font-bold tracking-[1.5px] text-white"
                style={{ marginLeft: GAP_AFTER_SWATCH }}
              >
                {h.label}
              </span>
              {/* Five indicators. The selected one is more than twice the size
                  of the rest, not merely brighter — measured off the print. */}
              <span
                aria-hidden
                className="flex flex-none items-center"
                style={{ gap: DOT_GAP - DOT_IDLE }}
              >
                {h.dimensions.map((_, di) => {
                  const on = selected && di === dim;
                  const size = on ? DOT_ACTIVE : DOT_IDLE;
                  return (
                    <span
                      key={di}
                      className="flex justify-center"
                      style={{ width: DOT_ACTIVE }}
                    >
                      <span
                        className="self-center rounded-full bg-white transition-all"
                        style={{
                          width: size,
                          height: size,
                          opacity: selected ? 1 : 0.35,
                        }}
                      />
                    </span>
                  );
                })}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
