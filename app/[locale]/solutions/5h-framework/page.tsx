import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import FiveHExplorer from "@/components/five-h/FiveHExplorer";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo/alternates";
import methodology from "@/public/5H-methodology.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "The 5H® Framework — Corporate DNA",
    description:
      "The 5H® Methodology is the neuroscience-led formula behind Corporate DNA's results across 26 countries — Head, Heart, Hunch, Hands and Habits.",
    alternates: localeAlternates(locale, "/solutions/5h-framework"),
  };
}

/** Registered-trademark superscript, matching the site's 5H® treatment. */
function R() {
  return <span className="align-super text-[0.5em] font-semibold">®</span>;
}

/** Small brand-red accent line + label used above section headings. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="inline-block h-0.5 w-9 bg-brand" />
      <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">
        {children}
      </span>
    </div>
  );
}

const OUTCOMES = [
  "Build great habits beyond ‘aha’ moments — repeating a skill enough to strengthen neural connections through practice, problem-solving and decision-making.",
  "Create real-world relevance by actively participating, experimenting and co-creating possible ideas and solutions.",
  "“Normalise” the real power of learning from mistakes.",
  "Share peer learning within the group through a collaborative model of multi-loop problem solving and feedback cycles.",
  "Create sustainable habits — new mindsets and skill sets that drive long-term success outside the workshops.",
  "Gain self-efficacy and confidence.",
  "Accelerate ROI on the organisation’s learning investments.",
];

const CLIENTS = [
  { name: "GSK", file: "gsk.png" },
  { name: "Heineken", file: "heineken.png" },
  { name: "Unilever", file: "unilever.png" },
  { name: "Shell", file: "shell.png" },
  { name: "Morgan Stanley", file: "morgan_stanley.png" },
  { name: "Aviva", file: "aviva.png" },
  { name: "Coca-Cola", file: "coca_cola.png" },
  { name: "Levi’s", file: "levis.png" },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default async function FiveHFrameworkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <SiteShell>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <PageHero
        eyebrow="Our Approach"
        title={<>Lead with 5H<R /></>}
        subtitle="95% of our clients cite 5H® as the real secret of our success — the neuroscience-led formula behind our results across 26 countries."
        bgImageUrl="/approach-hero.png"
        imageClassName="object-cover object-right"
        overlayClassName="bg-gradient-to-r from-ink via-ink/90 to-ink/65"
      />

      {/* ── Neuroscience-led formula ─────────────────────────────────── */}
      <section className="bg-white">
        <Reveal
          stagger={false}
          className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:px-10 md:py-28"
        >
          <div className="md:sticky md:top-28 md:self-start">
            <Eyebrow>Neuroscience-led formula</Eyebrow>
            <h2 className="text-[28px] font-bold leading-[1.1] tracking-[-0.6px] text-ink sm:text-[34px]">
              Developing the whole self in leadership
            </h2>
          </div>
          <div className="max-w-[62ch] space-y-5 text-[17px] leading-[1.7] text-muted">
            <p>
              Corporate DNA’s proprietary 5H<R /> Methodology is the
              neuroscience-led formula behind our proven results and global
              success. Over ten years and across 26 countries, we have used the
              5H<R /> in all our programs — culture transformations, leadership
              development, building high-performing teams and executive coaching.
            </p>
            <p>
              There are five clear lenses through which we approach developing
              the whole self in leadership — the{" "}
              <strong className="text-ink">
                Head, Heart, Hunch, Hands and Habits
              </strong>{" "}
              — in other words, thinking, relating, sensing, doing and applying.
            </p>
            <p>
              5H<R /> was born from the belief that traditional executive
              programs often develop skills that produce “partial leaders,”
              sustainable only in the short term. Our purpose is to go beyond and
              develop “whole leaders,” where all the learner’s faculties are
              engaged and integrated.
            </p>
            <p>
              Unlike learning experiences that focus on imparting knowledge and
              best practice, DNA programs challenge participants to fully own
              their learning by making it real: sharing real hopes and fears,
              practising new skills in front of peers, and receiving immediate
              feedback and coaching from DNA coaches.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Inner & Outer Game (interactive) ─────────────────────────── */}
      <section id="the-five-h" className="bg-ink-2 text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28">
          <div className="mb-12 max-w-[720px]">
            <Eyebrow>Introducing the Inner &amp; Outer Game</Eyebrow>
            <h2 className="text-[30px] font-bold leading-[1.1] tracking-[-0.8px] sm:text-[40px]">
              Five lenses. One whole leader.
            </h2>
            <p className="mt-5 text-[17px] leading-[1.7] text-white/70">
              The Head, Heart and Hunch live in the{" "}
              <strong className="font-semibold text-white">Inner Game</strong> —
              the internal processes that drive us to lead with purpose. The
              Hands and Habits exist in the{" "}
              <strong className="font-semibold text-white">Outer Game</strong> —
              the ways we translate intent into action.
            </p>
          </div>

          <FiveHExplorer />
        </div>
      </section>

      {/* ── The 5H wheel / interconnection ───────────────────────────── */}
      <section className="bg-white">
        <Reveal
          stagger={false}
          className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-28"
        >
          <div className="mx-auto mb-12 max-w-[720px] text-center">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="inline-block h-0.5 w-9 bg-brand" />
              <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">
                An integrated ecosystem
              </span>
            </div>
            <h2 className="text-[28px] font-bold leading-[1.1] tracking-[-0.6px] text-ink sm:text-[36px]">
              The 5H<R /> don’t live in separate compartments
            </h2>
          </div>

          <div className="relative mx-auto aspect-[3/2] w-full max-w-[900px] overflow-hidden rounded-xl border border-line bg-paper">
            <Image
              src={methodology}
              alt="The 5H methodology across the Inner Game (Head, Heart, Hunch) and Outer Game (Hands, Habits), mapped along a DNA helix."
              fill
              sizes="(min-width: 900px) 900px, 100vw"
              className="object-contain"
            />
          </div>

          <div className="mx-auto mt-12 grid max-w-[900px] gap-8 md:grid-cols-2">
            <p className="text-[17px] leading-[1.7] text-muted">
              The 5H<R /> are highly interconnected. Through them we illuminate
              different aspects of a single leadership ingredient. Courage, for
              example, has no simple definition: one leader may excel at
              “thinking brave” — Head-based courage — while another excels at
              “acting brave,” taking decisive action from the Hands.
            </p>
            <p className="text-[17px] leading-[1.7] text-muted">
              Created with simplicity in mind, the 5H<R /> live in a symbiotic,
              interdependent loop. To be a better thinker you must be more aware
              as a feeler; to be a doer you must be in tune as a sensor.
              Transformation happens only when the H’s connect — simple and
              practical, yet nuanced and deep.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Translating intent into action ───────────────────────────── */}
      <section className="bg-paper">
        <Reveal
          stagger={false}
          className="mx-auto grid max-w-[1200px] gap-12 px-6 py-20 md:grid-cols-[0.8fr_1.2fr] md:px-10 md:py-28"
        >
          <div className="md:sticky md:top-28 md:self-start">
            <Eyebrow>From intent to action</Eyebrow>
            <h2 className="text-[28px] font-bold leading-[1.1] tracking-[-0.6px] text-ink sm:text-[34px]">
              Making the learning real
            </h2>
            <p className="mt-5 text-[16px] leading-[1.7] text-muted">
              Through 5H<R />, we translate intent into lasting behaviour by
              encouraging the learner to:
            </p>
          </div>

          <ul className="space-y-4">
            {OUTCOMES.map((item) => (
              <li
                key={item}
                className="flex items-start gap-4 rounded-lg border border-line bg-white p-5"
              >
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand text-white">
                  <CheckIcon />
                </span>
                <span className="text-[16px] leading-[1.6] text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-[1200px] gap-8 px-6 py-20 md:grid-cols-2 md:px-10 md:py-24">
          <figure className="rounded-2xl border border-white/12 bg-white/[0.04] p-8 md:p-10">
            <blockquote className="text-[19px] font-medium leading-[1.55] text-white/90">
              “I am very impressed by your use of the 5H<R /> and the progress
              you have led us to make. From a broken start, the turnaround has
              been beyond my expectations… it would have been impossible to get
              where we are now without you.”
            </blockquote>
            <figcaption className="mt-6 border-t border-white/10 pt-5 text-sm">
              <span className="font-semibold text-white">Amy Yang</span>
              <span className="text-white/55"> — Managing Director, Levi’s China</span>
            </figcaption>
          </figure>

          <figure className="rounded-2xl border border-white/12 bg-white/[0.04] p-8 md:p-10">
            <blockquote className="text-[19px] font-medium leading-[1.55] text-white/90">
              “During Covid-19, GlaxoSmithKline adapted the 5H<R /> framework to
              measure the progress of its high-potentials within Emerging
              Markets.”
            </blockquote>
            <figcaption className="mt-6 border-t border-white/10 pt-5 text-sm">
              <span className="font-semibold text-white">Rhea Leckie</span>
              <span className="text-white/55"> — Founder, Corporate DNA</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── Client stories ───────────────────────────────────────────── */}
      <section className="bg-white">
        <Reveal
          stagger={false}
          className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24"
        >
          <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <Eyebrow>Proven in the field</Eyebrow>
              <h2 className="text-[28px] font-bold leading-[1.1] tracking-[-0.6px] text-ink sm:text-[34px]">
                Trusted by leaders worldwide
              </h2>
            </div>
            <Link
              href="/cases"
              className="text-sm font-bold uppercase tracking-[0.5px] text-brand hover:underline"
            >
              Explore more client stories →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
            {CLIENTS.map((c) => (
              <div
                key={c.name}
                className="flex items-center justify-center bg-white px-6 py-10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/logos/${c.file}`}
                  alt={c.name}
                  loading="lazy"
                  className="h-10 w-auto max-w-[120px] object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <section className="bg-brand text-white">
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between md:px-10 md:py-20">
          <div>
            <h2 className="text-[28px] font-bold leading-[1.1] tracking-[-0.6px] sm:text-[36px]">
              Ready to lead with 5H<R />?
            </h2>
            <p className="mt-4 max-w-[560px] text-lg leading-[1.5] text-white/85">
              Let’s design a program that develops whole leaders across your
              organisation.
            </p>
          </div>
          <Link
            href="/book"
            className="inline-block flex-none bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.5px] text-brand transition-colors hover:bg-white/90"
          >
            Contact us
          </Link>
        </div>
      </section>

      <p className="bg-white px-6 py-8 text-center text-xs text-muted">
        © 2021– 5H is the sole copyright and IP of Corporate DNA Consulting. All
        rights reserved.
      </p>
    </SiteShell>
  );
}
