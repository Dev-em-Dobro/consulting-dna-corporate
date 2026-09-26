import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import {
  Brain,
  Eye,
  Hand,
  Heart,
  Infinity as InfinityIcon,
  ListChecks,
  Play,
  Plus,
  UserRoundCheck,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import SiteShell from "@/components/SiteShell";
import FiveHShowcase from "@/components/five-h/FiveHShowcase";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, faqLd, serviceLd } from "@/lib/seo/jsonld";
import { localeAlternates } from "@/lib/seo/alternates";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist-approach",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif-approach",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "The 5H® Framework | CorporateDNA",
    description:
      "The 5H® Methodology is the neuroscience-led formula behind CorporateDNA's results across 36 countries: Head, Heart, Hunch, Hands and Habits.",
    alternates: localeAlternates("/approach"),
  };
}

function R() {
  return <span className="align-super text-[0.48em] font-semibold">®</span>;
}

type Faculty = {
  name: string;
  intelligence: string;
  description: string;
  dimensions: string[];
  color: string;
  tint: string;
  icon: LucideIcon;
};

const FACULTIES: Faculty[] = [
  {
    name: "Head",
    intelligence: "Cognitive intelligence",
    description:
      "The clarity to think critically, reason strategically and make sense of complexity.",
    dimensions: [
      "Critical Thinking",
      "Risk Appetite",
      "Growth Mindset",
      "Scenario Planning",
      "Navigating Complexity",
    ],
    color: "#5a1f5f",
    tint: "#fbf4fa",
    icon: Brain,
  },
  {
    name: "Heart",
    intelligence: "Emotional intelligence",
    description:
      "The courage to lead with empathy, authenticity and emotional connection.",
    dimensions: [
      "Courage & Resilience",
      "Empathy",
      "Authentic Energy",
      "Interpersonal Savvy",
      "Connection & Collaboration",
    ],
    color: "#c91f35",
    tint: "#fff4f5",
    icon: Heart,
  },
  {
    name: "Hunch",
    intelligence: "Intuitive intelligence",
    description:
      "The instinct to sense patterns, stay curious and make timely, wise decisions.",
    dimensions: [
      "Judgement & Discernment",
      "Curiosity",
      "Sensing & Sensemaking",
      "Insightfulness",
      "Accelerated Decisioning",
    ],
    color: "#e1a10c",
    tint: "#fff9ea",
    icon: Eye,
  },
  {
    name: "Hands",
    intelligence: "Execution intelligence",
    description:
      "The drive to take action, own outcomes and deliver real results.",
    dimensions: [
      "Resourcefulness",
      "Role Modelling",
      "Accountability",
      "Stakeholder Centricity",
      "Action Oriented",
    ],
    color: "#173f70",
    tint: "#f1f6fc",
    icon: Hand,
  },
  {
    name: "Habits",
    intelligence: "Behavioural intelligence",
    description:
      "The discipline to show up consistently, lead by example and build lasting trust.",
    dimensions: [
      "Listening & Questioning",
      "Leading with Why",
      "Consistency",
      "Ownership",
      "Transparency",
    ],
    color: "#285f4f",
    tint: "#f1f8f5",
    icon: InfinityIcon,
  },
];

const FAQS = [
  {
    question: "How is the 5H different from other leadership models?",
    answer:
      "The 5H develops five connected forms of intelligence together, helping leaders translate inner awareness into visible behaviour and repeatable habits.",
  },
  {
    question: "What does the 5H look like in a room?",
    answer:
      "Leaders work with live business situations, practise new responses, receive feedback and connect insight directly to the decisions in front of them.",
  },
  {
    question: "How do you measure whether it worked?",
    answer:
      "The DNA 360 Profiler and supporting diagnostics create a measurable view of leadership impact, development priorities and behaviour change over time.",
  },
];

