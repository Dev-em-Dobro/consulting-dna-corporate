/** Selected backgrounds for the published case-study heroes. */
export const CASE_HERO_COVERS: Record<string, string> = {
  "shell-women-leaders": "/cases/shell-women-leaders-hero.webp",
  "dubai-holding-leadership-accountability": "/cases/dubai-holding-leadership-accountability-hero.webp",
  "heineken-inner-outer-game": "/cases/frasers-property-hrlt-hero.webp",
  shell: "/cases/shell-women-leaders-hero.webp",
  aviva: "/cases/dyson-hero.webp",
  "coca-cola": "/cases/dp-world-hero.webp",
  levis: "/cases/dp-world-hero.webp",
  unilever: "/cases/shell-hero.webp",
  vodafone: "/cases/gsk-hero.webp",
  maaden: "/cases/shell-hero.webp",
  "frasers-property-hrlt": "/cases/vodafone-hero.webp",
  "frasers-property-leadership": "/cases/vodafone-hero.webp",
  dyson: "/cases/shell-women-leaders-hero.webp",
  "dp-world": "/cases/shell-hero.webp",
  bt: "/cases/morgan-stanley-hero.webp",
  gsk: "/cases/gsk-hero.webp",
  "morgan-stanley": "/cases/shell-women-leaders-hero.webp",
};

/** Per-case logo scale as a percentage of the available right-hand hero area. */
export const CASE_HERO_LOGO_SCALE_PERCENT: Record<string, number> = {
  "shell-women-leaders": 140,
  shell: 140,
  aviva: 80,
  vodafone: 80,
  dyson: 80,
  bt: 56,
  gsk: 56,
  "morgan-stanley": 80,
  unilever: 130,
};

/** Mobile versions crop transparent canvas so each brand is sized by its mark. */
export const CASE_HERO_MOBILE_LOGO_SRC: Record<string, string> = {
  "shell-women-leaders": "/logos/case-mobile-v2/shell.png",
  "dubai-holding-leadership-accountability": "/logos/case-mobile-v2/dubai-holding.png",
  "heineken-inner-outer-game": "/logos/case-mobile-v2/heineken.png",
  shell: "/logos/case-mobile-v2/shell.png",
  aviva: "/logos/case-mobile-v2/aviva.png",
  "coca-cola": "/logos/case-mobile-v2/coca-cola.png",
  levis: "/logos/case-mobile-v2/levis.png",
  unilever: "/logos/case-mobile-v2/unilever.png",
  vodafone: "/logos/case-mobile-v2/vodafone.png",
  maaden: "/logos/case-mobile-v2/maaden.png",
  "frasers-property-hrlt": "/logos/case-mobile-v2/frasers-property.png",
  "frasers-property-leadership": "/logos/case-mobile-v2/frasers-property.png",
  dyson: "/logos/case-mobile-v2/dyson.png",
  "dp-world": "/logos/case-mobile-v2/dp-world.png",
  bt: "/logos/case-mobile-v2/bt.png",
  gsk: "/logos/case-mobile-v2/gsk.png",
  "morgan-stanley": "/logos/case-mobile-v2/morgan-stanley.png",
};

/** Mobile logo height in pixels, tuned for each mark's shape and visual weight. */
export const CASE_HERO_MOBILE_LOGO_HEIGHT: Record<string, number> = {
  vodafone: 58,
  "dp-world": 92,
  "morgan-stanley": 88,
};

/** These marks need a white treatment only in the mobile hero. */
export const CASE_HERO_MOBILE_WHITE_LOGOS = new Set([
  "dp-world",
]);
