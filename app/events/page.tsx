import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import Reveal from "@/components/Reveal";
import TypeLabel from "@/components/TypeLabel";
import EventCard from "@/components/events/EventCard";
import { getEvents } from "@/lib/events-content";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { localeAlternates } from "@/lib/seo/alternates";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Events | CorporateDNA",
    description: "Where CorporateDNA convenes leaders: explore our leadership conversations, forums and gatherings.",
    alternates: localeAlternates("/events"),
    // Keep provisional copy out of search until the programme is confirmed.
    robots: { index: false, follow: true },
  };
}

export default async function EventsPage() {
  const events = await getEvents();
  const featured = events.find((event) => event.featured)
    ?? events.find((event) => event.status !== "past");
  const upcoming = events.filter(
    (event) => event.status !== "past" && event.slug !== featured?.slug,
  );
  const past = events.filter((event) => event.status === "past");

  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        <SolutionHero eyebrow="Events" title="Where we bring leaders together." noImage />
        {featured && (
          <section id="featured-event" aria-labelledby="featured-heading" className="bg-paper">
            <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
              <TypeLabel>In the spotlight</TypeLabel>
              <h2 id="featured-heading" className="font-serif text-[34px] font-semibold leading-[1.08] tracking-[-0.8px] text-ink sm:text-[42px] md:text-[52px]">Featured event</h2>
              <Reveal className="mt-10 md:mt-14"><EventCard event={featured} featured /></Reveal>
            </div>
          </section>
        )}
        <section id="upcoming-events" aria-labelledby="upcoming-heading" className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
            <TypeLabel>What’s next</TypeLabel>
            <div className="md:flex md:items-end md:justify-between md:gap-12">
              <h2 id="upcoming-heading" className="font-serif text-[34px] font-semibold leading-[1.08] tracking-[-0.8px] text-ink sm:text-[42px] md:text-[52px]">Upcoming events</h2>
              <p className="mt-5 max-w-[380px] text-[15px] leading-[1.65] text-muted md:mt-0">Conversations and perspectives for the moments that shape leadership.</p>
            </div>
            <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
              {upcoming.map((event) => <Reveal key={event.slug} className="h-full"><EventCard event={event} /></Reveal>)}
            </div>
            {upcoming.length === 0 && (
              <p className="mt-8 max-w-[40rem] text-[16px] leading-[1.7] text-muted">No upcoming events have been announced yet.</p>
            )}
          </div>
        </section>
        {past.length > 0 && (
          <section id="past-events" aria-labelledby="past-heading" className="bg-paper">
            <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24">
              <TypeLabel>Already held</TypeLabel>
              <h2 id="past-heading" className="font-serif text-[34px] font-semibold leading-[1.08] tracking-[-0.8px] text-ink sm:text-[42px] md:text-[52px]">Past events</h2>
              <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
                {past.map((event) => <Reveal key={event.slug} className="h-full"><EventCard event={event} /></Reveal>)}
              </div>
            </div>
          </section>
        )}
      </SiteShell>
    </div>
  );
}
