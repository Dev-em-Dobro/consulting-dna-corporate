/**
 * TAMANHO ÓPTICO DE LOGO  -  entrou em 01-10, quando "More client stories" e
 * "What our clients say" passaram a mostrar só logos.
 *
 * Caixa fixa + `object-contain` deixa um logo quadrado (Shell, BT, Unilever)
 * enorme ao lado de um wordmark comprido (Morgan Stanley, Schroders) que vira um
 * fio. O que o olho compara é a ÁREA de tinta, então cada logo ganha a mesma
 * área e a proporção decide largura e altura; os tetos seguram os extremos.
 *
 * Os arquivos de `public/clients/logos` são os de `public/logos/client-logos`
 * RECORTADOS rente à tinta (sem a margem transparente que cada um trazia), e é
 * isso que torna a conta confiável: a proporção abaixo é a do desenho, não a da
 * tela em volta. Logo novo aqui = recortar também e anotar a proporção.
 */
export function fitLogo(ratio: number, area: number, maxW: number, maxH: number) {
  let w = Math.sqrt(area * ratio);
  if (w > maxW) w = maxW;
  if (w / ratio > maxH) w = maxH * ratio;
  return { w: Math.round(w * 10) / 10, h: Math.round((w / ratio) * 10) / 10 };
}

/** Largura ÷ altura de cada arquivo recortado em `public/clients/logos`. */
export const LOGO_RATIO = {
  adidas: 1.571,
  bt: 1.024,
  "dp-world": 1.786,
  dyson: 2.778,
  "frasers-property": 2.885,
  gsk: 3.55,
  heineken: 2.4,
  maaden: 4.925,
  "morgan-stanley": 6.452,
  schroders: 5.405,
  shell: 1.083,
  unilever: 0.987,
  vodafone: 3.797,
} as const;

export type LogoKey = keyof typeof LOGO_RATIO;

export const logoSrc = (key: LogoKey) => `/clients/logos/${key}.png`;
