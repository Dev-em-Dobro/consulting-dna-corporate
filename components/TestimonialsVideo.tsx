"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Homepage testimonials "metralhadora" video (006 FR-402/403): a rapid-cut
 * stitched-testimonials reel shown immediately before the Client-Impact
 * section. Autoplays muted + looping with `playsInline`; under
 * `prefers-reduced-motion` it does not autoplay and exposes controls instead.
 *
 * The real reel is delivered later — until a `src` is provided this renders a
 * placeholder, so swapping in the video is a one-prop change.
 */
export default function TestimonialsVideo({
  src,
  poster,
  heading = "What Fortune 500 leaders say about us",
}: {
  src?: string;
  poster?: string;
  heading?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;
    if (reduceMotion) v.pause();
    else v.play().catch(() => {});
  }, [reduceMotion, src]);

  return (
    <section id="testimonials" className="bg-paper">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10">
        <div className="mb-2.5 flex items-baseline gap-3">
          <span className="inline-block h-0.5 w-9 bg-brand" />
          <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">
            In their words
          </span>
        </div>
        <h2 className="mb-10 max-w-[760px] text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-ink">
          {heading}
        </h2>

        <div className="relative aspect-video w-full overflow-hidden border border-line bg-ink">
          {src ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={src}
              poster={poster}
              muted
              loop
              playsInline
              autoPlay={!reduceMotion}
              controls={reduceMotion}
              preload="metadata"
            />
          ) : (
            // Placeholder until the real testimonials reel is delivered.
            <div className="flex h-full w-full items-center justify-center px-6 text-center text-[13.5px] font-semibold uppercase tracking-[1.5px] text-white/55">
              Testimonials video — coming soon
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
