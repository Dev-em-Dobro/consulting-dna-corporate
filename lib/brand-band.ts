/**
 * Colour maths for the branded client band (27-08 brief, item 8).
 *
 * Guli's mock dissolves a brand-coloured panel into the dark band and knocks the
 * client's mark out of it in white. Our logo files are colour-on-white with no
 * alpha, so the mark is knocked out at render time — which means the panel has
 * to be dark enough for white to read on it.
 *
 * That is not a given: `LOGO_COLORS` derives each panel from the logo's own
 * predominant colour, so a light brand would be asked to knock white out of its
 * own colour and disappear. `brandPanelColor` deepens the panel toward the band
 * until white clears a legibility floor, and leaves already-dark brands alone.
 */

/** The dark end of the band — the colour a panel is deepened toward. */
export const BAND_DARK = "#141414";

/** WCAG relative luminance of a `#rrggbb`, 0 (black) → 1 (white). */
export function luminance(hex: string): number {
  const n = parseInt(hex.replace("#", ""), 16);
  const channel = (shift: number) => {
    const c = ((n >> shift) & 255) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(16) + 0.7152 * channel(8) + 0.0722 * channel(0);
}

/** Contrast ratio of white against a colour, 1 → 21. */
export function contrastWithWhite(hex: string): number {
  return 1.05 / (luminance(hex) + 0.05);
}

/** Blend `hex` toward BAND_DARK by `amount` (0 = untouched, 1 = fully dark). */
export function deepen(hex: string, amount: number): string {
  const from = parseInt(hex.replace("#", ""), 16);
  const to = parseInt(BAND_DARK.replace("#", ""), 16);
  const mix = (shift: number) => {
    const a = (from >> shift) & 255;
    const b = (to >> shift) & 255;
    return Math.round(a + (b - a) * amount);
  };
  const hx = (v: number) => v.toString(16).padStart(2, "0");
  return `#${hx(mix(16))}${hx(mix(8))}${hx(mix(0))}`;
}

/**
 * Minimum contrast for the knocked-out mark. Below AA's 4.5 on purpose: the
 * logo is decorative — the client's name sits beside it as real text — so this
 * is a "clearly visible" floor, not a text-legibility one. Pushing to 4.5 would
 * drag every warm brand to near-black and cost the band its colour.
 */
const MIN_CONTRAST = 3.5;

/**
 * The panel colour to paint behind a white-knockout mark: the brand colour when
 * white already reads on it, otherwise deepened in steps until it does.
 */
export function brandPanelColor(hex: string): string {
  let colour = hex;
  for (let amount = 0; amount <= 0.8; amount += 0.05) {
    colour = deepen(hex, amount);
    if (contrastWithWhite(colour) >= MIN_CONTRAST) break;
  }
  return colour;
}
