import PageHero from "@/components/PageHero";
import RichText from "@/components/RichText";
import ResourceDownloads from "@/components/ResourceDownloads";
import type { InsightVM } from "@/lib/cms/map";

/** Date as DD.MM.YYYY, matching the insight cards. */
function fmtDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/**
 * Detail body for an insight. Shared by the live page and the preview route.
 * Follows the Solutions detail layout (title over a cover hero, rich-text body),
 * with the cover carrying a gradient overlay on top (007 FR-507). A meta row
 * (author · date · reading time) sits above the article, mirroring the card.
 */
export default function InsightView({ i }: { i: InsightVM }) {
  const date = fmtDate(i.publishedAt);
  const meta = [
    i.author ? `By ${i.author}` : null,
    date || null,
    `${i.readingMinutes} min read`,
  ].filter(Boolean) as string[];

  return (
    <>
      <PageHero
        eyebrow="Insight"
        title={i.title}
        bgImageUrl={i.coverUrl}
        overlayClassName="bg-gradient-to-t from-ink via-ink/80 to-ink/50"
      />

      <section className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-20 md:px-10 md:py-24">
          {/* Author · date · reading time. */}
          <div className="mb-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line pb-6 text-[15px] text-muted">
            {meta.map((part, idx) => (
              <span key={idx} className="flex items-center gap-x-3">
                {idx > 0 && (
                  <span aria-hidden className="text-muted/40">
                    ·
                  </span>
                )}
                <span
                  className={idx === 0 && i.author ? "font-semibold text-ink" : ""}
                >
                  {part}
                </span>
              </span>
            ))}
          </div>

          <RichText html={i.body} />
        </div>
      </section>

      {i.resources?.length ? <ResourceDownloads resources={i.resources} /> : null}
    </>
  );
}
