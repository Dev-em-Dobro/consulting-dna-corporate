import Image from "next/image";
import Link from "next/link";

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
    href: "/cases",
  },
] as const;

const moreStories = [
  { image: "/clients/impact/thumb-heineken.jpg", logo: "/logos/client-logos/heineken.png", name: "Heineken", label: "Culture & engagement", href: "/cases/heineken-inner-outer-game" },
  { image: "/clients/impact/thumb-vodafone.jpg", logo: "/logos/client-logos/vodafone.png", name: "Vodafone", label: "Leadership transformation", href: "/cases" },
  { image: "/clients/impact/thumb-frasers.jpg", logo: "/logos/client-logos/frasers-property.png", name: "Frasers Property", label: "High-performance teams", href: "/cases/frasers-property-leadership" },
  { image: "/clients/impact/thumb-dyson.jpg", logo: "/logos/client-logos/dyson.png", name: "Dyson", label: "Innovation & growth", href: "/cases" },
  { image: "/clients/impact/thumb-dp-world.jpg", logo: "/logos/client-logos/dp-world.png", name: "DP World", label: "Global leadership", href: "/cases" },
  { image: "/clients/impact/thumb-bt.jpg", logo: "/logos/client-logos/bt.png", name: "BT", label: "Inclusive leadership", href: "/cases" },
  { image: "/clients/impact/thumb-gsk.jpg", logo: "/logos/client-logos/gsk.png", name: "GSK", label: "Talent & capability", href: "/cases" },
  { image: "/clients/impact/thumb-morgan-stanley.jpg", logo: "/logos/client-logos/morgan-stanley.png", name: "Morgan Stanley", label: "Leadership for what's next", href: "/cases" },
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

function SectionLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="text-[13px] font-semibold text-brand hover:text-brand-dark">
      {children} <span aria-hidden>→</span>
    </Link>
  );
}

export default function ClientsStories() {
  return (
    <>
      <section id="case-studies" className="bg-[#f7f6f4]">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[1.6px] text-[#8a7044]">Impact in action</p>
              <h2 className="mt-3 font-serif text-[32px] font-semibold leading-[1.05] tracking-[-0.6px] text-ink sm:text-[40px]">
                Real organisations. Lasting change.
              </h2>
            </div>
            <SectionLink href="/cases">View all client stories</SectionLink>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {featured.map((card) => (
              <article key={card.name} className="flex h-full flex-col bg-white p-3">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={card.image} alt={card.imageAlt} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col px-3 pb-4 pt-5">
                  <div className="flex items-center gap-3">
                    <Image src={card.logo} alt="" width={36} height={36} className="h-8 w-8 object-contain" />
                    <p className="font-serif text-[22px] font-semibold leading-none text-ink">{card.name}</p>
                  </div>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[1.2px] text-[#8a7044]">{card.kicker}</p>
                  <p className="mt-2 text-[16px] leading-[1.45] text-ink">{card.body}</p>
                  <p className="mt-5 text-[40px] font-semibold leading-none tracking-[-1px] text-brand">{card.metric}</p>
                  <p className="mt-2 max-w-[24ch] text-[11px] font-semibold uppercase leading-[1.4] tracking-[0.8px] text-muted">
                    {card.metricLabel}
                  </p>
                  <Link href={card.href} className="mt-5 text-[14px] font-semibold text-brand hover:text-brand-dark">
                    View case study <span aria-hidden>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[1.6px] text-[#8a7044]">More client stories</p>
              <h2 className="mt-3 font-serif text-[32px] font-semibold leading-[1.05] tracking-[-0.6px] text-ink sm:text-[40px]">
                Different sectors. A common outcome.
              </h2>
            </div>
            <SectionLink href="/cases">View all client stories</SectionLink>
          </div>
          <div className="mt-8 flex gap-3 overflow-x-auto pb-2 xl:grid xl:grid-cols-8 xl:overflow-visible">
            {moreStories.map((story) => (
              <Link key={story.name} href={story.href} className="flex w-[148px] shrink-0 flex-col bg-white xl:w-auto">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={story.image} alt="" fill sizes="148px" className="object-cover" />
                </div>
                <div className="flex h-14 items-center justify-center px-3">
                  <Image src={story.logo} alt={story.name} width={120} height={36} className="h-7 w-auto max-w-[108px] object-contain" />
                </div>
                <p className="px-3 pb-4 text-[13px] leading-[1.35] text-ink">
                  {story.label} <span aria-hidden className="text-brand">→</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="voices" className="bg-[#f7f6f4]">
        <div className="mx-auto max-w-[1440px] px-6 pb-16 md:px-10 md:pb-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[1.6px] text-[#8a7044]">What our clients say</p>
              <h2 className="mt-3 font-serif text-[32px] font-semibold leading-[1.05] tracking-[-0.6px] text-ink sm:text-[40px]">
                Stronger leaders. Brighter futures.
              </h2>
            </div>
            <SectionLink href="/cases">Explore more client videos</SectionLink>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {quotes.map((item) => (
              <article key={item.logoAlt} className="grid grid-cols-[118px_1fr] items-center gap-4 bg-white p-4 sm:grid-cols-[140px_1fr]">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image src={item.image} alt={item.imageAlt} fill sizes="140px" className="object-cover" />
                </div>
                <div>
                  <Image src={item.logo} alt={item.logoAlt} width={88} height={32} className="h-7 w-auto object-contain" />
                  <p className="mt-3 font-serif text-[16px] leading-[1.45] text-ink sm:text-[18px]">“{item.quote}”</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-16 md:flex-row md:items-center md:justify-between md:px-10 md:py-20">
          <div className="max-w-[640px]">
            <p className="text-[11px] font-semibold uppercase tracking-[1.6px] text-[#d7b56d]">Let&apos;s build what&apos;s next</p>
            <h2 className="mt-3 font-serif text-[34px] font-semibold leading-[1.05] tracking-[-0.6px] sm:text-[44px]">
              Remarkable leadership changes what&apos;s possible.
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex shrink-0 items-center rounded-full bg-[#f08b86] px-7 py-3.5 text-[15px] font-semibold text-white hover:bg-brand"
          >
            Get in touch <span aria-hidden className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
