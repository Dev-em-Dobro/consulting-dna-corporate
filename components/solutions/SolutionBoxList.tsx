import Link from "next/link";
import type { SolutionIndexEntry } from "@/lib/cms/map";

/**
 * The Solutions index as the old site's black boxes, in the reading Guli
 * proposed on 29-08 (27-08 brief, item 5: "recuperar a força dos black boxes /
 * coloured bars do site antigo, ou uma interpretação moderna dessa lógica").
 *
 * A vertical list at every width — not a grid that collapses into one. Guli's
 * mock is the list, and the same move is what he prescribed for the 5H on
 * mobile: square tiles in a grid are what break there, "colocando isso em lista
 * já ajuda bastante qualquer usuário de mobile" (05:22).
 *
 * Content model is unchanged from the outcome-led index (commit 587e9e2): the
 * solution name is the label, what changes for the client is the line that
 * leads. Where CDNA has not authored an `outcome` yet the name becomes the
 * single line — which is literally what the mock shows, so the index degrades
 * into the mock rather than into a placeholder.
 *
 * `problemStatement` is deliberately not rendered here. It is `The Challenge`
 * on the solution page itself, and the brief asks to reduce the size of the
 * Solutions pages rather than restate them on the index.
 *
 * The diagonal and the sweep live in `.sbox` / `.sbox__sweep` in globals.css.
 * Tailwind's `hover:` is already gated on `(hover: hover)`, so the paired
 * `active:` variants are what touch actually gets.
 */
export default function SolutionBoxList({
  solutions,
}: {
  solutions: SolutionIndexEntry[];
}) {
  return (
    <ul className="flex flex-col gap-1.5">
      {solutions.map((s) => (
        <li key={s.slug}>
          <Link
            href={`/solutions/${s.slug}`}
            className="sbox group flex items-center gap-6 bg-ink-2 px-6 py-5 outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 md:px-8 md:py-6"
          >
            {/* The brand fill. Purely decorative: the row is one link and the
                text beside it carries the whole accessible name. */}
            <span aria-hidden className="sbox__sweep" />

            <span className="relative min-w-0 flex-1">
              {s.outcome ? (
                <>
                  <span className="block text-[11px] font-semibold uppercase tracking-[1.5px] text-white/65 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white group-active:text-white">
                    {s.title}
                  </span>
                  <span className="mt-1.5 block text-[17px] font-semibold leading-[1.3] tracking-[-0.3px] text-white sm:text-[19px]">
                    {s.outcome}
                  </span>
                </>
              ) : (
                <span className="block text-[17px] font-semibold leading-[1.3] tracking-[-0.3px] text-white sm:text-[19px]">
                  {s.title}
                </span>
              )}
            </span>

            {/* Muted at rest, white and nudged forward once the fill lands —
                the arrow is the only thing that travels with the sweep. */}
            <span
              aria-hidden
              className="relative flex-none text-[18px] leading-none text-brand-dark transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-white group-focus-visible:translate-x-1 group-focus-visible:text-white group-active:translate-x-1 group-active:text-white"
            >
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
