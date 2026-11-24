import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import RichText from "@/components/RichText";
import AwardsMentions from "@/components/AwardsMentions";
import PartnersStrip from "@/components/PartnersStrip";
import { localeAlternates } from "@/lib/seo/alternates";
import { getCmsPage } from "@/lib/cms/map";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Awards & partnerships | CorporateDNA",
    description:
      "The awards, accreditations and partnerships, including Harvard Business Impact and Imperial College London, behind CorporateDNA's leadership advisory.",
    alternates: localeAlternates("/awards"),
  };
}
export const revalidate = 300;

const str = (v: unknown) => (typeof v === "string" ? v : undefined);

export default async function AwardsPage() {
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

      {body && <section className="mx-auto max-w-[820px] px-6 py-12"><RichText html={body} /></section>}
      <AwardsMentions includeBrandonHall showYear />
      <section className="mx-auto max-w-[1440px] px-6 py-16 md:px-10">
        <PartnersStrip label="Our partners" tone="featured" />
      </section>
    </SiteShell>
  );
}
