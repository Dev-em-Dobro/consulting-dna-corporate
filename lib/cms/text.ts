/**
 * Turn a CMS-authored field into safe plain text for UI that renders it as text
 * (hero subtitles, card summaries, table cells, list items). The CMS emits some
 * fields as rich text (wrapped in `<p>`, `<strong>`, …); when those land in a
 * plain-text slot the tags show up literally on the page. Strip the markup here
 * so plain-text call sites never leak HTML. Rich-text fields keep going through
 * <RichText> and must NOT be passed through this.
 */

// Minimal entity table — the handful the CMS actually emits in prose fields.
const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’",
  hellip: "…", mdash: "—", ndash: "–",
};

export function plainText(input?: string): string | undefined {
  if (typeof input !== "string") return undefined;
  const out = input
    // Block boundaries become spaces so words don't glue together (`</p><p>`).
    .replace(/<\s*(br|\/p|\/div|\/li|\/h[1-6]|\/tr)\s*\/?>/gi, " ")
    // Drop every remaining tag.
    .replace(/<[^>]*>/g, "")
    // Decode numeric + named entities.
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m)
    // Normalise whitespace left behind by the strip.
    .replace(/\s+/g, " ")
    .trim();
  return out.length ? out : undefined;
}

/** Map `plainText` over an array of CMS strings, dropping any that become empty. */
export function plainTextList(input?: string[]): string[] | undefined {
  if (!input?.length) return undefined;
  const out = input.map((s) => plainText(s)).filter((s): s is string => !!s);
  return out.length ? out : undefined;
}
