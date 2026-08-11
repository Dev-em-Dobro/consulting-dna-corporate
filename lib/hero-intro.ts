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
 * A ~1.5KB black 2x2 H.264 clip (generated with ffmpeg) used to probe whether
 * the browser allows muted inline video autoplay BEFORE we download the real
 * intro asset. iOS Low Power Mode / battery savers reject play() even for
 * muted+playsinline video; probing first lets the preloader download only the
 * asset that will actually be used (MP4 when video can play, animated WebP
 * when it can't) instead of paying for both or falling back at play time.
 */
export const AUTOPLAY_PROBE_MP4 =
  "data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAMzbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAAFAAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAl10cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAIAAAACAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAABQAAAAAAABAAAAAAHVbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAAyAAAABABVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABgG1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAUBzdGJsAAAAwHN0c2QAAAAAAAAAAQAAALBhdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAIAAgBIAAAASAAAAAAAAAABFUxhdmM2Mi4yOC4xMDAgbGlieDI2NAAAAAAAAAAAAAAAGP//AAAANmF2Y0MBZAAK/+EAGWdkAAqs2V+IiMBEAAADAAQAAAMAyDxIllgBAAZo6+PLIsD9+PgAAAAAEHBhc3AAAAABAAAAAQAAABRidHJ0AAAAAAABGaQAAAAAAAAAGHN0dHMAAAAAAAAAAQAAAAIAAAIAAAAAFHN0c3MAAAAAAAAAAQAAAAEAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAIAAAABAAAAHHN0c3oAAAAAAAAAAAAAAAIAAALFAAAADAAAABRzdGNvAAAAAAAAAAEAAANjAAAAYnVkdGEAAABabWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAbWRpcmFwcGwAAAAAAAAAAAAAAAAtaWxzdAAAACWpdG9vAAAAHWRhdGEAAAABAAAAAExhdmY2Mi4xMi4xMDAAAAAIZnJlZQAAAtltZGF0AAACrgYF//+q3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2NSByMzIyMyAwNDgwY2IwIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAyNSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIG1idHJlZT0xIGNyZj0yMy4wIHFjb21wPTAuNjAgcXBtaW49MCBxcG1heD02OSBxcHN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAD2WIhAAv//72rvzLK3R/gQAAAAhBmiFsQr/+wA==";

/**
 * Resolves true when the browser allows muted inline video autoplay right now.
 * Uses the tiny probe clip above; a probe that hangs resolves true after 1.5s
 * (the video path has its own WebP fallback, so a wrong "true" is soft).
 */
export function canAutoplayVideo(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    let done = false;
    const settle = (ok: boolean) => {
      if (done) return;
      done = true;
      resolve(ok);
    };
    try {
      const v = document.createElement("video");
      v.muted = true;
      v.defaultMuted = true;
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
      v.src = AUTOPLAY_PROBE_MP4;
      const p = v.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          v.pause();
          settle(true);
        }).catch(() => settle(false));
      } else {
        settle(true);
      }
    } catch {
      settle(false);
    }
    window.setTimeout(() => settle(true), 1500);
  });
}
