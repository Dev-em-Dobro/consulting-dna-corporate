import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import EmptyNotice from "@/components/EmptyNotice";
import { getCaseCards } from "@/lib/cms/map";

export const metadata: Metadata = {
  title: "Flagship case studies — Corporate DNA",
};
export const revalidate = 300;

export default async function FlagshipCasesPage() {
  const cases = await getCaseCards();

  return (
    <SiteShell>
      <PageHero
        eyebrow="Flagship case studies"
        title="Our signature client stories."
        subtitle="Editorial, article-style stories — each with tags, a client quote and a video."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24">
          {cases.length === 0 ? (
            <EmptyNotice>No case studies published yet.</EmptyNotice>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cases.map((c) => (
                <Link
                  key={c.slug}
                  href={`/solutions/flagship-cases/${c.slug}`}
                  className="group flex flex-col border border-line transition-colors hover:border-brand"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-paper">
                    {c.coverUrl ? (
                      <Image
                        src={c.coverUrl}
                        alt={c.title}
                        fill
                        sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[11px] font-semibold uppercase tracking-[2px] text-ink/30">
                        Corporate DNA
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {c.tags.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-x-2 text-[11px] font-semibold uppercase tracking-[1.5px] text-brand">
                        {c.tags.slice(0, 3).map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-[20px] font-semibold leading-snug tracking-[-0.3px] text-ink group-hover:text-brand">
                      {c.title}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
