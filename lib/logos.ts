/**
 * The curated client logo wall — the single source shared by the homepage band
 * and the Our Clients page (27-08 brief, item 8). It used to live inside
 * `app/page.tsx`; two pages showing "the clients" from two hand-kept arrays is
 * exactly how they drift, and the brief asks for the wall to carry immediate
 * credibility on both.
 *
 * Files live in /public/logos. The order is deliberate — the largest and most
 * globally recognisable names lead.
 *
 * ============================================================================
 * ⚠️ LISTA DE 24-09 — SÓ CLIENTES DE VERDADE
 * ============================================================================
 * A daily pediu para tirar do banner as empresas que ainda são só negociação e
 * refazer a esteira com a pasta nova de logos. São estes dezenove arquivos,
 * importados de `Desktop/logos` no mesmo dia: recortados pela caixa do alfa e
 * reduzidos a 800px no lado maior, o mesmo tratamento dos arquivos de evidência.
 *
 * Every name here is already published on the live site. Adding one is a CDNA
 * approval matter, not a code change: the brief is explicit that no client name
 * or logo reaches production without sign-off.
 */
export const clientLogos = [
  "microsoft.png",
  "shell.png",
  "coca_cola.png",
  "unilever.png",
  "hsbc.png",
  "adidas.png",
  "heineken.png",
  "bank_of_england.png",
  "aston_martin.png",
  "dp_world.png",
  "dubai_holding.png",
  "frasers_property.png",
  "hbo_max.png",
  "bain_capital.png",
  "collins_aerospace.png",
  "kedaara.png",
  "schroders.png",
  "singtel.png",
  "swarovski.png",
];

/**
 * The wall split into the two counter-scrolling rows both pages render. Split
 * here rather than at each call site so the rows stay identical between them.
 */
const split = Math.ceil(clientLogos.length / 2);
export const clientLogoRows: [string[], string[]] = [
  clientLogos.slice(0, split),
  clientLogos.slice(split),
];

/**
 * Seconds for one full marquee loop, scaled to the row length so both rows
 * travel at the same apparent speed regardless of how many logos they hold.
 */
export const logoRowDuration = (row: string[]) => row.length * 4.6;
