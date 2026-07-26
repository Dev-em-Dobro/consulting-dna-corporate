import Image from "next/image";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import RichText from "@/components/RichText";
import { setRequestLocale } from "next-intl/server";
import { localeAlternates } from "@/lib/seo/alternates";
import { getCmsPage } from "@/lib/cms/map";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "The book — Corporate DNA",
    alternates: localeAlternates(locale, "/book"),
  };
}
export const revalidate = 300;

const str = (v: unknown) => (typeof v === "string" ? v : undefined);

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await getCmsPage("book");
  const data = page?.data ?? {};

  const title = str(data.title) ?? "Leadership: it's in your DNA";
  const subtitle = str(data.subtitle);
  const body = str(data.body);
  const coverUrl = str(data.coverUrl);
  const amazonUrl = str(data.amazonUrl) ?? str(data.purchaseUrl);

  return (
    <SiteShell>
      <PageHero eyebrow="The book" title={title} subtitle={subtitle} />

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1000px] grid-cols-1 items-start gap-12 px-6 py-20 md:grid-cols-[240px_1fr] md:px-10 md:py-24">
          {coverUrl && (
            <div className="relative mx-auto aspect-[3/4] w-[220px] overflow-hidden border border-line shadow-lg">
              <Image
                src={coverUrl}
                alt={title}
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
          )}
          <div>
            <RichText html={body} />
            <a
              href={amazonUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-brand-dark"
            >
              Buy on Amazon
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
