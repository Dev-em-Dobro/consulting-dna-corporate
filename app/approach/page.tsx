import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import FiveHExplorer from "@/components/five-h/FiveHExplorer";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, serviceLd, faqLd } from "@/lib/seo/jsonld";
import { localeAlternates } from "@/lib/seo/alternates";
import methodology from "@/public/5H-methodology.jpg";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "The 5H® Framework | CorporateDNA",
    description:
      "The 5H® Methodology is the neuroscience-led formula behind CorporateDNA's results across 36 countries: Head, Heart, Hunch, Hands and Habits.",
    alternates: localeAlternates("/approach"),
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
  "Build great habits beyond ‘aha’ moments, repeating a skill enough to strengthen neural connections through practice, problem-solving and decision-making.",
  "Create real-world relevance by actively participating, experimenting and co-creating possible ideas and solutions.",
  "“Normalise” the real power of learning from mistakes.",
  "Share peer learning within the group through a collaborative model of multi-loop problem solving and feedback cycles.",
  "Create sustainable habits, new mindsets and skill sets that drive long-term success outside the workshops.",
  "Gain self-efficacy and confidence.",
  "Accelerate ROI on the organisation’s learning investments.",
];

/**
 * FAQ — self-contained Q&A for GEO/AI extraction. Rendered visibly below AND
 * emitted as FAQPage JSON-LD (Google requires the answers be on the page).
 */
const FAQS = [
  {
    question: "What is the 5H® Framework?",
    answer:
      "The 5H® Framework is CorporateDNA Consulting's proprietary, neuroscience-led leadership methodology built on five lenses: Head, Heart, Hunch, Hands and Habits (thinking, relating, sensing, doing and applying). It develops the whole leader rather than isolated skills, so new behaviours hold under real enterprise pressure.",
  },
  {
    question: "What do the five H's stand for?",
    answer:
      "The five H's are Head (thinking), Heart (relating), Hunch (sensing), Hands (doing) and Habits (applying). Head, Heart and Hunch form the Inner Game, the internal drivers of purpose, while Hands and Habits form the Outer Game, translating intent into action.",
  },
  {
    question:
      "How is the 5H® Framework different from traditional leadership training?",
    answer:
      "Traditional executive programmes often build skills that create partial leaders, sustainable only in the short term. The 5H® engages all of a leader's faculties at once and embeds new habits through practice, peer feedback and real-world application, so change endures long after the programme ends.",
  },
  {
    question: "What is the DNA 360 Profiler?",
    answer:
      "The DNA 360 Profiler is CorporateDNA's diagnostic tool used alongside the 5H® Methodology. It turns a leadership diagnosis into a measurable development plan for individuals, teams and the wider organisation.",
  },
  {
    question: "Where and with whom has the 5H® Framework been used?",
    answer:
      "CorporateDNA has applied the 5H® Methodology across culture transformations, leadership development, team building and executive coaching in 36 countries, with clients including GSK, Heineken, Unilever, Shell, Morgan Stanley and Coca-Cola.",
  },
];

