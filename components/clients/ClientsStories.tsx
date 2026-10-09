import Image from "next/image";
import Link from "next/link";
import SectionHead from "@/components/clients/SectionHead";
import ClientVoices from "@/components/clients/ClientVoices";
import { LOGO_RATIO, fitLogo, logoSrc, type LogoKey } from "@/components/clients/logo-fit";
import { isReviewedCaseHref } from "@/lib/reviewed-cases";

type FeaturedCard = {
  image: string;
  imageAlt: string;
  /** Colour mark in the card body — keep these optically similar. */
  logo: string;
  /** Optional wider/padded asset for the white hero overlay. */
  overlayLogo?: string;
  name: string;
  kicker: string;
  body: string;
  metric: string;
  metricLabel: string;
  href: string;
  whiteLogoOnImage: boolean;
  whiteLogoWidth: string;
};

/** Shared box for the three colour marks under the hero. */
const FEATURED_LOGO_BOX = "relative h-7 w-[5.5rem] shrink-0";

const featured: FeaturedCard[] = [
  {
    image: "/cases/vodafone-hero.webp",
    imageAlt: "Vodafone case study",
    logo: "/clients/logos/vodafone.png",
    overlayLogo: "/logos/client-logos/vodafone.png",
    name: "Vodafone",
    kicker: "Talent development",
    body: "Building a leadership pipeline that lasted well beyond the programme.",
    metric: "700+",
    metricLabel: "high-potential leaders developed",
    href: "/cases/vodafone",
    whiteLogoOnImage: true,
    whiteLogoWidth: "72%",
  },
  {
    image: "/cases/gsk-hero.webp",
    imageAlt: "GSK case study",
    logo: "/clients/logos/gsk.png",
    overlayLogo: "/logos/client-logos/gsk-padded.png",
    name: "GSK",
    kicker: "Culture transformation",
    body: "Turning global strategy into local leadership alignment, priorities and behaviour.",
    metric: "30%",
    metricLabel: "improvement in decision-making agility",
    href: "/cases/gsk",
    whiteLogoOnImage: true,
    whiteLogoWidth: "58%",
  },
  {
    image: "/clients/impact/maaden.jpg",
    imageAlt: "Maaden team member in a hard hat on an industrial site",
    logo: "/clients/logos/maaden.png",
    name: "Maaden",
    kicker: "Leadership at scale",
    body: "Developing leaders to enable sustainable growth.",
    metric: "85%",
    metricLabel: "of leaders demonstrated stronger influence and collaboration",
    href: "/cases/maaden",
    whiteLogoOnImage: false,
    whiteLogoWidth: "55%",
  },
];

/* Use client logos in place of the old low-resolution stock thumbnails.
   Shunkhlai has no approved logo asset, so its name is the visual mark. */
const moreStories: { logo?: LogoKey; name: string; label: string; href: string }[] = [
  { logo: "vodafone", name: "Vodafone", label: "Talent development", href: "/cases/vodafone" },
  { logo: "gsk", name: "GSK", label: "Culture transformation", href: "/cases/gsk" },
  { logo: "maaden", name: "Ma'aden", label: "Leadership at scale", href: "/cases/maaden" },
  { logo: "frasers-property", name: "Frasers Property", label: "High-performance teams", href: "/cases/frasers-property-leadership" },
  { logo: "frasers-property", name: "Frasers Property", label: "HR leadership team", href: "/cases/frasers-property-hrlt" },
  { logo: "dyson", name: "Dyson", label: "Innovation & growth", href: "/cases/dyson" },
  { logo: "dp-world", name: "DP World", label: "Global leadership", href: "/cases/dp-world" },
  { logo: "bt", name: "BT", label: "Inclusive leadership", href: "/cases/bt" },
  { logo: "morgan-stanley", name: "Morgan Stanley", label: "Leadership for what's next", href: "/cases/morgan-stanley" },
  { name: "Shunkhlai", label: "Family business consulting", href: "/cases/shunkhlai" },
];

