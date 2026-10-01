import { Fragment } from "react";
import { getApproachCopy } from "@/lib/approach-copy-server";
import type { ApproachCopy } from "@/lib/approach-copy";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import {
  ListChecks,
  ChartNoAxesColumn,
  Compass,
  Dna,
  Plus,
  Star,
  Target,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import SiteShell from "@/components/SiteShell";
import PhotoCarousel from "@/components/PhotoCarousel";
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
  const copy = await getApproachCopy();
  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    alternates: localeAlternates("/approach"),
  };
}

function R() {
  return <span className="align-super text-[0.48em] font-semibold">®</span>;
}

function RegisteredText({ text }: { text: string }) {
  const parts = text.split("®");
  return <>{parts.map((part, index) => <Fragment key={index}>{part}{index < parts.length - 1 && <R />}</Fragment>)}</>;
}

const APPROACH_CAROUSEL = [
  {
    src: "/approach/approach-carousel-01.jpg",
    alt: "Leaders presenting their group's conclusions during a leadership dilemma debate in a CorporateDNA workshop",
  },
  {
    src: "/approach/approach-carousel-02.jpg",
    alt: "Participants talking in small groups during a CorporateDNA leadership programme, with the Inner to Outer Game of Leadership poster behind them",
  },
  {
    src: "/approach/approach-carousel-03.jpg",
    alt: "Collage from a CorporateDNA leadership programme: the cohort group photo, facilitators presenting and participants at a team dinner",
  },
];

const TOOLKIT_ICONS = [Dna, UsersRound, ChartNoAxesColumn, Compass, Star, UsersRound, Target];

