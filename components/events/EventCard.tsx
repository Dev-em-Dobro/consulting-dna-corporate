import EventVisual from "@/components/events/EventVisual";
import Link from "next/link";
import EventMeta from "@/components/events/EventMeta";
import { herLeadershipProspectusHref, eventContext, type LeadershipEvent } from "@/lib/events";

export default function EventCard({ event, featured = false }: { event: LeadershipEvent; featured?: boolean }) {
  const href = `/events/${event.slug}`;
  return (
    <article
      data-event-slug={event.slug}
      aria-labelledby={`event-${event.slug}`}
      className={featured
        ? "grid overflow-hidden bg-white lg:grid-cols-[1.1fr_1fr]"
        : "flex h-full min-w-0 flex-col border border-line bg-white p-4 sm:p-5"}
    >
        <Link href={href} aria-labelledby={`event-${event.slug}`} className={`relative block aspect-[4/3] w-full shrink-0 overflow-hidden ${featured ? "self-center bg-ink" : "mb-4 bg-paper"}`}>
          <EventVisual card image={event.image} alt={event.imageAlt ?? event.title} contain={event.imageContain} sizes={featured ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1280px) 22vw, (min-width: 768px) 45vw, 100vw"} />
          {featured && !event.imageContain && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-7 pb-7 pt-20 sm:px-9 sm:pb-9">
            <span className="text-[12px] font-medium uppercase tracking-[1.5px] text-white">{event.kind}</span>
          </div>}
        </Link>
      <div className={featured ? "flex flex-col p-7 sm:p-10 lg:p-12" : "flex flex-1 flex-col"}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium uppercase tracking-[1.2px]">
          <span className="text-brand-dark">{event.category}</span>
          {!featured && <span className="border-l border-line pl-4 text-muted">{event.kind}</span>}
        </div>
        <h3
          id={`event-${event.slug}`}
          className={featured
            ? "font-serif mt-7 text-[32px] font-semibold leading-[1.08] tracking-[-0.6px] text-ink sm:text-[40px] lg:text-[46px]"
            : "font-serif mt-4 text-[25px] font-semibold leading-[1.1] tracking-[-0.45px] text-ink sm:text-[28px] xl:text-[25px]"}
        >
          <Link href={href} className="hover:text-brand-dark">{event.title}</Link>
          <span data-no-translate className="mt-2 block font-sans text-sm font-medium leading-normal text-muted"><span className="locale-en-only">{eventContext(event, "en-GB")}</span><span className="locale-pt-only">{eventContext(event, "pt-BR")}</span></span>
        </h3>
        {event.summary ? <p className={featured ? "mt-5 whitespace-pre-line text-[15px] leading-[1.7] text-muted sm:text-[16px]" : "mt-3 line-clamp-2 text-[14px] leading-[1.5] text-muted"}>{event.summary}</p> : null}
        <div className="mt-4 border-t border-line pt-3"><EventMeta event={event} /></div>
        {/* 01-10: o evento futuro não tem "Read more"  -  a descrição já está toda no cartão. */}
        {event.status === "upcoming" ? (
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {event.links?.map((link) => <a key={link.href} href={link.href} download={link.href === herLeadershipProspectusHref ? "Her_Leadership_DNA_Prospectus_2027.pdf" : undefined} className={link.href === "/contact" ? "contact-action" : "text-[14px] font-semibold text-brand-dark underline underline-offset-4"}>{link.label}</a>)}
          </div>
        ) : (
          <div className="mt-auto pt-4"><Link href={href} className="inline-flex items-center gap-2 font-semibold text-brand-dark underline">Learn more <span aria-hidden="true">→</span></Link></div>
        )}
      </div>
    </article>
  );
}
