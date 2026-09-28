import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import TypeLabel from "@/components/TypeLabel";
import EventMeta from "@/components/events/EventMeta";
import { events, getEventBySlug } from "@/lib/events";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { localeAlternates } from "@/lib/seo/alternates";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return events.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();
  return {
    title: `${event.title} | Events | CorporateDNA`,
    description: event.summary,
    alternates: localeAlternates(`/events/${event.slug}`),
    robots: { index: false, follow: true },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();
  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        <SolutionHero eyebrow={event.kind} title={event.title} noImage />
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-20">
            <Link href="/events" className="inline-flex min-h-11 items-center gap-3 text-[12px] font-semibold uppercase tracking-[1px] text-ink transition-colors hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"><ArrowLeft aria-hidden="true" className="h-4 w-4" /> All events</Link>
            <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:gap-24">
              <div>
                <TypeLabel>{event.category}</TypeLabel>
                <h2 className="font-serif text-[34px] font-semibold leading-[1.08] tracking-[-0.6px] text-ink sm:text-[42px]">About the event</h2>
                {event.overview.length > 0 && (
                  <div className="mt-7 max-w-[720px] space-y-5 text-[16px] leading-[1.75] text-muted">{event.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                )}
                {event.topics.length > 0 && (
                  <>
                    <h3 className="font-serif mt-12 text-[27px] font-semibold text-ink">In the conversation</h3>
                    <ul className="mt-5 max-w-[720px] divide-y divide-line border-y border-line">
                      {event.topics.map((topic, index) => <li key={topic} className="flex items-start gap-5 py-5 text-[15px] leading-[1.6] text-ink"><span aria-hidden="true" className="text-[12px] font-semibold text-brand-dark">{String(index + 1).padStart(2, "0")}</span>{topic}</li>)}
                    </ul>
                  </>
                )}
                {event.links && event.links.length > 0 && (
                  <div className="mt-8 flex flex-col gap-3">
                    {event.links.map((link) => (
                      <a key={link.href} href={link.href} className="text-[15px] font-semibold text-brand underline underline-offset-4" target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <aside aria-label="Event information" className="self-start border-t-2 border-brand bg-paper p-7 sm:p-9">
                <h2 className="font-serif mb-7 text-[26px] font-semibold text-ink">Event details</h2>
                <EventMeta event={event} />
                {event.status === "upcoming" && (
                  <p className="mt-7 border-t border-line pt-6 text-[14px] leading-[1.65] text-muted">The full programme and further details will be announced here.</p>
                )}
              </aside>
            </div>
          </div>
        </section>
      </SiteShell>
    </div>
  );
}
