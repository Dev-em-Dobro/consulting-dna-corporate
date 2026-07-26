import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import type { InsightListEntry } from "@/lib/cms/map";

/** Date as DD.MM.YYYY, matching the reference mockup ("25.10.2027"). */
function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

/**
 * One insight in the /insights library (per the reference mockup): a cover image
 * on top, then a dark info panel with the title and stacked meta (author, date,
 * reading time). Presentational.
 */
export default function InsightCard({ entry }: { entry: InsightListEntry }) {
  const date = fmtDate(entry.publishedAt);
  return (
    <Link
      href={`/insights/${entry.slug}`}
      className="group flex flex-col overflow-hidden"
    >
      {/* Cover — image when present, light grey placeholder otherwise. */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#d7d3d0]">
        {entry.coverUrl && (
          <Image
            src={entry.coverUrl}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}
      </div>

      {/* Dark info panel. */}
      <div className="flex flex-1 flex-col bg-ink px-7 py-7 text-white">
        <h2 className="text-[24px] font-bold leading-[1.12] tracking-[-0.5px] group-hover:text-brand">
          {entry.title}
        </h2>
        <div className="mt-5 space-y-0.5 text-[15px] leading-[1.5] text-white/55">
          {entry.author && <p>From {entry.author}</p>}
          {date && <p>{date}</p>}
          <p>{entry.readingMinutes} minutes reading</p>
        </div>
      </div>
    </Link>
  );
}
