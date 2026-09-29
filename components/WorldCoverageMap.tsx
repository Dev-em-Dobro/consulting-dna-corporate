import world from "@/lib/world-countries.geo.json";
import { COVERAGE_ISO3, countriesToIso3 } from "@/lib/coverage";
import { getCoverageRegions } from "@/lib/cms/map";
import { geocode } from "@/lib/geocode";
import { CITY_COORDS } from "@/lib/city-coords";
import TypeLabel from "@/components/TypeLabel";

/**
 * World coverage map (008 FR-608–612). An async SERVER component rendering a
 * static SVG. Each published CMS region's `city` is geocoded (city + country →
 * lat/lng, cached) and drawn as a labelled pin. A country/city that can't be
 * resolved is skipped safely. The SVG scales fluidly (viewBox).
 *
 * ============================================================================
 * ⚠️ O ESTILO MUDOU EM 17-09, E FOI A MUDANÇA MAIOR DESTE ARQUIVO
 * ============================================================================
 *
 * Pedido da daily: *"trocar o estilo do mapa pelo que ela mandou na pasta do
 * drive"*, e a arte de referência é `1.About Page/Map Image.png`. Ela foi MEDIDA
 * pixel a pixel, não olhada — os valores estão em `REF` abaixo, e é de lá que
 * saem as cores daqui.
 *
 * O QUE O MAPA DEIXOU DE FAZER, e esta é a parte que importa: ele PINTAVA cada
 * país de atuação com uma cor própria, de uma paleta de oito, e escrevia o nome
 * dos grandes por cima em branco. A referência dela não pinta país nenhum — a
 * terra inteira é de UM cinza-azulado só, e quem diz onde a firma atua são os
 * alfinetes, sozinhos.
 *
 * ⚠️ ISSO CONTRARIA O FR-608–612, que pede os países de atuação pintados. Não é
 * descuido: é a arte que a cliente mandou, e a leitura dela é melhor para esta
 * página. Oito cores saturadas numa faixa `paper` faziam o mapa gritar mais alto
 * que a seção inteira, e a paleta era ARBITRÁRIA — a cor não significava nada,
 * era só `PALETTE[i % 8]` sobre a lista ordenada, então Canadá roxo e Brasil
 * azul não diziam coisa alguma ao leitor que tentasse decodificá-los.
 *
 * ⏳ COMO VOLTAR ATRÁS: `PAINT_COVERAGE = true`, uma linha. Nada foi apagado —
 * a paleta, a lista de países cobertos e o cálculo dos rótulos de país seguem
 * aqui inteiros, exatamente porque esta página já inverteu decisões em dias
 * seguidos e a peça pronta é mais barata que a reescrita.
 *
 * ⚠️ OS ALFINETES SÃO OS DO CMS, e a referência dela tem MUITO mais: ela desenha
 * umas cinquenta cidades (Estocolmo, Cairo, Ulaanbaatar, Lagos, Joanesburgo,
 * Auckland…) e o CMS publica as regiões de escritório, que são bem menos. O
 * pedido foi de ESTILO, e dado é outra conversa — encher o mapa de cidades que o
 * CMS não tem seria escrever alcance à mão numa página de prova. Se ela quiser
 * as cinquenta, é publicá-las como região no CMS e elas aparecem sozinhas.
 */

/**
 * As três cores da arte de referência, amostradas do PNG (`Map Image.png`,
 * 5530x2953, fundo transparente):
 *
 *   terra   `#abb3c1` com alfa 128 — ou seja, METADE deste cinza sobre o fundo
 *           da página. É por isso que `landFill` abaixo é calculado por `tone`
 *           em vez de sair daqui direto: a mistura tem de acontecer contra o
 *           branco ou contra o `paper`, e não contra um só dos dois.
 *   pino    `#e72e32`
 *   rótulo  `#000000`
 *
 * ⚠️ O PINO E O RÓTULO NÃO USAM ESTES DOIS VALORES, de propósito. O vermelho da
 * arte é um vizinho do `brand` (#d84339) e o preto é um vizinho do `ink`
 * (#373234); adotá-los literalmente colocaria no site um segundo vermelho e um
 * segundo preto, a três casas decimais dos que já existem, e a diferença não
 * seria vista por ninguém — só herdada por quem viesse depois. O que se copia da
 * referência é a DECISÃO (pino vermelho, rótulo escuro, terra neutra), não o
 * código hexadecimal.
 */
const REF = { land: [171, 179, 193] as const, landAlpha: 0.5 };

