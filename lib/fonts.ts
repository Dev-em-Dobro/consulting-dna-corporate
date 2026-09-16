import { Geist, Source_Serif_4 } from "next/font/google";

/**
 * O par tipográfico editorial — Geist + Source Serif 4.
 *
 * DE ONDE VEIO. Nasceu na /about, em 09-09, respondendo à Rhea: a Poppins do
 * site é "quadrada demais". Ela é geométrica — o `o` é um círculo, o `a` não tem
 * cauda — e no peso 700 que os títulos usavam isso lê como bloco. A referência
 * que ela aprovou (Explore Performance) faz o oposto: título em grotesca de peso
 * MÉDIO, corpo em serifa. O contraste entre os dois é o que dá ar editorial em
 * vez de ar de apresentação corporativa.
 *
 *   • GEIST para títulos, rótulos, números e botões. Grotesca neo, terminais
 *     retos, `a` e `g` com cauda — a mesma família de desenho da referência,
 *     livre e no Google Fonts.
 *   • SOURCE SERIF 4 para corpo, legendas e linhas de apoio. A Explore usa
 *     freight-text-pro, que é da Adobe; a Source Serif é o equivalente livre
 *     mais próximo em desenho e em altura de x.
 *
 * POR QUE ESTE ARQUIVO EXISTE. Enquanto a /about era proposta, as duas famílias
 * eram declaradas dentro da própria página, para nenhuma página real baixar duas
 * fontes por causa de um teste. A /about virou a página de verdade e as páginas
 * de serviço estão adotando a mesma linguagem — a partir de duas telas, declarar
 * a mesma coisa em dois lugares é como as duas começam a divergir sem ninguém
 * notar. Aqui é a definição única.
 *
 * NÃO ESTÁ NO `layout.tsx` DE PROPÓSITO. Isto ainda não é a tipografia do site
 * inteiro: 21 páginas continuam em Poppins com a NavV1. Carregar as duas
 * famílias no layout faria todas elas baixarem fonte que não usam. Cada página
 * que migra importa daqui e aplica no seu próprio topo, e no dia em que a última
 * migrar isto sobe para o layout e o `--font-sans` global muda junto.
 */

export const geist = Geist({
  subsets: ["latin"],
  /* 700 entra por causa dos componentes COMPARTILHADOS que caem dentro destas
     árvores e não foram reescritos — o SiteFooter e o WorldCoverageMap ainda
     pedem `font-bold`. Sem o 700 carregado o navegador engorda o 600 sozinho, e
     negrito sintético em grotesca fica sujo. */
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist-v3",
  display: "swap",
});

export const serif = Source_Serif_4({
  subsets: ["latin"],
  /* 500 é dos títulos de card, que usam `font-medium`. Sem ele o navegador
     engorda o 400 sozinho, e negrito sintético em serifa é pior que em grotesca:
     as hastes finas engrossam junto com as grossas e o desenho perde o contraste
     que define a família. */
  weight: ["400", "500", "600"],
  variable: "--font-serif-v3",
  display: "swap",
});

/**
 * As classes que publicam os `@font-face`. Vão no `className` do elemento que
 * abre a árvore.
 */
export const editorialFontClass = `${geist.variable} ${serif.variable}`;

/**
 * A TROCA ACONTECE AQUI, numa linha, e não classe por classe.
 *
 * `font-sans` na Tailwind v4 resolve `var(--font-sans)`; redeclarar essa variável
 * no elemento faz a própria classe pegar a Geist, e a família herda para a árvore
 * inteira — inclusive para a NavV2, o SiteFooter e o mapa, que continuam sem
 * saber que existe fonte nova. O mesmo vale para `--font-serif`: quem escrever
 * `font-serif` daqui para baixo recebe a Source Serif 4.
 */
export const editorialFontVars = {
  "--font-sans": "var(--font-geist-v3), system-ui, sans-serif",
  "--font-serif": "var(--font-serif-v3), Georgia, serif",
} as React.CSSProperties;
