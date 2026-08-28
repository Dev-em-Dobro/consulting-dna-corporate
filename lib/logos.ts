/**
 * The curated client logo wall — the single source shared by the homepage band
 * and the Our Clients page (27-08 brief, item 8). It used to live inside
 * `app/page.tsx`; two pages showing "the clients" from two hand-kept arrays is
 * exactly how they drift, and the brief asks for the wall to carry immediate
 * credibility on both.
 *
 * Files live in /public/logos. The order is deliberate — the largest and most
 * globally recognisable names lead, with Aramco first.
 *
 * Every name here is already published on the live site. Adding one is a CDNA
 * approval matter, not a code change: the brief is explicit that no client name
 * or logo reaches production without sign-off.
 */
export const clientLogos = [
  "aramco.png", "alphabet.png", "microsoft.png", "visa.png", "shell.png",
  "nestle.png", "coca_cola.png", "unilever.png", "bp.png", "hsbc.png",
  "disney.png", "pfizer.png", "novartis.png", "sanofi.png", "rio_tinto.png",
  "anglo_american.png", "goldman_sachs.png", "morgan_stanley.png", "citi.png", "standard_chartered.png",
  "chanel.png", "rolls_royce.png", "aston_martin.png", "mclaren.png", "lego.png",
  "adidas.png", "dyson.png",
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
