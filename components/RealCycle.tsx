"use client";

import { useEffect, useState } from "react";

/**
 * The six "reals" of the 27-08 brief (item 1), as Guli resolved them on 01-09.
 *
 * The block used to be a 2×3 grid with one term per cell. That put the word
 * "real" on screen six times, directly under a hero that already says it five —
 * which is what Ricardo flagged and what this replaces. Guli's fix keeps one
 * "Real", fixed, and cycles the second word: *"a primeira frase fica estática. A
 * segunda o 'real' fica parado em preto enquanto as palavras que ele quer ficam
 * trocando em vermelho, preferencialmente com um efeito de digitação (digita,
 * apaga, digita, apaga) bem rápido"*. His reference was a "you're **fascinating**"
 * loop — static prefix in ink, the changing word in the accent colour.
 *
 * **The width is reserved by the longest word.** Without that, the whole line
 * re-centres on every keystroke and "Real" jitters left and right. The longest
 * term is rendered invisibly in the same grid cell and the typed text sits on
 * top of it, left-aligned — the stacking idiom `FiveHExplorer` already uses so a
 * changing string cannot resize its container.
 *
 * **Reduced motion gets the whole set, not a frozen frame.** A caret parked on a
 * half-typed word reads as a bug, and one term out of six loses the point of the
 * item. So it degrades to the six joined into a single line, which is also what
 * screen readers get — the animation itself is `aria-hidden`, because a live
 * region retyping every 60ms would be hostile.
 */

/** Milliseconds per character while typing. "Bem rápido", as he asked. */
const TYPE_MS = 55;
/** Deleting is faster than typing — the return trip is not the content. */
const DELETE_MS = 28;
/** How long a completed word stays before it is erased. */
const HOLD_MS = 1500;
/** Beat between erasing one word and starting the next. */
const GAP_MS = 260;

export default function RealCycle({
  words,
  onDark = false,
}: {
  words: string[];
  /**
   * Inverte as duas cores para fundo escuro.
   *
   * O "Real" fixo estava cravado em `text-ink` — invisível sobre `ink`. E a
   * palavra que cicla estava em `text-brand`: #d84339 sobre escuro dá 2,87:1, o
   * mesmo motivo pelo qual a régua do rótulo vira `brand-light` na /about.
   * As duas trocam JUNTAS; clarear só uma quebraria o par que a linha é.
   */
  onDark?: boolean;
}) {
  const staticTone = onDark ? "text-white" : "text-ink";
  const wordTone = onDark ? "text-brand-light" : "text-brand";
  const [reduceMotion, setReduceMotion] = useState(false);
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduceMotion || words.length === 0) return;
    const word = words[index];
    let delay: number;
    let step: () => void;

    if (!deleting) {
      if (length < word.length) {
        delay = TYPE_MS;
        step = () => setLength((n) => n + 1);
      } else {
        delay = HOLD_MS;
        step = () => setDeleting(true);
      }
    } else if (length > 0) {
      delay = DELETE_MS;
      step = () => setLength((n) => n - 1);
    } else {
      delay = GAP_MS;
      step = () => {
        setDeleting(false);
        setIndex((n) => (n + 1) % words.length);
      };
    }

    const timer = window.setTimeout(step, delay);
    return () => window.clearTimeout(timer);
  }, [reduceMotion, words, index, length, deleting]);

  if (words.length === 0) return null;

  // The set as one sentence: the reduced-motion rendering, and the accessible
  // name in every case. One "Real", six terms, no repetition.
  const sentence = `Real ${words
    .slice(0, -1)
    .join(", ")
    .toLowerCase()} and ${words[words.length - 1].toLowerCase()}.`;

  if (reduceMotion) {
    return <span className={staticTone}>{sentence}</span>;
  }

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a));

  return (
    <>
      <span aria-hidden className={`whitespace-nowrap ${staticTone}`}>
        Real{" "}
        <span className="inline-grid justify-items-start align-bottom">
          {/* Reserves the line's width. Never visible, never read. */}
          <span className="invisible col-start-1 row-start-1">{longest}.</span>
          <span className={`col-start-1 row-start-1 ${wordTone}`}>
            {words[index].slice(0, length)}
            {length === words[index].length ? "." : ""}
            <span className="tw-caret" />
          </span>
        </span>
      </span>
      <span className="sr-only">{sentence}</span>
    </>
  );
}
