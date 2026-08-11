"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  PHONE_MEDIA_QUERY,
  HERO_FRAME_COUNT,
  HERO_FRAME_FPS,
  loadHeroFrames,
} from "@/lib/hero-intro";

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
          const section = scope.current;
          const isMobile = window.matchMedia(PHONE_MEDIA_QUERY).matches;
          if (video) {
            video.pause();
            if (!isMobile) {
              // Desktop: rewind to the opening iceberg frame and hold it as the
              // still backdrop behind the content.
              try {
                video.currentTime = 0;
              } catch {
                /* no-op: seeking may fail if metadata never loaded */
              }
            }
            // Mobile: no rewind and nothing else to do — CSS drops the video
            // from the hero the instant data-hero is removed (below).
          }
          // Grow the pinned mobile hero to its full content height as the
          // content reveals; desktop is unconstrained, so just drop the flag.
          if (section) {
            if (isMobile) {
              const from = section.clientHeight; // the fixed intro height (px)
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

        // Phone/tablet by touch capability, not just width — "Request Desktop
        // Website" fakes a wide viewport on real phones (see lib/hero-intro.ts).
        const isMobile = window.matchMedia(PHONE_MEDIA_QUERY).matches;
        const cleanups: Array<() => void> = [() => tl.kill()];

        // Runs the actual intro. Gated on the preloader below, so it never
        // plays behind the loading screen and its asset is already fully
        // cached — i.e. smooth from the first frame.
        const startIntro = () => {
          // Phones: a GSAP-driven image sequence drawn onto a <canvas>. Plain
          // JavaScript — no autoplay policy applies (iOS Low Power Mode blocks
          // <video> autoplay; large animated images stutter under main-thread
          // load), it always starts by itself, and the tween's onComplete
          // reveals the content at exactly the last frame.
          if (isMobile) {
            const section = scope.current;
            const canvas = section?.querySelector(
              ".hero-canvas"
            ) as HTMLCanvasElement | null;
            if (!section || !canvas) {
              reveal();
              return;
            }
            // Absolute safety net: never trap the visitor if frames stall.
            const cap = window.setTimeout(reveal, 45000);
            cleanups.push(() => window.clearTimeout(cap));

            const play = (frames: Array<HTMLImageElement | null>) => {
              const ctx = canvas.getContext("2d");
              if (revealed || !ctx || !frames.some(Boolean)) {
                reveal();
                return;
              }
              let last = -1;
              const draw = (i: number) => {
                if (i === last) return;
                // A failed frame draws the nearest earlier one — a 1/12s hold
                // is invisible; a blank flash is not.
                let j = i;
                while (j >= 0 && !frames[j]) j--;
                const img = j >= 0 ? frames[j] : null;
                if (!img) return;
                last = i;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                // Hint the browser to decode the next frames off the hot path,
                // so drawImage never waits on a synchronous decode.
                frames[i + 1]?.decode?.().catch(() => {});
                frames[i + 2]?.decode?.().catch(() => {});
              };
              draw(0);
              // Flip the hero from the poster <picture> to the <canvas>
              // (see globals.css: [data-intro="canvas"]).
              section.setAttribute("data-intro", "canvas");
              const state = { f: 0 };
              const tween = gsap.to(state, {
                f: HERO_FRAME_COUNT - 1,
                duration: HERO_FRAME_COUNT / HERO_FRAME_FPS,
                ease: "none",
                onUpdate: () => draw(Math.round(state.f)),
                onComplete: reveal,
              });
              cleanups.push(() => tween.kill());
            };

            // Use the frames the preloader already downloaded; if it was
            // aborted (slow network past its cap), download them ourselves.
            const pre = window.__heroFrames;
            if (pre) play(pre);
            else loadHeroFrames().then(play);
            return;
          }

          // Desktop: <video> intro.
          if (!video) {
            reveal();
            return;
          }
          // iOS/Safari refuses inline autoplay unless the element is *actually*
          // muted at play() time — force it (plus playsinline) before playing.
          video.muted = true;
          video.defaultMuted = true;
          video.setAttribute("muted", "");
          video.setAttribute("playsinline", "");

          video.addEventListener("ended", reveal);
          video.addEventListener("error", reveal);
          video.addEventListener("loadedmetadata", armFallback);
          video.addEventListener("durationchange", armFallback);
          armFallback();

          // Start playback from JS. Try immediately and again as the media
          // becomes ready; if autoplay is blocked, start on the first gesture.
          let started = false;
          const interactionEvents = ["touchstart", "pointerdown", "click", "keydown", "scroll"];
          const stopInteraction = () => {
            interactionEvents.forEach((ev) => window.removeEventListener(ev, tryPlay));
          };
          function tryPlay() {
            if (revealed || started) return;
            const p = video!.play();
            if (p && typeof p.then === "function") {
              p.then(() => {
                started = true;
                stopInteraction();
              }).catch(() => {
                /* blocked: wait for readiness or a user gesture (listeners) */
              });
            }
          }
          video.addEventListener("canplay", tryPlay);
          video.addEventListener("loadeddata", tryPlay);
          interactionEvents.forEach((ev) =>
            window.addEventListener(ev, tryPlay, { passive: true })
          );
          try {
            video.load();
          } catch {
            /* no-op */
          }
          tryPlay();

          cleanups.push(() => {
            stopInteraction();
            video.removeEventListener("ended", reveal);
            video.removeEventListener("error", reveal);
            video.removeEventListener("loadedmetadata", armFallback);
            video.removeEventListener("durationchange", armFallback);
            video.removeEventListener("canplay", tryPlay);
            video.removeEventListener("loadeddata", tryPlay);
          });
        };

        // Gate the intro on the preloader finishing so it doesn't run behind the
        // loading screen; if the preloader is absent or slow, start anyway.
        let begun = false;
        const begin = () => {
          if (begun) return;
          begun = true;
          window.clearTimeout(gate);
          window.removeEventListener("app:ready", begin);
          startIntro();
        };
        const gate = window.setTimeout(begin, 10000);
        if (window.__appReady) {
          begin();
        } else {
          window.addEventListener("app:ready", begin, { once: true });
        }
        cleanups.push(() => {
          window.clearTimeout(gate);
          window.clearTimeout(fallback);
          window.removeEventListener("app:ready", begin);
        });

        return () => cleanups.forEach((fn) => fn());
      });

      // Reduce-motion: skip the intro playback and show the iceberg frame right
      // away with a plain fade — no travel, scale, skew, or autoplaying motion.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (video) video.pause();
        // Show the full hero immediately — no intro playback, so no size pin.
        // (On mobile, CSS drops the video once data-hero is gone.)
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
    <section ref={scope} id="top" data-hero="intro" className="relative overflow-hidden bg-ink">
      {/* The intro <video>. Desktop (md+): always used; rewinds to the iceberg
          frame and holds it as the backdrop once the intro ends. Mobile: hidden
          by default, shown via [data-intro="video"] when JS plays it from the
          preloader's blob (hardware decoding = smooth playback + exact `ended`).
          Playback is started from JS, so no autoplay attribute and
          preload="none". */}
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 z-0 hidden w-full object-cover object-center md:block md:inset-y-auto md:top-1/2 md:-translate-y-1/2"
        poster="/videos/hero-poster.jpg"
        muted
        playsInline
        preload="none"
        aria-hidden="true"
      >
        <source src="/videos/hero-intro.mp4" type="video/mp4" />
        <source src="/videos/hero-intro.webm" type="video/webm" />
      </video>

      {/* PHONE poster: shows the clip's first frame until the canvas sequence
          starts (and for no-JS visitors). The first <source> hands true
          desktops (mouse + hover) a 1x1 placeholder so they never fetch the
          poster; a phone in "desktop site" mode (wide viewport but coarse
          pointer) still gets the real poster. Visibility is controlled in
          globals.css (not Tailwind md:) so it also works on desktop-mode
          phones. */}
      <picture
        className="hero-anim pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        <source
          media="(min-width: 768px) and (hover: hover) and (pointer: fine)"
          srcSet="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
        />
        <img src="/videos/hero-poster.jpg" alt="" className="w-full" />
      </picture>

      {/* PHONE intro player: GSAP draws the extracted video frames here (see
          lib/hero-intro.ts). A canvas has no autoplay policy — it always runs,
          Low Power Mode included. Hidden until JS marks data-intro="canvas";
          dropped entirely the instant the intro ends (globals.css). */}
      <canvas
        className="hero-canvas pointer-events-none absolute inset-0 z-0 hidden h-full w-full"
        width={720}
        height={406}
        aria-hidden="true"
      />

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