const CLIENTS = [
  { name: "GSK", file: "gsk.png" },
  { name: "Heineken", file: "heineken.png" },
  { name: "Unilever", file: "unilever.png" },
  { name: "Shell", file: "shell.png" },
  { name: "Morgan Stanley", file: "morgan-stanley.png" },
  { name: "Aviva", file: "aviva.png" },
  { name: "Coca-Cola", file: "coca-cola.png" },
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

export default async function FiveHFrameworkPage() {
  return (
    <SiteShell>
      <JsonLd
        data={[
          // 5H is the methodology behind every solution, not a solution itself,
          // so it hangs off the home — not off /services.
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Our Approach", path: "/approach" },
          ]),
          serviceLd({
            name: "The 5H® Framework",
            path: "/approach",
            description:
              "CorporateDNA's proprietary, neuroscience-led leadership methodology: Head, Heart, Hunch, Hands and Habits, that develops the whole leader so behaviour change holds under real enterprise pressure.",
          }),
          faqLd(FAQS),
        ]}
      />
      {/* ── Hero ───────────────────────────────────────────────────────
          The subtitle opened with "95% of our clients cite 5H® as the real
          secret of our success" until 01-09. Guilherme, 12-08, to the CDNA team
          and copied to us: "I have also instructed the developers to remove the
          unsupported 5H claims referring to 95%, 26 countries and 'over ten
          years' unless anyone can provide a reliable source." No source arrived
          in the three weeks that followed.

          Worth recording what left with it: 95% is not a stale version of the
          90% the homepage carries. 90% is *work sponsored by Chairman/CXO*, 95%
          is *clients who cite 5H as the secret of our success* — two different
          measurements. This one goes for want of a source, not because it
          contradicts anything, and it can come back the day CDNA produces one. */}
      <PageHero
        eyebrow="Our Approach"
        title={<>Lead with 5H<R /></>}
        subtitle="The neuroscience-led formula behind our results across 36 countries."
        bgImageUrl="/approach-hero.png"
        imageClassName="object-cover object-right"
        overlayClassName="bg-gradient-to-r from-ink via-ink/90 to-ink/65"
      />

      {/* ── Our IP & Diagnostics ─────────────────────────────────────── */}
      <section id="ip-diagnostics" className="bg-paper">
        <Reveal
          stagger={false}
          className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24"
        >
          <div className="max-w-[720px]">
            <Eyebrow>Our IP &amp; Diagnostics</Eyebrow>
            <h2 className="text-[30px] font-bold leading-[1.1] tracking-[-0.8px] text-ink sm:text-[38px]">
              Proprietary frameworks and diagnostics we own.
            </h2>
            <p className="mt-5 text-[17px] leading-[1.7] text-muted">
              The tools that make our approach measurable and ownable, a
              neuroscience-led framework and the diagnostics that put it to work
              with leaders and teams.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* 5H — established, links to the framework detail on this page */}
            <Link
              href="#the-five-h"
              className="group flex flex-col border border-line bg-white p-7 transition-colors hover:border-brand"
            >
              <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-brand">
                Framework
              </span>
              <h3 className="mt-3 text-[21px] font-bold tracking-[-0.4px] text-ink">
                The 5H<R /> Framework
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-muted">
                Our proprietary, neuroscience-led leadership methodology: Head,
                Heart, Hunch, Hands and Habits, developing the whole leader so
                behaviour change holds under real enterprise pressure.
              </p>
              <span className="mt-5 text-[13px] font-semibold uppercase tracking-[1px] text-ink group-hover:text-brand">
                Explore the framework →
              </span>
            </Link>

            {/* DNA 360 Profiler — name confirmed elsewhere; overview to confirm */}
            <div className="flex flex-col border border-line bg-white p-7">
              <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-brand">
                Diagnostic
              </span>
              <h3 className="mt-3 text-[21px] font-bold tracking-[-0.4px] text-ink">
                The DNA 360 Profiler
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-[1.6] text-muted">
                Our multi-perspective leadership diagnostic, used to profile
                strengths and development priorities across the 5H<R /> lenses.
              </p>
              <span className="mt-5 inline-flex w-fit items-center gap-2 border border-dashed border-line px-3 py-1 text-[11.5px] font-medium text-muted">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
                Overview pending CDNA confirmation
              </span>
            </div>

            {/* The Team Climate Assessment card was REMOVED per the 27-08 brief
                (item 11): it is explicitly NOT to be presented as proprietary IP.
                This answers the "pending CDNA confirmation" flag it carried.
                Further frameworks/diagnostics only go in once CDNA validates
                them — nothing is to be invented here. */}
          </div>
        </Reveal>
      </section>

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
              CorporateDNA’s proprietary 5H<R /> Methodology is the
              neuroscience-led formula behind our proven results and global
              {/* "Over ten years and across 26 countries" — the age claim goes
                  (12-08 instruction, no source), the country count is corrected
                  rather than removed: 36 is the figure Guilherme authorised in
                  the same e-mail, and 26 was the only real contradiction with
                  the rest of the site. */}
              success. Across 36 countries, we have used the
              5H<R /> in all our programs: culture transformations, leadership
              development, building high-performing teams and executive coaching.
            </p>
            <p>
              There are five clear lenses through which we approach developing
              the whole self in leadership, the{" "}
              <strong className="text-ink">
                Head, Heart, Hunch, Hands and Habits
              </strong>, in other words, thinking, relating, sensing, doing and applying.
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
              <strong className="font-semibold text-white">Inner Game</strong>, the internal processes that drive us to lead with purpose. The
              Hands and Habits exist in the{" "}
              <strong className="font-semibold text-white">Outer Game</strong>, the ways we translate intent into action.
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
              “thinking brave”: Head-based courage, while another excels at
              “acting brave,” taking decisive action from the Hands.
            </p>
            <p className="text-[17px] leading-[1.7] text-muted">
              Created with simplicity in mind, the 5H<R /> live in a symbiotic,
              interdependent loop. To be a better thinker you must be more aware
              as a feeler; to be a doer you must be in tune as a sensor.
              Transformation happens only when the H’s connect: simple and
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
              <span className="text-white/55">: Managing Director, Levi’s China</span>
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
              <span className="text-white/55">: Founder, CorporateDNA</span>
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
                  src={`/logos/client-logos/${c.file}`}
                  alt={c.name}
                  loading="lazy"
                  className="h-10 w-auto max-w-[120px] object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── FAQ (visible + FAQPage JSON-LD, for search & AI extraction) ── */}
      <section className="bg-paper">
        <Reveal
          stagger={false}
          className="mx-auto max-w-[820px] px-6 py-20 md:px-10 md:py-24"
        >
          <div className="mb-12 text-center">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="inline-block h-0.5 w-9 bg-brand" />
              <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">
                Frequently asked
              </span>
            </div>
            <h2 className="text-[28px] font-bold leading-[1.1] tracking-[-0.6px] text-ink sm:text-[36px]">
              The 5H<R /> Framework, explained
            </h2>
          </div>

          <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
            {FAQS.map((f) => (
              <div key={f.question} className="p-6 md:p-8">
                <dt className="text-[18px] font-semibold leading-snug text-ink">
                  {f.question}
                </dt>
                <dd className="mt-3 text-[16px] leading-[1.7] text-muted">
                  {f.answer}
                </dd>
              </div>
            ))}
          </dl>
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
            href="/#contact"
            className="inline-block flex-none bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.5px] text-brand transition-colors hover:bg-white/90"
          >
            Contact us
          </Link>
        </div>
      </section>

      <p className="bg-white px-6 py-8 text-center text-xs text-muted">
        © 2021– 5H is the sole copyright and IP of CorporateDNA Consulting. All
        rights reserved.
      </p>
    </SiteShell>
  );
}
