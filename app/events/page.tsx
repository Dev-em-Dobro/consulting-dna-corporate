import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import Reveal from "@/components/Reveal";
import TypeLabel from "@/components/TypeLabel";
import EventCard from "@/components/events/EventCard";
import { events } from "@/lib/events";
import { getEventsCopy } from "@/lib/events-copy-server";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { localeAlternates } from "@/lib/seo/alternates";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Events | CorporateDNA",
    description: "Where CorporateDNA convenes leaders: explore our leadership conversations, forums and gatherings.",
    alternates: localeAlternates("/events"),
  };
}

export default async function EventsPage() {
  const copy = await getEventsCopy();
  const upcoming = events.filter((event) => event.status === "upcoming");
  const past = events.filter((event) => event.status === "past");

  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        <SolutionHero eyebrow="Events" title="Where we bring leaders together." noImage />
        <section id="upcoming-events" aria-labelledby="upcoming-heading" className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
            <TypeLabel>{copy.upcoming.label}</TypeLabel>
            <h2 id="upcoming-heading" className="font-serif text-[34px] font-semibold leading-[1.08] tracking-[-0.8px] text-ink sm:text-[42px] md:text-[52px]">
              {copy.upcoming.heading}
            </h2>
            {upcoming.length === 0 ? (
              <p className="mt-8 max-w-[40rem] text-[18px] leading-[1.7] text-muted">{copy.upcoming.body}</p>
            ) : (
              <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
                {upcoming.map((event) => (
                  <Reveal key={event.slug} className="h-full">
                    <EventCard event={event} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
        <section id="past-events" aria-labelledby="past-heading" className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
            <TypeLabel>Already held</TypeLabel>
            <h2 id="past-heading" className="font-serif text-[34px] font-semibold leading-[1.08] tracking-[-0.8px] text-ink sm:text-[42px] md:text-[52px]">
              Past events
            </h2>
            <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
              {past.map((event) => (
                <Reveal key={event.slug} className="h-full">
                  <EventCard event={event} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </SiteShell>
    </div>
  );
}
