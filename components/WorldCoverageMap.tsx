import world from "@/lib/world-countries.geo.json";
import { COVERAGE_ISO3, countriesToIso3 } from "@/lib/coverage";
import { getCoverageRegions } from "@/lib/cms/map";
import { geocode } from "@/lib/geocode";
import { CITY_COORDS } from "@/lib/city-coords";

/**
 * World coverage map (008 FR-608–612). An async SERVER component rendering a
 * static SVG. Countries the firm operates in are painted (each in its own colour
 * from a brand-harmonised palette) from the published CMS regions' `country`
 * field; when the CMS has no regions it falls back to the static COVERAGE_ISO3
 * so the map is never blank. Each region's `city` is geocoded (city + country →
 * lat/lng, cached) and drawn as a labelled pin. A country/city that can't be
 * resolved is skipped safely. The SVG scales fluidly (viewBox).
 */

// Simple equirectangular projection into a 1000×500 canvas; the viewBox then
// crops most of Antarctica + the empty ocean margins for a tighter frame.
const W = 1000;
const H = 500;

// Visible window (crops empty Pacific sides + the polar oceans). Everything that
// keeps labels on-screen references this so the bounds never drift from the crop.
const VIEW = { x: 60, y: 15, w: 880, h: 405 };

type Ring = number[][];
type Geometry =
  | { type: "Polygon"; coordinates: Ring[] }
  | { type: "MultiPolygon"; coordinates: Ring[][] };
type Feature = { id: string; properties: { name: string }; geometry: Geometry };

const project = (lng: number, lat: number): [number, number] => [
  ((lng + 180) / 360) * W,
  ((90 - lat) / 180) * H,
];

