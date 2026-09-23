"use client";

import { useMemo, useState } from "react";
import type { CaseListEntry } from "@/lib/cms/map";
import CaseRow from "./CaseRow";

type Sort = "newest" | "oldest";

/**
 * Client library island for /cases: a search box + a tag ("content") filter + a
 * date sort, over the case list from the server. Filtering/sorting is entirely
 * in-browser; the reference mockup drives the layout.
 */
export default function CasesLibrary({ cases }: { cases: CaseListEntry[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState<Sort>("newest");

  // Unique tag list for the "content" dropdown, alphabetical.
  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    for (const c of cases) for (const t of c.tags) set.add(t);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [cases]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = cases.filter((c) => {
      if (tag !== "all" && !c.tags.includes(tag)) return false;
      if (!q) return true;
      const hay = [c.client, c.challenge ?? "", c.tags.join(" ")].join(" ").toLowerCase();
      return hay.includes(q);
    });
    const sorted = [...filtered].sort((a, b) => {
      const cmp = a.publishedAt.localeCompare(b.publishedAt);
      return sort === "newest" ? -cmp : cmp;
    });
    return sorted;
  }, [cases, query, tag, sort]);

  return (
    <div>
      {/* Filter bar (per the reference): a filled grey search field, then the two
          filled grey dropdowns (content / date). */}
      <div className="mb-10 space-y-3">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases"
            aria-label="Search cases"
            className="w-full bg-neutral-100 px-4 py-3.5 pr-11 text-[15px] text-ink outline-none placeholder:text-muted focus:bg-neutral-200"
          />
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              aria-label="Filter by content"
              className="w-full appearance-none bg-neutral-100 px-4 py-3.5 pr-10 text-[15px] text-ink outline-none focus:bg-neutral-200"
            >
              <option value="all">content</option>
              {tagOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
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
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <SelectChevron />
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="text-[14px] text-muted">No cases match your filters.</p>
      ) : (
        <div className="space-y-8">
          {results.map((c) => (
            <CaseRow key={c.slug} entry={c} />
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
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
