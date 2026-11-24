import { sectionHeading } from "@/lib/section-heading";
import SectionHeading from "@/components/SectionHeading";
import { getApproachCopy } from "@/lib/approach-copy-server";
import type { ApproachCopy } from "@/lib/approach-copy";
import Image from "next/image";
import FrameworkWheel from "@/components/five-h/FrameworkWheel";
import LocalizedImage from "@/components/LocalizedImage";
import Link from "next/link";
import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  ListChecks,
  ChartNoAxesColumn,
  Compass,
  Dna,
  Star,
  Target,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import SiteShell from "@/components/SiteShell";
import TypeLabel from "@/components/TypeLabel";
import PhotoCarousel from "@/components/PhotoCarousel";
import FiveHShowcase from "@/components/five-h/FiveHShowcase";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, serviceLd } from "@/lib/seo/jsonld";
import { localeAlternates } from "@/lib/seo/alternates";

const geist = localFont({
  src: "../../assets/fonts/geist-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-geist-approach",
  display: "swap",
});

const serif = localFont({
  src: "../../assets/fonts/source-serif-4-latin-wght-normal.woff2",
  weight: "200 900",
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

function plainFiveH(text: string) {
  return text.replace(/5H[®©™]+/gi, "5H");
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
      <TypeLabel>{copy.label}</TypeLabel>
      <h3 className="whitespace-pre-line text-[28px] font-semibold leading-[1.08] tracking-[-0.5px] text-ink sm:text-[34px]">{copy.heading}</h3>
      <p className="mt-4 max-w-[560px] text-[14px] leading-[1.65] text-muted sm:text-[15px]">{copy.body}</p>
      <div className="mt-12 flex flex-wrap justify-center gap-y-7">
        {copy.items.map((item, index) => {
          const Icon = TOOLKIT_ICONS[index];
          return (
            <div key={index} className="w-1/4 min-w-0 px-1 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-brand/15 bg-[#fcf6f2] sm:size-16">
                <Icon aria-hidden="true" className="size-6 text-brand sm:size-7" strokeWidth={1.5} />
              </span>
              <h4 className="mt-3 whitespace-pre-line text-[11px] font-semibold leading-[1.3] text-ink sm:text-[12px]">{item.title.replace(/PROFILER/g, "Profiler")}</h4>
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
        ]}
      />

      <section className="relative isolate flex min-h-[84svh] flex-col justify-end overflow-hidden bg-ink pt-[76px] text-white md:justify-center">
        <LocalizedImage
          src="/approach/approach-hero-landscape.png"
          alt="A magnifying glass over the 5H competency profile"
          ptSrc="/approach/approach-hero-pt-br.webp"
          ptAlt="Uma lupa sobre o perfil de competências 5H em português"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1f1c1d]/88 via-[#1f1c1d]/60 to-[#1f1c1d]/20" />
        <div className="w-full">
          <div className="mx-auto w-full max-w-[1440px] px-6 py-20 md:px-10 md:py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[2.2px] text-brand-light">
              <span>5H<sup className="text-[0.7em]">®</sup></span> · <span>{plainFiveH(copy.hero.eyebrow).replace(/^(?:the )?5H\b\s*/i, "")}</span>
            </p>
            <h1 className="mt-5 max-w-[900px] whitespace-pre-line font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.2px] text-white [text-wrap:balance] sm:text-[44px] md:text-[52px] lg:max-w-none">
              {plainFiveH(copy.hero.title).replace(" One integrated leader.", "\nOne integrated leader.")}
            </h1>
            <p className="mt-6 max-w-[620px] text-[19px] leading-[1.4] text-white/78 md:text-[22px]">
              {plainFiveH(copy.hero.subtitle)}
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <nav aria-label="Explore the 5H leadership framework" className="mx-auto flex max-w-[1440px] flex-wrap gap-x-8 gap-y-3 border-b border-line px-6 py-5 text-sm font-semibold text-brand-dark md:px-10">
          <a href="#framework" className="underline">Diagnostic toolkit</a>
          <a href="#the-five-h" className="underline">The five intelligences</a>
          <a href="#whole-leader" className="underline">Inner and outer game</a>
          <a href="#dna-360-profiler" className="underline">DNA 360 Profiler</a>
        </nav>
        <section id="framework" className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20">
          <TypeLabel>{plainFiveH(copy.framework.label)}</TypeLabel>
          <SectionHeading className="whitespace-pre-line font-serif text-[25px] font-semibold leading-[1.18] tracking-[-0.35px] text-ink sm:text-[34px] lg:text-[46px]">
            {plainFiveH(copy.framework.heading).replace(" One integrated leader.", "\nOne integrated leader.")}
          </SectionHeading>
          <p className="mt-5 max-w-[900px] text-[15px] leading-[1.6] text-muted sm:text-[16px] lg:text-[17px]">
            {plainFiveH(copy.framework.body)}
          </p>
          <div className="mt-9 grid items-start gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <figure className="rounded-sm border border-line p-4 sm:p-6">
                <FrameworkWheel />
                <figcaption className="mt-4 text-center text-base font-semibold text-ink">Values, beliefs and drivers</figcaption>
                <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                  {copy.fiveH.faculties.map(faculty => <div key={faculty.name}>
                    <dt className="font-semibold text-ink">{faculty.name}</dt>
                    <dd className="mt-1 text-base leading-relaxed text-muted">{faculty.dimensions.map((dimension, index) => <span key={dimension}>{index > 0 && " · "}<span>{dimension}</span></span>)}</dd>
                  </div>)}
                </dl>
              </figure>
              <a href="/approach/5h-framework-wheel-user.png" className="mt-2 inline-flex min-h-11 items-center font-semibold text-brand-dark underline">View the full-size framework diagram</a>
            </div>
            <DiagnosticToolkit copy={copy.framework.toolkit} />
          </div>
          <p className="mt-8 text-center text-[14px] leading-[1.5] text-[#777] lg:mt-10">
            {copy.framework.copyright.replace(/5H[®©™]/g, "5H")}
          </p>
        </section>

        <FiveHShowcase heading={plainFiveH(copy.fiveH.heading)} faculties={copy.fiveH.faculties} />

        <section id="whole-leader" className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
          <SectionHeading className="max-w-[520px] font-serif text-[31px] font-semibold leading-[1.08] tracking-[-0.5px] text-ink sm:text-[38px] lg:text-[48px]">
            {plainFiveH(copy.introduction.heading)}
          </SectionHeading>
          <div className="mt-7 max-w-[720px] space-y-5 text-[15px] leading-[1.72] text-muted sm:text-[16px] lg:mt-9 lg:text-[17px]">
            {copy.introduction.paragraphs.map((paragraph, index) => <p key={index}>{plainFiveH(paragraph)}</p>)}
          </div>
          </div>
          <div id="two-games" className="min-w-0">
          <div className="mx-auto max-w-[720px] divide-y divide-line rounded-sm border border-line">
            {[copy.games.inner, copy.games.outer].map(game => <div key={game.heading} className="flex items-start gap-4 p-5">
              <svg aria-hidden="true" viewBox="0 0 48 40" className="mt-1 w-12 shrink-0" fill="none" strokeWidth="3">
                <circle cx="17" cy="20" r="13" stroke={game === copy.games.inner ? "#7c1847" : "#aaa"} />
                <circle cx="31" cy="20" r="13" stroke={game === copy.games.outer ? "#7c1847" : "#aaa"} />
              </svg>
              <div><h3 className="text-xl font-semibold text-ink">{game.heading}</h3>
                <p className="mt-2 text-base text-muted">{game.body}</p>
                <p className="mt-2 flex flex-wrap gap-x-3 text-base font-semibold text-ink">{game.labels.map(label => <span key={label}>{label}</span>)}</p>
              </div>
            </div>)}
          </div>
          <div data-no-translate className="mx-auto mt-2 max-w-[720px] font-semibold text-brand-dark underline">
            <a className="locale-en-only block w-fit py-3" href="/approach/inner-outer-game-5h-20261001.png">View the full-size inner and outer game diagram</a>
            <a className="locale-pt-only w-fit py-3" href="/approach/inner-outer-game-5h-pt-br.svg">Ampliar o diagrama do jogo interior e exterior</a>
          </div>
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
            captions={["Participants present their response to a leadership dilemma.", "Small groups discuss the inner and outer game of leadership.", "Facilitators and participants during a CorporateDNA programme."]}
            label="CorporateDNA programmes in action"
            frameClassName="max-w-[980px]"
            sizes="(min-width: 1060px) 980px, 100vw"
          />
        </section>

      </div>

      <section id="dna-360-profiler" className="bg-[#353132] text-white">
        <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20">
          <TypeLabel onDark>{plainFiveH(copy.profiler.label)}</TypeLabel>
          <SectionHeading className="font-serif text-[34px] font-semibold leading-[1.05] tracking-[-0.7px] sm:text-[44px] lg:text-[54px]">
            {plainFiveH(copy.profiler.heading)}
          </SectionHeading>
          <div className="lg:mt-9 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-16">
            <div className="mt-7 max-w-[760px] space-y-5 text-[14px] leading-[1.68] text-white/82 sm:text-[15px] lg:mt-0 lg:text-[16px]">
              {copy.profiler.paragraphs.map((paragraph, index) => <p key={index}>{plainFiveH(paragraph)}</p>)}
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
            <TypeLabel>{copy.learning.label}</TypeLabel>
            <SectionHeading className="font-serif text-[32px] font-semibold leading-[1.08] text-ink lg:text-[38px]">
              {copy.learning.heading} <span className="text-brand">{sectionHeading(copy.learning.accent)}</span>
            </SectionHeading>
            {copy.learning.body.trim() && copy.learning.body.trim() !== "Body copy to be confirmed (max 500 characters)." && (
              <p className="mt-4 text-[15px] leading-[1.6] text-muted">{copy.learning.body}</p>
            )}
          </div>
          <div className="mt-8 self-center lg:mt-0 lg:border-l lg:border-line lg:pl-12">
            <p className="font-serif text-2xl">{copy.cta.heading.replace(/5H[®©™]/g, "5H")}</p>
            <Link href="/contact" className="contact-action mt-5">{copy.cta.buttonLabel}</Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
