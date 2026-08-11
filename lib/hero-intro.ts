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
export function loadHeroFrames(
  signal?: AbortSignal
): Promise<Array<HTMLImageElement | null>> {
  const one = (i: number): Promise<HTMLImageElement | null> =>
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

  const frames: Array<HTMLImageElement | null> = new Array(HERO_FRAME_COUNT).fill(null);
  let next = 0;
  const worker = async () => {
    while (next < HERO_FRAME_COUNT) {
      const i = next++;
      frames[i] = await one(i);
    }
  };
  return Promise.all(Array.from({ length: 8 }, worker)).then(() => frames);
}
