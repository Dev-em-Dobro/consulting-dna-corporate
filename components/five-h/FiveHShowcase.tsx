"use client";

import Image from "next/image";
import { useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Faculty = {
  name: string;
  intelligence: string;
  description: string;
  dimensions: string[];
  color: string;
};

// Clockwise order in the supplied wheel image.
const FACULTIES: Faculty[] = [
  {
    name: "Head",
    intelligence: "Cognitive intelligence",
    description: "The clarity to think critically, reason strategically and make sense of complexity.",
    dimensions: ["Critical Thinking", "Risk Appetite", "Growth Mindset", "Scenario Planning", "Navigating Complexity"],
    color: "#6d3474",
  },
  {
    name: "Hands",
    intelligence: "Execution intelligence",
    description: "The drive to take action, own outcomes and deliver real results.",
    dimensions: ["Resourcefulness", "Role Modelling", "Accountability", "Stakeholder Centricity", "Action Oriented"],
    color: "#292c69",
  },
  {
    name: "Habits",
    intelligence: "Behavioural intelligence",
    description: "The discipline to show up consistently, lead by example and build lasting trust.",
    dimensions: ["Listening & Questioning", "Leading with Why", "Consistency", "Ownership", "Transparency"],
    color: "#0b773e",
  },
  {
    name: "Hunch",
    intelligence: "Intuitive intelligence",
    description: "The instinct to sense patterns, stay curious and make timely, wise decisions.",
    dimensions: ["Judgement & Discernment", "Curiosity", "Sensing & Sensemaking", "Insightfulness", "Accelerated Decisioning"],
    color: "#e7bf09",
  },
  {
    name: "Heart",
    intelligence: "Emotional intelligence",
    description: "The courage to lead with empathy, authenticity and emotional connection.",
    dimensions: ["Courage & Resilience", "Empathy", "Authentic Energy", "Interpersonal Savvy", "Connection & Collaboration"],
    color: "#d84238",
  },
];

function slotFor(index: number, active: number) {
  const distance = (index - active + FACULTIES.length) % FACULTIES.length;
  return distance > 2 ? distance - FACULTIES.length : distance;
}

// The image has unequal slices. These angles put each slice's midpoint at 12 o'clock.
const WHEEL_ANGLES = [0, -75, -165, -240, -300];

function wheelRotationForStep(step: number) {
  const index = ((step % FACULTIES.length) + FACULTIES.length) % FACULTIES.length;
  const turns = Math.floor(step / FACULTIES.length);
  return WHEEL_ANGLES[index] - turns * 360;
}

export default function FiveHShowcase() {
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
    const nextIndex = (activeRef.current + (distanceX < 0 ? 1 : -1) + FACULTIES.length) % FACULTIES.length;
    selectCard(nextIndex);
  };

  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (Date.now() >= suppressClickUntilRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickUntilRef.current = 0;
  };

  return (
    <section ref={rootRef} id="the-five-h" className="overflow-clip border-y border-black/5 bg-[#dedede]">
      <div className="mx-auto max-w-[1180px] px-6 pb-0 pt-12 md:px-10 md:pt-20">
        <h2 className="max-w-[720px] font-serif text-[36px] font-semibold leading-[1.18] tracking-[-0.75px] text-ink sm:text-[46px] lg:text-[54px]">
          Five intelligences. One whole leader.
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
                  key={faculty.name}
                  ref={(node) => { cardRefs.current[index] = node; }}
                  className="relative col-start-1 row-start-1 w-[80%] justify-self-center overflow-hidden rounded-[10px] bg-[#f8f8f8] shadow-[0_1px_0_rgba(55,50,52,0.03)] will-change-transform"
                  style={{
                    opacity: initiallySelected ? 1 : 0,
                    visibility: initiallySelected ? "visible" : "hidden",
                    zIndex: initiallySelected ? 3 : 1,
                  }}
                >
                  <div className="h-7" style={{ backgroundColor: faculty.color }} />
                  <div aria-hidden={slot !== 0} className="px-5 pb-7 pt-5 text-center sm:px-10 sm:pb-8">
                    <h3 className="text-[23px] font-bold uppercase leading-none text-ink">{faculty.name}</h3>
                    <p className="mt-3 text-[15px] font-normal uppercase leading-none text-ink sm:text-[16px]">{faculty.intelligence}</p>
                    <p className="mx-auto mt-7 max-w-[420px] text-[15px] leading-[1.85] text-ink sm:text-[16px]">{faculty.description}</p>
                    <p className="mx-auto mt-5 max-w-[440px] text-[14px] font-normal leading-[2.05] sm:text-[16px]" style={{ color: faculty.color }}>
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

          <div className="relative z-20 mx-auto -mt-7 h-[90px] overflow-hidden sm:-mt-9 sm:h-[110px]">
            <div className="absolute inset-x-0 top-0 flex justify-center">
              <div ref={wheelRef} className="h-[220px] w-[220px] flex-none will-change-transform sm:h-[270px] sm:w-[270px]">
                <Image aria-hidden="true" alt="" src="/approach-5h-ring.png" width={636} height={636} className="h-full w-full" />
              </div>
            </div>
          </div>
          <span className="sr-only" aria-live="polite">{FACULTIES[active].name} selected</span>
        </div>
      </div>
    </section>
  );
}
