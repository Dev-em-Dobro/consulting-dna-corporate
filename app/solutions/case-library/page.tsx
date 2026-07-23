import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import EmptyNotice from "@/components/EmptyNotice";
import { getCaseCards } from "@/lib/cms/map";

export const metadata: Metadata = {
  title: "Case-study library — Corporate DNA",
};
export const revalidate = 300;

// The searchable/filterable library launches once there are 10+ published cases.
const LIBRARY_MIN = 10;

export default async function CaseLibraryPage() {
  const cases = await getCaseCards();
  const ready = cases.length >= LIBRARY_MIN;

  return (
    <SiteShell>
      <PageHero
        eyebrow="Case-study library"
        title="The full library of client work."
        subtitle="Searchable and filterable by tags."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24">
          {!ready ? (
            <EmptyNotice>
              The full library opens once there are {LIBRARY_MIN}+ published cases (
              {cases.length} so far). In the meantime, see our{" "}
              <Link
                href="/solutions/flagship-cases"
                className="ml-1 font-semibold text-brand hover:underline"
              >
                flagship case studies →
              </Link>
            </EmptyNotice>
          ) : (
            <div className="grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {cases.map((c) => (
                <Link
                  key={c.slug}
                  href={`/solutions/flagship-cases/${c.slug}`}
                  className="group bg-white p-6 transition-colors hover:bg-paper"
                >
                  {c.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-x-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-brand">
                      {c.tags.slice(0, 3).map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  )}
                  <span className="text-[17px] font-semibold text-ink group-hover:text-brand">
                    {c.title}
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
