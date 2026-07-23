import PageHero from "@/components/PageHero";
import RichText from "@/components/RichText";
import EmptyNotice from "@/components/EmptyNotice";

/**
 * Detail body for a region. Takes the resolved name/city/body so it serves both
 * the live page (which may fall back to a static region name) and the preview
 * route (which always has CMS data).
 */
export default function RegionView({
  name,
  city,
  body,
}: {
  name: string;
  city?: string;
  body?: string;
}) {
  return (
    <>
      <PageHero eyebrow="Region" title={name} subtitle={city} />

      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-20 md:px-10 md:py-24">
          {body ? (
            <RichText html={body} />
          ) : (
            <EmptyNotice>Content for {name} is coming soon.</EmptyNotice>
          )}
        </div>
      </section>
    </>
  );
}
