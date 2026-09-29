/**
 * Shared bits for the hero intro (Preloader + HeroV1).
 *
 * PHONE_MEDIA_QUERY: "is this a phone/tablet?" must NOT rely on viewport width
 * alone — iOS Safari's "Request Desktop Website" (and Android's "Desktop site")
 * reports a ~980px viewport on a real phone, which used to push handsets down
 * the desktop code path (no height pin, gesture-gated autoplay, video kept as
 * backdrop). A touch-primary device (hover: none + pointer: coarse) is a phone
 * or tablet no matter what viewport it claims, so we match on either signal.
 * globals.css mirrors this same condition for the intro rules.
 */
export const PHONE_MEDIA_QUERY =
  "(max-width: 767px), ((hover: none) and (pointer: coarse))";

/**
 * True on phones/tablets. maxTouchPoints comes first: it is hardware truth
 * that desktop-site modes cannot fake (it's how sites detect iPads posing as
 * Macs), while viewport width AND hover/pointer media features can all be
 * masked by iOS "Request Desktop Website". The inline <head> script in
 * app/layout.tsx applies the same test before first paint to set the `touch`
 * class that gates the hero intro CSS.
 */
export function isTouchDevice(): boolean {
  return (
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 1) ||
    window.matchMedia(PHONE_MEDIA_QUERY).matches
  );
}

/**
 * (Re)applies the `js` / `touch` classes on <html> that all intro CSS keys
 * off. The inline <head> script sets them before first paint, but in-app
 * browsers (WhatsApp, Instagram, ...) inject code that breaks React
 * hydration (error #418) — React then re-renders <html> with its own
 * className, WIPING both classes and silently killing every html.js/.touch
 * rule (observed on the user's iPhone: the canvas played invisibly behind
 * the poster). Called from post-hydration effects so the classes always
 * survive a hydration-failure recovery.
 */
export function applyEnvClasses(): void {
  const el = document.documentElement;
  el.classList.add("js");
  if (isTouchDevice()) el.classList.add("touch");
}

/**
 * The phone intro is a GSAP-driven image sequence drawn onto a <canvas> —
 * plain JavaScript, so no autoplay policy applies (iOS Low Power Mode blocks
 * <video> autoplay and stutters large animated images). Frames are extracted
 * from hero-intro.mp4 with ffmpeg at 12fps / 720px WebP (~2.7MB total, 239
 * frames ≈ 19.9s — the full clip).
 */
export const HERO_FRAME_COUNT = 239;
export const HERO_FRAME_FPS = 12;
export const HERO_FRAME_WIDTH = 720;
export const HERO_FRAME_HEIGHT = 406;

export const heroFramePath = (i: number) =>
  `/videos/hero-frames/f-${String(i + 1).padStart(3, "0")}.webp`;

/**
 * Downloads every intro frame (bounded concurrency — phone radios choke on a
 * 239-request burst) and materializes each as a loaded <img>. Images are kept
 * compressed in memory (~2.7MB); decoding happens per-draw with a small
 * decode-ahead window in HeroV1, so we never hold ~280MB of raw bitmaps.
 * Individual failures resolve to null (the player draws the nearest earlier
 * frame); the promise itself never rejects.
 */
const loadOneFrame = (
  i: number,
  signal?: AbortSignal
): Promise<HTMLImageElement | null> =>
  fetch(heroFramePath(i), { signal })
    .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
    .then(
      (blob) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("decode"));
          };
          img.src = url;
        })
    )
    .catch(() => null);

export function loadHeroFrames(
  signal?: AbortSignal
): Promise<Array<HTMLImageElement | null>> {
  const frames: Array<HTMLImageElement | null> = new Array(HERO_FRAME_COUNT).fill(null);
  let next = 0;
  const worker = async () => {
    while (next < HERO_FRAME_COUNT) {
      const i = next++;
      frames[i] = await loadOneFrame(i, signal);
    }
  };
  return Promise.all(Array.from({ length: 8 }, worker)).then(() => frames);
}

/**
 * Fills the null slots of a partially-downloaded frame set in the background
 * (the preloader hands over whatever it got when its 25s network cap fires).
 * Mutates `frames` in place; the canvas player reads the array live on every
 * tick, so frames simply pop in as they arrive.
 */
export function fillHeroFrames(frames: Array<HTMLImageElement | null>): void {
  const missing: number[] = [];
  frames.forEach((f, i) => {
    if (!f) missing.push(i);
  });
  let next = 0;
  const worker = async () => {
    while (next < missing.length) {
      const i = missing[next++];
      const img = await loadOneFrame(i);
      if (img) frames[i] = img;
    }
  };
  for (let k = 0; k < 4; k++) void worker();
}
