import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import RichText from "@/components/RichText";
import EmptyNotice from "@/components/EmptyNotice";
import { getCmsPage } from "@/lib/cms/map";

const str = (v: unknown) => (typeof v === "string" ? v : undefined);

/**
 * Shared renderer for the CMS-driven legal singletons (privacy / cookies /
 * terms). Each is a `pages` singleton fetched by key; the body is rich text
 * rendered via <RichText>. Falls back to a "coming soon" notice when the CMS
 * has no content yet, so a route never renders blank.
 */
export default async function LegalView({
  cmsKey,
  eyebrow,
  fallbackTitle,
}: {
  cmsKey: string;
  eyebrow: string;
  fallbackTitle: string;
}) {
  const page = await getCmsPage(cmsKey);
  const data = page?.data ?? {};
  const title = str(data.title) ?? fallbackTitle;
  const subtitle = str(data.subtitle);
  const body = str(data.body);

  return (
    <SiteShell>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} />

      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-20 md:px-10 md:py-24">
          {body ? (
            <RichText html={body} />
          ) : (
            <EmptyNotice>This content will be published soon.</EmptyNotice>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
