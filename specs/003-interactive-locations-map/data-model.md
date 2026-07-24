# Phase 1 Data Model: Interactive Locations Map

The feature has no persistence. The only entity is a code-defined `Office`,
exported from `lib/offices.ts`.

## Entity: Office

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `slug` | `string` | yes | Stable key (e.g. `"london"`); used for React keys and email handle. |
| `city` | `string` | yes | Display name in the carousel (e.g. `"London"`). |
| `country` | `string` | yes | Shown with the address / for context. |
| `addressLines` | `string[]` | yes | One or more lines, rendered verbatim. |
| `tel` | `string \| null` | no | Phone; `null`/absent hides the Tel line. |
| `email` | `string` | yes | Contact email (e.g. `london@corporatednaconsulting.com`). |
| `coords` | `{ lng: number; lat: number }` | yes | Map center for this office. |
| `zoom` | `number` | yes | Target zoom the camera flies to (≈15 street level). |

### Type (reference)

```ts
export type Office = {
  slug: string;
  city: string;
  country: string;
  addressLines: string[];
  tel?: string | null;
  email: string;
  coords: { lng: number; lat: number };
  zoom: number;
};
```

## Validation / invariants

- `offices` array is non-empty; order defines carousel order.
- Each `slug` is unique.
- `coords.lng ∈ [-180, 180]`, `coords.lat ∈ [-90, 90]`.
- `zoom ∈ [0, 22]` (Mapbox range); offices use ~15.
- `email` is a valid address; derived handle matches `slug` by convention.

## Seed data (5 offices)

Carried from the current homepage `offices` array (addresses verbatim) + emails
per the reference design + coordinates from research D9:

- **London** — 60 St Martin's Ln, Covent Garden, London WC2N 4JS · +44 20 3755 5329 · london@…
- **Miami** — 1221 Brickell Avenue, Suite 900, Miami, Florida, 33131, USA · +1 305-374-4611 · miami@…
- **Singapore** — The Great Room, Afro Asia, 63 Robinson Road, Level 8, Singapore 068894 · +65 6995 2480 · singapore@…
- **Dubai** — Sheikh Rashid Tower, 4th Floor, Dubai World Trade Centre, Dubai — UAE · (no tel) · dubai@…
- **Saudi Arabia** — 2888 King Fahd Road, … Riyadh 13321 · (no tel) · riyadh@…

## UI state (not persisted)

| State | Owner | Type | Notes |
|-------|-------|------|-------|
| `activeIndex` | `LocationsBlock` | `number` | Index into `offices`; drives map + carousel + address. |
| `mapReady` | `LocationsBlock` | `boolean` | True once Mapbox loaded + `load` event fired. |
| `mapFailed` | `LocationsBlock` | `boolean` | True on missing token / init error → render fallback list. |
