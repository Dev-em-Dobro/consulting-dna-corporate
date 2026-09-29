import Image from "next/image";
import Link from "next/link";
import type { CaseListEntry } from "@/lib/cms/map";
import { BAND_DARK, brandPanelColor } from "@/lib/brand-band";

/**
 * One flagship client on Our Clients (27-08 brief, item 8), in Guli's 29-08
 * reading.
 *
 * The band *is* the whole card — no challenge, no metric, no body. The row is
 * one link into the case, which is what "Find out more" points at.
 *
 * Height is measured off the mock rather than chosen: its bands are 36px on a
 * 120px card, so height is 0.30 of the width and the gap between them is 0.22 of
 * the height. Ours were at 0.37 — the bands were the thing running tall, not the
 * gaps running wide, which is why the list read loose.
 *
 * **The dissolve.** Guli's mock does not put a logo on a gradient; it fades a
 * brand-coloured panel into the black and knocks the mark out of it in white,
 * so the two read as one image. Reproducing that with our assets takes two
 * moves, because `/public/logos` holds opaque colour-on-white PNGs:
 *
 * 1. The panel is its own masked element, not a background gradient. A gradient
 *    only reaches full colour at the right edge; the mock holds flat dark, ramps
 *    once, then holds flat colour. A mask over a solid panel gives that, and
 *    keeps the ramp independent of the card's width.
 * 2. The mark is knocked out at render: `invert` turns the white plate black and
 *    the ink light, then `screen` drops the black — black is `screen`'s identity
 *    — leaving a white mark on the panel. `isolate` on the card keeps that blend
 *    from reaching the page behind it.
 *
 * The knockout is monochrome, so it loses a brand's second colour (Heineken's
 * red star goes white). Matching the mock exactly needs the brands' own
 * knockout assets; this is what the files we have can do.
 *
 * `brandPanelColor` handles the trap in (2): the panel colour is derived from
 * the logo, so a light brand would knock white out of its own colour. See
 * lib/brand-band.ts.
 *
 * ⚠️ `CaseRow` on /cases still renders the older gradient-plus-plate version of
 * this band. Guli treats them as one solution; they should converge.
 */
export default function ClientBandCard({ entry }: { entry: CaseListEntry }) {
  const panel = entry.logoColor ? brandPanelColor(entry.logoColor) : null;

  return (
    <Link
      href={`/cases/${entry.slug}`}
      className="group relative isolate flex min-h-[92px] items-center justify-between gap-6 overflow-hidden px-6 py-4 outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 md:px-8"
      style={{ backgroundColor: BAND_DARK }}
    >
      {panel && (
        <span
          aria-hidden
          // Narrower from `md` up, so the black holds past the middle before the
          // dissolve starts. In band coordinates the panel begins at 100%−width
          // and reaches full opacity 38% of its own width later, so:
          //
          //   mobile  (58%)  black 0→42%   · dissolve 42→64%  · colour 64→100%
          //   desktop (40%)  black 0→60%   · dissolve 60→75%  · colour 75→100%
          //
          // The tag line below is capped at 56% to land inside the solid black
          // on both. It used to be unbounded, so on wide screens it ran into the
          // dissolve and finished over the brand colour — white on GSK's orange,
          // which is the worst pairing in the set.
          className="absolute inset-y-0 right-0 w-[58%] md:w-[40%]"
          style={{
            backgroundColor: panel,
            maskImage: "linear-gradient(to right, transparent 0%, black 38%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 38%)",
          }}
        />
      )}

      <span className="relative min-w-0 md:max-w-[56%]">
        <span className="block text-[20px] font-bold uppercase leading-tight tracking-[0.5px] text-white md:text-[22px]">
          {entry.client}
        </span>

        {entry.tags.length > 0 && (
          <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[1.5px] text-white/70">
            {entry.tags.join(" · ")}
          </span>
        )}

        <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[1.5px] text-white/80 underline decoration-white/40 underline-offset-4 transition-colors group-hover:text-white group-hover:decoration-white group-focus-visible:text-white group-focus-visible:decoration-white">
          Find out more
        </span>
      </span>

      {entry.logoUrl && (
        <Image
          src={entry.logoUrl}
          alt=""
          width={180}
          height={72}
          className="relative h-12 w-auto max-w-[140px] flex-none object-contain md:h-14 md:max-w-[180px]"
          // `brightness` runs after `invert`, which is what makes it safe: the
          // white plate is already black by then, and black × k stays black, so
          // only the mark is lifted. Mid-luminance inks (GSK's orange) invert to
          // grey and would otherwise knock out dull rather than white.
          style={{
            filter: "invert(1) grayscale(1) brightness(2)",
            mixBlendMode: "screen",
          }}
        />
      )}
    </Link>
  );
}
