import world from "@/lib/world-countries.geo.json";
import { COVERAGE_ISO3 } from "@/lib/coverage";

/**
 * World coverage map (008 FR-608–612). A SERVER component that renders a static
 * SVG — zero client JS, no runtime fetch. Each country is one GeoJSON feature,
 * so the USA and Canada paint as whole countries (no state/province borders).
 * Painted countries are data-driven from `COVERAGE_ISO3`; a listed country with
 * no matching feature is skipped safely. The SVG scales fluidly (viewBox), so
 * it stays legible and non-overflowing down to small screens.
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

export default function WorldCoverageMap({
  eyebrow = "Global reach",
  title = "Where we operate.",
}: {
  eyebrow?: string;
  title?: string;
}) {
  const covered = new Set(COVERAGE_ISO3);
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
          aria-label="World map highlighting the countries where the firm operates"
          className="h-auto w-full"
        >
          {features.map((f) => {
            const d = featurePath(f.geometry);
            if (!d) return null;
            const on = covered.has(f.id);
            return (
              <path
                key={f.id}
                d={d}
                className={on ? "fill-brand" : "fill-[#e7e3df]"}
                stroke="#fff"
                strokeWidth={0.4}
              />
            );
          })}
        </svg>
      </div>
    </section>
  );
}
