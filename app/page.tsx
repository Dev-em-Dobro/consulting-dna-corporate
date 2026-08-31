import type { Metadata } from "next";
import { localeAlternates } from "@/lib/seo/alternates";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import methodology from "@/public/5H-methodology.jpg";
import HeroV1 from "@/components/HeroV1";
import NavV1 from "@/components/NavV1";
import Reveal from "@/components/Reveal";
import LogoMarquee from "@/components/LogoMarquee";
import PhotoCarousel from "@/components/PhotoCarousel";
import Counter from "@/components/Counter";
import PeopleGrid from "@/components/PeopleGrid";
import SiteFooter from "@/components/SiteFooter";
import BookEndorsements from "@/components/BookEndorsements";
import AwardsMentions from "@/components/AwardsMentions";
import { getPeople, getTickerEntries } from "@/lib/cms/map";
import { buildSiteNav } from "@/lib/nav-server";
import ContactForm from "@/components/ContactForm";
import LocationsBlock from "@/components/LocationsBlock";
import RunningTicker from "@/components/RunningTicker";
import WorldCoverageMap from "@/components/WorldCoverageMap";
import JsonLd from "@/components/JsonLd";
import { bookLd, personLd } from "@/lib/seo/jsonld";
import { clientLogoRows, logoRowDuration } from "@/lib/logos";
import { getSiteStats } from "@/lib/stats";

export async function generateMetadata(): Promise<Metadata> {
  const title =
    "Global Leadership Advisory & Executive Coaching | Corporate DNA";
  return {
    title,
    description: SITE_DESCRIPTION,
    alternates: localeAlternates("/"),
    openGraph: { title, description: SITE_DESCRIPTION },
    twitter: { title, description: SITE_DESCRIPTION },
  };
}

// The curated client wall now lives in lib/logos.ts, shared with /our-clients
// so the two walls cannot drift apart (27-08 brief, item 8).
const [logoRow1, logoRow2] = clientLogoRows;

const book = {
  title:
    "Corporate DNA: How Great Companies Build What Competitors Can't Copy and clients want to emulate",
  subtitle: "The book behind the method",
  body: [
    "What if the greatest competitive advantage isn't your strategy, products or technology—but your organisational DNA?",
    "Drawing on nearly two decades of advising CEOs and executive teams around the world, Rhea Leckie reveals the principles behind organisations that consistently outperform, adapt and endure.",
    "More than a leadership book, this is the story of how a boutique consultancy scaled through financial crises, wars and a global pandemic by intentionally building a Corporate DNA that clients now seek to emulate. Blending real-world leadership stories with a practical framework, the book explores how culture, leadership, decision-making and human behaviour become an organisation's greatest source of resilience and growth.",
    "For leaders who want to build companies that thrive through uncertainty—not just survive it—this is a blueprint for creating a legacy that lasts.",
  ],
};

const challenges = [
  { num: "01", title: "CEO & executive performance", body: "Support for new and established CEOs and C-suite leaders navigating transitions, first 100 days and sustained top-team pressure." },
  { num: "02", title: "Executive-team alignment", body: "Aligning senior teams behind strategy so decisions move faster and the organisation feels one coherent leadership voice." },
  { num: "03", title: "Leadership succession & talent", body: "Building credible successors and the enterprise leadership pipeline before the seat, not after the gap appears." },
  { num: "04", title: "Enterprise transformation & culture", body: "Closing the gap when transformation is moving faster than leadership capability and culture can currently sustain." },
];

/**
 * The six terms item 1 asks the homepage to explain "Keeping Leadership Real"
 * with, quoted from the e-mail. Not the seven-term list in its opening, which is
 * about the experience of the site as a whole.
 */
const reals = [
  "Real pressures",
  "Real politics",
  "Real choices",
  "Real judgement",
  "Real people",
  "Real consequences",
];

const differentiators = [
  { n: "1", title: "Identity and habits, not skills alone", body: "We change how leaders think and behave under pressure, so improvement holds long after the programme ends." },
  { n: "2", title: "High-stakes, senior-level experience", body: "Advisors who have operated at board and C-suite level and are trusted in genuinely high-stakes conversations." },
  { n: "3", title: "Proprietary 5H and DNA 360 methodology", body: "A rigorous, measurable framework — not a generic coaching approach borrowed from elsewhere." },
  { n: "4", title: "Global insight with local delivery", body: "A 75-strong faculty delivering consistently across 36 countries, tuned to regional context." },
];

