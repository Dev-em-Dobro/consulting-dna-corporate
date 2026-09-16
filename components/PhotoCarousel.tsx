"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

type PhotoCarouselProps = {
  /** Image sources (absolute public paths, e.g. "/dna-time/dna-time-01.jpeg"). */
  images: string[];
  /** Milliseconds between automatic slides. */
  interval?: number;
};

export default function PhotoCarousel({
  images,
  interval = 5000,
}: PhotoCarouselProps) {
  const count = images.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => setIndex((i + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  // Auto-advance every `interval` ms. Re-running on `index` means manual
  // navigation also restarts the countdown. Pauses while hovered/focused.
  useEffect(() => {
    if (count <= 1 || paused) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [count, interval, paused, next, index]);

  if (count === 0) return null;

  return (
    <div
      className="group relative mx-auto w-full max-w-[640px] overflow-hidden rounded-xl bg-ink"
      role="region"
      aria-roledescription="carousel"
      aria-label="Life at Corporate DNA"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Sliding track: all slides in a row, shifted by -index * 100%. */}
      <div
        className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div
            key={src}
            aria-hidden={i !== index}
            className="relative aspect-[16/10] w-full shrink-0 sm:aspect-[16/9]"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(min-width: 640px) 640px, 100vw"
              // Eager for all: slides start translated out of the viewport, so
              // lazy loading never fires and the incoming slide arrives blank.
              loading="eager"
              // `cover`, not `contain` — Guli, 31-08: "garantiria que todas as
              // fotos estão redimensionar pra maior, pra não aparecer margens
              // nas fotos fora de proporção." These are photographs of varying
              // aspect, so `contain` letterboxed the odd ones against the dark
              // frame. Cropping is the accepted trade: the frame stays full.
              //
              // Scoped to photographs on purpose. The other `object-contain`
              // uses in the repo are logo lock-ups (LogoMarquee, ClientBandCard,
              // CaseRow, AwardsMentions, our-partnerships) where the whole point
              // is that nothing is cropped — do not carry this change there.
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Prev / next controls */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous image"
        className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-ink shadow-md transition-colors hover:bg-brand hover:text-white md:left-5"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next image"
        className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 text-ink shadow-md transition-colors hover:bg-brand hover:text-white md:right-5"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to image ${i + 1}`}
            aria-current={i === index}
            className={`h-2 cursor-pointer rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
