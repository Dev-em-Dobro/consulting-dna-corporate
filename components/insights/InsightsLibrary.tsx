"use client";

import { useMemo, useState } from "react";
import type { InsightListEntry } from "@/lib/cms/map";
import InsightCard from "./InsightCard";

type Sort = "newest" | "oldest";

/**
 * Client library island for /insights (per the reference mockup): a "content"
 * filter + a "date" sort over the insight list from the server, then the card
 * grid. Filtering/sorting is entirely in-browser. Insights carry no tags, so the
 * "content" dropdown filters by author (the one content facet the cards show);
 * it stays a plain label when no insight has an author.
 */
export default function InsightsLibrary({
  insights,
}: {
  insights: InsightListEntry[];
}) {
  const [author, setAuthor] = useState("all");
  const [sort, setSort] = useState<Sort>("newest");

  // Unique authors for the "content" dropdown, alphabetical.
  const authorOptions = useMemo(() => {
    const set = new Set<string>();
    for (const i of insights) if (i.author) set.add(i.author);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [insights]);

  const results = useMemo(() => {
    const filtered = insights.filter(
      (i) => author === "all" || i.author === author,
    );
    return [...filtered].sort((a, b) => {
      const cmp = a.publishedAt.localeCompare(b.publishedAt);
      return sort === "newest" ? -cmp : cmp;
    });
  }, [insights, author, sort]);

  return (
    <div>
      {/* Filter bar (per the reference): the two filled grey dropdowns. */}
      <div className="mb-10 grid max-w-[520px] grid-cols-2 gap-3">
        <div className="relative">
          <select
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            aria-label="Filter by content"
            className="w-full appearance-none bg-neutral-100 px-4 py-3.5 pr-10 text-[15px] text-ink outline-none focus:bg-neutral-200"
          >
            <option value="all">content</option>
            {authorOptions.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <SelectChevron />
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort by date"
            className="w-full appearance-none bg-neutral-100 px-4 py-3.5 pr-10 text-[15px] text-ink outline-none focus:bg-neutral-200"
          >
            <option value="newest">date — newest</option>
            <option value="oldest">date — oldest</option>
          </select>
          <SelectChevron />
        </div>
      </div>

      {results.length === 0 ? (
        <p className="text-[14px] text-muted">No insights match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((i) => (
            <InsightCard key={i.slug} entry={i} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Down chevron for the filled selects (native arrow is hidden via appearance-none). */
function SelectChevron() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