const ringToPath = (ring: Ring): string =>
  ring
    .map((pt, i) => {
      const [x, y] = project(pt[0], pt[1]);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ") + "Z";

const featurePath = (g: Geometry): string =>
  g.type === "Polygon"
    ? g.coordinates.map(ringToPath).join(" ")
    : g.coordinates.flat().map(ringToPath).join(" ");

// One colour per covered country, harmonised with the brand red (#d84339).
const PALETTE = [
  "#d84339", // brand red
  "#e8833a", // orange
  "#e6b02e", // amber
  "#3f9e8f", // teal
  "#3a7ca5", // blue
  "#8a5a9e", // purple
  "#b5342b", // brand dark
  "#5b9e4f", // green
];

const titleCase = (s: string) =>
  s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase());

// ---- Label de-overlap -------------------------------------------------------
// With ~37 pins, city labels collide (Europe, US, Asia clusters). A greedy
// placer tries each label to the right/left/above/below its pin, with vertical
// nudges, and keeps the first spot that clears every pin marker and every
// already-placed label. Deterministic (no randomness) so SSR is stable.
type Anchor = "start" | "end" | "middle";
type PinT = { x: number; y: number; label: string };
type Placed = PinT & { lx: number; ly: number; anchor: Anchor };
type Box = { x1: number; y1: number; x2: number; y2: number };

const FONT = 8.5;
const CHAR_W = 4.5; // approx glyph advance at FONT
const LINE_H = 9;
const PIN_SCALE = 0.78; // shrink the teardrop marker

const overlaps = (a: Box, b: Box) =>
  a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;

function labelBox(lx: number, ly: number, anchor: Anchor, text: string): Box {
  const w = text.length * CHAR_W + 2;
  const x1 = anchor === "end" ? lx - w : anchor === "middle" ? lx - w / 2 : lx;
  return { x1, y1: ly - LINE_H, x2: x1 + w, y2: ly + 2 };
}

const markerBox = (p: PinT): Box => ({
  x1: p.x - 5,
  y1: p.y - 15,
  x2: p.x + 5,
  y2: p.y + 1,
});

function placeLabels(pins: PinT[], seed: Box[] = []): Placed[] {
  // City labels avoid the pin markers AND the seeded boxes (country names).
  const boxes: Box[] = [...pins.map(markerBox), ...seed];
  const placed: Placed[] = [];
  // Top-to-bottom, left-to-right for a stable, tidy sweep.
  const order = [...pins].sort((a, b) => a.y - b.y || a.x - b.x);

  for (const p of order) {
    const cands: { lx: number; ly: number; anchor: Anchor }[] = [];
    for (const base of [-7, 9]) {
      for (const nudge of [0, -10, 10, -20, 20]) {
        cands.push({ lx: p.x + 6, ly: p.y + base + nudge, anchor: "start" });
        cands.push({ lx: p.x - 6, ly: p.y + base + nudge, anchor: "end" });
      }
    }
    cands.push({ lx: p.x, ly: p.y - 18, anchor: "middle" });
    cands.push({ lx: p.x, ly: p.y + 11, anchor: "middle" });

    let pick = cands[0];
    let pickBox = labelBox(pick.lx, pick.ly, pick.anchor, p.label);
    for (const c of cands) {
      const b = labelBox(c.lx, c.ly, c.anchor, p.label);
      // Keep the whole label inside the visible viewBox (so edge cities like
      // Sydney flip to the left instead of being clipped off the map).
      if (
        b.x1 < VIEW.x + 2 ||
        b.x2 > VIEW.x + VIEW.w - 2 ||
        b.y1 < VIEW.y + 2 ||
        b.y2 > VIEW.y + VIEW.h - 2
      )
        continue;
      if (boxes.some((o) => overlaps(b, o))) continue;
      pick = c;
      pickBox = b;
      break;
    }
    boxes.push(pickBox);
    placed.push({ ...p, lx: pick.lx, ly: pick.ly, anchor: pick.anchor });
  }
  return placed;
}

// ---- Country-name labels ----------------------------------------------------
// Short display names where the GeoJSON name is long / not what people expect.
const SHORT_NAME: Record<string, string> = {
  USA: "USA",
  GBR: "UK",
  ARE: "UAE",
};

/**
 * Centre point + projected size of a country's largest landmass, for placing a
 * name in the middle of it. Uses the shoelace centroid of the biggest outer
 * ring (so islands/exclaves don't drag the label into the sea).
 */
function countryLabelPos(
  g: Geometry,
): { x: number; y: number; w: number; h: number } | null {
  const rings: number[][][] =
    g.type === "Polygon" ? [g.coordinates[0]] : g.coordinates.map((p) => p[0]);

  let best: { ring: number[][]; clng: number; clat: number } | null = null;
  let bestArea = -1;
  for (const ring of rings) {
    let a = 0;
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      const [x0, y0] = ring[i];
      const [x1, y1] = ring[i + 1];
      const cr = x0 * y1 - x1 * y0;
      a += cr;
      cx += (x0 + x1) * cr;
      cy += (y0 + y1) * cr;
    }
    a *= 0.5;
    if (!a) continue;
    const area = Math.abs(a);
    if (area > bestArea) {
      bestArea = area;
      best = { ring, clng: cx / (6 * a), clat: cy / (6 * a) };
    }
  }
  if (!best) return null;

  const [x, y] = project(best.clng, best.clat);
  let minx = Infinity;
  let miny = Infinity;
  let maxx = -Infinity;
  let maxy = -Infinity;
  for (const [lng, lat] of best.ring) {
    const [px, py] = project(lng, lat);
    if (px < minx) minx = px;
    if (px > maxx) maxx = px;
    if (py < miny) miny = py;
    if (py > maxy) maxy = py;
  }
  return { x, y, w: maxx - minx, h: maxy - miny };
}

