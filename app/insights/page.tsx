import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import EmptyNotice from "@/components/EmptyNotice";
import { getInsightCards } from "@/lib/cms/map";

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
  const insights = await getInsightCards();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Insights"
        title="Thinking, articles and perspectives."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[900px] px-6 py-20 md:px-10 md:py-24">
          {insights.length === 0 ? (
            <EmptyNotice>No insights published yet.</EmptyNotice>
          ) : (
            <div className="divide-y divide-line border-y border-line">
              {insights.map((i) => (
                <Link
                  key={i.slug}
                  href={`/insights/${i.slug}`}
                  className="group flex flex-col gap-1.5 py-7 transition-colors"
                >
                  {i.publishedAt && (
                    <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-brand">
                      {fmtDate(i.publishedAt)}
                    </span>
                  )}
                  <h2 className="text-[22px] font-semibold leading-snug tracking-[-0.3px] text-ink group-hover:text-brand">
                    {i.title}
                  </h2>
                  {i.summary && (
                    <p className="max-w-[62ch] text-[15px] leading-relaxed text-muted">
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
