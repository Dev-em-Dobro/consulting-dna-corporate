import { ChevronRight, Settings, TrendingUp, Users, type LucideIcon } from "lucide-react";
import SolutionHero from "@/components/solutions/SolutionHero";

const levels: {
  image: string;
  overlay: string;
  label: string;
  title: string;
  body: string;
}[] = [
  {
    image: "/services/culture/organisation.jpg",
    overlay: "One organisation. A shared way of working.",
    label: "Organisation-wide culture",
    title: "From stated culture to lived culture.",
    body: "We translate enterprise purpose, strategy and values into a culture people can recognise and practise every day, embedding it through leadership, management, critical teams and the moments that matter across the organisation.",
  },
  {
    image: "/services/culture/market.jpg",
    overlay: "Local relevance. Enterprise consistency.",
    label: "Market / function culture",
    title: "Making culture meaningful where work gets done.",
    body: "We help markets and functions translate enterprise culture into their own operating reality, creating shared habits around decisions, collaboration, performance, customers and talent while protecting what needs to remain consistent across the enterprise.",
  },
  {
    image: "/services/culture/top-team.jpg",
    overlay: "Set the tone. Drive the shift. Multiply the impact.",
    label: "Top team / group culture",
    title: "The culture at the top becomes the culture below.",
    body: "We work with Executive Teams, Boards and senior leadership groups to define and role-model the culture required for what comes next, strengthening how they make decisions, challenge one another, collaborate, hold accountability and visibly set the tone for the organisation.",
  },
];

const planets = [
  "Leadership and role modelling",
  "Ownership and accountability",
  "Radical candour",
  "Keep / kill / change processes",
  "Employee experience",
  "Critical teams",
  "Performance differentiation",
  "Meetings and dialogue",
  "Cross-vertical collaboration",
  "Decision speed and escalation",
];

const proofs: { title: string; line: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Behaviour proof",
    line: "How people show up.",
    body: "Fearless honesty, accountability, ownership, role-modelling and the everyday habits that signal the culture is changing.",
    icon: Users,
  },
  {
    title: "Operating proof",
    line: "How work gets done.",
    body: "Decision speed, escalation, meeting effectiveness, cross-functional collaboration, process simplicity and clarity of ownership.",
    icon: Settings,
  },
  {
    title: "Business proof",
    line: "What changes as a result.",
    body: "Tangible outcomes owned by each critical team: speed, quality, customer outcomes, productivity, delivery and growth.",
    icon: TrendingUp,
  },
];

const journey = [
  ["Baseline", "Where are we today?", false],
  ["90 days", "What is beginning to shift?", true],
  ["6 months", "What can we prove?", true],
  ["Embed and scale", "What do we reinforce and scale?", true],
] as const;

export default function CultureTransformationPage() {
  return (
    <>
      <SolutionHero
        eyebrow="Our services"
        title="Culture Transformation"
        subtitle="Turn strategic intent into the habits that shape how the organisation actually operates."
        imageUrl="/hero/culture-transformation.jpeg"
        imageFilter="saturate-[.85] brightness-[.6]"
      />
      <section className="mx-auto max-w-[1200px] px-6 py-20 md:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">What we do</p>
            <h2 className="mt-4 font-serif text-4xl font-medium text-ink md:text-5xl">
              We make culture real in the flow of work.
            </h2>
          </div>
          <div className="space-y-4 text-ink/80">
            <p>We work at organisation, market and top-team levels to translate intended culture, values and behaviours into the everyday habits, choices and decisions that determine how work actually gets done.</p>
            <p>Every transformation starts with the belief and business reason for change. We then identify the moments where culture needs to show up differently and embed it through leaders, managers, teams and the operating rhythms of the organisation.</p>
            <p>For us, culture is the ecosystem within which everything else sits, whether it is leadership, talent, strategy or business performance. You can invest in great leaders and exceptional talent, but without the right culture, much of that value remains untapped.</p>
          </div>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {levels.map((card) => (
            <li key={card.label}>
              <div className="relative h-44 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.image} alt="" className="h-full w-full object-cover" />
                <p className="absolute inset-x-4 bottom-4 text-right text-xs font-semibold uppercase tracking-[1.2px] text-white">{card.overlay}</p>
              </div>
              <div className="pt-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[1.4px] text-brand">
                  <Users className="size-4" aria-hidden="true" />
                  {card.label}
                </p>
                <h3 className="mt-3 font-serif text-2xl text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{card.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="bg-ink px-6 py-20 text-white md:px-10">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[13px] font-semibold uppercase tracking-[2px] text-brand-light">How we work</p>
          <h2 className="mt-4 font-serif text-4xl">The CDNA Culture Ecosystem.</h2>
          <p className="mt-4 text-sm uppercase tracking-[2px] text-white/60">Ten planets. A stronger culture.</p>
          <p className="mt-6 max-w-[40ch] text-white/80">Purpose, strategy and performance sit at the centre. Ten practices orbit them.</p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {planets.map((item, i) => (
              <li key={item} className="border border-white/15 px-4 py-3 text-sm">
                <span className="mr-3 text-brand-light">{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mx-auto max-w-[1200px] px-6 py-20 md:px-10">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">We make the shift visible</p>
            <h2 className="mt-4 font-serif text-4xl font-medium text-ink">From culture intent to measurable organisational change.</h2>
          </div>
          <p className="text-ink/80">
            Culture transformation only matters if people behave differently, work differently and produce different outcomes. We establish a baseline, identify the proof points that matter, and track whether the new culture is becoming visible in the flow of work.
          </p>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {proofs.map(({ title, line, body, icon: Icon }) => (
            <li key={title} className="bg-ink p-6 text-white">
              <Icon className="size-8" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-4 text-xs font-semibold uppercase tracking-[1.6px] text-brand-light">{title}</h3>
              <p className="mt-2 font-medium text-white">{line}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-20">
          <p className="text-xs font-semibold uppercase tracking-[1.6px] text-brand">Our measurement journey</p>
          <ol className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-6 lg:flex-nowrap lg:justify-between">
            {journey.map(([title, question, filled], i) => (
              <li key={title} className="flex items-center gap-4">
                <span className={`inline-flex size-16 shrink-0 items-center justify-center rounded-full px-2 text-center text-[10px] font-semibold uppercase leading-tight ${filled ? "bg-brand text-white" : "bg-ink text-white"}`}>
                  {title}
                </span>
                <span className="max-w-[14ch] text-sm leading-snug text-ink/80">{question}</span>
                {i < journey.length - 1 ? <ChevronRight className="hidden size-7 shrink-0 text-brand lg:block" strokeWidth={2.5} aria-hidden="true" /> : null}
              </li>
            ))}
          </ol>
        </div>
        <div className="mx-auto mt-24 flex items-center gap-6 md:gap-10">
          <span className="h-px min-w-8 flex-1 bg-brand" aria-hidden="true" />
          <p className="text-center font-serif text-2xl leading-snug text-brand md:text-[1.75rem]">
            Culture isn&apos;t what is written on the wall.
            <span className="mt-1 block font-semibold">It&apos;s what happens when the real work begins.</span>
          </p>
          <span className="h-px min-w-8 flex-1 bg-brand" aria-hidden="true" />
        </div>
      </section>
    </>
  );
}