export default async function ApproachPage() {
  return (
    <SiteShell
      footerTopBorder
      floatingNav
      className={`${geist.variable} ${serif.variable} font-sans`}
      style={
        {
          "--font-sans": "var(--font-geist-approach), system-ui, sans-serif",
          "--font-serif": "var(--font-serif-approach), Georgia, serif",
        } as React.CSSProperties
      }
    >
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Our Approach", path: "/approach" },
          ]),
          serviceLd({
            name: "The 5H® Framework",
            path: "/approach",
            description:
              "CorporateDNA's proprietary, neuroscience-led leadership methodology: Head, Heart, Hunch, Hands and Habits.",
          }),
          faqLd(FAQS),
        ]}
      />

      <section className="relative isolate flex min-h-[84svh] flex-col justify-end overflow-hidden bg-ink pt-[76px] text-white md:justify-center">
        <Image
          src="/hero-bk-1.jpeg"
          alt="CorporateDNA leaders gathered in a city setting"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center grayscale"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1f1c1d]/88 via-[#1f1c1d]/60 to-[#1f1c1d]/20" />
        <div className="w-full">
          <div className="mx-auto w-full max-w-[1440px] px-6 py-20 md:px-10 md:py-16">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2.2px] text-brand-light">
              <span aria-hidden="true" className="h-px w-10 bg-brand-light" /> Our approach
            </p>
            <h1 className="mt-5 max-w-[900px] font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.2px] text-white [text-wrap:balance] sm:text-[44px] md:text-[52px]">
              Lead with 5H<R />
            </h1>
            <p className="mt-6 max-w-[620px] text-[19px] leading-[1.4] text-white/78 md:text-[22px]">
              The neuroscience-led formula behind our results across 36 countries.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <section className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20 lg:grid lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <h2 className="max-w-[520px] font-serif text-[31px] font-semibold leading-[1.08] tracking-[-0.5px] text-ink sm:text-[38px] lg:text-[48px]">
            Developing the whole self in leadership
          </h2>
          <div className="mt-7 max-w-[720px] space-y-5 text-[15px] leading-[1.72] text-muted sm:text-[16px] lg:mt-0 lg:text-[17px]">
            <p>
              The 5H<R /> gives you more than a single point measurement. It reveals all of a leader&apos;s faculties and how those interact and work together under real pressure.
            </p>
            <p>
              There are five clear lenses through which we approach developing the whole self in leadership: Head, Heart, Hunch, Hands and Habits.
            </p>
            <p>
              5H<R /> was born from the belief that traditional executive programmes often develop partial leaders, sustainable only in the short term.
            </p>
            <p>
              Our purpose is to develop whole leaders, where thinking, feeling, sensing, doing and practising are engaged and integrated.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-6 pb-12 md:px-10 md:pb-20">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,680px)] lg:items-center lg:gap-16">
            <h2 className="max-w-[760px] font-serif text-[31px] font-semibold leading-[1.08] tracking-[-0.5px] text-ink sm:text-[38px] lg:text-[48px]">
              Two games. Every leader is playing both.
            </h2>

          <div className="relative -mx-4 mt-10 w-[calc(100%+32px)] max-w-[680px] px-[4%] py-[7%] sm:mx-auto sm:w-full sm:px-[5%] lg:mt-0">
            <Image
              src="/approach-two-games-arrow.svg"
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 768px) 680px, 100vw"
              className="pointer-events-none object-fill"
            />

            <div className="relative grid grid-cols-2 gap-[5%]">
              <article className="flex min-w-0 flex-col overflow-hidden rounded-[10px] bg-[#e9e9e9] shadow-[0_3px_8px_rgba(0,0,0,0.27)]">
                <h3 className="bg-[#383838] px-1 py-[14px] text-center text-[clamp(16px,4.6vw,24px)] font-bold leading-[1.5] text-white sm:py-[17px]">Inner Game</h3>
                <div className="flex min-h-[clamp(290px,72vw,365px)] flex-1 flex-col items-center px-2 pb-8 pt-7 text-center sm:px-5 md:min-h-[430px] md:pb-10 md:pt-9">
                  <p className="max-w-[240px] text-[clamp(14px,3.8vw,20px)] leading-[1.5] text-[#595959]">Who we are and how we show up. What happens inside a leader&apos;s mind and emotions.</p>
                  <div className="mt-auto flex w-full max-w-[134px] flex-col gap-[3px] pt-8 md:max-w-[170px]">
                    {[["Head", "#693274"], ["Heart", "#df3f38"], ["Hunch", "#e5bd0b"]].map(([name, color]) => <span key={name} className="rounded-full px-2 text-[clamp(14px,4vw,23px)] leading-[1.32] text-white" style={{ backgroundColor: color }}>{name}</span>)}
                  </div>
                </div>
              </article>
              <article className="flex min-w-0 flex-col overflow-hidden rounded-[10px] bg-[#e9e9e9] shadow-[0_3px_8px_rgba(0,0,0,0.27)]">
                <h3 className="bg-[#383838] px-1 py-[14px] text-center text-[clamp(16px,4.6vw,24px)] font-bold leading-[1.5] text-white sm:py-[17px]">Outer Game</h3>
                <div className="flex min-h-[clamp(290px,72vw,365px)] flex-1 flex-col items-center px-2 pb-8 pt-7 text-center sm:px-5 md:min-h-[430px] md:pb-10 md:pt-9">
                  <p className="max-w-[240px] text-[clamp(14px,3.8vw,20px)] leading-[1.5] text-[#595959]">How that inner state becomes behaviour, decisions and impact.</p>
                  <div className="mt-auto flex w-full max-w-[134px] flex-col gap-[3px] pt-8 md:max-w-[170px]">
                    {[["Hands", "#2e4794"], ["Habits", "#08764b"]].map(([name, color]) => <span key={name} className="rounded-full px-2 text-[clamp(14px,4vw,23px)] leading-[1.32] text-white" style={{ backgroundColor: color }}>{name}</span>)}
                  </div>
                </div>
              </article>
            </div>
          </div>
          </div>

          <div className="mx-auto max-w-[980px]">
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { label: "Self-assessment", Icon: UserRoundCheck },
              { label: "360 assessment", Icon: UsersRound },
              { label: "Situational assessment", Icon: ListChecks },
            ].map(({ label, Icon }) => (
              <div key={label} className="text-center">
                <div className="flex aspect-square items-center justify-center bg-[#f5f4f2]">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 sm:h-20 sm:w-20">
                    <Icon aria-hidden size={28} strokeWidth={1.5} className="text-brand sm:size-10" />
                  </span>
                </div>
                <p className="mt-3 text-[13px] font-medium leading-[1.25] text-muted sm:text-[18px] lg:text-[22px]">{label}</p>
              </div>
            ))}
          </div>

          <div className="relative mt-8 aspect-[1.58/1] overflow-hidden lg:mt-7">
            <Image src="/clients-bottom-banner.jpg" alt="CorporateDNA leaders together" fill sizes="(min-width: 760px) 680px, 100vw" className="object-cover grayscale" />
            <div className="absolute inset-0 bg-black/10" />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/45 text-white shadow-xl">
              <Play aria-hidden="true" className="ml-1 h-6 w-6 fill-current" />
            </span>
          </div>
          </div>
        </section>

        <FiveHShowcase />

        <div className="bg-white px-6 pb-4 pt-14 text-center md:pt-16">
          <p className="mx-auto max-w-[720px] text-[16px] font-semibold leading-[1.4] text-ink sm:text-[19px]">
            (Most leadership development stops at the Head)
          </p>
        </div>

        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20 lg:grid lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-20">
            <div>
              <h2 className="max-w-[620px] text-center font-serif text-[25px] font-semibold leading-[1.18] tracking-[-0.35px] text-ink sm:text-[34px] lg:text-left lg:text-[46px]">
                What happens underneath drives the outcome.
              </h2>
              <p className="mx-auto mt-7 max-w-[560px] text-center text-[12px] leading-[1.6] text-muted sm:text-[13px] lg:mx-0 lg:max-w-[520px] lg:text-left lg:text-[16px]">
                Five connected forms of intelligence, centred on the values, beliefs and drivers that shape how a leader shows up.
              </p>
            </div>
            <div className="mt-9 lg:mt-0">
              <Image
                src="/approach-5h-wheel.svg"
                alt="The 5H model showing the inner game, outer game and the five leadership intelligences"
                width={932}
                height={908}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="mx-auto h-auto w-full max-w-[680px]"
              />
            </div>
          </div>
          <p className="px-6 pb-12 pt-4 text-center text-[14px] leading-[1.5] text-[#777] md:pb-16 md:pt-0">
            The 5H© Framework. © 2026 Corporate DNA Consulting. All rights reserved.
          </p>
        </section>
      </div>

      <section id="dna-360-profiler" className="bg-[#353132] text-white">
        <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
          <div>
          <h2 className="font-serif text-[34px] font-semibold leading-[1.05] tracking-[-0.7px] sm:text-[44px] lg:text-[54px]">
            The 5H, as an assessment.
          </h2>
          <div className="mt-7 max-w-[720px] space-y-5 text-[14px] leading-[1.68] text-white/82 sm:text-[15px] lg:text-[17px]">
            <p>
              The 5H was the catalyst for building the DNA 360™ Profiler with Dr Nigel Guenole, our Head of Assessments, and his team of PhD researchers.
            </p>
            <p>
              The result is a situational psychometric assessment using over 125 organisational scenarios, measuring a leader&apos;s ability to flex between inner and outer game behaviours according to the situation in front of them.
            </p>
          </div>
          </div>

          <div className="mt-10 grid gap-7 border-t border-white/15 pt-8 sm:grid-cols-2 sm:gap-10 lg:mt-0 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
            <div>
              <strong className="block text-[40px] font-bold leading-none text-brand">125+</strong>
              <span className="mt-2 block max-w-[260px] text-[12px] font-semibold uppercase leading-[1.5] tracking-[0.9px] text-white/78">
                organisational scenarios<br />in one assessment
              </span>
            </div>
            <div>
              <strong className="block text-[35px] font-bold leading-none text-brand">PhD led</strong>
              <span className="mt-2 block max-w-[300px] text-[12px] font-semibold uppercase leading-[1.5] tracking-[0.9px] text-white/78">
                Built in house with<br />Dr Nigel Guenole, Head of Assessments
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-10 md:py-20 lg:grid lg:grid-cols-[0.55fr_1.45fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-brand">Frequently asked questions</p>
            <h2 className="mt-3 max-w-[360px] font-serif text-[32px] font-semibold leading-[1.08] text-ink lg:text-[44px]">A clearer view of the 5H.</h2>
          </div>
          <div className="mt-8 space-y-3 lg:mt-0">
            {FAQS.map((faq, index) => (
              <details key={faq.question} open={index === 1} className="group bg-[#f0f0ef] px-5 py-4 sm:px-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-serif text-[17px] font-semibold leading-[1.3] text-ink marker:hidden sm:text-[19px]">
                  {faq.question}
                  <Plus aria-hidden="true" className="h-5 w-5 flex-none text-brand transition-transform group-open:rotate-45" />
                </summary>
                <p className="max-w-[61ch] pb-1 pt-4 text-[13px] leading-[1.65] text-muted sm:text-[14px]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] border-t border-line px-6 py-11 md:px-10 md:py-16">
          <h2 className="font-serif text-[30px] font-semibold leading-tight tracking-[-0.45px] text-ink sm:text-[38px] lg:text-[48px]">
            Making the learning <span className="text-brand">real.</span>
          </h2>
        </div>
      </section>

      <section className="bg-brand text-white">
        <div className="mx-auto max-w-[1440px] px-6 py-10 text-center md:px-10 md:py-14 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:text-left">
          <h2 className="font-serif text-[34px] font-semibold leading-none sm:text-[43px] lg:text-[52px]">Ready to lead with 5H<R />?</h2>
          <Link href="/contact" className="mt-7 inline-flex min-h-14 w-full items-center justify-center bg-white px-8 text-[12px] font-bold uppercase tracking-[1.4px] text-brand shadow-[0_8px_20px_rgba(83,17,23,0.22)] transition-colors hover:bg-[#fff4f3] sm:w-auto sm:min-w-[360px] lg:mt-0">
            Start a conversation <span className="ml-3" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
