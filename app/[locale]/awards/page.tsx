import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import RichText from "@/components/RichText";
import EmptyNotice from "@/components/EmptyNotice";
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
    title: "Awards & partnerships — Corporate DNA",
    description:
      "The awards, accreditations and partnerships — including Harvard Business Impact and Imperial College London — behind Corporate DNA's leadership advisory.",
    alternates: localeAlternates(locale, "/awards"),
  };
}
export const revalidate = 300;

const str = (v: unknown) => (typeof v === "string" ? v : undefined);

export default async function AwardsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = await getCmsPage("awards");
  const data = page?.data ?? {};
  const subtitle = str(data.subtitle);
  const body = str(data.body);

  return (
    <SiteShell>
      <PageHero
        eyebrow="Awards & partnerships"
        title="Recognition and the partners we work with."
        subtitle={subtitle}
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-20 md:px-10 md:py-24">
          {body ? (
            <RichText html={body} />
          ) : (
            <EmptyNotice>Awards & partnerships content is coming soon.</EmptyNotice>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
