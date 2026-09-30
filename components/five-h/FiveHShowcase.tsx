"use client";

import { DEFAULT_APPROACH_COPY, type ApproachCopy } from "@/lib/approach-copy";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const FACULTY_COLORS = ["#6d3474", "#292c69", "#0b773e", "#e7bf09", "#d84238"];

function slotFor(index: number, active: number) {
  const distance = (index - active + FACULTY_COLORS.length) % FACULTY_COLORS.length;
  return distance > 2 ? distance - FACULTY_COLORS.length : distance;
}

// The image has unequal slices. These angles put each slice's midpoint at 12 o'clock.
const WHEEL_ANGLES = [0, -75, -165, -240, -300];

function wheelRotationForStep(step: number) {
  const index = ((step % FACULTY_COLORS.length) + FACULTY_COLORS.length) % FACULTY_COLORS.length;
  const turns = Math.floor(step / FACULTY_COLORS.length);
  return WHEEL_ANGLES[index] - turns * 360;
}

export default function FiveHShowcase({
  heading = DEFAULT_APPROACH_COPY.fiveH.heading,
  faculties = DEFAULT_APPROACH_COPY.fiveH.faculties,
}: { heading?: string; faculties?: ApproachCopy["fiveH"]["faculties"] }) {
  const FACULTIES = faculties.map((faculty, index) => ({ ...faculty, color: FACULTY_COLORS[index] }));
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const wheelRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const wheelStepsRef = useRef(0);
  const timelineRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const swipeStartRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
  const suppressClickUntilRef = useRef(0);

  const { contextSafe } = useGSAP(() => {
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const slot = slotFor(index, activeRef.current);
      gsap.set(card, {
        xPercent: slot * 105,
        y: slot === 0 ? 0 : 28,
        autoAlpha: Math.abs(slot) <= 1 ? 1 : 0,
        zIndex: slot === 0 ? 3 : 1,
      });
    });
    if (wheelRef.current) gsap.set(wheelRef.current, { rotation: 0 });
    return () => timelineRef.current?.kill();
  }, { scope: rootRef });

  const selectCard = contextSafe((index: number) => {
    const direction = slotFor(index, activeRef.current);
    if (Math.abs(direction) !== 1) return;

    activeRef.current = index;
    wheelStepsRef.current += direction;
    setActive(index);

    timelineRef.current?.kill();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeline = gsap.timeline({ defaults: { duration: reduceMotion ? 0 : 0.78, ease: "power3.inOut" } });
    timelineRef.current = timeline;

    cardRefs.current.forEach((card, cardIndex) => {
      if (!card) return;
      const slot = slotFor(cardIndex, index);
      timeline.set(card, { zIndex: slot === 0 ? 3 : 1 }, 0);
      timeline.to(card, {
        xPercent: slot * 105,
        y: slot === 0 ? 0 : 28,
        autoAlpha: Math.abs(slot) <= 1 ? 1 : 0,
      }, 0);
    });

    if (wheelRef.current) {
      timeline.to(wheelRef.current, { rotation: wheelRotationForStep(wheelStepsRef.current) }, 0);
    }
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      selectCard((activeRef.current + 1) % FACULTY_COLORS.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [selectCard]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch" || !event.isPrimary) return;
    suppressClickUntilRef.current = 0;
    swipeStartRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStartRef.current;
    if (!start || start.pointerId !== event.pointerId) return;
    swipeStartRef.current = null;

    const distanceX = event.clientX - start.x;
    const distanceY = event.clientY - start.y;
    if (Math.abs(distanceX) < 45 || Math.abs(distanceX) < Math.abs(distanceY) * 1.2) return;

    suppressClickUntilRef.current = Date.now() + 450;
    const nextIndex = (activeRef.current + (distanceX < 0 ? 1 : -1) + FACULTY_COLORS.length) % FACULTY_COLORS.length;
    selectCard(nextIndex);
  };

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (Date.now() >= suppressClickUntilRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickUntilRef.current = 0;
  };

  return (
    <section ref={rootRef} id="the-five-h" className="overflow-clip border-b border-black/5 bg-[#dedede]">
      <div className="mx-auto max-w-[1440px] px-6 pb-0 pt-12 md:px-10 md:pt-20">
        <h2 className="max-w-[720px] font-serif text-[30px] font-semibold leading-[1.18] tracking-[-0.55px] text-ink sm:text-[38px] lg:max-w-none lg:text-[42px]">
          {heading}
        </h2>

        <div
          className="relative mx-auto mt-14 max-w-[900px] sm:mt-16"
          style={{ touchAction: "pan-y" }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => { swipeStartRef.current = null; }}
          onClickCapture={handleClickCapture}
        >
          <div className="relative grid">
            {FACULTIES.map((faculty, index) => {
              const slot = slotFor(index, active);
              const initiallySelected = index === 0;
              return (
                <article
                  key={index}
                  ref={(node) => { cardRefs.current[index] = node; }}
                  className="relative col-start-1 row-start-1 w-[80%] justify-self-center overflow-hidden rounded-[10px] bg-[#f8f8f8] shadow-[0_1px_0_rgba(55,50,52,0.03)] will-change-transform"
                  style={{
                    opacity: initiallySelected ? 1 : 0,
                    visibility: initiallySelected ? "visible" : "hidden",
                    zIndex: initiallySelected ? 3 : 1,
                  }}
                >
                  <div className="h-5" style={{ backgroundColor: faculty.color }} />
                  <div aria-hidden={slot !== 0} className="px-5 pb-6 pt-4 text-center sm:px-10 sm:pb-7">
                    <h3 className="text-[19px] font-bold uppercase leading-none text-ink sm:text-[20px]">{faculty.name}</h3>
                    <p className="mt-2 text-[13px] font-normal uppercase leading-none text-ink sm:text-[14px]">{faculty.intelligence}</p>
                    <p className="mx-auto mt-5 max-w-[420px] text-[14px] leading-[1.65] text-ink sm:text-[15px]">{faculty.description}</p>
                    <p className="mx-auto mt-4 max-w-[440px] text-[12px] font-normal leading-[1.8] sm:text-[13px]" style={{ color: faculty.color }}>
                      {faculty.dimensions.slice(0, 3).join(" · ")}<br className="hidden sm:block" /> {faculty.dimensions.slice(3).join(" · ")}
                    </p>
                  </div>
                  {Math.abs(slot) === 1 && (
                    <button
                      type="button"
                      aria-label={`Show ${faculty.name} in the centre`}
                      onClick={() => selectCard(index)}
                      className="absolute inset-0 z-10 cursor-pointer rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#292c69]"
                    />
                  )}
                </article>
              );
            })}
          </div>

          <div className="relative z-20 mx-auto -mt-7 h-[104px] overflow-hidden sm:-mt-9 sm:h-[126px]">
            <div className="absolute inset-x-0 top-0 flex justify-center">
              <div ref={wheelRef} className="h-[240px] w-[240px] flex-none will-change-transform sm:h-[290px] sm:w-[290px]">
                <Image aria-hidden="true" alt="" src="/approach-5h-ring.png" width={636} height={636} className="h-full w-full" />
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label={`Show previous 5H intelligence: ${FACULTIES[(active + FACULTIES.length - 1) % FACULTIES.length].name}`}
            onClick={() => selectCard((active + FACULTIES.length - 1) % FACULTIES.length)}
            className="absolute left-0 top-[42%] z-30 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 text-ink shadow-sm transition-colors hover:bg-white sm:size-10"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            aria-label={`Show next 5H intelligence: ${FACULTIES[(active + 1) % FACULTIES.length].name}`}
            onClick={() => selectCard((active + 1) % FACULTIES.length)}
            className="absolute right-0 top-[42%] z-30 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white/90 text-ink shadow-sm transition-colors hover:bg-white sm:size-10"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
          <span className="sr-only" aria-live="polite">{FACULTIES[active].name} selected</span>
        </div>
      </div>
    </section>
  );
}
