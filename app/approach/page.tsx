import { getApproachCopy } from "@/lib/approach-copy-server";
import type { ApproachCopy } from "@/lib/approach-copy";
import Image from "next/image";
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

function firstMention(text: string, previous: string[]) {
  const clean = plainFiveH(text);
  const index = clean.search(/5H/i);
  if (index < 0 || previous.some(value => /5H/i.test(value))) return clean;
  return <>{clean.slice(0, index + 2)}<sup>®</sup>{clean.slice(index + 2)}</>;
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

/** Section headings carry no closing full stop (layout audit #4). */
const noStop = (text: string) => text.replace(/\.\s*$/, "");

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
              {firstMention(copy.hero.eyebrow, [])}
            </p>
            <h1 className="mt-5 max-w-[900px] whitespace-pre-line font-serif text-[36px] font-semibold leading-[1.1] tracking-[-0.2px] text-white [text-wrap:balance] sm:text-[44px] md:text-[52px] lg:max-w-none">
              {firstMention(copy.hero.title.replace(" One integrated leader.", "\nOne integrated leader."), [copy.hero.eyebrow])}
            </h1>
            <p className="mt-6 max-w-[620px] text-[19px] leading-[1.4] text-white/78 md:text-[22px]">
              {firstMention(copy.hero.subtitle, [copy.hero.eyebrow, copy.hero.title])}
            </p>
          </div>
        </div>
      </section>

      <div className="bg-white">
        <section id="framework" className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-brand">{firstMention(copy.framework.label, [copy.hero.eyebrow, copy.hero.title, copy.hero.subtitle])}</p>
          <h2 className="mt-3 whitespace-pre-line font-serif text-[25px] font-semibold leading-[1.18] tracking-[-0.35px] text-ink sm:text-[34px] lg:text-[46px]">
            {noStop(copy.framework.heading.replace(" One integrated leader.", "\nOne integrated leader."))}
          </h2>
          <p className="mt-5 max-w-[900px] text-[15px] leading-[1.6] text-muted sm:text-[16px] lg:text-[17px]">
            {copy.framework.body}
          </p>
          <div className="mt-9 grid items-start gap-10 lg:mt-12 lg:grid-cols-2 lg:gap-16">
            <div>
<a href="/approach/5h-framework-wheel-user.png" className="block cursor-zoom-in">              <LocalizedImage
                src="/approach/5h-framework-wheel-user.png"
                alt="The 5H model showing the five leadership intelligences and their dimensions"
                ptSrc="/approach/5h-framework-wheel-user.png"
                ptAlt="Modelo 5H com as cinco dimensões da liderança e suas competências"
                width={1322}
                height={1329}
                sizes="(min-width: 1440px) 648px, (min-width: 1024px) 45vw, 100vw"
                className="h-auto w-full max-w-[648px]"
              /></a>
            </div>
            <DiagnosticToolkit copy={copy.framework.toolkit} />
          </div>
          <p className="mt-8 text-center text-[14px] leading-[1.5] text-[#777] lg:mt-10">
            {plainFiveH(copy.framework.copyright)}
          </p>
        </section>

        <FiveHShowcase heading={noStop(copy.fiveH.heading)} faculties={copy.fiveH.faculties} />

        <section id="whole-leader" className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
          <h2 className="max-w-[520px] font-serif text-[31px] font-semibold leading-[1.08] tracking-[-0.5px] text-ink sm:text-[38px] lg:text-[48px]">
            {noStop(copy.introduction.heading)}
          </h2>
          <div className="mt-7 max-w-[720px] space-y-5 text-[15px] leading-[1.72] text-muted sm:text-[16px] lg:mt-9 lg:text-[17px]">
            {copy.introduction.paragraphs.map((paragraph, index) => <p key={index}>{plainFiveH(paragraph)}</p>)}
          </div>
          </div>
          <div id="two-games" className="min-w-0">
          <LocalizedImage
            src="/approach/inner-outer-game-5h-20261001.png"
            alt="Inner Game and Outer Game connected by the five leadership intelligences"
            ptSrc="/approach/inner-outer-game-5h-pt-br.svg"
            ptAlt="Jogo interior e jogo exterior conectados pelas cinco dimensões da liderança"
            width={1620}
            height={971}
            sizes="(min-width: 1024px) 650px, 100vw"
            className="mx-auto h-auto w-full max-w-[720px]"
          />
          <div data-no-translate className="mt-2 text-center text-sm underline"><a className="locale-en-only" href="/approach/inner-outer-game-5h-20261001.png">View full-size diagram</a><a className="locale-pt-only" href="/approach/inner-outer-game-5h-pt-br.svg">Ampliar diagrama</a></div>
          <div className="mx-auto mt-6 max-w-[980px] px-5 py-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-3 gap-4 lg:mx-auto lg:max-w-[720px] lg:gap-10">
            {[
              { label: copy.games.assessmentLabels[0], Icon: UserRoundCheck },
              { label: copy.games.assessmentLabels[1], Icon: UsersRound },
              { label: copy.games.assessmentLabels[2], Icon: ListChecks },
            ].map(({ label, Icon }) => (
              <div key={label} className="rounded-md border border-line px-1 py-2 text-center">
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
          <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-brand-light">{copy.profiler.label}</p>
          <div className="mt-3 lg:grid lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-16">
            <div>
              <h2 className="font-serif text-[34px] font-semibold leading-[1.05] tracking-[-0.7px] sm:text-[44px] lg:text-[54px]">
                {noStop(copy.profiler.heading)}
              </h2>
              <div className="mt-7 max-w-[760px] space-y-5 text-[14px] leading-[1.68] text-white/82 sm:text-[15px] lg:mt-9 lg:text-[16px]">
                {copy.profiler.paragraphs.map((paragraph, index) => <p key={index}>{plainFiveH(paragraph)}</p>)}
              </div>
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
              {copy.learning.heading} <span className="text-brand">{noStop(copy.learning.accent)}</span>
            </h2>
            {copy.learning.body.trim() && copy.learning.body.trim() !== "Body copy to be confirmed (max 500 characters)." && (
              <p className="mt-4 text-[15px] leading-[1.6] text-muted">{copy.learning.body}</p>
            )}
          </div>
          <div id="approach-cta" className="mt-8 lg:mt-0 lg:border-l lg:border-line lg:pl-12">
            <p className="font-serif text-[24px] leading-[1.25] text-ink">{plainFiveH(copy.cta.heading)}</p>
            <Link href="/contact" className="mt-6 inline-flex border-b-2 border-brand pb-1 text-[13px] font-bold uppercase tracking-[1px] text-brand">{copy.cta.buttonLabel}</Link>
          </div>
        </div>
      </section>

    </SiteShell>
  );
}
