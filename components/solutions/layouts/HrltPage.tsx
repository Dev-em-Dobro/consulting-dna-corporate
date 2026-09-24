import {
  BarChart3,
  Cog,
  FileText,
  Gem,
  Globe,
  Search,
  Sprout,
  Star,
  Target,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import SolutionHero from "@/components/solutions/SolutionHero";
import ServiceClose from "@/components/solutions/layouts/ServiceClose";

const pillars: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Collective Identity",
    body: "Align purpose, values and enterprise role for the HR function.",
    icon: Users,
  },
  {
    title: "Capability & Mindset",
    body: "Build the skills, judgement and confidence to lead in a complex, AI-driven world.",
    icon: Sprout,
  },
  {
    title: "Ways of Working",
    body: "Create clarity, rhythm and collaboration across the team and wider business.",
    icon: BarChart3,
  },
  {
    title: "Enterprise Impact",
    body: "Increase influence, credibility and contribution to business priorities.",
    icon: Cog,
  },
  {
    title: "Future Readiness",
    body: "Prepare HRLTs to navigate change, disruption and shape what comes next.",
    icon: Globe,
  },
];

const steps: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Discover",
    body: "Understand your context, ambitions and team dynamics.",
    icon: Search,
  },
  {
    title: "Co-create",
    body: "Design a tailored journey with the CHRO and HRLT.",
    icon: FileText,
  },
  {
    title: "Experience",
    body: "Run immersive sessions, sprints and real-time application.",
    icon: Users,
  },
  {
    title: "Embed",
    body: "Provide tools, coaching and team practices to integrate new behaviours.",
    icon: Wrench,
  },
  {
    title: "Measure",
    body: "Track progress and impact on team effectiveness and business outcomes.",
    icon: BarChart3,
  },
];

const outcomes: { label: string; icon: LucideIcon }[] = [
  { label: "Stronger strategic influence", icon: Star },
  { label: "Faster and better decision-making", icon: BarChart3 },
  { label: "Greater alignment and collective impact", icon: Users },
  { label: "Higher employee and manager engagement", icon: Sprout },
  { label: "More consistent execution of people priorities", icon: Target },
  { label: "A future-ready HR function", icon: Gem },
];

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="inline-flex size-16 items-center justify-center rounded-full bg-[#f6e8e6] text-ink">
      <Icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
    </span>
  );
}

export default function HrltPage() {
  return (
    <>
      <SolutionHero
        eyebrow="Our services"
        title="HR Leadership Teams (HRLT)"
        subtitle="Stronger HR leadership teams. A greater impact on the business."
        imageUrl="/hero/hrlt.jpeg"
        imageFilter="saturate-[.8] brightness-[.55]"
      />
      <section className="mx-auto max-w-[1200px] px-6 py-20 md:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">What we do</p>
            <h2 className="mt-4 font-serif text-4xl font-medium text-ink md:text-5xl">
              Build HR leadership teams that shape the business, from the inside out.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink/80">
              We help CHROs and their HR Leadership Teams strengthen their collective identity, capability and ways of working, so they can lead people, performance and transformation in a more connected, strategic and impactful way.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {pillars.map(({ title, body, icon }) => (
              <li key={title} className="text-center">
                <IconBadge icon={icon} />
                <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bg-[#f7f1ef] px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">How we work</p>
            <h2 className="mt-4 font-serif text-4xl font-medium text-ink">
              A focused, practical journey. Built around your context.
            </h2>
            <p className="mt-6 leading-relaxed text-ink/80">
              We combine insight, experience and real-world application to help HRLTs make progress that sticks.
            </p>
          </div>
          <ol className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {steps.map(({ title, body, icon: Icon }, i) => (
              <li key={title} className="relative text-center">
                <span className="relative inline-flex">
                  <span className="inline-flex size-[72px] items-center justify-center rounded-full border border-ink/15 bg-white text-ink">
                    <Icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="absolute -right-1 -top-1 inline-flex size-6 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                </span>
                {i < steps.length - 1 ? (
                  <span className="absolute left-[calc(50%+42px)] top-9 hidden text-ink/30 lg:block" aria-hidden="true">
                    →
                  </span>
                ) : null}
                <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="mx-auto max-w-[1200px] px-6 py-20 md:px-10">
        <p className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Evidence</p>
        <h2 className="mt-4 font-serif text-4xl font-medium text-ink">Stronger HRLTs. Greater business impact.</h2>
        <p className="mt-4 max-w-[52ch] text-ink/80">
          Our work helps HR leadership teams build the capability and influence to drive real change.
        </p>
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[minmax(0,1.4fr)_auto]">
          <ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {outcomes.map(({ label, icon: Icon }) => (
              <li key={label} className="text-center">
                <Icon className="mx-auto size-7 text-ink" strokeWidth={1.5} aria-hidden="true" />
                <p className="mt-3 text-sm leading-snug text-ink">{label}</p>
              </li>
            ))}
          </ul>
          <div className="border-ink/10 lg:border-l lg:pl-10">
            <p className="text-center text-xs font-semibold uppercase tracking-[2px] text-ink/45">Trusted by</p>
            <ul className="mt-6 grid grid-cols-2 items-center gap-x-8 gap-y-6">
              {[
                ["/logos/adidas.png", "adidas"],
                ["/logos/frasers_property.png", "Frasers Property"],
                ["/logos/dyson.png", "dyson"],
                ["/logos/maaden.png", "Ma'aden"],
              ].map(([src, alt]) => (
                <li key={alt} className="flex h-14 items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={alt} className="max-h-12 w-auto max-w-[140px] object-contain" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <ServiceClose />
    </>
  );
}
