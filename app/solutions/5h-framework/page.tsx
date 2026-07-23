import Image from "next/image";
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import RichText from "@/components/RichText";
import Reveal from "@/components/Reveal";
import { getCmsPage } from "@/lib/cms/map";
import methodology from "@/public/5H-methodology.jpg";

export const metadata: Metadata = {
  title: "The 5H® Framework — Corporate DNA",
};
export const revalidate = 300;

export default async function FiveHFrameworkPage() {
  const page = await getCmsPage("5h");
  const data = page?.data ?? {};
  const subtitle = typeof data.subtitle === "string" ? data.subtitle : undefined;
  const body = typeof data.body === "string" ? data.body : undefined;
  const coverUrl = typeof data.coverUrl === "string" ? data.coverUrl : undefined;

  return (
    <SiteShell>
      <PageHero
        title={
          <>
            The 5H<span className="align-super text-[0.5em] font-semibold">®</span>{" "}
            Framework
          </>
        }
        subtitle={subtitle}
      />

      <section className="bg-white">
        <Reveal
          stagger={false}
          className="mx-auto max-w-[820px] px-6 py-20 md:px-10 md:py-28"
        >
          <h2 className="mb-8 text-[28px] sm:text-[32px] md:text-[36px] font-bold leading-[1.1] tracking-[-0.6px] text-ink">
            The 5H<span className="align-super text-base font-semibold">®</span>{" "}
            Framework
          </h2>

          <div className="relative mb-10 aspect-[3/2] w-full overflow-hidden border border-line">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt="The 5H Framework methodology"
                fill
                sizes="(min-width: 820px) 820px, 100vw"
                className="object-cover"
              />
            ) : (
              <Image
                src={methodology}
                alt="The 5H Framework methodology"
                fill
                sizes="(min-width: 820px) 820px, 100vw"
                className="object-cover"
              />
            )}
          </div>

          {body ? (
            <RichText html={body} />
          ) : (
            <div className="max-w-[62ch] space-y-5 text-[17px] leading-[1.7] text-muted">
              <p>
                The 5H methodology works across the inner game of the leader and
                the outer game of performance, so behaviour holds under real
                enterprise pressure.
              </p>
            </div>
          )}
        </Reveal>
      </section>
    </SiteShell>
  );
}