export default function ClientsStories() {
  const featuredStories = featured.filter((card) => isReviewedCaseHref(card.href));
  const reviewedMoreStories = moreStories.filter((story) => isReviewedCaseHref(story.href));
  return (
    <>
      {featuredStories.length > 0 && (
      <section id="case-studies" className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <SectionHead label="Impact in action" />
          <h2 className="font-serif text-[30px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[38px]">
            Real organisations. Lasting change.
          </h2>
          <div className={`mt-8 grid grid-cols-1 gap-5 ${featuredStories.length === 1 ? "lg:max-w-[440px]" : "lg:grid-cols-3"}`}>
            {featuredStories.map((card) => (
              <article key={card.name} className="flex h-full flex-col border border-line bg-white">
                <div className="relative aspect-[16/9] overflow-hidden bg-paper">
                  <Image src={card.image} alt={card.imageAlt} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
                  {card.whiteLogoOnImage && (
                    <>
                      <div aria-hidden className="absolute inset-0 bg-black/35" />
                      <div className="absolute inset-0 flex items-center justify-center px-6">
                        <Image
                          src={card.overlayLogo ?? card.logo}
                          alt=""
                          width={320}
                          height={128}
                          style={{ width: card.whiteLogoWidth }}
                          className="h-auto max-h-[52%] object-contain brightness-0 invert"
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-1 flex-col border-t border-line">
                  <div className="px-6 pb-8 pt-5">
                    <div className="flex h-12 items-center justify-between gap-4">
                      <p className="min-w-0 text-[12px] font-semibold uppercase tracking-[1px] text-muted">{card.name}</p>
                      <div className={FEATURED_LOGO_BOX}>
                        <Image
                          src={card.logo}
                          alt=""
                          fill
                          sizes="120px"
                          className="object-contain object-right"
                        />
                      </div>
                    </div>
                    <h3 className="mt-6 font-serif text-[24px] font-semibold leading-[1.2] tracking-[-0.3px] text-ink">
                      {card.kicker}
                    </h3>
                    <p className="mt-3 text-[15px] leading-[1.6] text-muted">{card.body}</p>
                  </div>
                  <div className="mt-auto flex min-h-24 items-center gap-5 border-t border-line bg-paper px-6 py-5">
                    <p className="shrink-0 text-[34px] font-semibold leading-none tracking-[-1px] text-ink">{card.metric}</p>
                    <p className="max-w-[30ch] text-[11px] font-semibold uppercase leading-[1.45] tracking-[0.6px] text-muted">
                      {card.metricLabel}
                    </p>
                  </div>
                  <div className="border-t border-line px-6 py-5">
                    <Link href={card.href} className="inline-block text-[13px] font-semibold text-ink underline decoration-brand decoration-2 underline-offset-4 transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                      View case study <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      {reviewedMoreStories.length > 0 && (
      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <SectionHead label="More client stories" />
          <h2 className="font-serif text-[30px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[38px]">
            Different sectors. A common outcome.
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {reviewedMoreStories.map((story) => {
              /* Em % da largura do cartão: a caixa do logo é 4:3, então a altura
                 máxima de 42% da largura é ~56% da altura dela. */
              const { w } = story.logo ? fitLogo(LOGO_RATIO[story.logo], 0.09, 0.72, 0.42) : { w: 0 };
              return (
                <Link key={story.href} href={story.href} className="group flex flex-col border border-line bg-white transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  <div className="flex aspect-[4/3] items-center justify-center">
                    {story.logo ? (
                      <Image
                        src={logoSrc(story.logo)}
                        alt={story.name}
                        width={600}
                        height={Math.round(600 / LOGO_RATIO[story.logo])}
                        sizes="(min-width: 1280px) 120px, (min-width: 640px) 18vw, 36vw"
                        style={{ width: `${w * 100}%` }}
                        className="h-auto transition-transform duration-300 motion-safe:group-hover:scale-105"
                      />
                    ) : (
                      <span className="px-3 text-center font-serif text-[22px] font-semibold text-ink">{story.name}</span>
                    )}
                  </div>
                  <p className="border-t border-line px-3 py-3 text-[12px] leading-[1.45] text-muted">
                    {story.label} <span aria-hidden className="inline-block text-brand transition-transform group-hover:translate-x-1">→</span>
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* "What our clients say" virou esteira em 01-10  -  ver o componente. */}
      <ClientVoices />
    </>
  );
}
