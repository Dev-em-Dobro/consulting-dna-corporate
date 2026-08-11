"use client";

import { useEffect } from "react";
import { applyEnvClasses, isTouchDevice, loadHeroFrames } from "@/lib/hero-intro";

declare global {
  interface Window {
    /** Set once the loading screen has dismissed; the hero intro waits on this. */
    __appReady?: boolean;
    /** Fully-downloaded phone intro frames (null = failed), shared with HeroV1. */
    __heroFrames?: Array<HTMLImageElement | null>;
  }
}

/**
 * Full-screen loading overlay shown until the page and the hero intro asset have
 * finished loading, then faded out. Warming the intro asset here (mobile: fully
 * download the animated WebP; desktop: prime the MP4 cache) means the hero intro
 * plays back smoothly the instant the site is revealed. Coordinates with HeroV1
 * via `window.__appReady` / the `app:ready` event and the shared blob URL.
 *
 * The overlay is gated on `.js` in CSS, so no-JS visitors never get stuck behind
 * it.
 */
export default function Preloader() {
  useEffect(() => {
    // Restore the `js`/`touch` classes in case a hydration failure wiped them
    // (in-app browsers — see lib/hero-intro.ts).
    applyEnvClasses();
    const root = document.documentElement;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      window.__appReady = true;
      window.dispatchEvent(new Event("app:ready"));
      root.classList.add("app-ready");
      // Fully drop it from the compositor once the fade is done.
      window.setTimeout(() => root.classList.add("app-ready-done"), 650);
    };

    // Phone/tablet by hardware touch, not width or CSS media features —
    // "Request Desktop Website" can fake all of those (see lib/hero-intro.ts).
    const isMobile = isTouchDevice();

    // All render-critical resources (images, CSS, fonts) are loaded.
    const waitLoad = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    // Warm the hero intro asset so it plays smoothly right after the loader.
    const waitHero = new Promise<void>((resolve) => {
      if (isMobile) {
        // Fully download every intro frame BEFORE revealing the site (the
        // phone intro is a GSAP canvas image sequence — see lib/hero-intro.ts),
        // so playback starts instantly and can't stutter on the network.
        // Aborting after 25s guarantees a stalled connection can never trap
        // the visitor behind the loader.
        const ctrl = new AbortController();
        const abort = window.setTimeout(() => ctrl.abort(), 25000);
        loadHeroFrames(ctrl.signal)
          .then((frames) => {
            // Hand over only if at least the first frame made it; otherwise
            // HeroV1 retries the download itself.
            if (frames.some(Boolean)) window.__heroFrames = frames;
          })
          .finally(() => {
            window.clearTimeout(abort);
            resolve();
          });
      } else {
        // Desktop: prime the MP4 cache in the background; don't block on it.
        try {
          const v = document.createElement("video");
          v.muted = true;
          v.preload = "auto";
          v.src = "/videos/hero-intro.mp4";
          v.load();
        } catch {
          /* no-op */
        }
        resolve();
      }
    });

    // Keep the loader up a beat (no jarring flash) but never past the hard cap.
    // Mobile blocks on the full WebP download (see waitHero, capped at 25s), so
    // its hard cap sits above that; desktop never blocks on the hero asset.
    const minTime = new Promise<void>((resolve) => window.setTimeout(resolve, 600));
    const hardCap = window.setTimeout(finish, isMobile ? 28000 : 9000);

    Promise.all([waitLoad, waitHero, minTime]).then(finish);

    return () => {
      window.clearTimeout(hardCap);
    };
  }, []);

  return (
    <div className="preloader" aria-hidden="true">
      <span className="preloader__spinner" />
    </div>
  );
}
