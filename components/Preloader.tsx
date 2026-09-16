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

    // Duas guardas por rota, e elas NÃO são a mesma coisa. Ambas por pathname e
    // não por prop, de propósito: o Preloader está no layout, é compartilhado
    // por TODAS as páginas, e a maioria delas não tem herói nenhum para aquecer.
    const path = window.location.pathname;

    // ⚠️ A LISTA SE INVERTEU em 10-09, junto com a promoção da V2 para `/`.
    // Antes isto era uma lista de EXCEÇÕES (`/home-v2` e `/home-v3` não
    // aquecem, todo o resto aquece), porque quem usava a intro era a home. Hoje
    // a home é a V2 e quem usa a intro é uma rota só — a `/home-v1`, o arquivo.
    // Virou lista de INCLUSÃO pelo mesmo motivo que ela existe: se um dia
    // aparecer outra rota, o padrão seguro é não baixar nada.
    //
    // Deixar como estava era o erro silencioso desta mudança: `/` passaria a
    // casar com a regra antiga e o telefone ficaria parado no spinner baixando
    // 239 frames (2,7 MB, até 25s) de uma animação que a home nova não tem.
    const usesHeroIntro = /^\/home-v1\b/.test(path);

    // A sequência de frames em canvas do telefone (só a HeroV1 a roda).
    const needsHeroFrames = usesHeroIntro;

    // O clipe do desktop, por outro motivo: desde 07-09 nem a V2 nem a V3 usam
    // `hero-intro.mp4` — as duas têm fotografia estática de fundo, cuidada pelo
    // `<Image>` do Next com `priority` (ver HeroV2.tsx e HeroV3.tsx). Aquecer o
    // MP4 nelas seria baixar 3,8 MB de um vídeo que a página não tem.
    const needsHeroVideo = usesHeroIntro;

    // All render-critical resources (images, CSS, fonts) are loaded.
    const waitLoad = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    // Warm the hero intro asset so it plays smoothly right after the loader.
    const waitHero = new Promise<void>((resolve) => {
      if (isMobile && !needsHeroFrames) {
        // Telefone, em qualquer rota que não seja a `/home-v1`: o fundo é uma
        // imagem estática que o próprio herói busca. Nada para aquecer aqui.
        resolve();
      } else if (!isMobile && !needsHeroVideo) {
        // Desktop, mesma coisa: o fundo é fotografia, e quem cuida dela é o
        // <Image> do Next, com `priority`. Nada para aquecer aqui também.
        resolve();
      } else if (isMobile) {
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
    const hardCap = window.setTimeout(
      finish,
      isMobile && needsHeroFrames ? 28000 : 9000
    );

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
