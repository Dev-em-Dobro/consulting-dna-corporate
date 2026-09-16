import type { ReactNode, SVGProps } from "react";

/** The two "games" the 5H® methodology is organised around. */
export type Game = "Inner Game" | "Outer Game";

export type HFaculty = {
  key: string;
  /** Display name, e.g. HEAD. */
  label: string;
  /** The verb it maps to, e.g. Thinking. */
  verb: string;
  game: Game;
  /** Accent hex, matching the DNA wheel illustration. */
  color: string;
  description: string;
  /**
   * The five dimensions this faculty covers — 25 across the wheel.
   *
   * Transcribed from `docs/5H-wheel-25-dimensions.png`, which is the CDNA
   * artwork, so the wording (including "Interpersonal savvy" in lower case) is
   * theirs and is reproduced verbatim.
   *
   * ⚠️ Proprietary CDNA IP. The names are lifted from their own wheel, but this
   * cycle's approval list has not come back — the 27-08 brief requires sign-off
   * before anything reaches production.
   *
   * Order is ours, not the wheel's: each faculty is read along its arc in the
   * direction its labels run. The wheel itself is a circle with no start, and
   * Guli's mock does not fix an order. Reordering an array here is the whole
   * change if CDNA wants a different sequence.
   */
  dimensions: string[];
  icon: (props: SVGProps<SVGSVGElement>) => ReactNode;
};

/* --- Icons ---------------------------------------------------------------
   Hand-drawn, single stroke family (1.75px, round caps) so the five glyphs
   read as one set. `currentColor` lets each faculty tint its own icon. */

function IconBase({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

// HEAD — thinking. A lightbulb: ideas, reasoning, interpretation.
function HeadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3Z" />
    </IconBase>
  );
}

// HEART — relating. Emotion, authenticity, trust.
function HeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </IconBase>
  );
}

// HUNCH — sensing. Intuition, the "gut brain".
function HunchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </IconBase>
  );
}

// HANDS — doing. Tangible action, choices and decisions.
function HandsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M6 12V8a1.5 1.5 0 0 1 3 0v3" />
      <path d="M9 11V6.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M12 11V7a1.5 1.5 0 0 1 3 0v4" />
      <path d="M15 11.5V9a1.5 1.5 0 0 1 3 0v4.8c0 3.4-2.4 6.2-6 6.2-2.6 0-4.3-1.2-5.4-3.4l-1.4-3c-.5-1.2 1.2-2.1 1.9-1L9 14" />
    </IconBase>
  );
}

// HABITS — practicing. Repetition, rituals, sustainable change.
function HabitsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <IconBase {...props}>
      <path d="M17 2.5 21 6l-4 3.5" />
      <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
      <path d="M7 21.5 3 18l4-3.5" />
      <path d="M21 13v1a4 4 0 0 1-4 4H3" />
    </IconBase>
  );
}

export const FIVE_H: HFaculty[] = [
  {
    key: "head",
    label: "HEAD",
    verb: "Thinking",
    game: "Inner Game",
    color: "#97bf3f",
    description:
      "How leaders think, reason and interpret the world around them.",
    dimensions: [
      "Critical Thinking (Reasoning)",
      "Decision Making",
      "Growth Mindset & Learning Agility",
      "Scenario Planning",
      "Navigating Complexity",
    ],
    icon: HeadIcon,
  },
  {
    key: "heart",
    label: "HEART",
    verb: "Relating",
    game: "Inner Game",
    color: "#e0392c",
    description:
      "How leaders feel, relate and connect through emotion, authenticity and trust.",
    dimensions: [
      "Courage & Resilience",
      "Empathy",
      "Authentic Energy",
      "Interpersonal savvy",
      "Connection & Collaboration",
    ],
    icon: HeartIcon,
  },
  {
    key: "hunch",
    label: "HUNCH",
    verb: "Sensing",
    game: "Inner Game",
    color: "#35b5bf",
    description:
      "How leaders sense and tap into their intuition, or their gut brain.",
    dimensions: [
      "Judgement & Discernment",
      "Curiosity",
      "Sensing & Sense Making",
      "Insightfulness",
      "Accelerated Decisioning",
    ],
    icon: HunchIcon,
  },
  {
    key: "hands",
    label: "HANDS",
    verb: "Doing",
    game: "Outer Game",
    color: "#55b34e",
    description:
      "How leaders take tangible action through choices and decisions.",
    dimensions: [
      "Resourcefulness",
      "Role Modelling",
      "Accountability",
      "Stakeholder Centricity",
      "Action Oriented",
    ],
    icon: HandsIcon,
  },
  {
    key: "habits",
    label: "HABITS",
    verb: "Practicing",
    game: "Outer Game",
    color: "#ef9d63",
    description:
      "How leaders create sustainable change through building new habits, repetitive rituals, and practices.",
    dimensions: [
      "Listening & Questioning",
      "Leading with Why",
      "Consistency",
      "Ownership",
      "Transparency",
    ],
    icon: HabitsIcon,
  },
];
