import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import RichText from "@/components/RichText";
import EmptyNotice from "@/components/EmptyNotice";
import { getCmsPage } from "@/lib/cms/map";

export const metadata: Metadata = {
  title: "Awards & partnerships — Corporate DNA",
};
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