export default async function WorldCoverageMap({
  eyebrow = "Global reach",
  title = "Where we operate.",
}: {
  eyebrow?: string;
  title?: string;
}) {
  const regions = await getCoverageRegions();

  // Painted countries come from the CMS regions; fall back to the static list
  // when the CMS has none, so the map never renders blank.
  const coveredCodes = regions.length
    ? countriesToIso3(regions.map((r) => r.country))
    : COVERAGE_ISO3;

  // Stable colour per country (sorted so the assignment doesn't shuffle).
  const colorFor: Record<string, string> = {};
  [...coveredCodes]
    .sort()
    .forEach((code, i) => (colorFor[code] = PALETTE[i % PALETTE.length]));
  const covered = new Set(coveredCodes);

  // A labelled pin per region city. Coordinates come from the pre-geocoded
  // table (fast, no rate limits); a city not baked in yet is geocoded live.
  // The pin shows even when the country itself can't paint (e.g. Hong Kong).
  const pins = (
    await Promise.all(
      regions.map(async (r) => {
        if (!r.city) return null;
        const coord = CITY_COORDS[r.slug] ?? (await geocode(r.city, r.country));
        if (!coord) return null;
        const [x, y] = project(coord.lng, coord.lat);
        return { x, y, label: titleCase(r.city) };
      }),
    )
  ).filter((p): p is { x: number; y: number; label: string } => !!p);

  // No CMS data → hide the whole section rather than showing a pin-less map.
  // The section is only meaningful when it can plot the offices the CMS
  // publishes; with no regions (e.g. the CMS is unreachable) there are no pins,
  // so render nothing instead of a bare painted world map.
  if (!regions.length || !pins.length) return null;

  const features = (world as { features: Feature[] }).features;

  // Country-name labels centred on each painted country big enough to fit one
  // (no pin). Small countries are skipped so the name never overflows the shape.
  const countryNames = features
    .filter((f) => covered.has(f.id))
    .map((f) => {
      const pos = countryLabelPos(f.geometry);
      if (!pos) return null;
      // Only reasonably large countries get a name; small ones stay pin-only.
      if (pos.w < 45 || pos.h < 24) return null;
      const name = SHORT_NAME[f.id] ?? f.properties.name;
      const fs = Math.min(11, Math.max(8, pos.h * 0.13));
      const w = name.length * fs * 0.56;
      if (pos.w < w) return null; // name must fit across the country
      if (
        pos.x < VIEW.x + 6 ||
        pos.x > VIEW.x + VIEW.w - 6 ||
        pos.y < VIEW.y + 6 ||
        pos.y > VIEW.y + VIEW.h - 6
      )
        return null;
      return { x: pos.x, y: pos.y, name, fs };
    })
    .filter(
      (c): c is { x: number; y: number; name: string; fs: number } => !!c,
    );

  // Let city labels avoid the country names too.
  const cnBoxes: Box[] = countryNames.map((c) => {
    const w = c.name.length * c.fs * 0.56;
    return {
      x1: c.x - w / 2,
      y1: c.y - c.fs / 2,
      x2: c.x + w / 2,
      y2: c.y + c.fs / 2,
    };
  });

  const placed = placeLabels(pins, cnBoxes);

  return (
    <section id="coverage" className="bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24">
        <div className="mb-2.5 flex items-baseline gap-3">
          <span className="inline-block h-0.5 w-9 bg-brand" />
          <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">
            {eyebrow}
          </span>
        </div>
        <h2 className="mb-10 max-w-[720px] text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-ink">
          {title}
        </h2>

        <svg
          viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
          role="img"
          aria-label="World map highlighting the countries and cities where the firm operates"
          className="h-auto w-full"
        >
          {features.map((f, i) => {
            const d = featurePath(f.geometry);
            if (!d) return null;
            const fill = covered.has(f.id)
              ? (colorFor[f.id] ?? "#d84339")
              : "#e7e3df";
            // Key by index — some GeoJSON features share id "-99" (disputed
            // territories), which would otherwise collide.
            return (
              <path key={i} d={d} fill={fill} stroke="#fff" strokeWidth={0.4} />
            );
          })}
          {/* Country names, centred on the country (no pin). */}
          {countryNames.map((c, i) => (
            <text
              key={`c${i}`}
              x={c.x}
              y={c.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={c.fs}
              fontWeight={700}
              letterSpacing="0.4"
              fill="#ffffff"
              opacity={0.92}
              stroke="rgba(55,50,52,0.28)"
              strokeWidth={c.fs * 0.08}
              paintOrder="stroke"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
              {c.name}
            </text>
          ))}
          {/* Pin markers (tip on the city). */}
          {pins.map((p, i) => (
            <g key={`m${i}`} transform={`translate(${p.x}, ${p.y}) scale(${PIN_SCALE})`}>
              <path
                d="M0 0 c-4.2 -6 -6.4 -9.2 -6.4 -12.8 a6.4 6.4 0 1 1 12.8 0 c0 3.6 -2.2 6.8 -6.4 12.8 z"
                fill="#373234"
                stroke="#fff"
                strokeWidth={0.6}
              />
              <circle cx="0" cy="-12.8" r="2.4" fill="#fff" />
            </g>
          ))}
          {/* City labels, placed to avoid overlapping each other and the pins. */}
          {placed.map((p, i) => (
            <text
              key={`l${i}`}
              x={p.lx}
              y={p.ly}
              textAnchor={p.anchor}
              fontSize={FONT}
              fontWeight={600}
              fill="#373234"
              stroke="#fff"
              strokeWidth={2}
              paintOrder="stroke"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </section>
  );
}
