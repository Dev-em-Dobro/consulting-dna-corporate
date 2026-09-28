import Image from "next/image";
import Link from "next/link";
import HoverFillButton from "@/components/HoverFillButton";
import EventMeta from "@/components/events/EventMeta";
import type { LeadershipEvent } from "@/lib/events";

export default function EventCard({ event, featured = false }: { event: LeadershipEvent; featured?: boolean }) {
  const href = `/events/${event.slug}`;

  return (
    <article
      aria-labelledby={`event-${event.slug}`}
      className={featured
        ? "grid overflow-hidden bg-white lg:grid-cols-[1.1fr_1fr]"
        : "flex h-full flex-col border border-line bg-white p-7 sm:p-9"}
    >
      {featured && event.image && (
        <div className="relative aspect-[4/3] overflow-hidden bg-ink lg:aspect-auto lg:min-h-[540px]">
          <Image src={event.image} alt={event.imageAlt ?? ""} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover saturate-[.65]" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-7 pb-7 pt-20 sm:px-9 sm:pb-9">
            <span className="text-[12px] font-medium uppercase tracking-[1.5px] text-white">{event.kind}</span>
          </div>
        </div>
      )}
      <div className={featured ? "flex flex-col p-7 sm:p-10 lg:p-12" : "flex h-full flex-col"}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium uppercase tracking-[1.2px]">
          <span className="text-brand-dark">{event.category}</span>
          {!featured && <span className="border-l border-line pl-4 text-muted">{event.kind}</span>}
        </div>
        <h3
          id={`event-${event.slug}`}
          className={featured
            ? "font-serif mt-7 text-[32px] font-semibold leading-[1.08] tracking-[-0.6px] text-ink sm:text-[40px] lg:text-[46px]"
            : "font-serif mt-8 text-[29px] font-semibold leading-[1.1] tracking-[-0.45px] text-ink sm:text-[34px]"}
        >
          <Link href={href} className="transition-colors hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">{event.title}</Link>
        </h3>
        <p className="mt-5 text-[15px] leading-[1.7] text-muted sm:text-[16px]">{event.summary}</p>
        <div className="mt-7 border-t border-line pt-6"><EventMeta event={event} /></div>
        <div className="mt-auto pt-8"><HoverFillButton label="Read more" href={href} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand" /></div>
      </div>
    </article>
  );
}
