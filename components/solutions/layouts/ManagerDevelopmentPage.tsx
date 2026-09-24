import {
  BarChart3,
  ChevronRight,
  Cog,
  Handshake,
  MessageCircle,
  MessagesSquare,
  Network,
  Sprout,
  Star,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import SolutionHero from "@/components/solutions/SolutionHero";
import ServiceClose from "@/components/solutions/layouts/ServiceClose";

const pathways = [
  {
    image: "/services/manager/first-time.jpg",
    alt: "A first-time manager in conversation",
    tone: "bg-[#f8ecea]",
    label: "First-time managers",
    title: "From managing yourself to managing others.",
    body: "We build the foundations to lead people with clarity and confidence.",
    points: [
      "Stepping into the manager identity",
      "Setting expectations",
      "Delegating and empowering",
      "Giving feedback",
      "Managing difficult conversations",
    ],
  },
  {
    image: "/services/manager/mid-level.jpg",
    alt: "A mid-level manager leading a discussion",
    tone: "bg-[#f3f4f6]",
    label: "Mid-level managers",
    title: "From managing people to leading performance.",
    body: "We strengthen the capability to lead through others, across functions and through complexity.",
    points: [
      "Leading through others",
      "Coaching for performance",
      "Accountability without micromanagement",
      "Navigating competing priorities",
      "Building high-performing teams",
    ],
  },
];

const moments: { label: string; icon: LucideIcon }[] = [
  { label: "Setting direction", icon: Target },
  { label: "Delegating", icon: Users },
  { label: "Giving feedback", icon: MessageCircle },
  { label: "Coaching", icon: Sprout },
  { label: "Having difficult conversations", icon: MessagesSquare },
  { label: "Managing performance", icon: BarChart3 },
  { label: "Building trust", icon: Handshake },
  { label: "Motivating others", icon: UserPlus },
  { label: "Navigating conflict", icon: Network },
  { label: "Leading change", icon: Cog },
];

const steps = [
  { title: "Short modules", body: "60-90 minute learning experiences", image: "/services/manager/modules.jpg" },
  { title: "Manager sprints", body: "Targeted application over a few weeks", image: "/services/manager/sprints.jpg" },
  { title: "Practice labs", body: "Real conversations, scenarios and peer learning", image: "/services/manager/labs.jpg" },
  { title: "Manager toolkits", body: "Simple tools and conversation guides", image: "/services/manager/toolkits.jpg" },
  { title: "Peer learning", body: "Learn from each other's challenges and successes", image: "/services/manager/peers.jpg" },
  { title: "Habit nudges", body: "Small prompts that turn learning into everyday behaviour", image: "/services/manager/nudges.jpg" },
];

const outcomes: { label: string; icon: LucideIcon }[] = [
  { label: "Greater manager confidence", icon: Users },
  { label: "Stronger employee engagement", icon: BarChart3 },
  { label: "Better conversations", icon: MessageCircle },
  { label: "Greater accountability", icon: UserPlus },
  { label: "Stronger team performance", icon: TrendingUp },
  { label: "More consistent leadership habits", icon: Star },
];

export default function ManagerDevelopmentPage() {
  return (
    <>
      <SolutionHero
        eyebrow="Our services"
        title="Manager Development"
        subtitle="Great managers turn everyday moments into better performance."
        imageUrl="/hero/manager-development.jpeg"
      />
      <section className="mx-auto max-w-[1200px] px-6 py-20 md:px-10">
        <p className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">What we do</p>
        <h2 className="mt-4 max-w-[22ch] font-serif text-4xl font-medium text-ink md:text-5xl">
          Build practical manager capability at the moments that matter.
        </h2>
        <p className="mt-4 text-lg text-ink/80">Two targeted pathways, designed for real-world impact.</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {pathways.map((card) => (
            <article key={card.label} className={`grid overflow-hidden rounded-sm sm:grid-cols-[220px_1fr] ${card.tone}`}>
              <div className="relative min-h-56 sm:min-h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.image} alt={card.alt} className="absolute inset-0 h-full w-full object-cover object-center" />
              </div>
              <div className="p-6 md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[1.5px] text-brand">{card.label}</p>
                <h3 className="mt-2 font-serif text-2xl text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{card.body}</p>
                <ul className="mt-4 space-y-2">
                  {card.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-ink">
                      <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] text-white" aria-hidden="true">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="bg-[#f7f4f2] px-6 py-16 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-center text-[13px] font-semibold uppercase tracking-[2px] text-ink">
            The manager moments that matter
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-y-8 sm:grid-cols-5 lg:grid-cols-10 lg:divide-x lg:divide-ink/10">
            {moments.map(({ label, icon: Icon }) => (
              <li key={label} className="px-2 text-center">
                <Icon className="mx-auto size-8 text-ink lg:size-11" strokeWidth={1.5} aria-hidden="true" />
                <p className="mt-3 text-xs leading-snug text-ink">{label}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="bg-[#f3eeeb] px-6 py-20 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">How we work</p>
          <h2 className="mt-4 font-serif text-4xl font-medium text-ink">
            Bite-sized. Practical. Built into the flow of work.
          </h2>
          <p className="mt-4 max-w-[62ch] text-ink/80">
            Focused learning, real conversations and practical tools, so managers can apply what they learn immediately.
          </p>
          <ol className="mt-12 grid grid-cols-2 gap-x-10 gap-y-10 md:grid-cols-3 xl:grid-cols-6">
            {steps.map((step, i) => (
              <li key={step.title} className="relative text-center">
                <span className="relative inline-flex w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={step.image} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
                  <span className="absolute left-1 top-1 inline-flex size-8 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                </span>
                {i < steps.length - 1 ? (
                  <ChevronRight className="pointer-events-none absolute -right-7 top-[22%] hidden size-8 text-brand xl:block" strokeWidth={2.5} aria-hidden="true" />
                ) : null}
                <h3 className="mt-4 text-sm font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="mx-auto max-w-[1200px] px-6 py-20 md:px-10">
        <p className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Evidence</p>
        <h2 className="mt-4 font-serif text-4xl font-medium text-ink">Building managers people want to work for.</h2>
        <p className="mt-4 max-w-[58ch] text-ink/80">
          Nearly two decades of manager development across industries, geographies and organisational levels.
        </p>
        <div className="mt-12 flex flex-col items-start gap-10 lg:flex-row">
          <ul className="grid w-full grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-ink/10">
            {outcomes.map(({ label, icon: Icon }) => (
              <li key={label} className="px-3 text-center">
                <Icon className="mx-auto size-8 text-ink lg:size-11" strokeWidth={1.5} aria-hidden="true" />
                <p className="mt-3 text-sm leading-snug text-ink">{label}</p>
              </li>
            ))}
          </ul>
          <ul className="flex w-full items-start justify-center gap-8 border-ink/10 pt-0 lg:w-auto lg:shrink-0 lg:border-l lg:pl-8">
            {[
              ["/logos/bt.png", "BT"],
              ["/logos/dp_world.png", "DP World"],
            ].map(([src, alt]) => (
              <li key={alt} className="flex h-8 items-center lg:h-11">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} className="h-8 w-auto object-contain lg:h-11" />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ServiceClose />
    </>
  );
}
