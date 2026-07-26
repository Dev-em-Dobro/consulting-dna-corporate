/**
 * Countries where the firm operates, by ISO 3166 alpha-3 code (008 FR-610).
 * The world coverage map paints exactly these; edit this list to add/remove a
 * country — no image editing required. Codes with no matching map feature
 * (e.g. tiny city-states like Singapore, SGP, at this resolution) are skipped
 * safely by the map (FR-612).
 *
 * Seed list derived from the offices + the meeting's US/Canada note — replace
 * with the firm's authoritative coverage list when provided.
 */
export const COVERAGE_ISO3: string[] = [
  "USA", // United States
  "CAN", // Canada
  "GBR", // United Kingdom
  "ARE", // United Arab Emirates
  "SAU", // Saudi Arabia
  "SGP", // Singapore (no polygon at this resolution — skipped)
];

/**
 * Country name (as authored in the CMS region `country` field, free text) →
 * ISO 3166 alpha-3. Names are normalised (trim + lowercase) before lookup, with
 * common variants included. Extend this when the firm enters a new country;
 * unknown names are silently dropped by `countriesToIso3`.
 */
const COUNTRY_TO_ISO3: Record<string, string> = {
  "united states": "USA",
  "united states of america": "USA",
  "usa": "USA",
  "us": "USA",
  "canada": "CAN",
  "united kingdom": "GBR",
  "uk": "GBR",
  "great britain": "GBR",
  "england": "GBR",
  "united arab emirates": "ARE",
  "uae": "ARE",
  "saudi arabia": "SAU",
  "kingdom of saudi arabia": "SAU",
  "ksa": "SAU",
  "singapore": "SGP",
};

/** Map free-text country names to ISO3 codes, dropping unknowns; de-duplicates. */
export function countriesToIso3(names: (string | undefined | null)[]): string[] {
  const out = new Set<string>();
  for (const n of names) {
    if (!n) continue;
    const code = COUNTRY_TO_ISO3[n.trim().toLowerCase()];
    if (code) out.add(code);
  }
  return [...out];
}
