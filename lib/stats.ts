import { getPage } from "@/lib/cms/client";

/**
 * The firm-level statistics band — the editable statistics item 18 asks us to
 * preserve, now shared by the homepage and Our Impact (27-08 brief, item 9)
 * rather than re-declared per page.
 *
 * Values come from the CMS `home` singleton (page_home: years / countries /
 * faculty / sponsoredPct); the labels are site copy. The fallbacks below are
 * used verbatim when the CMS is unreachable or a field is blank, so the band
 * never renders empty.
 *
 * NOTE: these numbers are part of the approval list sent on 06-08 that is still
 * outstanding — the site carries `36 countries` here while /approach carries
 * `26 countries`, `95%` and `ten years`. Reconciling them is a CDNA decision,
 * not ours; both stay as they are until that list comes back.
 */
export type SiteStat = { value: string; label: string };

const STAT_FALLBACK: (SiteStat & { cmsKey: string })[] = [
  { cmsKey: "years", value: "18", label: "Years advising senior leaders" },
  { cmsKey: "countries", value: "36", label: "Countries of global delivery" },
  { cmsKey: "faculty", value: "75", label: "Faculty of senior practitioners" },
  { cmsKey: "sponsoredPct", value: "90%", label: "Work sponsored by Chairman / CXO" },
];

/**
 * Fetch the `home` singleton and merge its published values over the fallbacks.
 * A blank/missing field or an unreachable CMS keeps the fallback number.
 */
export async function getSiteStats(): Promise<SiteStat[]> {
  const home = await getPage("home");
  const data = (home?.data ?? {}) as Record<string, unknown>;
  return STAT_FALLBACK.map((s) => {
    const v = data[s.cmsKey];
    return {
      value: typeof v === "string" && v.trim() ? v : s.value,
      label: s.label,
    };
  });
}
