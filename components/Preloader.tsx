"use client";

import { useEffect } from "react";
import { PHONE_MEDIA_QUERY, canAutoplayVideo } from "@/lib/hero-intro";

declare global {
  interface Window {
    /** Set once the loading screen has dismissed; the hero intro waits on this. */
    __appReady?: boolean;
    /** Object URL of the fully-downloaded mobile intro WebP, shared with HeroV1. */
    __heroWebpUrl?: string;
    /** Object URL of the fully-downloaded mobile intro MP4, shared with HeroV1. */
    __heroVideoUrl?: string;
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

    // Phone/tablet by touch capability, not just width — "Request Desktop
    // Website" fakes a wide viewport on real phones (see lib/hero-intro.ts).
    const isMobile = window.matchMedia(PHONE_MEDIA_QUERY).matches;

    // All render-critical resources (images, CSS, fonts) are loaded.
    const waitLoad = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    // Warm the hero intro asset so it plays smoothly right after the loader.
    const waitHero = new Promise<void>((resolve) => {
      if (isMobile) {
        // Probe whether video autoplay is allowed (iOS Low Power Mode blocks
        // it), then fully download ONLY the asset the hero will actually use —
        // the MP4 when video can play, the animated WebP when it can't — and
        // hand HeroV1 the blob URL BEFORE revealing the site. Playback then
        // reads from memory, so it can't stutter mid-clip, is never downloaded
        // twice, and starts the instant the loader lifts. Aborting after 25s
        // guarantees a stalled network can never trap the visitor behind the
        // loader.
        const ctrl = new AbortController();
        const abort = window.setTimeout(() => ctrl.abort(), 25000);
        canAutoplayVideo()
          .then((videoOk) =>
            fetch(videoOk ? "/videos/hero-intro.mp4" : "/videos/hero-intro.webp", {
              signal: ctrl.signal,
            })
              .then((r) => r.blob())
              .then((b) => {
                const url = URL.createObjectURL(b);
                if (videoOk) window.__heroVideoUrl = url;
                else window.__heroWebpUrl = url;
              })
          )
          .catch(() => {
            /* aborted or offline: reveal anyway, HeroV1 fetches it itself */
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
