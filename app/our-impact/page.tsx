import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, ChartNoAxesColumnIncreasing, Earth, Map as MapIcon, Sprout, TreeDeciduous, Users } from "lucide-react";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import TypeLabel from "@/components/TypeLabel";
import world from "@/lib/world-countries.geo.json";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { getImpactCopy } from "@/lib/impact-copy-server";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getImpactCopy();
  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    alternates: localeAlternates("/our-impact"),
  };
}
export const revalidate = 300;

/* ── The partnership sheet of 29-09 ─────────────────────────────────────────
   Sections and words follow the CorporateDNA × TERRAGRN one-pager; colour and
   type do NOT. The sheet is TERRAGRN green, olive, orange and blue; here every
   surface is one of the site's own — `ink`, `brand-dark`, `paper`, white — and
   the headings are the editorial serif the other pages use.

   `brand-dark` and not `brand` behind white text: the cards carry 13px detail
   lines, and white on #d84339 is 3.9:1, under the 4.5:1 small text needs.
   #b5342b gives 5.3:1. */

const PHOTO = (n: number) => `/impact/terragon/${String(n).padStart(2, "0")}.jpeg`;

const STAT_TONES = [
  { card: "bg-ink text-white", detail: "text-white/70" },
  { card: "bg-brand-dark text-white", detail: "text-white/80" },
  { card: "bg-paper text-ink", detail: "text-muted" },
  { card: "bg-ink-2 text-white", detail: "text-white/70" },
];
const STAT_ICONS = [TreeDeciduous, MapIcon, Users, Earth];
const AREA_ICONS = [Sprout, Earth, Users, ChartNoAxesColumnIncreasing];

const UPLINK_URL = "https://uplink.weforum.org/";

/* ── South Africa, drawn from the same GeoJSON as the world map ─────────────
   Equirectangular with the cosine of the mid latitude, so the country is not
   stretched sideways at 29°S. Lesotho is a hole in the ZAF polygon and stays
   one (`evenodd`). The pin is Mpumalanga's rough centre. */
type Ring = [number, number][];
const SA = (world as unknown as { features: { id: string; geometry: { coordinates: Ring[] } }[] })
  .features.find((f) => f.id === "ZAF")!.geometry.coordinates;
const LNG0 = 16.3, LNG1 = 33, LAT0 = -22, LAT1 = -34.9;
const KX = Math.cos((29 * Math.PI) / 180);
const MAP_W = 400;
const SCALE = MAP_W / ((LNG1 - LNG0) * KX);
const MAP_H = Math.round((LAT0 - LAT1) * SCALE);
const project = (lng: number, lat: number) =>
  [((lng - LNG0) * KX * SCALE).toFixed(1), ((LAT0 - lat) * SCALE).toFixed(1)] as const;
const SA_PATH = SA.map((ring) => "M" + ring.map(([x, y]) => project(x, y).join(",")).join("L") + "Z").join("");
const [PIN_X, PIN_Y] = project(30.4, -25.8).map(Number);

function SouthAfricaMap({ region, country }: { region: string; country: string }) {
  return (
    <svg viewBox={`-10 -10 ${MAP_W + 20} ${MAP_H + 20}`} className="h-auto w-full" role="img" aria-label={`${region}, ${country}`}>
      <path d={SA_PATH} fillRule="evenodd" className="fill-line stroke-white" strokeWidth={2} />
      <circle cx={PIN_X} cy={PIN_Y} r={34} className="fill-brand/15" />
      <g transform={`translate(${PIN_X} ${PIN_Y})`}>
        <path d="M0 0 C -11 -14 -14 -20 -14 -26 A 14 14 0 1 1 14 -26 C 14 -20 11 -14 0 0 Z" className="fill-brand" />
        <circle cy={-26} r={5.5} className="fill-white" />
      </g>
      <text x={PIN_X - 22} y={PIN_Y + 30} textAnchor="end" className="fill-ink text-[17px] font-medium">
        {region}
      </text>
      <text x={MAP_W * 0.42} y={MAP_H * 0.62} textAnchor="middle" className="fill-muted text-[19px] font-medium uppercase tracking-[4px]">
        {country}
      </text>
    </svg>
  );
}

function Photo({ n, className, sizes, alt = "TERRAGRN" }: { n: number; className: string; sizes: string; alt?: string }) {
  return (
    <div className={`relative overflow-hidden bg-paper ${className}`}>
      <Image src={PHOTO(n)} alt={alt} fill sizes={sizes} className="object-cover" />
    </div>
  );
}

const H2 = "font-serif text-[32px] font-semibold leading-[1.1] tracking-[-0.4px] text-ink sm:text-[40px] md:text-[44px]";

