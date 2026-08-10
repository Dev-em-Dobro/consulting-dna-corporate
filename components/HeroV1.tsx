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

        // Reveal the hero content and stop the intro video. Guarded so it runs
        // exactly once, whichever trigger fires first: the video ending (happy
        // path), the video erroring, autoplay being blocked, or the safety
        // fallback below (so content is never trapped behind a stalled video).
        let revealed = false;
        const reveal = () => {
          if (revealed) return;
          revealed = true;
          window.clearTimeout(fallback);
          if (video) video.pause();
          tl.play();
        };

        // Safety net: if the video stalls or never reaches `ended`, reveal after
        // its declared duration (+ buffer), or a fixed cap if metadata is absent.
        let fallback = window.setTimeout(reveal, 15000);
        const onMeta = () => {
          if (!video || !Number.isFinite(video.duration)) return;
          window.clearTimeout(fallback);
          fallback = window.setTimeout(reveal, video.duration * 1000 + 4000);
        };

        if (video) {
          video.addEventListener("ended", reveal);
          video.addEventListener("error", reveal);
          video.addEventListener("loadedmetadata", onMeta);
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
            video.removeEventListener("loadedmetadata", onMeta);
          }
          tl.kill();
        };
      });

      // Reduce-motion: skip the intro video entirely and reveal straight away
      // with a plain fade — no travel, scale, skew, or autoplaying motion.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (video) video.pause();
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
    <section ref={scope} id="top" className="relative overflow-hidden bg-black">
      {/* Intro video: plays full-bleed with all hero content hidden, then stops
          when the reveal timeline runs (triggered by its `ended` event). */}
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        muted
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
      >
        <source src="/videos/hero-intro.mp4" type="video/mp4" />
      </video>

      {/* solid dark background (demo: hero photo removed) — revealed over the
          video's final frame once the intro ends, giving the readable hero. */}
      <div className="h-bg pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-ink via-ink to-black" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 pb-24 pt-[110px] md:px-10">
        <div className="mx-auto max-w-[1000px] text-center">
          <div className="mb-[26px] flex items-center justify-center gap-3">
            <span className="h-bar inline-block h-0.5 w-9 bg-brand" />
            <span className="h-eyebrow text-[13px] font-semibold uppercase tracking-[2px] text-brand">
              Leadership advisory for high-stakes moments
            </span>
          </div>
          <h1 className="h-title mb-7 text-[38px] sm:text-[48px] md:text-[64px] font-bold leading-[1.04] tracking-[-1.5px] text-white [text-wrap:balance]">
            Great strategy only wins when your leaders can carry&nbsp;it.
          </h1>
          <p className="h-sub mx-auto mb-8 max-w-[720px] text-xl font-normal leading-[1.55] text-white/85">
            We partner with CEOs, CHROs and executive teams to sharpen
            decisions, unite the top team and build the leadership their strategy demands.
          </p>
          <p className="h-cta mb-9 text-[15px] font-semibold uppercase tracking-[3px] text-white/90">
            Clarity under pressure.{" "}
            <span className="text-brand">Outcomes that hold.</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#contact"
              className="h-cta bg-brand px-[30px] py-4 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-brand-dark"
            >
              Start a conversation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
