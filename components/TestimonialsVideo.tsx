"use client";

import { useRef, useState } from "react";

/**
 * Homepage testimonials "metralhadora" video (006 FR-402/403): a rapid-cut
 * stitched-testimonials reel shown immediately before the Client-Impact
 * section.
 *
 * Lazy click-to-play: on page load only the lightweight poster image renders —
 * the `<video>` element (and therefore the mp4 download) is not mounted until
 * the visitor clicks play, so the reel never adds loading weight to the initial
 * page open.
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
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    setPlaying(true);
    // The <video> mounts in the same user-gesture tick, so play() is allowed.
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}));
  };

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
          {src && playing ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={src}
              poster={poster}
              controls
              playsInline
              preload="auto"
            />
          ) : src ? (
            // Poster only — the mp4 is not requested until the visitor clicks.
            <button
              type="button"
              onClick={handlePlay}
              aria-label="Play testimonials video"
              className="group relative block h-full w-full cursor-pointer"
            >
              {poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={poster}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
              <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
              <span className="absolute left-1/2 top-1/2 flex h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand shadow-xl transition-transform group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  className="ml-1 h-8 w-8 fill-white"
                  aria-hidden="true"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
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