/**
 * `false` = terra toda de um cinza só, como a arte dela. `true` devolve a
 * pintura por país de atuação e os nomes de país por cima — ver o ⏳ no
 * cabeçalho. Vale para as duas rotas que renderizam este mapa (/about e
 * /our-clients), que é o que mantém as duas iguais.
 */
const PAINT_COVERAGE = false;

// Equirectangular into a 1000×500 canvas, then latitude drawn 1.22× taller.
// At 2:1 the continents read as a strip — "achatado", o pedido de 23-09 na
// /about. 1.22 é a conta que leva a MESMA janela geográfica (o VIEW abaixo)
// para 16:9: 880 / (405 × 1.22) ≈ 1.78. Os pinos usam o mesmo `project`, então
// sobem junto com a costa. A janela continua cortando Antártida e o Pacífico
// vazio; o que muda é a altura de cada grau de latitude.
const LAT_SCALE = 1.22;
const W = 1000;
const H = 500 * LAT_SCALE;

// Visible window (crops empty Pacific sides + the polar oceans). Everything that
// keeps labels on-screen references this so the bounds never drift from the crop.
const VIEW = { x: 60, y: 15 * LAT_SCALE, w: 880, h: 405 * LAT_SCALE };

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
  tone = "white",
  typeLabel = false,
  bare = false,
}: {
  /**
   * Pass `null` to both to render the map alone, with no header of its own.
   * /about-v2 needs that: its "Where we work." block opens with a heading and
   * an intro paragraph the map has no slot for, and a second eyebrow directly
   * under the first reads as two sections instead of one.
   *
   * Optional and off by default — the three homepages render this component
   * with its header and must not change.
   */
  eyebrow?: string | null;
  title?: string | null;
  /**
   * Ground the map sits on. `paper` exists for /about, where the whole "Where
   * we work" block (this map + the offices below it) shares one band so the two
   * halves read as one section — see the note at the call site.
   *
   * A prop rather than a change to the component, for the same reason
   * LocationsBlock has one: the three homepages render this map on white and
   * must not move.
   *
   * ⚠️ The map is DRAWN against its ground, so this is not only a CSS class.
   * Country borders are stroked in the ground colour, which is what makes the
   * landmasses read as shapes cut out of the page rather than outlined on top
   * of it; and the un-covered countries need to stay as far from the ground as
   * they were on white, or the empty world washes out. Both follow `tone`
   * below. The palette of COVERED countries is saturated and doesn't care.
   */
  tone?: "white" | "paper";
  /**
   * Renderiza o rótulo pelo <TypeLabel> (14px/500/1,3px) em vez do span local
   * de 13px/600/2px.
   *
   * Existe para a home, que em 10-09 adotou o TypeLabel em todos os rótulos de
   * seção: sem isto o mapa era o único bloco daquela página abrindo numa
   * métrica diferente das seções vizinhas.
   *
   * Desligado por padrão porque as três homes antigas renderizam este mapa com
   * o rótulo de antes e não podem mudar. Mesmo padrão de `maxWidthClass`.
   */
  typeLabel?: boolean;
  /**
   * Devolve só o conteúdo (rótulo/título, se houver, e o SVG) — sem
   * `<section>`, sem container centralizado e sem padding.
   *
   * Existe para a /about (item 3 da call de 14-09): lá o mapa deixou de ser uma
   * faixa inteira e passou a dividir a linha com o texto de "Where we work", o
   * texto à esquerda e o mapa à direita. Quem manda em largura, fundo e
   * espaçamento passa a ser o grid do chamador; com o wrapper próprio o mapa
   * abriria uma segunda faixa de 1200px DENTRO da coluna da direita, e a
   * largura do SVG deixaria de acompanhar a coluna.
   *
   * Desligado por padrão: as três homes renderizam o mapa como seção inteira e
   * não podem mudar. Mesmo padrão de `tone` e `typeLabel`.
   */
  bare?: boolean;
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

  // Headerless mode also drops the top padding: the caller's own intro sits
  // directly above, and stacking both paddings opens a gap the 27-08 brief
  // (item 16, "excessive white space") asks us to close.
  const headless = eyebrow === null && title === null;

  // The two colours that are a function of the ground (see the `tone` doc).
  // `ground` is every stroke that means "the page behind this": country
  // borders, the pin keyline, the city-label halo. `emptyFill` is the
  // un-covered world; it sits ~28 points below white, so on paper (#f3f3f3) it
  // has to come down too or the difference halves and the map reads washed out.
  const ground = tone === "paper" ? "#f3f3f3" : "#ffffff";
  const emptyFill = tone === "paper" ? "#e0dbd6" : "#e7e3df";

  /* A TERRA, misturada aqui e não no `REF`. A arte dela é `#abb3c1` a 50% sobre
     fundo transparente; esta conta faz a mesma mistura contra o fundo real desta
     página, que é branco ou `paper`.

     ⚠️ É COR CHAPADA, E NÃO `fillOpacity={0.5}`, embora o segundo fosse uma
     linha a menos e desse a mesma cor. O motivo é a COSTURA entre países: são
     ~250 polígonos encostados, e cada um precisa de `stroke` da própria cor para
     as bordas não deixarem fios claros de antialiasing entre eles. Com meia
     opacidade, os traços vizinhos se sobrepõem e a costura fica mais ESCURA que
     o miolo — uma malha de fronteiras desenhada exatamente onde a referência não
     tem nenhuma. Opaco, o traço sobreposto é idêntico ao miolo. */
  const mix = (c: number, g: number) => Math.round(c * REF.landAlpha + g * (1 - REF.landAlpha));
  const groundRgb = tone === "paper" ? [243, 243, 243] : [255, 255, 255];
  const landFill = `rgb(${REF.land.map((c, i) => mix(c, groundRgb[i])).join(",")})`;

  // O conteúdo em si. Vive numa variável porque `bare` decide se ele sai
  // embrulhado na seção própria ou cru, para o grid do chamador posicionar.
  const content = (
    <>
      {eyebrow !== null &&
        (typeLabel ? (
          <TypeLabel>{eyebrow}</TypeLabel>
        ) : (
          <div className="mb-2.5 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">
              {eyebrow}
            </span>
          </div>
        ))}
      {title !== null && (
        <h2 className="mb-10 max-w-[720px] text-[30px] sm:text-[34px] md:text-[40px] font-bold leading-[1.1] tracking-[-0.8px] text-ink">
          {title}
        </h2>
      )}

      <svg
        viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
        role="img"
        aria-label="World map highlighting the countries and cities where the firm operates"
        className="h-auto w-full"
      >
        {features.map((f, i) => {
          const d = featurePath(f.geometry);
          if (!d) return null;
          /* ⚠️ COM `PAINT_COVERAGE` DESLIGADO, TODO PAÍS RECEBE A MESMA COR — e
             o `stroke` passa a ser a própria cor da terra, não o fundo da
             página. Enquanto os países eram coloridos, traçar a borda no tom do
             fundo era o que os recortava um do outro; agora não há o que
             recortar, e uma borda clara entre eles desenharia as fronteiras que
             a referência não tem. */
          const fill = PAINT_COVERAGE
            ? covered.has(f.id)
              ? (colorFor[f.id] ?? "#d84339")
              : emptyFill
            : landFill;
          // Key by index — some GeoJSON features share id "-99" (disputed
          // territories), which would otherwise collide.
          return (
            <path
              key={i}
              d={d}
              fill={fill}
              stroke={PAINT_COVERAGE ? ground : landFill}
              strokeWidth={0.4}
            />
          );
        })}
        {/* Country names, centred on the country (no pin). Só com a pintura
            ligada: em cima de terra toda da mesma cor eles não teriam a que se
            referir, e a referência dela não os tem. */}
        {PAINT_COVERAGE && countryNames.map((c, i) => (
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
            {/* ⚠️ VERMELHO DESDE 17-09 — era `#373234`, o `ink`. É a marca mais
                visível da arte dela: alfinete vermelho sobre terra neutra. Com a
                pintura por país desligada, é o ÚNICO vermelho do mapa, e era
                justamente por competir com os oito tons de país que ele tinha
                nascido escuro.

                `brand` E NÃO O `#e72e32` DA ARTE — ver a caixa do `REF`. */}
            <path
              d="M0 0 c-4.2 -6 -6.4 -9.2 -6.4 -12.8 a6.4 6.4 0 1 1 12.8 0 c0 3.6 -2.2 6.8 -6.4 12.8 z"
              fill="#d84339"
              stroke={ground}
              strokeWidth={0.6}
            />
            <circle cx="0" cy="-12.8" r="2.4" fill={ground} />
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
            stroke={ground}
            strokeWidth={2}
            paintOrder="stroke"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            {p.label}
          </text>
        ))}
      </svg>
    </>
  );

  if (bare) return content;

  return (
    <section
      id="coverage"
      className={tone === "paper" ? "bg-paper" : "bg-white"}
    >
      <div
        className={`mx-auto max-w-[1200px] px-6 pb-20 md:px-10 md:pb-24 ${
          headless ? "pt-0" : "pt-20 md:pt-24"
        }`}
      >
        {content}
      </div>
    </section>
  );
}
