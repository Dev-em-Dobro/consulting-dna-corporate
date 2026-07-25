import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import EmptyNotice from "@/components/EmptyNotice";
import { getInsightListEntries } from "@/lib/cms/map";

export const metadata: Metadata = { title: "Insights — Corporate DNA" };
export const revalidate = 300;

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(d);
};

export default async function InsightsPage() {
  const insights = await getInsightListEntries();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Insights"
        title="Thinking, articles and perspectives."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[1100px] px-6 py-20 md:px-10 md:py-24">
          {insights.length === 0 ? (
            <EmptyNotice>No insights published yet.</EmptyNotice>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {insights.map((i) => (
                <Link
                  key={i.slug}
                  href={`/insights/${i.slug}`}
                  className="group flex flex-col"
                >
                  {/* Cover — image when present, branded placeholder otherwise. */}
                  <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden bg-[#e9e6e3]">
                    {i.coverUrl ? (
                      <Image
                        src={i.coverUrl}
                        alt={i.title}
                        fill
                        sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-ink/90 to-brand" />
                    )}
                    <span className="absolute bottom-0 left-0 h-[4px] w-9 bg-brand" />
                  </div>

                  {/* Meta: date · reading time (· author when available) */}
                  <div className="mb-1.5 flex flex-wrap items-center gap-x-2 text-[12px] font-semibold uppercase tracking-[1.2px] text-brand">
                    {i.publishedAt && <span>{fmtDate(i.publishedAt)}</span>}
                    {i.publishedAt && <span className="text-ink/25">·</span>}
                    <span>{i.readingMinutes} min read</span>
                    {i.author && (
                      <>
                        <span className="text-ink/25">·</span>
                        <span className="normal-case tracking-normal text-muted">{i.author}</span>
                      </>
                    )}
                  </div>

                  <h2 className="text-[19px] font-semibold leading-snug tracking-[-0.3px] text-ink group-hover:text-brand">
                    {i.title}
                  </h2>
                  {i.summary && (
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">
                      {i.summary}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
