"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function HeroV1() {
  const scope = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const video = videoRef.current;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Built paused: the intro video plays first with everything hidden, and
        // this reveal only runs once the video ends (see `reveal` below).
        const tl = gsap.timeline({ defaults: { ease: "power4.out" }, paused: true });
        // fromTo (not from): the targets start hidden via CSS, so we must state
        // the visible end explicitly — otherwise GSAP would read the hidden CSS
        // value as the destination and animate hidden -> hidden.
        tl.fromTo(
          ".h-bg",
          { autoAlpha: 0, scale: 1.12 },
          { autoAlpha: 1, scale: 1, duration: 1.6, ease: "power2.out" },
          0
        )
          .fromTo(
            ".h-bar",
            { autoAlpha: 0, scaleX: 0, transformOrigin: "left" },
            { autoAlpha: 1, scaleX: 1, duration: 0.6 },
            0.25
          )
          .fromTo(
            ".h-eyebrow",
            { autoAlpha: 0, x: -12 },
            { autoAlpha: 1, x: 0, duration: 0.5 },
            "-=0.3"
          )
          .fromTo(
            ".h-title",
            { autoAlpha: 0, y: 46, skewY: 2 },
            { autoAlpha: 1, y: 0, skewY: 0, duration: 1 },
            "-=0.15"
          )
          .fromTo(
            ".h-sub",
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: 0.8 },
            "-=0.6"
          )
          .fromTo(
            ".h-cta",
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.6 },
            "-=0.5"
          );

        // Reveal the hero content and settle the intro video on its first frame
        // (the iceberg above the water), leaving it as a still background.
        // Guarded so it runs exactly once, whichever trigger fires first: the
        // video ending (happy path), an error, blocked autoplay, or the safety
        // fallback below (so content is never trapped behind a stalled video).
        let fallback = 0;
        let revealed = false;
        const reveal = () => {
          if (revealed) return;
          revealed = true;
          window.clearTimeout(fallback);
          if (video) {
            video.pause();
            // Rewind to the opening iceberg frame and hold it as the backdrop.
            try {
              video.currentTime = 0;
            } catch {
              /* no-op: seeking may fail if metadata never loaded */
            }
          }
          // On mobile the hero is pinned to the clip's 16:9 aspect during
          // playback (full-bleed cover, no bars, no cropped captions). Grow it
          // to its full content height as the content reveals; desktop is
          // unconstrained, so there we just drop the intro flag.
          const section = scope.current;
          if (section) {
            if (window.matchMedia("(max-width: 767px)").matches) {
              const from = section.clientHeight; // the 16:9 intro height (px)
              section.removeAttribute("data-hero"); // release to natural height
              const to = section.clientHeight; // full content height (px)
              gsap.fromTo(
                section,
                { height: from },
                {
                  height: to,
                  duration: 1.1,
                  ease: "power2.inOut",
                  onComplete: () => {
                    section.style.height = "";
                  },
                }
              );
            } else {
              section.removeAttribute("data-hero");
            }
          }
          tl.play();
        };

        // Safety net only: reveal if the video stalls or never fires `ended`.
        // It must never fire before the clip would naturally end, so we size it
        // to the real duration (+ buffer) as soon as that's known — including
        // synchronously here, since the duration may already be available by the
        // time this effect runs, in which case `loadedmetadata` won't fire again.
        // Until the duration is known we use a generous cap longer than any
        // plausible intro.
        const armFallback = () => {
          window.clearTimeout(fallback);
          const dur = video && Number.isFinite(video.duration) ? video.duration : 0;
          fallback = window.setTimeout(reveal, dur > 0 ? dur * 1000 + 4000 : 30000);
        };

        if (video) {
          video.addEventListener("ended", reveal);
          video.addEventListener("error", reveal);
          video.addEventListener("loadedmetadata", armFallback);
          video.addEventListener("durationchange", armFallback);
          armFallback();
          // Muted autoplay is permitted on modern browsers; if it's still
          // blocked, reveal immediately rather than sitting on a frozen frame.
          const p = video.play();
          if (p && typeof p.catch === "function") p.catch(() => reveal());
        } else {
          reveal();
        }

        return () => {
          window.clearTimeout(fallback);
          if (video) {
            video.removeEventListener("ended", reveal);
            video.removeEventListener("error", reveal);
            video.removeEventListener("loadedmetadata", armFallback);
            video.removeEventListener("durationchange", armFallback);
          }
          tl.kill();
        };
      });

      // Reduce-motion: skip the intro playback and show the iceberg frame right
      // away with a plain fade — no travel, scale, skew, or autoplaying motion.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (video) video.pause();
        // Show the full hero immediately — no intro playback, so no 16:9 pin.
        scope.current?.removeAttribute("data-hero");
        gsap.fromTo(
          [".h-bg", ".h-bar", ".h-eyebrow", ".h-title", ".h-sub", ".h-cta"],
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4, ease: "power1.out", stagger: 0.06, delay: 0.05 }
        );
      });

      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section ref={scope} id="top" data-hero="intro" className="relative overflow-hidden bg-black">
      {/* Intro video: plays full-bleed with all hero content hidden, then stops
          and rewinds to its first frame (the iceberg) once the reveal runs.
          Poster = that same first frame, so first paint is instant. WebM first
          (smallest), MP4 fallback for Safari; audio stripped since it's muted. */}
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
        poster="/videos/hero-poster.jpg"
        muted
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
      >
        <source src="/videos/hero-intro.webm" type="video/webm" />
        <source src="/videos/hero-intro.mp4" type="video/mp4" />
      </video>

      {/* Legibility overlay: hidden while the video plays, then fades in with the
          content. Semi-transparent so the iceberg still reads behind the text. */}
      <div className="h-bg pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/45 via-black/55 to-black/75" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 pb-24 pt-[110px] md:px-10">
        <div className="mx-auto max-w-[1000px] text-center">
          <div className="mb-[26px] flex items-center justify-center gap-3">
            <span className="h-bar inline-block h-0.5 w-9 bg-brand" />
            <span className="h-eyebrow text-[13px] font-semibold uppercase tracking-[2px] text-brand">
              Global leadership advisory &amp; executive coaching
            </span>
          </div>
          <h1 className="h-title mb-7 text-[38px] sm:text-[48px] md:text-[64px] font-bold leading-[1.04] tracking-[-1.5px] text-white [text-wrap:balance]">
            When the stakes are high, leadership must become&nbsp;real.
          </h1>
          <p className="h-sub mx-auto mb-8 max-w-[720px] text-xl font-normal leading-[1.55] text-white/85">
            We help CEOs, CHROs and executive teams align leadership, accelerate
            decisions and build the talent required to deliver transformation.
          </p>
          <p className="h-cta mb-9 text-[15px] font-semibold uppercase tracking-[3px] text-white/90">
            Making Leadership Real.{" "}
            <span className="text-brand">Results, Not Promises.</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#contact"
              className="h-cta bg-brand px-[30px] py-4 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-brand-dark"
            >
              Discuss a leadership challenge
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
