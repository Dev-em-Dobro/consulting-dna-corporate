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
