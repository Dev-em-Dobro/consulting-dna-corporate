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

import world from "@/lib/world-countries.geo.json";

type CountryFeature = { id: string; properties: { name: string } };

/**
 * Country name → ISO 3166 alpha-3, built from the map's OWN GeoJSON
 * (`feature.properties.name` → `feature.id`). Deriving it from the same data the
 * map paints means every one of the ~180 countries resolves automatically — no
 * hand-maintained table to fall behind the CMS.
 */
const NAME_TO_ISO3: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const f of (world as { features: CountryFeature[] }).features) {
    const name = f.properties?.name?.trim().toLowerCase();
    if (name) m[name] = f.id;
  }
  return m;
})();

/**
 * Common spellings the CMS `country` field might use that differ from the
 * GeoJSON's official English names (e.g. "USA" vs "United States of America",
 * "Brasil" vs "Brazil"). Checked before NAME_TO_ISO3.
 */
const ALIASES: Record<string, string> = {
  "united states": "USA",
  "usa": "USA",
  "us": "USA",
  "uk": "GBR",
  "great britain": "GBR",
  "england": "GBR",
  "uae": "ARE",
  "kingdom of saudi arabia": "SAU",
  "ksa": "SAU",
  "brasil": "BRA",
  "singapore": "SGP",
};

/**
 * Map free-text country names (from the CMS) to ISO3 codes, dropping unknowns
 * and de-duplicating. Aliases win over the GeoJSON-derived names.
 */
export function countriesToIso3(names: (string | undefined | null)[]): string[] {
  const out = new Set<string>();
  for (const n of names) {
    if (!n) continue;
    const key = n.trim().toLowerCase();
    const code = ALIASES[key] ?? NAME_TO_ISO3[key];
    if (code) out.add(code);
  }
  return [...out];
}
