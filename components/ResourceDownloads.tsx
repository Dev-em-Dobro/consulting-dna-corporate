import type { ResourceLink } from "@/lib/cms/map";

/** Document-with-down-arrow glyph (inline so we carry no icon dependency). */
function FileIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 shrink-0 text-brand"
    >
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M12 11v6" />
      <path d="m9.5 14.5 2.5 2.5 2.5-2.5" />
    </svg>
  );
}

/**
 * "Reports & Resources" — a list of downloadable files carried by a case,
 * solution or insight (the CMS `resources[]`). Rendered only by callers when
 * there is at least one resolved resource, so it never shows an empty block.
 * The `heading` lets a page opt into a different label (default below).
 */
export default function ResourceDownloads({
  resources,
  heading = "Reports & Resources",
}: {
  resources: ResourceLink[];
  heading?: string;
}) {
  return (
    <section className="border-t border-line bg-white">
      <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-20">
        <h2 className="text-[13px] font-bold uppercase tracking-[1.5px] text-brand">
          {heading}
        </h2>
        <ul className="mt-8 border-t border-line">
          {resources.map((r, i) => (
            <li key={`${r.url}-${i}`} className="border-b border-line">
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="group flex items-center gap-4 py-5 transition-colors"
              >
                <FileIcon />
                <span className="flex-1 text-[17px] font-medium text-ink transition-colors group-hover:text-brand">
                  {r.title}
                </span>
                <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-muted transition-colors group-hover:text-brand">
                  Download
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
