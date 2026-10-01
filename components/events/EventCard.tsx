import EventVisual from "@/components/events/EventVisual";
import Link from "next/link";
import HoverFillButton from "@/components/HoverFillButton";
import EventMeta from "@/components/events/EventMeta";
import type { LeadershipEvent } from "@/lib/events";

export default function EventCard({ event, featured = false }: { event: LeadershipEvent; featured?: boolean }) {
  const href = `/events/${event.slug}`;
  /* 01-10: o evento futuro não tem página própria a visitar  -  sem links nem hovers. */
  const linked = event.status !== "upcoming";

  return (
    <article
      aria-labelledby={`event-${event.slug}`}
      className={featured
        ? "grid overflow-hidden bg-white lg:grid-cols-[1.1fr_1fr]"
        : "flex h-full min-w-0 flex-col border border-line bg-white p-4 sm:p-5"}
    >
        <MaybeLink href={linked ? href : undefined} ariaLabel={event.title} className={featured ? "relative block aspect-[4/3] overflow-hidden bg-ink lg:aspect-auto lg:min-h-[540px]" : "relative mb-4 block aspect-[2/1] overflow-hidden bg-paper"}>
          <EventVisual image={event.image} alt={event.imageAlt ?? event.title} contain={event.imageContain} sizes={featured ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"} />
          {featured && !event.imageContain && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-7 pb-7 pt-20 sm:px-9 sm:pb-9">
            <span className="text-[12px] font-medium uppercase tracking-[1.5px] text-white">{event.kind}</span>
          </div>}
        </MaybeLink>
      <div className={featured ? "flex flex-col p-7 sm:p-10 lg:p-12" : "flex h-full flex-col"}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium uppercase tracking-[1.2px]">
          <span className="text-brand-dark">{event.category}</span>
          {!featured && <span className="border-l border-line pl-4 text-muted">{event.kind}</span>}
        </div>
        <h3
          id={`event-${event.slug}`}
          className={featured
            ? "font-serif mt-7 text-[32px] font-semibold leading-[1.08] tracking-[-0.6px] text-ink sm:text-[40px] lg:text-[46px]"
            : "font-serif mt-4 line-clamp-2 text-[25px] font-semibold leading-[1.1] tracking-[-0.45px] text-ink sm:text-[28px] xl:text-[25px]"}
        >
          {linked ? (
            <Link href={href} className="transition-colors hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">{event.title}</Link>
          ) : event.title}
        </h3>
        {event.summary ? <p className={featured ? "mt-5 whitespace-pre-line text-[15px] leading-[1.7] text-muted sm:text-[16px]" : "mt-3 line-clamp-2 text-[14px] leading-[1.5] text-muted"}>{event.summary}</p> : null}
        <div className="mt-4 border-t border-line pt-3"><EventMeta event={event} /></div>
        {/* 01-10: o evento futuro não tem "Read more"  -  a descrição já está toda no cartão. */}
        {event.status === "upcoming" ? null : (
          <div className="mt-auto pt-4"><HoverFillButton label="Read more" href={href} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand" /></div>
        )}
      </div>
    </article>
  );
}

function MaybeLink({ href, ariaLabel, className, children }: { href?: string; ariaLabel: string; className: string; children: React.ReactNode }) {
  return href ? (
    <Link href={href} aria-label={ariaLabel} className={className}>{children}</Link>
  ) : (
    <div className={className}>{children}</div>
  );
}