function DiagnosticToolkit({ copy }: { copy: ApproachCopy["framework"]["toolkit"] }) {
  return (
    <div className="lg:border-l lg:border-line lg:pl-10">
      <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-brand">{copy.label}</p>
      <h3 className="mt-3 whitespace-pre-line text-[28px] font-semibold leading-[1.08] tracking-[-0.5px] text-ink sm:text-[34px]">{copy.heading}</h3>
      <p className="mt-4 max-w-[560px] text-[14px] leading-[1.65] text-muted sm:text-[15px]">{copy.body}</p>
      <div className="mt-12 grid grid-cols-4 gap-y-7">
        {copy.items.map((item, index) => {
          const Icon = TOOLKIT_ICONS[index];
          return (
            <div key={index} className="min-w-0 px-1 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-brand/15 bg-[#fcf6f2] sm:size-16">
                <Icon aria-hidden="true" className="size-6 text-brand sm:size-7" strokeWidth={1.5} />
              </span>
              <h4 className="mt-3 whitespace-pre-line text-[11px] font-semibold leading-[1.3] text-ink sm:text-[12px]">{item.title}</h4>
              <p className="mt-1 whitespace-pre-line text-[10px] leading-[1.4] text-muted sm:text-[12px]">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function ApproachPage() {
  const copy = await getApproachCopy();
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
            description: copy.metadata.description,
          }),
          faqLd(copy.faq.items),
        ]}
      />

      <section className="relative isolate flex min-h-[84svh] flex-col justify-end overflow-hidden bg-ink pt-[76px] text-white md:justify-center">
        <Image
          src="/approach/approach-hero-landscape.png"
          alt="A magnifying glass over the 5H competency profile"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1f1c1d]/88 via-[#1f1c1d]/60 to-[#1f1c1d]/20" />
        <div className="w-full">
          <div className="mx-auto w-full max-w-[1440px] px-6 py-20 md:px-10 md:py-16">
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[2.2px] text-brand-light">
              <span aria-hidden="true" className="h-px w-10 bg-brand-light" /> {copy.hero.eyebrow}
            </p>
            <h1 className="mt-5 max-w-[900px] whitespace-pre-line font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.2px] text-white [text-wrap:balance] sm:text-[44px] md:text-[52px] lg:max-w-none">
              <RegisteredText text={copy.hero.title.replace(" One integrated leader.", "\nOne integrated leader.")} />
            </h1>
            <p className="mt-6 max-w-[620px] text-[19px] leading-[1.4] text-white/78 md:text-[22px]">
              {copy.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <section id="framework" className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-brand">{copy.framework.label}</p>
          <h2 className="mt-3 whitespace-pre-line font-serif text-[25px] font-semibold leading-[1.18] tracking-[-0.35px] text-ink sm:text-[34px] lg:text-[46px]">
            {copy.framework.heading.replace(" One integrated leader.", "\nOne integrated leader.")}
          </h2>
          <p className="mt-5 max-w-[900px] text-[15px] leading-[1.6] text-muted sm:text-[16px] lg:text-[17px]">
            {copy.framework.body}
          </p>
          <div className="mt-9 grid items-start gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Image
                src="/approach/5h-framework-wheel-user.png"
                alt="The 5H model showing the five leadership intelligences and their dimensions"
                width={1322}
                height={1329}
                sizes="(min-width: 1440px) 648px, (min-width: 1024px) 45vw, 100vw"
                className="h-auto w-full max-w-[648px]"
              />
            </div>
            <DiagnosticToolkit copy={copy.framework.toolkit} />
          </div>
          <p className="mt-8 text-center text-[14px] leading-[1.5] text-[#777] lg:mt-10">
            {copy.framework.copyright}
          </p>
        </section>

        <FiveHShowcase heading={copy.fiveH.heading} faculties={copy.fiveH.faculties} />

        <div className="bg-white px-6 py-14 text-center md:py-16">
          <p className="mx-auto max-w-[720px] text-[14px] font-normal leading-[1.4] text-ink sm:text-[16px]">
            {copy.fiveH.note}
          </p>
        </div>

        <section id="whole-leader" className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
          <h2 className="max-w-[520px] font-serif text-[31px] font-semibold leading-[1.08] tracking-[-0.5px] text-ink sm:text-[38px] lg:text-[48px]">
            {copy.introduction.heading}
          </h2>
          <div className="mt-7 max-w-[720px] space-y-5 text-[15px] leading-[1.72] text-muted sm:text-[16px] lg:mt-9 lg:text-[17px]">
            {copy.introduction.paragraphs.map((paragraph, index) => <p key={index}><RegisteredText text={paragraph} /></p>)}
          </div>
          </div>
          <div id="two-games" className="min-w-0">
          <Image
            src="/approach/inner-outer-game-5h-20261001.png"
            alt="Inner Game and Outer Game connected by the five leadership intelligences"
            width={1620}
            height={971}
            sizes="(min-width: 1024px) 650px, 100vw"
            className="mx-auto h-auto w-full max-w-[720px]"
          />
          <div className="mx-auto mt-6 max-w-[980px] px-5 py-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-3 gap-4 lg:mx-auto lg:max-w-[720px] lg:gap-10">
            {[
              { label: copy.games.assessmentLabels[0], Icon: UserRoundCheck },
              { label: copy.games.assessmentLabels[1], Icon: UsersRound },
              { label: copy.games.assessmentLabels[2], Icon: ListChecks },
            ].map(({ label, Icon }) => (
              <div key={label} className="text-center">
                <div className="flex h-14 items-center justify-center sm:h-20 lg:h-16">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f0f0ef] sm:h-16 sm:w-16 lg:size-14">
                    <Icon aria-hidden size={24} strokeWidth={1.5} className="text-ink sm:size-8 lg:size-7" />
                  </span>
                </div>
                <p className="mt-2 text-[12px] font-medium leading-[1.25] text-muted sm:text-[14px]">{label}</p>
              </div>
            ))}
          </div>

          </div>
          </div>
          </div>
        </section>

        {/* 01-10 (reunião com a Rhea): a foto única acima do "The DNA 360
            Profiler" vira carrossel, no mesmo padrão dos outros do site
            (PhotoCarousel). Moldura mantém a largura de 980px da foto antiga. */}
        <section id="approach-video" aria-label="CorporateDNA programmes in action" className="bg-[#373234] px-6 py-12 md:px-10 md:py-20">
          <PhotoCarousel
            images={APPROACH_CAROUSEL.map((slide) => slide.src)}
            alts={APPROACH_CAROUSEL.map((slide) => slide.alt)}
            label="CorporateDNA programmes in action"
            frameClassName="max-w-[980px]"
            sizes="(min-width: 1060px) 980px, 100vw"
          />
        </section>

      </div>

      <section id="dna-360-profiler" className="bg-[#353132] text-white">
        <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-brand-light">{copy.profiler.label}</p>
          <h2 className="mt-3 font-serif text-[34px] font-semibold leading-[1.05] tracking-[-0.7px] sm:text-[44px] lg:text-[54px]">
            {copy.profiler.heading}
          </h2>
          <div className="lg:mt-9 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-16">
            <div className="mt-7 max-w-[760px] space-y-5 text-[14px] leading-[1.68] text-white/82 sm:text-[15px] lg:mt-0 lg:text-[16px]">
              {copy.profiler.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            <div className="mt-10 grid gap-8 lg:mt-0">
              <Image
                src="/approach/nigel-guenole-30-09.webp"
                alt="Dr Nigel Guenole, who validated the 5H leadership framework"
                width={227}
                height={234}
                className="mb-8 w-full max-w-[280px] object-cover object-top"
              />
              <div>
                <strong className="block text-[40px] font-bold leading-none text-brand">{copy.profiler.facts[0].value}</strong>
                <span className="mt-2 block max-w-[260px] text-[12px] font-semibold uppercase leading-[1.5] tracking-[0.9px] text-white/78 whitespace-pre-line">
                  {copy.profiler.facts[0].label}
                </span>
              </div>
              <div>
                <strong className="block text-[35px] font-bold leading-none text-brand">{copy.profiler.facts[1].value}</strong>
                <span className="mt-2 block max-w-[300px] text-[12px] font-semibold uppercase leading-[1.5] tracking-[0.9px] text-white/78 whitespace-pre-line">
                  {copy.profiler.facts[1].label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="learning" className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-10 md:py-20 lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-brand">{copy.learning.label}</p>
            <h2 className="mt-3 font-serif text-[32px] font-semibold leading-[1.08] text-ink lg:text-[38px]">
              {copy.learning.heading} <span className="text-brand">{copy.learning.accent}</span>
            </h2>
            {copy.learning.body.trim() && copy.learning.body.trim() !== "Body copy to be confirmed (max 500 characters)." && (
              <p className="mt-4 text-[15px] leading-[1.6] text-muted">{copy.learning.body}</p>
            )}
          </div>
          <div className="mt-8 lg:mt-0 lg:border-l lg:border-line lg:pl-12">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[1.5px] text-brand">{copy.faq.label}</p>
            <div className="space-y-3">
              {copy.faq.items.map((faq, index) => (
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
        </div>
      </section>

      <section id="approach-cta" className="bg-brand text-white">
        <div className="mx-auto max-w-[1440px] px-6 py-10 text-center md:px-10 md:py-14 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:text-left">
          <h2 className="font-serif text-[34px] font-semibold leading-none sm:text-[43px] lg:text-[52px]"><RegisteredText text={copy.cta.heading} /></h2>
          <Link href="/contact" className="mt-7 inline-flex min-h-14 w-full items-center justify-center bg-white px-8 text-[12px] font-bold uppercase tracking-[1.4px] text-brand shadow-[0_8px_20px_rgba(83,17,23,0.22)] transition-colors hover:bg-[#fff4f3] sm:w-auto sm:min-w-[360px] lg:mt-0">
            {copy.cta.buttonLabel} <span className="ml-3" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
