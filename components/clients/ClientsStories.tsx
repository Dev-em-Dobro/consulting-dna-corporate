import Image from "next/image";
import Link from "next/link";
import SectionHead from "@/components/clients/SectionHead";

const featured = [
  {
    image: "/clients/impact/shell.jpg",
    imageAlt: "Wind turbines at sunset",
    logo: "/logos/client-logos/shell.png",
    name: "Shell",
    kicker: "Leadership transformation",
    body: "Building the leadership capability to deliver a lower carbon future.",
    metric: "92%",
    metricLabel: "of leaders reported greater confidence in driving change",
    href: "/cases/shell-women-leaders",
  },
  {
    image: "/clients/impact/dubai-holding.jpg",
    imageAlt: "Dubai skyline with the Burj Khalifa",
    logo: "/logos/client-logos/dubai-holding.png",
    name: "Dubai Holding",
    kicker: "Talent & succession",
    body: "Strengthening leadership across a diversified global business.",
    metric: "3x",
    metricLabel: "increase in internal leadership pipeline",
    href: "/cases/dubai-holding-leadership-accountability",
  },
  {
    image: "/clients/impact/maaden.jpg",
    imageAlt: "Maaden team member in a hard hat on an industrial site",
    logo: "/logos/client-logos/maaden.png",
    name: "Maaden",
    kicker: "Leadership at scale",
    body: "Developing leaders to enable sustainable growth.",
    metric: "85%",
    metricLabel: "of leaders demonstrated stronger influence and collaboration",
    href: "/cases/maaden",
  },
] as const;

const moreStories = [
  { image: "/clients/impact/thumb-heineken.jpg", logo: "/logos/client-logos/heineken.png", name: "Heineken", label: "Culture & engagement", href: "/cases/heineken-inner-outer-game" },
  { image: "/clients/impact/thumb-vodafone.jpg", logo: "/logos/client-logos/vodafone.png", name: "Vodafone", label: "Leadership transformation", href: "/cases/vodafone", logoScale: 2.25 },
  { image: "/clients/impact/thumb-frasers.jpg", logo: "/logos/client-logos/frasers-property.png", name: "Frasers Property", label: "High-performance teams", href: "/cases/frasers-property-leadership" },
  { image: "/clients/impact/thumb-dyson.jpg", logo: "/logos/client-logos/dyson.png", name: "Dyson", label: "Innovation & growth", href: "/cases/dyson" },
  { image: "/clients/impact/thumb-dp-world.jpg", logo: "/logos/client-logos/dp-world.png", name: "DP World", label: "Global leadership", href: "/cases/dp-world" },
  { image: "/clients/impact/thumb-bt.jpg", logo: "/logos/client-logos/bt.png", name: "BT", label: "Inclusive leadership", href: "/cases/bt" },
  { image: "/clients/impact/thumb-gsk.jpg", logo: "/logos/client-logos/gsk.png", name: "GSK", label: "Talent & capability", href: "/cases/gsk" },
  { image: "/clients/impact/thumb-morgan-stanley.jpg", logo: "/logos/client-logos/morgan-stanley.png", name: "Morgan Stanley", label: "Leadership for what's next", href: "/cases/morgan-stanley", logoScale: 2.25 },
] as const;

const quotes = [
  {
    image: "/clients/impact/quote-shell.jpg",
    imageAlt: "Client portrait shown with the Shell quote",
    logo: "/logos/client-logos/shell.png",
    logoAlt: "Shell",
    quote: "They bring real challenge and a partnership mindset that makes a difference.",
  },
  {
    image: "/clients/impact/quote-maaden.jpg",
    imageAlt: "Client portrait shown with the Maaden quote",
    logo: "/logos/client-logos/maaden.png",
    logoAlt: "Maaden",
    quote: "A truly collaborative approach that builds leaders for the long term.",
  },
  {
    image: "/clients/impact/quote-bt.jpg",
    imageAlt: "Client portrait shown with the BT quote",
    logo: "/logos/client-logos/bt.png",
    logoAlt: "BT",
    quote: "CorporateDNA help us turn ambition into real, measurable progress.",
  },
] as const;

export default function ClientsStories() {
  return (
    <>
      <section id="case-studies" className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <SectionHead label="Impact in action" />
          <h2 className="font-serif text-[30px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[38px]">
            Real organisations. Lasting change.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {featured.map((card) => (
              <article key={card.name} className="flex h-full flex-col border border-line bg-white">
                <div className="relative aspect-[16/9] overflow-hidden bg-paper">
                  <Image src={card.image} alt={card.imageAlt} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col border-t border-line">
                  <div className="px-6 pb-8 pt-5">
                    <div className="flex h-12 items-center justify-between gap-4">
                      <p className="text-[12px] font-semibold uppercase tracking-[1px] text-muted">{card.name}</p>
                      <Image
                        src={card.logo}
                        alt=""
                        width={96}
                        height={48}
                        className={`h-12 w-20 shrink-0 object-cover ${card.name === "Maaden" ? "scale-[1.4]" : ""}`}
                      />
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

      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <SectionHead label="More client stories" />
          <h2 className="font-serif text-[30px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[38px]">
            Different sectors. A common outcome.
          </h2>
          <div className="mt-8 flex gap-3 overflow-x-auto pb-2 xl:grid xl:grid-cols-8 xl:overflow-visible">
            {moreStories.map((story) => (
              <Link key={story.name} href={story.href} className="group flex w-[148px] shrink-0 flex-col border border-line bg-white transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand xl:w-auto">
                <div className="relative aspect-[4/3] overflow-hidden bg-paper">
                  <Image src={story.image} alt="" fill sizes="148px" className="object-cover" />
                </div>
                <div className="flex h-14 items-center justify-center border-t border-line px-3">
                  <Image
                    src={story.logo}
                    alt={story.name}
                    width={120}
                    height={36}
                    style={"logoScale" in story && story.logoScale ? { transform: `scale(${story.logoScale})` } : undefined}
                    className="h-7 w-auto max-w-[108px] object-contain"
                  />
                </div>
                <p className="px-3 pb-4 text-[12px] leading-[1.45] text-muted">
                  {story.label} <span aria-hidden className="inline-block text-brand transition-transform group-hover:translate-x-1">→</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="voices" className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <SectionHead label="What our clients say" />
          <h2 className="font-serif text-[30px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[38px]">
            Stronger leaders. Brighter futures.
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {quotes.map((item) => (
              <article key={item.logoAlt} className="grid grid-cols-[118px_1fr] items-center gap-4 border border-line bg-white p-4 sm:grid-cols-[140px_1fr]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={item.image} alt={item.imageAlt} fill sizes="140px" className="object-cover" />
                </div>
                <div>
                  <Image
                    src={item.logo}
                    alt={item.logoAlt}
                    width={88}
                    height={32}
                    style={
                      item.logoAlt === "Maaden"
                        ? { transform: "scale(2)", transformOrigin: "left center" }
                        : item.logoAlt === "Shell"
                          ? { transform: "translateX(-18px)" }
                          : undefined
                    }
                    className="block h-7 w-auto object-contain"
                  />
                  <p className="mt-3 font-serif text-[16px] leading-[1.5] text-ink sm:text-[18px]">“{item.quote}”</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
