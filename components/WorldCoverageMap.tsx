import world from "@/lib/world-countries.geo.json";
import { COVERAGE_ISO3, countriesToIso3 } from "@/lib/coverage";
import { getCoverageRegions } from "@/lib/cms/map";
import { geocode } from "@/lib/geocode";

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
// crops most of Antarctica for a cleaner frame.
const W = 1000;
const H = 500;

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

/** A labelled map pin whose tip sits exactly on (x, y). */
function Pin({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d="M0 0 c-4.2 -6 -6.4 -9.2 -6.4 -12.8 a6.4 6.4 0 1 1 12.8 0 c0 3.6 -2.2 6.8 -6.4 12.8 z"
        fill="#373234"
        stroke="#fff"
        strokeWidth={0.6}
      />
      <circle cx="0" cy="-12.8" r="2.4" fill="#fff" />
      <text
        x="8"
        y="-10.5"
        fontSize="11"
        fontWeight={600}
        fill="#373234"
        stroke="#fff"
        strokeWidth={2.6}
        paintOrder="stroke"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        {label}
      </text>
    </g>
  );
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

  // Geocode each region that resolves to a covered country into a labelled pin.
  const pins = (
    await Promise.all(
      regions.map(async (r) => {
        const iso = countriesToIso3([r.country])[0];
        if (!iso || !r.city) return null;
        const coord = await geocode(r.city, r.country);
        if (!coord) return null;
        const [x, y] = project(coord.lng, coord.lat);
        return { x, y, label: titleCase(r.city) };
      }),
    )
  ).filter((p): p is { x: number; y: number; label: string } => !!p);

  const features = (world as { features: Feature[] }).features;

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
          viewBox="0 0 1000 430"
          role="img"
          aria-label="World map highlighting the countries and cities where the firm operates"
          className="h-auto w-full"
        >
          {features.map((f) => {
            const d = featurePath(f.geometry);
            if (!d) return null;
            const fill = covered.has(f.id)
              ? (colorFor[f.id] ?? "#d84339")
              : "#e7e3df";
            return (
              <path key={f.id} d={d} fill={fill} stroke="#fff" strokeWidth={0.4} />
            );
          })}
          {pins.map((p, i) => (
            <Pin key={i} x={p.x} y={p.y} label={p.label} />
          ))}
        </svg>
      </div>
    </section>
  );
}
