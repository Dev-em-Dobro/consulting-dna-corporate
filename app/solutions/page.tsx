import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import EmptyNotice from "@/components/EmptyNotice";
import { localeAlternates } from "@/lib/seo/alternates";
import { getSolutionCards } from "@/lib/cms/map";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Solutions — Corporate DNA",
    description:
      "How Corporate DNA helps senior leaders and their organisations — CEO and executive performance, team alignment, succession and transformation, powered by the 5H® methodology.",
    alternates: localeAlternates("/solutions"),
  };
}
export const revalidate = 300;

export default async function SolutionsPage() {
  const solutions = await getSolutionCards();

  return (
    <SiteShell footerTopBorder>
      <PageHero
        eyebrow="Solutions"
        title="Solutions"
        subtitle="How we help senior leaders and their organisations."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24">
          {/* The 5H® methodology underpins every solution — surface it first. */}
          <Link
            href="/solutions/5h-framework"
            className="group mb-10 flex flex-col gap-5 bg-ink p-8 text-white transition-colors hover:bg-ink/90 md:flex-row md:items-center md:justify-between md:p-10"
          >
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="inline-block h-0.5 w-9 bg-brand" />
                <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">
                  Our methodology
                </span>
              </div>
              <h2 className="text-[24px] font-bold tracking-[-0.5px] md:text-[28px]">
                Lead with 5H®
              </h2>
              <p className="mt-2 max-w-[520px] text-[15px] leading-[1.6] text-white/70">
                The neuroscience-led framework behind every engagement: Head, Heart,
                Hunch, Hands and Habits.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-[14px] font-semibold uppercase tracking-[1px] text-brand">
              Explore the approach
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>

          {solutions.length === 0 ? (
            <EmptyNotice>No solutions published yet.</EmptyNotice>
          ) : (
            <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
              {solutions.map((s) => (
                <Link
                  key={s.slug}
                  href={`/solutions/${s.slug}`}
                  className="group flex items-center justify-between bg-white p-8 transition-colors hover:bg-paper"
                >
                  <span className="text-[19px] font-semibold tracking-[-0.3px] text-ink group-hover:text-brand">
                    {s.title}
                  </span>
                  <span className="text-brand transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
