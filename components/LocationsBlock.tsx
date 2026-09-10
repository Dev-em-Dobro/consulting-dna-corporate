"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { offices as defaultOffices, type Office } from "@/lib/offices";
import LocationsCarousel from "./LocationsCarousel";
import TypeLabel from "./TypeLabel";

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
  tone = "paper",
  maxWidthClass = "max-w-[1200px]",
  typeLabel = false,
}: {
  offices?: Office[];
  eyebrow?: string;
  context?: string;
  /**
   * Largura do container do cabeçalho e da lista de fallback.
   *
   * Existe desde 10-09, quando a home subiu de 1200 para 1440: este bloco
   * continuava em 1200 e passava a abrir 120px à direita de todas as seções
   * vizinhas, o que numa faixa de cor só lê como defeito de alinhamento.
   *
   * Prop com o padrão antigo, e não uma troca do número aqui dentro, porque o
   * bloco também roda na /our-clients, na /our-team e na /home-v3, que seguem
   * em 1200 — mudar a constante alinharia a home e desalinharia as outras três.
   * Mesmo padrão do `maxWidthClass` da NavV2.
   *
   * Só o cabeçalho e o fallback mudam: o mapa e o carrossel são presos em
   * 560px por desenho próprio e não acompanham a coluna da página.
   */
  maxWidthClass?: string;
  /**
   * Renderiza o rótulo pelo <TypeLabel> (14px/500/1,3px) em vez do span local
   * de 13px/600/2px, acompanhando o `tone` para o contraste sobre fundo escuro.
   *
   * Existe para a home, que em 10-09 adotou o TypeLabel em todos os rótulos de
   * seção. Desligado por padrão: /our-clients, /our-team e /home-v3 renderizam
   * este bloco com o rótulo de antes. Mesmo padrão de `maxWidthClass`.
   */
  typeLabel?: boolean;
  /**
   * Ground the block sits on. `dark` is Guli's 31-08 fix for the homepage,
   * where this block and the book block above it were both light grey and
   * adjacent — the same collision he solved on Client Impact with red.
   *
   * A prop rather than a change to the component, because the block also runs
   * on Our Clients and Our Team, where it has different neighbours (a
   * black-and-white photograph, and the footer) and no collision to fix.
   * Darkening those uninvited would be inventing a decision he did not make.
   *
   * `ink-2` and not `ink`: the book block's card directly above is `ink`, so
   * reusing it would rhyme two dark masses across a thin paper gap. `ink-2` is
   * the darker of the two and reads as the "quase preto" he asked for.
   */
  tone?: "paper" | "dark";
}) {
  const dark = tone === "dark";
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
    <section
      ref={sectionRef}
      id="offices"
      className={dark ? "bg-ink-2" : "bg-paper"}
    >
      <div className="py-24">
        <div className={`mx-auto mb-12 ${maxWidthClass} px-6 md:px-10`}>
          {typeLabel ? (
            <TypeLabel onDark={dark}>{eyebrow}</TypeLabel>
          ) : (
            <div className="flex items-baseline gap-3">
              <span className="inline-block h-0.5 w-9 bg-brand" />
              <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">
                {eyebrow}
              </span>
            </div>
          )}
          {context ? (
            <p
              className={`mt-4 max-w-[640px] text-[15px] leading-[1.6] md:text-[16px] ${
                dark ? "text-white/70" : "text-muted"
              }`}
            >
              {context}
            </p>
          ) : null}
        </div>

        {mapFailed ? (
          <div className={`mx-auto ${maxWidthClass} px-6 md:px-10`}>
            <OfficeGrid offices={offices} dark={dark} />
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
              className={`relative h-[340px] w-full touch-pan-y overflow-hidden border-y bg-[#e9e6e3] md:mx-auto md:h-[360px] md:max-w-[560px] md:border ${
                dark ? "border-white/15" : "border-line"
              }`}
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
              <div
                className={`mb-8 border-b pb-6 ${
                  dark ? "border-white/20" : "border-muted/30"
                }`}
              >
                <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] font-semibold uppercase tracking-[2px]">
                  {offices.map((o, i) => (
                    <span key={o.slug} className="flex items-center gap-x-3">
                      {i > 0 && (
                        <span
                          aria-hidden
                          className={dark ? "text-white/30" : "text-muted/40"}
                        >
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
                            ? dark
                              ? "text-white"
                              : "text-ink"
                            : dark
                              ? "text-white/50 hover:text-white"
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
                tone={tone}
              />

              {/* Divider above the address mirrors the one under the office
                  strip, so the active city name sits framed between two lines.
                  Fixed min-height so switching offices (2–3 address lines ± tel)
                  never shifts the surrounding page — the "dancing footer" fix. */}
              <div
                className={`mt-8 min-h-[128px] border-t pt-8 text-center ${
                  dark ? "border-white/20" : "border-muted/30"
                }`}
              >
                <p
                  className={`text-[15px] leading-[1.7] ${
                    dark ? "text-white/70" : "text-muted"
                  }`}
                >
                  {active.addressLines.map((line, i) => (
                    <span key={i} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                {active.tel && (
                  <p
                    className={`mt-1 text-[15px] leading-[1.7] ${
                      dark ? "text-white/70" : "text-muted"
                    }`}
                  >
                    Tel: {active.tel}
                  </p>
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
function OfficeGrid({ offices, dark }: { offices: Office[]; dark: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-x-20 gap-y-4 sm:grid-cols-2">
      {offices.map((o) => (
        <div key={o.slug} className="py-8">
          <h3
            className={`mb-4 text-[22px] font-bold uppercase tracking-[0.5px] ${
              dark ? "text-white" : "text-ink"
            }`}
          >
            {o.city}
          </h3>
          <p
            className={`text-[15px] leading-[1.7] ${
              dark ? "text-white/70" : "text-muted"
            }`}
          >
            {o.addressLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
          {o.tel && (
            <p
              className={`mt-1 text-[15px] leading-[1.7] ${
                dark ? "text-white/70" : "text-muted"
              }`}
            >
              Tel: {o.tel}
            </p>
          )}
          <span className="mt-6 block h-[3px] w-8 bg-brand" />
        </div>
      ))}
    </div>
  );
}
