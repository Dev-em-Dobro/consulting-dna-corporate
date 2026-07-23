import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import EmptyNotice from "@/components/EmptyNotice";
import { getSolutionCards } from "@/lib/cms/map";

export const metadata: Metadata = { title: "Solutions — Corporate DNA" };
export const revalidate = 300;

export default async function SolutionsPage() {
  const solutions = await getSolutionCards();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Solutions"
        title="Solutions"
        subtitle="How we help senior leaders and their organisations."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24">
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
