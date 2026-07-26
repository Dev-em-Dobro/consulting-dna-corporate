import { plainText } from "@/lib/cms/text";

/**
 * Build a clean meta description from an arbitrary CMS field (which may be
 * rich text / HTML) or a plain string. Strips markup via `plainText`, then
 * clamps to `max` characters on a word boundary with an ellipsis. Returns
 * `undefined` when there's nothing usable, so callers can fall back to a
 * static default (per-page description → SITE_DESCRIPTION).
 */
export function metaDescription(
  input?: string,
  max = 155,
): string | undefined {
  const text = plainText(input);
  if (!text) return undefined;
  if (text.length <= max) return text;
  // Cut at the last word boundary before the limit (leave room for the ellipsis).
  const slice = text.slice(0, max - 1);
  const cut = slice.lastIndexOf(" ");
  return `${(cut > 40 ? slice.slice(0, cut) : slice).trimEnd()}…`;
}

/** First non-empty candidate, run through `metaDescription`. */
export function firstDescription(
  candidates: (string | undefined)[],
  max = 155,
): string | undefined {
  for (const c of candidates) {
    const d = metaDescription(c, max);
    if (d) return d;
  }
  return undefined;
}