// `caseSlug` deep-links a card to its published case detail page (/cases/<slug>).
// Cards without a slug fall back to the flagship-cases listing (/cases).
const cases: {
  client: string; sector: string; challenge: string;
  metric: string; metricLabel: string; caseSlug?: string;
}[] = [
  { client: "Heineken", sector: "FMCG", challenge: "Accelerate the readiness and advancement of high-potential leaders across the group.", metric: "45%", metricLabel: "higher promotion rate for programme participants", caseSlug: "heineken" },
  { client: "Coca-Cola", sector: "FMCG", challenge: "Reset a legacy beverage brand by embedding new mindsets and behaviours across a newly formed APAC leadership team.", metric: "43", metricLabel: "leaders transformed across APAC & Japan", caseSlug: "coca-cola" },
  { client: "Shell", sector: "Energy", challenge: "Scale women's leadership development across a global engineering workforce.", metric: "2,582", metricLabel: "women leaders impacted across the programme", caseSlug: "case-1d007617" },
];

export default async function V1() {
  const [people, nav, stats, ticker] = await Promise.all([
    getPeople(),
    buildSiteNav(),
    getSiteStats(),
    getTickerEntries(),
  ]);
  return (
    <div className="w-full overflow-x-hidden bg-white">
      <JsonLd
        data={[
          personLd({ name: "Rhea Leckie", jobTitle: "Founder" }),
          bookLd({
            name: book.title,
            author: "Rhea Leckie",
            path: "/#book",
            description: book.body[1],
            image: `${SITE_URL}/book-cover.jpg`,
          }),
        ]}
      />
      {/* NAV */}
      <NavV1 items={nav} />

      {/* TICKER — directly under the nav, where the old CDNA site carried it
          (27-08 brief, item 17). Renders nothing until the CMS has 2023+ entries,
          so it costs no vertical space while the content is still being written. */}
      <RunningTicker entries={ticker} />

      {/* HERO */}
      <HeroV1 />

      {/* WHAT "REAL" MEANS — 27-08 brief, item 1: "Precisamos explicar Keeping
          Leadership Real de maneira curta e visual, trazendo: real pressures,
          real politics, real choices, real judgement, real people and real
          consequences."

          The six terms are his, verbatim, and nothing else is written here —
          no invented copy. The heading is his too: item 1 keeps "When the
          stakes are high, leadership must become real" alive ("pode continuar
          na narrativa, mas não como primary headline") and gives it a job —
          "'High stakes' passa a explicar por que Keeping Leadership Real
          importa". This section IS that explanation, so the sentence belongs
          here. Note it echoes the hero sub-line, which carries the same phrase
          inside a longer clause; the repetition is the brief's own device, but
          it is the one thing worth confirming with CDNA.

          Placed between the hero and the wall on purpose. Item 2 warns against
          "long explanation antes de proof"; this is the short, visual one item 1
          asks for, and it is the unpacking of the claim the hero just made. It
          also breaks the run of three dark bands (ticker, hero, wall) and gives
          the logo wall back the set-up line it lost in the reorder.

          Note there are two lists of "reals" in the e-mail and they are not
          interchangeable: the seven in the opening are about the experience of
          the whole site; these six are harder — pressures, politics,
          consequences — and are the ones item 1 attaches to the homepage. */}
      <section id="real" className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-10 py-16 md:py-20">
          {/* Head first: every other section on this page opens with the rule +
              eyebrow + h2 set, and this one opening cold on six bare labels was
              most of why it read as unfinished. `stagger={false}` so the head
              fades as one block — a stagger here would animate the eyebrow and
              the h2 separately, against a grid that is already staggering. */}
          <Reveal stagger={false} className="mb-10 md:mb-12">
            <div className="mb-2.5 flex items-baseline gap-3">
              <span className="inline-block h-0.5 w-9 bg-brand" />
              <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">
                Keeping Leadership Real
              </span>
            </div>
            <h2 className="max-w-[720px] text-[30px] font-bold leading-[1.1] tracking-[-0.8px] text-ink sm:text-[34px] md:text-[40px]">
              When the stakes are high, leadership must become real.
            </h2>
          </Reveal>
          {/* `Reveal` IS the grid, as in the credibility band below. It renders
              its own data-reveal="stagger" and animates its direct children, so
              nesting a second stagger inside it leaves the terms matched by the
              opacity-0 rule in globals.css with nothing to animate them — the
              section renders as an empty band, for real visitors.

              The hairline grid is the page's own device for a set of related
              facts — the case header band, the Measured outcomes cards and the
              regions grid all use this exact `gap-px border border-line bg-line`
              construction. White cells on paper, so the set reads as a block
              instead of six labels floating in white.

              Two rows of three rather than six across: at six columns the terms
              shrink to labels and "Real consequences" wraps alone. Equal cells
              also stop that one term breaking the rhythm of the row. */}
          <Reveal className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
            {reals.map((term) => (
              <div key={term} className="bg-white p-6 md:p-7">
                <span className="mb-4 block h-[3px] w-8 bg-brand" />
                <span className="block text-[20px] font-bold leading-[1.15] tracking-[-0.5px] text-ink md:text-[24px]">
                  {term}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CREDIBILITY — proof, before any explanation.
          The brief's ordering principle is "Claim → Proof → Explanation, e não
          long explanation antes de proof" (item 2), so the logo wall and the
          statistics now sit between the hero and "What we solve", which used to
          come first. */}
      <section className="bg-ink text-white">
        <div className="pb-[34px] pt-[70px]">
          <p className="mb-9 text-center text-[12px] font-semibold uppercase tracking-[2.5px] text-white/70">
            Trusted by leadership teams at
          </p>
          <div className="flex flex-col gap-5">
            <LogoMarquee logos={logoRow1} duration={logoRowDuration(logoRow1)} />
            <LogoMarquee logos={logoRow2} duration={logoRowDuration(logoRow2)} reverse />
          </div>
        </div>
        <div className="mx-auto max-w-[1200px] px-10 pb-20 pt-5">
          <Reveal className="mx-auto grid max-w-[760px] grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            {stats.map((s) => (
              <div key={s.label} className="flex items-start gap-5">
                <span className="mt-[38px] h-[3px] w-8 flex-none bg-brand md:mt-[50px]" />
                <div>
                  <div className="text-[44px] md:text-[56px] font-bold leading-none tracking-[-1.5px] text-brand">
                    <Counter value={s.value} />
                  </div>
                  <div className="mt-2 text-[16px] font-medium leading-snug text-white/80">{s.label}</div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* WHAT WE SOLVE — the explanation, now that the proof is above it. */}
      <section id="solve" className="bg-white">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24 md:text-center">
          <div className="mb-2.5 flex items-baseline gap-3 md:justify-center">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">What we solve</span>
          </div>
          <h2 className="mb-3 max-w-[720px] text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-ink md:mx-auto">
            The leadership challenges that determine enterprise performance.
          </h2>
          <p className="max-w-[620px] text-lg leading-[1.55] text-muted md:mx-auto">
            We start with what is at stake for the organisation — then bring the people, method and evidence to solve it.
          </p>
        </Reveal>
      </section>

      {/* CHALLENGES — hidden for now (set the guard to true to restore) */}
      {false && (
      <section id="challenges" className="bg-white">
        <Reveal className="mx-auto max-w-[1200px] px-10 pb-24 pt-4">
          <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2">
            {challenges.map((ch) => (
              <div key={ch.num} className="bg-white p-10 hover:bg-[#fafafa]">
                <div className="mb-[18px] text-[13px] font-bold tracking-[1px] text-brand">{ch.num}</div>
                <h3 className="mb-3 text-2xl font-semibold tracking-[-0.3px] text-ink">{ch.title}</h3>
                <p className="text-base leading-[1.6] text-[#4a4548]">{ch.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
      )}

      {/* WHY CDNA — hidden for now (set the guard to true to restore) */}
      {false && (
      <section className="bg-paper">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24">
          <div className="mb-2.5 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Why Corporate DNA</span>
          </div>
          <h2 className="mb-[52px] max-w-[760px] text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-ink">
            Four reasons senior teams choose us over a coaching directory.
          </h2>
          <div className="grid grid-cols-1 gap-x-14 gap-y-10 md:grid-cols-2">
            {differentiators.map((d) => (
              <div key={d.n} className="flex items-start gap-[22px]">
                <div className="flex h-11 w-11 flex-none items-center justify-center border-[1.5px] border-brand text-base font-bold text-brand">
                  {d.n}
                </div>
                <div>
                  <h3 className="mb-2 text-[21px] font-semibold tracking-[-0.3px] text-ink">{d.title}</h3>
                  <p className="text-base leading-[1.6] text-[#4a4548]">{d.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
      )}

      {/* The compiled "metralhadora" testimonial reel used to sit here. Item 13
          of the 27-08 brief removes it from the public site: "Remover o compiled
          testimonial video atual do public website. Em vez disso, criar uma
          estrutura modular para individual client testimonial videos." That
          structure exists — the `testimonial_video` content type and its read
          layer — and stays empty until CDNA supplies the individual films.
          `components/TestimonialsVideo.tsx` is left in the repo for them. */}

      {/* CLIENT IMPACT */}
      <section id="impact" className="bg-white">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24">
          <div className="mb-2.5 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Client impact</span>
          </div>
          <h2 className="mb-[52px] max-w-[720px] text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-ink">
            Results, not promises — measured where it matters.
          </h2>
          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {cases.map((c) => (
              <article key={c.client} className="flex flex-col border border-line">
                <div className="bg-ink px-[26px] py-[22px] text-white">
                  <div className="text-[19px] font-bold tracking-[0.5px]">{c.client}</div>
                  <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[1px] text-white/70">{c.sector}</div>
                </div>
                <div className="flex flex-1 flex-col px-[26px] py-7">
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-brand">Challenge</p>
                  <p className="mb-[22px] text-[15px] leading-[1.55] text-[#4a4548]">{c.challenge}</p>
                  <div className="mt-auto pt-[22px]">
                    <span className="mb-[18px] block h-[3px] w-9 bg-brand" />
                    <div className="text-[40px] md:text-[52px] font-bold leading-none tracking-[-1.5px] text-brand">
                      <Counter value={c.metric} />
                    </div>
                    <div className="mt-2.5 text-[14.5px] font-medium leading-snug text-ink">{c.metricLabel}</div>
                    <a
                      href={c.caseSlug ? `/cases/${c.caseSlug}` : "/cases"}
                      className="mt-4 inline-block text-[14px] font-semibold text-brand underline underline-offset-4 transition-colors hover:text-brand-dark"
                    >
                      read more here
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 5H FRAMEWORK — hidden for now (set the guard to true to restore) */}
      {false && (
      <section id="approach" className="bg-ink text-white">
        <Reveal className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-[72px] px-10 py-24 md:grid-cols-2">
          <div>
            <div className="mb-2.5 flex items-baseline gap-3">
              <span className="inline-block h-0.5 w-9 bg-brand" />
              <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Our approach</span>
            </div>
            <h2 className="mb-5 text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-white">
              The 5H<span className="align-super text-xl font-semibold">®</span> Framework
            </h2>
            <p className="mb-[18px] text-[17px] leading-[1.65] text-white/80">
              Sustained leadership change comes from identity and habits — not skills alone. Our proprietary 5H methodology works across the{" "}
              <em className="font-semibold not-italic text-white">inner game</em> of the leader and the{" "}
              <em className="font-semibold not-italic text-white">outer game</em> of performance, so behaviour holds under real enterprise pressure.
            </p>
            <p className="mb-[30px] text-[17px] leading-[1.65] text-white/80">
              Paired with our DNA 360 Profiler, it turns diagnosis into a measurable development plan for individuals, teams and the wider organisation.
            </p>
            <Link href="/approach" className="border-b-2 border-brand pb-1 text-sm font-bold uppercase tracking-[0.5px] text-white hover:text-brand">
              Explore the methodology →
            </Link>
          </div>
          <div className="flex justify-center">
            <Image src={methodology} alt="The 5H Framework methodology" className="h-auto w-full max-w-[560px] border border-white/10" />
          </div>
        </Reveal>
      </section>
      )}

      {/* PEOPLE — hidden until the CMS has published people */}
      {people.length > 0 && (
        <section id="people" className="bg-white">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24">
          <div className="mb-2.5 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Our people</span>
          </div>
          <h2 className="mb-3 max-w-[720px] text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-ink">
            Senior advisors who have sat where our clients sit.
          </h2>
          <p className="mb-12 max-w-[640px] text-lg leading-[1.55] text-muted">
            A leadership team of seasoned advisors, backed by a global faculty of 75 practitioners delivering across 36 countries.
          </p>
          <PeopleGrid people={people} />
          {/* The DNA experience — copy on the left, life-at-DNA carousel on the
              right. Stacks on mobile (text first, then the images). */}
          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-14">
            <div>
              <p className="text-lg font-medium leading-[1.55] text-ink">
                With our “One DNA TEAM” principle, we execute as one
                collaborative team.
              </p>
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="mb-2 text-[17px] font-bold tracking-[-0.3px] text-ink">
                    The DNA Experience
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-muted">
                    We blend our individual talents with the collective
                    expertise of our global pool of 75 members across 36
                    countries, and deliver the power of the “DNA experience” to
                    every client. Each time, every time.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-[17px] font-bold tracking-[-0.3px] text-ink">
                    Trusted Relationships
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-muted">
                    Relationships are at the core of who we are. We build
                    long-term, deep relationships with our people and become
                    part of each other’s stories. We are part of a family who
                    care about each other, stay close and grow, laugh and unmask
                    together.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-[17px] font-bold tracking-[-0.3px] text-ink">
                    Inclusion &amp; Diversity
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-muted">
                    Our best-in-class people are full of great character and
                    personality, representing a range of backgrounds in the
                    behavioural sciences and business; coming from different
                    markets around the world, and representing a wide range of
                    social identities.
                  </p>
                </div>
              </div>
            </div>
            <PhotoCarousel
              images={Array.from({ length: 28 }, (_, i) => i + 1)
                .filter((n) => n !== 5 && n !== 8 && n !== 14)
                .map(
                  (n) =>
                    `/dna-time/dna-time-${String(n).padStart(2, "0")}.jpeg`
                )}
            />
          </div>
          <div className="mt-14 flex flex-wrap items-center gap-x-14 gap-y-6 border-t border-line pt-10">
            <span className="text-[12px] font-semibold uppercase tracking-[2px] text-muted">In partnership with</span>
            <span className="text-[19px] font-bold text-ink">Harvard Business Impact</span>
            <span className="h-[22px] w-px bg-[#d9d5d1]" />
            <span className="text-[19px] font-bold text-ink">Imperial College London</span>
          </div>
        </Reveal>
        </section>
      )}

      {/* BOOK */}
      <section id="book" className="bg-paper">
        <Reveal className="mx-auto max-w-[1200px] py-14 md:px-10 md:py-24">
          <div className="bg-ink text-white md:border md:border-line md:p-14">
            {/* Blog-post layout: the cover floats and the copy wraps around it.
                `flow-root` contains the float so the endorsements block below
                starts on a clean line. */}
            <div className="flow-root px-6 pb-10 pt-12 md:p-0">
              <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">{book.subtitle}</span>
              <h3 className="mb-6 mt-6 text-[26px] sm:text-[30px] font-bold leading-[1.15] tracking-[-0.6px] text-white">
                {book.title}
              </h3>

              <figure className="mb-7 w-full md:float-right md:mb-4 md:ml-12 md:w-[400px]">
                <div className="relative aspect-[4/3] w-full overflow-hidden shadow-xl">
                  <Image src="/book-cover.png" alt={book.title} fill sizes="(min-width: 768px) 400px, 100vw" className="object-cover" />
                </div>
              </figure>

              <div className="space-y-4 text-[17px] leading-[1.65] text-white/80">
                {book.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <a
                href="https://www.amazon.com/Leadership-Its-Your-Rhea-Duttagupta/dp/1408168340"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-brand-dark"
              >
                Buy on Amazon
              </a>
            </div>

            {/* Recovered from the legacy /book-endorsements page, which now
                redirects here. Inside the card so it reads as one block. */}
            <BookEndorsements />
          </div>
        </Reveal>
      </section>

      {/* OFFICES / REGIONS — interactive locations map + carousel (feature 003) */}
      <LocationsBlock />

      {/* GLOBAL COVERAGE — world map of countries served (feature 008) */}
      <WorldCoverageMap />

      {/* AWARDS & MENTIONS — spec 009, design docs/Group 2.png */}
      <AwardsMentions />

      {/* CONTACT */}
      <section id="contact" className="bg-brand text-white">
        <Reveal className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-[72px] px-10 py-[88px] md:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="mb-6 text-[32px] sm:text-[38px] md:text-[44px] font-bold leading-[1.08] tracking-[-1px] text-white [text-wrap:balance]">
              What is changing, and where does leadership need to go?
            </h2>
            <p className="mb-2 max-w-[460px] text-[19px] leading-[1.6] text-white/90">
              Tell us the leadership challenge you are facing. We will respond with a considered, confidential point of view — not a sales pitch.
            </p>
          </div>
          <ContactForm />
        </Reveal>
      </section>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
}