export default async function OurImpactPage() {
  const copy = await getImpactCopy();

  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
    <SiteShell footerTopBorder floatingNav>
      <SolutionHero
        eyebrow={copy.hero.eyebrow}
        title={copy.hero.title}
        body={[copy.hero.body]}
        imageUrl={PHOTO(2)}
        imageShadeOpacity={0.82}
      />

      {/* ── The four figures ── */}
      <section id="figures" className="bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-3 px-6 pt-12 sm:grid-cols-2 md:px-10 md:pt-16 lg:grid-cols-4">
          {copy.stats.items.map((item, i) => {
            const tone = STAT_TONES[i % STAT_TONES.length];
            const Icon = STAT_ICONS[i % STAT_ICONS.length];
            return (
              <div key={i} className={`flex items-center gap-5 px-6 py-7 ${tone.card}`}>
                <Icon aria-hidden className="h-11 w-11 shrink-0 opacity-90" strokeWidth={1.3} />
                <div>
                  <p className="font-serif text-[34px] font-semibold leading-none">{item.value}</p>
                  <p className="mt-1.5 text-[16px] font-medium leading-snug">{item.label}</p>
                  <p className={`mt-1 text-[13px] leading-snug ${tone.detail}`}>{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── WEF recognition · photo · shared commitment ── */}
      <section id="recognition" className="bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-3 px-6 py-3 md:px-10 lg:grid-cols-[1fr_1.05fr_1fr]">
          <div className="flex flex-col justify-center bg-ink px-8 py-12 text-white md:px-10">
            <TypeLabel onDark>{copy.recognition.label}</TypeLabel>
            <h2 className="font-serif text-[30px] font-semibold leading-[1.12] tracking-[-0.3px] md:text-[36px]">
              {copy.recognition.heading}
            </h2>
            <p className="mt-5 text-[16px] leading-[1.7] text-white/75">{copy.recognition.body}</p>
          </div>
          <Photo n={3} className="min-h-[320px] lg:min-h-[480px]" sizes="(min-width: 1024px) 35vw, 100vw" />
          <div className="flex flex-col justify-center bg-paper px-8 py-12 md:px-10">
            <TypeLabel>{copy.partnership.label}</TypeLabel>
            <h2 className="font-serif text-[30px] font-semibold leading-[1.12] tracking-[-0.3px] text-ink md:text-[36px]">
              {copy.partnership.heading}
            </h2>
            <p className="mt-5 text-[16px] leading-[1.7] text-muted">{copy.partnership.body}</p>
          </div>
        </div>
      </section>

      {/* ── The agroforest ── */}
      <section id="agroforest" className="bg-white">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-16 md:px-10 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <TypeLabel>{copy.agroforest.label}</TypeLabel>
            <h2 className={`${H2} max-w-[18ch]`}>{copy.agroforest.heading}</h2>
            <div className="mt-7 space-y-5 text-[17px] leading-[1.7] text-muted">
              {copy.agroforest.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Photo n={4} className="col-span-2 aspect-[16/9]" sizes="(min-width: 1024px) 50vw, 100vw" />
            <Photo n={6} className="aspect-[4/3]" sizes="(min-width: 1024px) 25vw, 50vw" />
            <Photo n={10} className="aspect-[4/3]" sizes="(min-width: 1024px) 25vw, 50vw" />
          </div>
        </div>
      </section>

      {/* ── A model for regenerative growth ── */}
      <section id="model" className="bg-[#edf4e8]">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <TypeLabel>{copy.model.label}</TypeLabel>
            <h2 className={`${H2} max-w-[16ch]`}>{copy.model.heading}</h2>
            <p className="mt-7 max-w-[60ch] text-[17px] leading-[1.7] text-muted">{copy.model.body}</p>
          </div>
          <div className="mx-auto w-full max-w-[460px]">
            <SouthAfricaMap region={copy.model.mapRegion} country={copy.model.mapCountry} />
          </div>
        </div>
      </section>

      {/* ── Impact areas ── */}
      <section id="areas" className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <TypeLabel>{copy.areas.label}</TypeLabel>
          <div className="mt-6 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {copy.areas.items.map((item, i) => {
              const Icon = AREA_ICONS[i % AREA_ICONS.length];
              return (
                <div key={i} className={`lg:px-8 ${i === 0 ? "lg:pl-0" : "lg:border-l lg:border-line"}`}>
                  <div className="flex items-center gap-4">
                    <Icon aria-hidden className="h-10 w-10 shrink-0 text-brand" strokeWidth={1.4} />
                    <h3 className="font-serif text-[21px] font-semibold leading-[1.2] text-ink">{item.title}</h3>
                  </div>
                  <p className="mt-4 text-[15px] leading-[1.65] text-muted">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SiteShell>
    </div>
  );
}
