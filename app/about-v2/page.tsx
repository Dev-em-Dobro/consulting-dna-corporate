/**
 * /about-v2 — a About reorganizada, para o cliente aprovar. NÃO é o site.
 *
 * De onde vem: a Maliha mandou em 08-09 dois anexos — `CDNA_About_Page_Dev_Outline.docx`
 * (o "text breakdown": sete blocos, cada campo marcado FINAL ou HOLD) e uma
 * imagem de página inteira mostrando a ordem dos blocos. A imagem é referência
 * de ARRANJO, não de design: ela vem com header branco, cards arredondados e
 * ícones que não são deste site. O que se aproveita dela é a sequência dos
 * blocos; a linguagem visual continua sendo a nossa (PageHero em `bg-ink`,
 * Eyebrow vermelho, régua vermelha, Counter, alternância white/paper).
 *
 * Onde o documento e a imagem discordam, o documento ganha — ele é a instrução
 * escrita para o time de desenvolvimento. Dois casos:
 *   • Our Promise: a imagem põe o corpo em duas colunas; o texto pede "single
 *     column prose, narrower measure than the surrounding blocks".
 *   • Region tiles: a imagem mostra foto em cada tile; os campos de CMS do
 *     documento são só { name, descriptor }, sem imagem.
 *
 * Rota separada, `noindex`, fora do sitemap e fora do menu, pelo mesmo motivo
 * da /home-v2: enquanto é proposta, a /our-identity no ar não pode depender de
 * nada que esta página mexa. Se for aprovada, o conteúdo sobe para a página
 * real e esta pasta some.
 *
 * ⚠️ O documento também pede renomear rotas (/about, /services, /team,
 * /clients-impact, /contact, /books) com 301 das atuais. Isso NÃO está feito
 * aqui — é trabalho de redirects e sitemap, separado desta página, e foi
 * levantado com o cliente.
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist, Source_Serif_4 } from "next/font/google";
import NavV2 from "@/components/NavV2";
import SiteFooter from "@/components/SiteFooter";
import { buildSiteNav } from "@/lib/nav-server";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import WorldCoverageMap from "@/components/WorldCoverageMap";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import heroPhoto from "@/public/about-hero.jpeg";
/* A foto da home (mulher no palco, público em volta) reaproveitada no bloco de
   propósito — ver a caixa de comentário daquela seção. Mesmo arquivo que a
   HeroV2 e a HeroV3 importam; o Next deduplica, então não há segundo download. */
import purposePhoto from "@/public/dna-time/dna-time-06.jpeg";

/* ────────────────────────────────────────────────────────────────────────────
   TIPOGRAFIA — o teste de 09-09.

   O problema, na palavra da Rhea: a Poppins do site é "quadrada demais". Ela é
   uma geométrica — o `o` é um círculo, o `a` não tem cauda —, e no peso 700 que
   esta página usa em todo título isso lê como bloco. A referência que ela
   aprovou (Explore Performance) faz o oposto: título em grotesca de peso MÉDIO,
   corpo em serifa. O contraste entre os dois é o que dá ar editorial em vez de
   ar de apresentação corporativa.

   Daí o par:
     • GEIST para títulos, rótulos, números e botões. Grotesca neo, terminais
       retos, `a` e `g` com cauda — a mesma família de desenho da referência,
       livre e no Google Fonts.
     • SOURCE SERIF 4 para corpo, legendas e as linhas de apoio. É a mesma
       escolha já feita na /home-v2 pelo mesmo motivo: a Explore usa
       freight-text-pro, que é da Adobe, e a Source Serif é o equivalente livre
       mais próximo em desenho e em altura de x.

   PESOS. 400/500/600 são os da grade. O 700 entra por causa dos componentes
   COMPARTILHADOS que caem dentro desta árvore e não foram reescritos — o
   SiteFooter e o WorldCoverageMap ainda pedem `font-bold`. Sem o 700 carregado
   o navegador engorda o 600 sozinho, e negrito sintético em grotesca fica sujo.

   CARREGADAS AQUI, e não no layout, pelo mesmo motivo da serifa da /home-v2:
   nenhuma página real pode baixar duas famílias por causa de uma proposta.

   ONDE A GRADE NÃO FOI SEGUIDA À RISCA — três lugares, todos por medida, todos
   anotados no ponto de uso:
     1. h3 de card a 28px. Vale para título de UMA palavra (os escritórios), e
        quebra em três linhas nos pilares e nos valores, cujos títulos são
        frases inteiras em coluna de ~250px. Lá vão a 20px.
     2. Números a 48px. Dois dos quatro "números" são frases ("5 of the top 10"),
        e a coluna não comporta. Ver a conta no bloco 1b.
     3. Menu a 16px. Vale de 1280 para cima; num tablet de 1024 os oito itens
        encapsulados estouram a barra por 40px. Ver a conta na NavV2.
   ──────────────────────────────────────────────────────────────────────── */
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist-v3",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif-v3",
  display: "swap",
});

/**
 * Rótulo acima do título — régua vermelha + palavra, a 14px/1,3px da grade.
 *
 * Cópia local do <Eyebrow>, e não uma prop nova nele: o Eyebrow compartilhado
 * serve a cinco páginas no ar (Our Identity, Our Team, Our Clients, Our Impact,
 * Our Partnerships) e está cravado em 12,5px/600/2px. Mudá-lo para testar uma
 * fonte numa rota `noindex` mexeria nas cinco. Se a tipografia for aprovada, o
 * caminho é o contrário: esta vira a definição e o componente some daqui.
 */
function TypeLabel({
  children,
  onDark = false,
}: {
  children: React.ReactNode;
  /**
   * Fundo escuro — troca o vermelho da marca pelo tom claro dele.
   *
   * Existe porque #d84339 não é legível como TEXTO sobre `ink`: 2,87:1, abaixo
   * até da régua de 3:1 de texto grande, e sem conserto possível pelo fundo (a
   * conta está no `--color-brand-light`, em globals.css). O tom claro é o mesmo
   * vermelho com a luminosidade subida, e devolve 4,53:1.
   *
   * A RÉGUA MUDA JUNTO com a palavra. Elas leem como um objeto só; deixar o
   * traço no vermelho cheio e clarear apenas o texto pareceria defeito de
   * renderização, não decisão. E o traço tem o mesmo problema: 2,87:1 é
   * limítrofe até para elemento gráfico, cuja régua é 3:1.
   */
  onDark?: boolean;
}) {
  /* Classes ESCRITAS POR INTEIRO nas duas pontas, e não montadas com
     `bg-${tone}`: a Tailwind gera o CSS varrendo o código-fonte atrás de nomes
     de classe literais, então um nome concatenado em tempo de execução nunca
     chega a existir na folha de estilo. O elemento sai com a classe no HTML e
     sem regra nenhuma por trás — falha silenciosa, que só aparece olhando a
     tela. */
  return (
    <div className="mb-5 flex items-center gap-3">
      <span
        className={`inline-block h-0.5 w-9 ${onDark ? "bg-brand-light" : "bg-brand"}`}
      />
      <span
        className={`text-[14px] font-medium uppercase leading-none tracking-[1.3px] ${
          onDark ? "text-brand-light" : "text-brand"
        }`}
      >
        {children}
      </span>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const title = "About V2 (proposta) — Corporate DNA";
  return {
    title,
    description:
      "Our purpose, our promise, what we believe, and where we work.",
    // Sem `alternates`: o canonical de /our-identity é da página real.
    robots: { index: false, follow: false },
    openGraph: { title },
    twitter: { title },
  };
}
export const revalidate = 300;

/* ────────────────────────────────────────────────────────────────────────────
   Conteúdo do outline de 08-09. Tudo abaixo é transcrição — nada foi escrito
   por nós. O que está marcado HOLD no documento leva comentário no lugar.

   Estes arrays vivem na página, e não em `lib/`, de propósito: enquanto isto
   for proposta, nenhum dado que a página real usa pode mudar por causa dela.
   ──────────────────────────────────────────────────────────────────────── */

/**
 * Block 1, faixa de estatísticas. FINAL no documento, com uma ressalva: o `36`
 * aparece como `[36] countries`, entre colchetes — número pendente de
 * confirmação, junto com o "over 75 senior practitioners" do bloco de regiões.
 *
 * Não vem de `getSiteStats()`: aquelas quatro são outras (90% sponsored, 18
 * years, 36 countries, 75 faculty) e alimentam a home e a Our Impact. O
 * documento diz que estas "pull from the global fields in section 0" — uma
 * seção que não veio no anexo. Até ela chegar, ficam aqui.
 */
const STATS = [
  { value: "18 years", label: "of senior leadership advisory, since London, 2007", icon: "calendar" },
  { value: "36 countries", label: "programmes delivered, across five regions", icon: "globe" },
  { value: "1,000+", label: "leaders coached and teams developed", icon: "people" },
  { value: "5 of the top 10", label: "FTSE 100 companies are long standing clients", icon: "chart" },
];

/**
 * Os quatro ícones da faixa de números, desenhados aqui dentro.
 *
 * POR QUE INLINE, e não um pacote: o site não tem biblioteca de ícones. O único
 * jogo de SVG que existe é o das redes no rodapé e as setas soltas, cada uma
 * escrita no ponto de uso. Instalar lucide/heroicons por causa de quatro
 * desenhos numa página de PROPOSTA seria colocar uma dependência no
 * `package.json` do site inteiro para servir uma rota `noindex` que pode ser
 * descartada. Se a página for aprovada e os ícones aparecerem também nos cinco
 * valores (a referência mostra outros cinco lá), aí sim vale a conversa sobre
 * adotar um set de verdade.
 *
 * O DESENHO segue a referência: contorno, sem preenchimento, canto e junta
 * arredondados, traço de 1,5 num quadro de 24. `stroke="currentColor"` para a
 * cor vir do `text-brand` do container e não ficar cravada aqui — é assim que
 * um `hover` ou uma versão em fundo claro continuam funcionando sem tocar no
 * path. `aria-hidden`: o ícone repete o que o número ao lado já diz.
 */
function StatIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
    /* O meridiano é um <ellipse> e não um <path> curvo escrito à mão. A
       primeira versão tentava desenhar a elipse com dois arcos em `d` e saía
       uma amêndoa torta — arco de Bézier com raios desiguais é fácil de errar
       e impossível de conferir lendo o atributo. `rx`/`ry` diz a mesma coisa
       sem margem para erro. */
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="3.8" ry="9" />
        <path d="M3.2 9h17.6M3.2 15h17.6" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.2 20a5.8 5.8 0 0 1 11.6 0" />
        <circle cx="17" cy="7" r="2.4" />
        <path d="M16.2 12.4a5 5 0 0 1 4.6 5" />
      </>
    ),
    chart: (
      <>
        <path d="M3.5 20.5h17" />
        <path d="M7 20.5V14M12 20.5V9.5M17 20.5V5" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[26px] w-[26px]"
    >
      {paths[name]}
    </svg>
  );
}

/** Block 2, os quatro pilares. FINAL. */
const PILLARS = [
  {
    heading: "We invest in Identity beyond role.",
    body: "When leaders shift Identity (Who am I), they accelerate skills faster.",
  },
  {
    heading: "We lead with care and candour.",
    body: "We empower leaders by balancing compassion and action.",
  },
  {
    heading: "We tackle root causes, not symptoms.",
    body: "We achieve success through robust discovery and laser focus.",
  },
  {
    heading: "We earn the right as your trusted ally.",
    body: "By Keeping It Real, we develop Talent and build relationships.",
  },
];

/**
 * Block 5, os cinco valores. Os corpos são FINAL; o documento diz que três dos
 * cinco NOMES estão em HOLD ("shown in brackets, pending confirmation") e pede
 * que os nomes sejam campos de CMS para trocar sem deploy. O documento não
 * marca quais três — a tabela dele traz os cinco sem colchete. Ficam como
 * escritos, e viram campo de CMS quando a página real for montada.
 */
const VALUES = [
  {
    name: "Creative Flow",
    body: "Our creativity lives in the big ideas and equally in the details and frameworks that hold them together. Execution should feel like flow.",
  },
  {
    name: "Bold Humility",
    body: "Boldness lives in duality with humility. Bold enough to move people beyond their comfort zones, humble enough to be sustainable. Confident, never arrogant.",
  },
  {
    name: "Relationship Centricity",
    body: "We believe in mutually empowered relationships where we learn from each other. Clients should always feel us as deeply invested in their present and their future.",
  },
  {
    name: "Real Results",
    body: "Our relentless quest for excellence is anchored in real issues and real results: engagement up, performance up, collaboration up.",
  },
  {
    name: "Trust & Truth",
    body: "Trust and truth live in one cycle. We help our clients with the hard right rather than the easy wrong, and hold ourselves accountable for breakthrough results.",
  },
];

/**
 * Block 6, os escritórios — endereço, telefone e e-mail como o documento pede.
 *
 * ⚠️ Local de propósito, e NÃO `lib/offices.ts`. Três destes registros
 * divergem do que está no ar hoje:
 *   • Singapore: o documento traz "1 Raffles Place, Level 24, Tower 1, 048616"
 *     e +65 6408 0636; o site serve "The Great Room, Afro Asia, 63 Robinson
 *     Road, Level 8, 068894" e +65 6995 2480. São endereços diferentes.
 *   • Dubai: o documento dá um telefone (+971 58 141 2901) e, duas linhas
 *     abaixo, diz que Dubai "has no contact details published anywhere".
 *   • Miami: o documento não traz telefone; o site publica +1 305-374-4611.
 * Escrever isso em `lib/offices.ts` mudaria a home e a Our Team sem ninguém ter
 * confirmado qual versão está certa. Fica aqui até o cliente decidir.
 */
const OFFICES = [
  {
    city: "London",
    address: ["60 St Martin’s Lane, Covent Garden", "London WC2N 4JS"],
    tel: "+44 20 3755 5329",
    email: "london@corporatednaconsulting.com",
  },
  {
    city: "Singapore",
    address: ["1 Raffles Place, Level 24", "Tower 1, Singapore 048616"],
    tel: "+65 6408 0636",
    email: "singapore@corporatednaconsulting.com",
  },
  {
    city: "Dubai",
    address: ["Sheikh Rashid Tower, 4th Floor", "Dubai World Trade Centre, Dubai"],
    tel: "+971 58 141 2901",
    email: "dubai@corporatednaconsulting.com",
  },
  {
    city: "Riyadh",
    address: [
      "2888 King Fahd Road, Saudi Journalists",
      "Association Building, 2nd Floor, Al Sahafah",
      "Dist. 13671, Riyadh 13321, RASA6101",
    ],
    tel: null,
    email: "riyadh@corporatednaconsulting.com",
  },
  {
    city: "Miami",
    address: ["1221 Brickell Ave, Suite 900", "Miami, FL 33131"],
    tel: null,
    email: "miami@corporatednaconsulting.com",
  },
];

/**
 * Block 6, as cinco regiões. Os NOMES são FINAL; os descritores são HOLD ("one
 * line descriptor per region, max 120 characters"). Os textos abaixo são os que
 * aparecem na própria imagem da Maliha — placeholder do cliente, não copy nossa
 * — e devem virar campo de CMS.
 */
const REGIONS = [
  { name: "Americas", descriptor: "Driving leadership impact across North and South America." },
  { name: "UK & Europe", descriptor: "Partnering with organisations to build resilient leaders across Europe." },
  { name: "GCC & Middle East", descriptor: "Supporting transformation across the GCC and wider Middle East." },
  { name: "Asia", descriptor: "Developing leaders for a fast-changing Asia." },
  { name: "India", descriptor: "Enabling people and organisations to realise their potential." },
];

export default async function AboutV2Page() {
  const nav = await buildSiteNav();
  return (
    /* SEM <SiteShell> — e essa é a razão de o shell estar montado à mão aqui.
       O SiteShell embute a NavV1: barra vermelha, `sticky`, ocupando 76px do
       fluxo. O pedido de 08-09 foi o menu SEM FUNDO sobre o herói, como na
       /home-v2, e isso é a NavV2: `absolute`, transparente, flutuando sobre a
       primeira dobra. Não dá para pedir isso ao SiteShell sem mudar o shell de
       todas as páginas do site.

       `relative` no wrapper porque a NavV2 é `absolute`: sem um ancestral
       posicionado ela se prenderia ao documento inteiro, não a esta árvore.

       `maxWidthClass` em 1440 para a barra correr na mesma margem do conteúdo,
       que também subiu para 1440.

       AS FONTES SÃO TROCADAS AQUI, numa linha, e não classe por classe.
       `font-sans` na Tailwind v4 resolve `var(--font-sans)`; redeclarar essa
       variável NESTE elemento faz a própria classe pegar a Geist, e a família
       herda para a árvore inteira — inclusive para a NavV2, o SiteFooter e o
       mapa, que continuam sem saber que existe fonte nova. O mesmo vale para
       `--font-serif`: quem escrever `font-serif` daqui para baixo recebe a
       Source Serif 4, e as aspas vermelhas dos dois blocos de citação, que já
       usavam `font-serif` genérica, ganham a serifa de verdade de graça.

       As duas variáveis do next/font (`--font-geist-v3`, `--font-serif-v3`)
       entram pelo `className`; elas só publicam os `@font-face`. */
    <div
      className={`${geist.variable} ${serif.variable} relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white font-sans`}
      style={
        {
          "--font-sans": "var(--font-geist-v3), system-ui, sans-serif",
          "--font-serif": "var(--font-serif-v3), Georgia, serif",
        } as React.CSSProperties
      }
    >
      <NavV2 items={nav} maxWidthClass="max-w-[1440px]" outlined />
      <main className="flex-1">
      <JsonLd
        data={breadcrumbLd([{ name: "About", path: "/about-v2" }])}
      />

      {/* ── Primeira dobra · Breadcrumb + Block 1 (hero) + Block 1b (números)
          ───────────────────────────────────────────────────────────────
          UMA seção só, de tela cheia, pedido em 08-09: "a hero e a parte com os
          números ocupando 100vh". Os três pedaços já eram `bg-ink` e liam como
          uma faixa escura só; agora são de fato um bloco, com a foto atrás dos
          três e o espaço livre distribuído entre eles — breadcrumb no topo, o
          título no meio, os números na base.

          ALTURA: `min-h-svh` (100svh CHEIOS) com `pt-[76px]`.
            • Era `calc(100svh-76px)` enquanto o menu era a NavV1 `sticky`, que
              OCUPA lugar no fluxo: descontar a barra era o que impedia a faixa
              dos números de cair abaixo da dobra. Com a NavV2, que é `absolute`
              e flutua POR CIMA, não há nada a descontar — se o desconto tivesse
              ficado, sobrariam 76px de branco no fim da dobra.
            • O `pt-[76px]` substitui o desconto: ele não muda a altura total
              (a caixa é `border-box`), só impede que o eyebrow nasça debaixo do
              menu flutuante.
            • `svh` e não `vh` porque no telefone `100vh` conta a tela COM a
              barra de endereço retraída: a base do bloco fica escondida atrás
              do navegador até o usuário rolar.
          É `min-h`, não `h`: no telefone os quatro números empilham em quatro
          linhas e não cabem em uma tela — aí o bloco cresce e rola, em vez de
          cortar conteúdo.

          A ARTE é a que a Maliha mandou em 08-09 (`public/about-hero.jpeg`): o
          skyline montado — Big Ben, Marina Bay, Burj Khalifa, Kingdom Centre —
          com a hélice de DNA atravessando o céu. Ela é a imagem definitiva da
          seção, não mais o placeholder da home V2. Duas ressalvas de arquivo
          estão anotadas no <Image> logo abaixo. */}
      <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink pt-[76px] text-white">
        {/* ⚠️ O ARQUIVO É PEQUENO E QUASE QUADRADO: 1373x1145 (1,2:1), 229 KB,
            e veio pelo WhatsApp, que recomprime. Duas consequências:

            1. LARGURA. A dobra pede algo em torno de 1920px. Em telas de até
               1440 o upscale é 1,05x e não aparece; num monitor de 1920 é 1,4x e
               num 2560 é 1,86x, aí a imagem amolece. O escurecimento perdoa
               muito disso (é arte escura, monocromática e granulada), mas o
               conserto de verdade é pedir o original à Maliha — o que veio é a
               cópia que o WhatsApp gerou, não o arquivo dela.

            2. PROPORÇÃO. É 1,2:1, quase quadrada, contra uma dobra de ~1,9:1.
               Essa diferença é o motivo de a imagem NÃO ser de sangria total —
               ver a caixa logo abaixo. */}

        {/* A IMAGEM NÃO OCUPA A LARGURA TODA: ela vive numa caixa de 72% presa
            à DIREITA, e os 28% da esquerda são `ink` puro, sem imagem nenhuma
            por baixo. Isso responde aos dois pedidos de 08-09 sobre a
            referência, e o motivo de não dar para resolver com `object-position`
            merece ficar escrito, porque é contraintuitivo:

              Com `fill` + `object-cover` de sangria total, a imagem é escalada
              PELA LARGURA (o arquivo é mais "gordo" que a caixa). Aí não sobra
              folga horizontal nenhuma — o corte é 100% vertical, e mexer no eixo
              X do `object-position` não move absolutamente nada no desktop. Foi
              o que travou a primeira tentativa de descentralizar a torre.

            Encolhendo a caixa para 72% os dois problemas caem juntos:

            • "DÁ PRA VER BEM MAIS O DNA". A caixa fica menos alongada (1,4:1 em
              vez de 1,9:1 numa tela de 1600), então o `object-cover` corta bem
              menos altura: aparecem ~86% da imagem contra os ~62% de antes. A
              hélice inteira e o skyline inteiro entram no quadro.
            • "A TORRE NÃO FICA TÃO CENTRALIZADA". O Burj está a ~51% da largura
              do arquivo; com a caixa começando em 28% da tela, ele cai em
              28 + 0,72x0,51 = ~65% da largura da dobra, à direita do centro,
              como na referência.

            NO TELEFONE A CAIXA É OUTRA — refeito em 09-09, quando o pedido foi
            "a torre bem centralizada e mais pra baixo pra não atrapalhar a
            leitura". A caixa antiga era `inset-y-0 w-full`: sangria total, foto
            atrás de tudo, e o "mais pra baixo" era impossível de atender.

            POR QUE ERA IMPOSSÍVEL, e vale escrever porque é o espelho exato da
            armadilha que já está documentada acima para o desktop. Numa tela de
            390x1100 a caixa tem proporção 0,35:1 contra 1,2:1 do arquivo, então
            o `object-cover` escala PELA ALTURA: a imagem sai com 1321px de
            largura dentro de uma caixa de 390px. São 931px de folga horizontal e
            ZERO de folga vertical — o corte é 100% horizontal, e mexer no eixo Y
            do `object-position` não move nada. No desktop é ao contrário. Em
            ambos os casos a saída não é o `object-position`: é mudar a caixa.

            A caixa nova ocupa os 64% DE BAIXO da dobra (`inset-x-0 bottom-0
            h-[64%]`), e é ela que resolve as duas metades do pedido de uma vez:

            • "MAIS PRA BAIXO": a foto simplesmente começa depois do texto. O
              título, o rótulo e a linha de apoio passam a viver sobre `ink`
              limpo, sem nada por baixo — que é a leitura mais confortável que
              existe, e não custa nenhum escurecimento.
            • "BEM CENTRALIZADA": com a caixa mais baixa (390x705, proporção
              0,55:1) a escala ainda é pela altura, então o eixo X continua sendo
              o que manda — e agora ele pode ir para `50%`, centralizando a
              torre, porque não há mais texto disputando aquele espaço. Era o
              `62%` que a empurrava para o lado, e ele existia justamente para
              fugir do texto.

            A foto continua inteira e visível: ela ganhou dois terços da dobra
            só para si, em vez de ficar atrás de tudo com o texto por cima. */}
        <div className="absolute inset-x-0 bottom-0 -z-10 h-[64%] w-full md:inset-y-0 md:left-auto md:right-0 md:h-auto md:w-[72%]">
          <Image
            src={heroPhoto}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* O TRATAMENTO, refeito em 08-09 contra a referência que o cliente
            mandou (`docs/rhea-feedback/hero-about.png`): "dava pra ver mais da
            imagem e ela aparecer mais na direita".

            A versão anterior era uma camada chapada de `ink/75` sobre tudo. Isso
            atendia o contraste do texto e destruía a arte junto: a hélice, que é
            o motivo de a imagem existir, virava um chiado cinza. A referência
            faz o contrário — a metade direita é a foto LIMPA, com o branco da
            hélice e as nuvens em contraste cheio, e o texto mora num campo
            escuro à esquerda para onde a foto se dissolve.

            Daí as duas camadas serem DIRECIONAIS, e não chapadas:

            1. LAVADO LATERAL. Ele tem uma função a mais desde que a imagem
               passou a viver numa caixa de 72%: ESCONDER A EMENDA. A borda
               esquerda da caixa é um corte reto em 28% da largura, e sem nada
               por cima ela apareceria como uma linha vertical atravessando a
               dobra. Por isso o gradiente fica opaco até passar dos 28% e só
               então abre, morrendo a 60% — o olho lê "a foto se dissolve no
               escuro", que é o que a referência faz, e não "tem uma imagem
               colada ali". Da metade para a direita não há camada nenhuma, então
               o skyline e a hélice ficam com o contraste original do arquivo.
               O preço é o Big Ben, que fica no primeiro terço do arquivo e some;
               a referência faz a mesma escolha, e é ela que manda.
            2. FECHO DA BASE. Necessário porque os números atravessam a largura
               inteira, inclusive a parte clara: "1,000+" e "5 of the top 10"
               caem justamente sobre os arranha-céus iluminados. O gradiente sobe
               pela metade de baixo e chega opaco na borda, então os números
               ficam sobre `ink` sólido. Isso não briga com a referência — nela a
               orla também é escura.

            Não há mais camada chapada: as duas direcionais já se cruzam na
            esquerda e somam o suficiente para o texto.

            ⚠️ O LAVADO LATERAL É SÓ DE `md` PARA CIMA desde 09-09. Ele descreve
            uma composição horizontal — escuro à esquerda, foto à direita — e no
            telefone a composição virou VERTICAL: texto em cima, foto embaixo.
            Aplicado ali ele fazia o oposto do que devia: deixava a coluna
            esquerda opaca e o lado direito da tela com a foto crua bem debaixo
            do título, que é exatamente a queixa de leitura de 09-09. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 hidden md:block"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(55,50,52) 0%, rgb(55,50,52) 28%, rgba(55,50,52,.82) 36%, rgba(55,50,52,.5) 45%, rgba(55,50,52,.2) 53%, rgba(55,50,52,0) 60%)",
          }}
        />
        {/* EMENDA DA FOTO NO TELEFONE. A caixa da imagem começa num corte reto a
            36% da altura; sem nada por cima, essa borda apareceria como uma
            linha horizontal atravessando a dobra — o mesmo defeito que o lavado
            lateral resolve no desktop, girado 90°. O gradiente cobre exatamente
            a caixa da foto e vai de `ink` opaco no topo dela a transparente aos
            34%, então o olho lê "a foto emerge do escuro" em vez de "tem uma
            imagem colada ali". */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-[64%] md:hidden"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgb(55,50,52) 0%, rgba(55,50,52,.72) 14%, rgba(55,50,52,.28) 26%, rgba(55,50,52,0) 34%)",
          }}
        />
        {/* FECHO DA BASE. No telefone ele sobe mais (`h-[58%]` contra metade da
            dobra) porque os números agora ocupam duas linhas em vez de quatro,
            mas cada linha é mais larga: as quatro células atravessam a faixa
            inteira, inclusive a parte onde a torre é clara. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-[58%] md:h-1/2"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgb(55,50,52) 0%, rgba(55,50,52,.96) 22%, rgba(55,50,52,.72) 48%, rgba(55,50,52,.3) 76%, rgba(55,50,52,0) 100%)",
          }}
        />

        {/* ⚠️ O BREADCRUMB VISÍVEL SAIU em 08-09, a pedido. Vale registrar que
            isso CONTRARIA o outline da Maliha, que pede em letra: "Breadcrumb at
            the top of the page: Home / About" (bloco 3). Foi decisão posterior
            ao documento, então ganha dele — mas quando a página for revisada com
            o cliente é bom saber que a ausência é deliberada, e não esquecimento.

            O `breadcrumbLd` no topo do componente FICOU. Ele é dado estruturado
            invisível, descreve a posição da página na hierarquia do site e não
            depende de haver uma trilha desenhada na tela. Como a rota é
            `noindex` e está fora do sitemap, hoje ele não faz diferença nenhuma;
            se esta página virar a /about de verdade, aí sim vale decidir se
            mantém o dado sem a trilha visível. */}
        {/* O título. Escrito aqui, e não com <PageHero>, porque o PageHero é uma
            <section> com `bg-ink` OPACO próprio: dentro deste bloco ele taparia
            a foto e a imagem viraria uma tarja no meio da tela, em vez de fundo
            da dobra inteira. As classes abaixo são as do PageHero não-compacto,
            copiadas, para o herói continuar idêntico ao das outras páginas
            internas. Se um dia isto virar a /about de verdade, o caminho é dar
            ao PageHero uma variante de tela cheia — não mexer nele agora, que a
            página real depende dele. */}
        {/* NO TELEFONE O TÍTULO ENCOSTA NO TOPO; no desktop ele continua
            centrado no espaço que sobra.

            O `items-center` sozinho distribui a folga em partes iguais acima e
            abaixo, e no telefone isso rendia 183px de vazio entre a base do menu
            e o rótulo — medido em 393x852, com outros 183px espelhados embaixo.
            O que funciona no desktop, onde a dobra é larga e o título ocupa uma
            linha só, vira um buraco numa tela estreita: o visitante abre a
            página e a primeira coisa que vê é o nada entre o logo e o texto.

            `items-start` no telefone tira a metade de cima da folga e joga tudo
            para baixo, onde ela não é buraco nenhum — é justamente onde a foto
            começa (307px). O bloco passa a ler como texto em cima, foto no meio,
            números embaixo, que era a composição pretendida quando a imagem
            desceu para os 64% de baixo.

            O `pt-16` no lugar do `py-12` é o "pode ter espaço, mas não tanto":
            64px abaixo do menu em vez dos 183px de antes, e em vez dos 48px que
            o padding original entregaria sozinho, que colariam demais. */}
        <div className="flex flex-1 items-start md:items-center">
          <div className="mx-auto w-full max-w-[1440px] px-6 pb-12 pt-16 md:px-10 md:py-16">
            <TypeLabel onDark>About</TypeLabel>
            {/* h1 — Geist 500 a 52px, entrelinha 1,1, como a grade pede.
                Duas coisas mudaram além da família:

                O PESO CAIU DE 700 PARA 500, e é ele que responde ao
                "quadrado demais". A 60px, a Poppins 700 é uma parede de hastes
                da mesma espessura das contraformas; o mesmo texto em Geist 500
                devolve o branco de dentro das letras. É a diferença que a
                referência tem e esta página não tinha.

                O TAMANHO CAIU DE 60px PARA 52px. Parece contramão — mas o peso
                menor pede menos corpo para ocupar a mesma presença, e 52px é o
                que a grade fixa. Se ficar tímido na tela grande, o número a
                mexer é este, sozinho.

                O PESO É 600, E NÃO OS 500 DA GRADE — medido contra a própria
                referência em 09-09, depois de a comparação ser levantada. O h1
                da Explore é 52px / peso 500 / entrelinha 1,1 / `letter-spacing:
                normal`: os mesmos números que a grade traz. Mesmo assim o deles
                lê muito mais forte, por três motivos que o número não carrega:

                  • A FONTE DELES NÃO É ESTA. Eles usam Platform Web, cujo 500 é
                    um médio cheio; o 500 da Geist é bem mais leve. Peso é uma
                    escala relativa a cada família, não uma medida absoluta —
                    copiar o "500" copia o rótulo, não a mancha. O 600 da Geist
                    é o que chega perto do 500 da Platform.
                  • BRANCO SOBRE ESCURO AFINA. Os dois heróis são texto branco
                    sobre foto, e nessa combinação a letra parece mais fina do
                    que é. Um degrau de peso compensa; no h2, que é escuro sobre
                    branco, o 500 fica.
                  • O TÍTULO DELES OCUPA A DOBRA. São 103 caracteres em três
                    linhas de 952px; o nosso é "Keeping Leadership Real.", uma
                    linha curta. Metade do "parece maior" é área ocupada, não
                    corpo de letra, e isso é decisão de COPY — se a Rhea quiser
                    a mesma presença, o caminho é um título mais longo, não uma
                    fonte maior.

                O `tracking` também acompanha a referência: `normal` lá, e aqui
                −0,2px em vez dos −0,8px da primeira tentativa. Fechar o
                espacejamento encolhe a linha e trabalha contra a presença que a
                comparação está pedindo. */}
            <h1 className="max-w-[900px] text-[36px] font-semibold leading-[1.1] tracking-[-0.2px] text-white [text-wrap:balance] sm:text-[44px] md:text-[52px]">
              Keeping Leadership Real.
            </h1>
            {/* A QUEBRA É MANUAL, e por isso são dois <span> em vez de uma
                frase só com `max-width` deixando o navegador decidir: o pedido
                de 08-09 foi por um ponto de quebra específico ("Our purpose, our
                promise" / "what we believe, and where we work"), e largura
                máxima não garante ponto nenhum — ela muda com a fonte carregada,
                com o zoom e com o tamanho da tela.

                `md:block` e não `block`: no telefone a segunda metade sozinha já
                ocupa duas linhas, e forçar a quebra ali criaria três linhas com
                a primeira quase vazia. Abaixo de `md` os spans ficam em linha e
                o texto reflui normalmente. */}
            {/* Linha de apoio — Source Serif 4 400 a 22px, entrelinha 1,4. É a
                primeira aparição da serifa na página, e ela vem colada no
                título de propósito: o par "grotesca em cima, serifa embaixo" é
                o device inteiro. Se a serifa só aparecesse lá embaixo no corpo,
                o contraste chegaria tarde demais para ser lido como escolha. */}
            <p className="mt-5 max-w-[620px] font-serif text-[19px] leading-[1.4] text-white/75 md:text-[22px]">
              <span className="md:block">Our purpose, our promise,</span>{" "}
              <span className="md:block">what we believe, and where we work</span>
            </p>
          </div>
        </div>

        {/* Block 1b · Estatísticas, refeito em 08-09 contra
            `docs/rhea-feedback/about-pagina-inteira.jpeg`. Três mudanças, e as
            três vieram da referência:

            1. ÍCONE no lugar da régua vermelha. A faixa da home e da Our Impact
               abre cada número com um traço de 3px; a referência põe um ícone de
               contorno vermelho. Aqui ganha a referência — ver StatIcon, no topo
               do arquivo, para o porquê de serem desenhados à mão.
            2. DIVISÓRIA vertical entre os itens.
            3. O NÚMERO NÃO PODE QUEBRAR em duas linhas. "36 countries" e "5 of
               the top 10" quebravam, e uma coluna com título de duas linhas
               desalinha a linha de rótulo de todas as outras.

            A CONTA, porque o conserto NÃO é só `whitespace-nowrap`. Sozinho ele
            troca um defeito por outro pior: em vez de quebrar em duas linhas, o
            número TRANSBORDA a coluna e invade a vizinha. Foi o que aconteceu na
            primeira tentativa, e só apareceu porque foi medido.

            ⚠️ REFEITA EM 09-09 PARA A GEIST. Os números abaixo NÃO são os da
            versão em Poppins — trocar de família invalida uma medida de largura,
            e a diferença aqui não é pequena: no peso 600, com o espacejamento de
            −0,5px que a Geist pede (a Poppins levava −1,2px), a string mais
            longa passou de 6,47em para 6,92em. A fonte "mais estreita" acabou
            ocupando MAIS lugar, porque o aperto do espacejamento saiu junto.

            Tudo gira em torno de "5 of the top 10", o mais longo dos quatro:
            6,918em, medido no canvas com a fonte real já carregada. As colunas
            que recebem divisória perdem mais 40px para o `pl-10`, e são elas que
            apertam. Larguras úteis medidas na página, e o teto de corpo que cada
            uma comporta:

              1280px (4 col) → coluna de 229px. Teto 34px. É o caso mais apertado
                               da página inteira.
              1440px+ (4 col)→ coluna de 269px. Teto 39px. Não cresce mais: o
                               container trava em 1440, então 1920 é igual a 1440.
              1024px (2 col) → coluna de 411px. Teto 60px. Aqui sobra.
               768px (2 col) → coluna de 283px. Teto 41px.
               640px (2 col) → coluna de 235px. Teto 34px — a segunda pior.
               390px (1 col) → coluna de 342px. Teto 50px.

            Daí o `36 → 32 → 38 → 44 → 32 → 38` parecer errado de tão vai-e-volta,
            e não ser: o tamanho segue a LARGURA DA COLUNA, e a coluna não cresce
            junto com a tela — ela despenca toda vez que a grade ganha uma coluna
            nova (em `sm` e em `xl`) e volta a crescer entre um salto e outro.

            O corte do topo é `2xl` (1536) e não 1440, embora a coluna já esteja
            no tamanho final aos 1440: a Tailwind emite os variantes arbitrários
            (`min-[1440px]:`) ANTES dos nomeados, então `xl:` ganharia dele no
            cascade e o degrau simplesmente não aconteceria. Entre 1440 e 1535 os
            números ficam 6px menores do que caberiam. É o preço de não escrever
            um `!important` para vencer uma regra de ordenação.

            ⚠️ OS "48px+" DA GRADE NÃO CABEM AQUI, e não é questão de ajuste
            fino: o teto do caso apertado é 34px. Dois dos quatro "números" são
            frases inteiras — "5 of the top 10" e "36 countries" —, e frase não
            escala como número. As duas saídas de verdade são de LAYOUT ou de
            CONTEÚDO, não de tipografia: duas colunas em vez de quatro (a faixa
            dobra de altura), ou separar o número da unidade ("5" grande, "of the
            top 10" pequeno embaixo), que é como faixas de estatística
            costumam resolver isso — e muda o que o outline da Maliha escreveu.

            O `whitespace-nowrap` fica como trava final: se alguém editar um
            número para algo mais longo, ele transborda de forma visível na
            revisão em vez de quebrar em silêncio. */}
        {/* ⚠️ A FAIXA ENCOLHEU EM 09-09, e a razão é uma medida de proporção da
            dobra, não gosto. Medido em 1440x900, que é o notebook comum:

              bloco da mensagem (rótulo + título + linha de apoio) → 172px, 19%
              faixa de números                                      → 218px, 24%
              vazio entre os dois                                   → 217px, 24%

            Ou seja: a PROVA ocupava mais da primeira tela do que a MENSAGEM. E o
            desequilíbrio era maior do que os números sozinhos dizem, porque a
            faixa trazia quatro ícones vermelhos de 36px lado a lado — vermelho
            saturado é o maior ímã de atenção da página, e havia quatro deles
            embaixo contra um título branco de uma linha em cima. A primeira
            fixação tinha boa chance de cair nos números, e não na frase que a
            página existe para dizer.

            Faixa de números na dobra é padrão bom e fica: ela é prova social e
            trabalha a favor de quem chega pela primeira vez. O que muda é o
            POSTO dela — de bloco co-titular para rodapé da dobra:

              ícone   36px → 26px (e some no telefone, onde não sobra espaço)
              número  38px → 30px em desktop
              respiro pb-20 → pb-12

            São ~90px devolvidos à mensagem numa tela de 900px. O título não
            cresceu; o que cresceu foi a diferença entre ele e o resto, que é o
            que hierarquia quer dizer.

            NÃO MEXI NO VAZIO DE 217px porque ele é consequência do `min-h-svh`
            com o título centrado em `flex-1`: ele existe para a dobra ter ar. Se
            depois de ver isto no ar você quiser a mensagem mais alta na tela, o
            ajuste é trocar o `items-center` do bloco do título por algo tipo
            `justify-end` com padding — mas aí é escolha de composição, e prefiro
            que seja vista antes de ser feita.

            ⚠️ FALTA UMA AÇÃO NA DOBRA. Não há CTA nenhum aqui: o visitante lê o
            título, lê a linha de apoio, vê os números e não tem para onde ir a
            não ser rolar. Isso não é ajuste de tamanho, é conteúdo — anotado
            para a conversa com o cliente, não resolvido aqui. */}
        <div className="mx-auto w-full max-w-[1440px] px-6 pb-10 md:px-10 md:pb-12">
          {/* DUAS COLUNAS JÁ NO TELEFONE (pedido de 09-09: "duas linhas com 2
              quadrados menores, ao invés de cada quadrado ocupar a largura toda
              da tela"). Em 390px cada célula fica com 161px úteis — o `gap-x`
              cai de 40px para 20px justamente para não comer mais que isso.

              O preço está no corpo do número: 161px comportam no máximo 24px
              para "5 of the top 10", contra os 36px que ele tinha ocupando a
              largura inteira. É a troca que o pedido implica — quatro blocos
              empilhados não cabiam na dobra de jeito nenhum (a seção media
              1102px numa tela de 844px, e o quarto número ficava fora). */}
          <Reveal className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-10 sm:gap-y-10 xl:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                /* A divisória mora no ITEM, não no container, porque precisa
                   sumir em quem abre cada linha da grade — e "primeiro da
                   linha" muda com o breakpoint, coisa que `divide-x` não sabe
                   fazer. Com quatro itens fixos dá para resolver pelo índice:
                     • 2 colunas (sm+): borda nos ímpares, que são a coluna da
                       direita;
                     • 4 colunas (xl+): borda em todos menos o primeiro.
                   No telefone são duas colunas mas SEM divisória: os 40px de
                   `pl` que ela pede não existem em 161px de célula. */
                className={[
                  i % 2 === 1 ? "sm:border-l sm:border-white/15 sm:pl-10" : "",
                  i > 0 ? "xl:border-l xl:border-white/15 xl:pl-10" : "",
                ].join(" ")}
              >
                {/* O ícone SOME NO TELEFONE. Em duas colunas de 161px ele custa
                    26px de altura por célula, vezes duas linhas, numa dobra que
                    já estava estourando — e é o elemento com menos informação
                    dos três (o número e o rótulo dizem tudo). `text-brand-light`
                    e não `text-brand` pelo mesmo motivo do rótulo do herói: o
                    vermelho cheio sobre `ink` dá 2,87:1, abaixo até da régua de
                    3:1 que vale para elemento gráfico. */}
                <span className="mb-3 hidden text-brand-light sm:block">
                  <StatIcon name={s.icon} />
                </span>
                {/* Geist 600. A grade pede "48px+" para número grande; os
                    tamanhos abaixo são MEDIDOS, não escolhidos — ver o
                    comentário da faixa, logo acima. O `tracking` sai do −1,2px
                    que a Poppins pedia: no peso 600 da Geist ele fecharia o
                    "1,000+" em cima da vírgula. */}
                <div className="whitespace-nowrap text-[18px] font-semibold leading-none tracking-[-0.5px] text-white min-[360px]:text-[21px] sm:text-[30px] md:text-[34px] lg:text-[40px] xl:text-[28px] 2xl:text-[30px]">
                  <Counter value={s.value} />
                </div>
                {/* Legenda — Source Serif 4 400 a 14px, a linha "texto pequeno"
                    da grade. Serifa clara sobre fundo escuro é o caso em que
                    ela mais afina, então a opacidade sobe de 70% para 75%: o
                    desenho da Source Serif tem hastes finas que a 14px em
                    branco/70 começam a sumir contra a foto. */}
                <div className="mt-2 max-w-[240px] font-serif text-[13px] leading-[1.45] text-white/75 sm:mt-3 sm:text-[14px] sm:leading-[1.5]">
                  {s.label}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Block 2 · Our Identity ────────────────────────────────────
          "Two column. Photograph left, quote right. Four pillar cards in a row
          beneath, full width." (outline)

          REDESENHADO em 08-09 sobre a referência da Explore Performance que a
          Rhea aprovou (`docs/rhea-feedback/about-explore.png`): fundo BRANCO,
          foto ocupando a altura inteira da faixa, texto na outra metade. A
          Explore põe o texto à esquerda e a foto à direita; aqui é espelhado —
          foto à esquerda —, que é o lado que o outline da Maliha pede e o que a
          imagem de página inteira dela mostra.

          A FOTO NÃO SANGRA. Em 08-09 ela ia até a borda da janela, como na
          Explore. Em 09-09 o cliente pediu o contrário: ela fica CONTIDA no
          mesmo `max-w-[1440px]` de todos os outros blocos, inclusive em telas
          maiores que isso. Daí o container em volta da grade — era o único
          `mx-auto max-w-[1440px] px-6 md:px-10` que faltava na página, e é ele
          que faz a borda esquerda da foto cair na mesma linha vertical do logo,
          do título do hero e dos quatro números.

          O respiro entre as colunas passou a ser `lg:gap-14` na grade. Antes
          vinha do `lg:px-14` da coluna de texto, que agora não pode existir: com
          o container por fora, padding horizontal na coluna somaria ao dele e a
          citação terminaria ~96px antes da margem em vez de alinhar com ela.

          A PROPORÇÃO É PAISAGEM E ESTÁ TRAVADA, desde 09-09. O outline é
          explícito no slot de imagem: "Image: the CDNA team group photograph
          supplied with the slide. Landscape crop, no treatment."

          Antes daqui a foto não tinha `aspect`: era uma coluna da grade e quem
          definia a altura era o TEXTO ao lado, porque duas células de uma grade
          se esticam para a mais alta. O efeito colateral é que a proporção
          mudava com a largura da tela — 1,40:1 em 1920 (paisagem, por acaso) e
          1,16:1 em 1280, quase quadrada. "Paisagem" virava uma coisa que
          dependia do navegador de quem abre.

          `aspect-[3/2]` resolve: é a paisagem fotográfica padrão, a que sai de
          qualquer câmera sem recorte, então é a que o cliente consegue mandar
          sem trabalho. Não está no outline — ele diz só "landscape" —, é
          escolha nossa dentro do que ele pede, e trocar por 16/9 é uma linha.

          `self-center` porque a foto agora é MAIS BAIXA que a coluna de texto
          (435px contra ~466px em 1440). Sem ele a grade estica a célula e o
          `aspect` não vale de nada; com ele a foto fica centrada na altura da
          citação, que é onde o olho espera.

          Some com isto o `min-h-[360px]`, que existia só para a coluna não
          colapsar quando empilhada. Com proporção fixa ela tem altura própria
          em qualquer largura, e no telefone dá 218px de altura, que é o que uma
          foto de grupo em paisagem pede.

          OS QUATRO PILARES ficaram FORA do split, em faixa própria de largura
          cheia, como o outline manda ("in a row beneath, full width"). Para os
          pilares descerem para dentro do split eles teriam de ir para a coluna
          da direita, em 2x2 — o que contraria o outline e espreme quatro textos
          em meia largura. Fica como está até alguém pedir o contrário. */}
      <section id="identity" className="bg-white text-ink">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-14">
            {/* ⚠️ A FOTO DO TIME AINDA NÃO EXISTE, e ela não é uma foto a tirar:
                é a que já está no "approved Our Identity slide", um slide do
                `CDNA Overview Deck Final 22 Jan 2026.pdf`. O outline diz
                "supplied with the slide" porque, do lado da CDNA, ela já foi
                entregue — só não chegou até nós. O deck foi lido para escrever
                a avaliação de 11-07 (`docs/analise.txt`, que o cita pelo nome),
                mas o arquivo não está no repositório nem é anexo de nenhum dos
                `.eml` arquivados. Pedido em 09-09.

                Não há substituto: as 25 fotos de `public/dna-time` são de
                eventos e de turmas de programa, não do time da CDNA, e passar
                uma delas por foto do time seria dizer algo falso na página.

                O placeholder fica no TAMANHO E NA PROPORÇÃO reais, o que serve
                de amostra do recorte a pedir — paisagem 3:2, sem tratamento. */}
            <div className="relative aspect-[3/2] self-center">
              <ImagePlaceholder
                className="absolute inset-0 h-full w-full"
                label="CDNA team photograph"
              />
            </div>

            <div className="flex items-center py-16 md:py-20">
              <div className="w-full max-w-[680px]">
                <TypeLabel>Keeping Leadership Real</TypeLabel>
                {/* AS ASPAS FICAM AO LADO DO TEXTO, não por cima dele — corrigido
                    em 08-09 contra a referência.

                    Como estava: a aspa de abertura era `absolute -left-1 -top-6`,
                    ou seja, pendurada ACIMA da primeira linha e quase colada na
                    margem. Na referência ela está na mesma altura da primeira
                    linha, recuada num vão à esquerda, e o texto todo começa depois
                    dela. É a diferença entre "aspa flutuando sobre a citação" e
                    "citação recuada com a aspa na margem", que é o desenho certo.

                    Por isso o `pl-9` no <blockquote>: ele abre o vão de 36px onde
                    a aspa mora, e todo o corpo passa a se alinhar à direita dela,
                    inclusive as linhas seguintes e a assinatura. Sem o padding a
                    aspa `absolute` cairia por cima da primeira palavra.

                    `aria-hidden` nas duas: quem usa leitor de tela já recebe a
                    citação pelo <blockquote>, e "aspas duplas" lido em voz alta é
                    ruído. */}
                <blockquote className="relative pl-9">
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 select-none font-serif text-[44px] leading-[0.9] text-brand"
                  >
                    “
                  </span>
                  {/* Corpo — Source Serif 4 400 a 18px, entrelinha 1,65, que é
                      a linha "texto corrido" da grade quase sem ajuste: já
                      estava em 1,65, só a família e o corpo mudaram. A serifa
                      tem altura de x menor que a Poppins, então 18px aqui lê
                      com mais ou menos o mesmo tamanho aparente dos 17,5px de
                      antes — a mudança que se vê é o desenho, não a escala. */}
                  <p className="font-serif text-[17px] leading-[1.65] text-ink/80 md:text-[18px]">
                    At CDNA, <span className="font-semibold text-brand">Keeping It Real</span>{" "}
                    isn’t a slogan; it’s how we work. We speak with honesty, design
                    with truth, and deliver with the same authenticity we expect
                    from leaders. Our conversations are candid, our relationships
                    are human, and our programmes are built from real, lived
                    experience, not theory.
                  </p>
                  <p className="mt-5 font-serif text-[17px] leading-[1.65] text-ink/80 md:text-[18px]">
                    CEOs and CHROs respect us for keeping it relevant, resilient,
                    and{" "}
                    {/* A aspa de fechamento acompanha a de abertura: mesmo corpo
                        (44px) e na altura da linha, não pendurada abaixo dela.

                        `leading-[0]` é o detalhe que faz funcionar. Sem ele, um
                        glifo de 44px dentro de um parágrafo de 18px ESTICA a
                        caixa da última linha e abre um buraco entre ela e a
                        assinatura. Com altura de linha zero o glifo transborda da
                        própria caixa sem empurrar nada, e o `translate-y` o traz
                        para o nível do texto — a aspa serifada nasce muito acima
                        da linha de base.

                        ⚠️ O DESLOCAMENTO SUBIU DE 0,22em PARA 0,36em EM 09-09,
                        e a razão é a troca de fonte: 0,22em foi calibrado contra
                        a serifa GENÉRICA do sistema, que era o que `font-serif`
                        entregava antes. A Source Serif 4 põe o `”` mais alto na
                        caixa do em, então a mesma constante deixava a aspa
                        pairando acima de "real." em vez de encostada nela.
                        Conferido no navegador contra 0,22 / 0,30 / 0,36: em 0,36
                        a tinta da aspa cai na altura-x da palavra, que é onde
                        ela lê como parte da linha.

                        Constante calibrada por fonte: se a família mudar de
                        novo, esta é para reconferir, não para herdar.

                        `whitespace-nowrap` na última palavra + aspa, desde 09-09:
                        ao conter a faixa em 1440 a medida do texto caiu de 680
                        para 652px, e nessa largura a linha quebrava EXATAMENTE
                        entre "real." e a aspa, deixando o glifo sozinho numa
                        linha só dele. Presos, os dois descem juntos quando não
                        couberem — que é uma quebra normal de parágrafo, não um
                        órfão. */}
                    <span className="whitespace-nowrap">
                      real.
                      <span
                        aria-hidden
                        className="ml-1.5 inline-block translate-y-[0.36em] select-none font-serif text-[44px] leading-[0] text-brand"
                      >
                        ”
                      </span>
                    </span>
                  </p>
                  {/* A ASSINATURA FICA EM GEIST, e não na serifa que a grade dá
                      para "texto pequeno". Ela não é corpo de texto: é o
                      crédito da citação, e o trabalho dela é se separar do que
                      está sendo citado. Em serifa 14px, no mesmo desenho do
                      parágrafo logo acima, ela leria como mais uma linha da
                      fala. Em grotesca 500 ela vira rótulo — que é a função. */}
                  <footer className="mt-6 text-[14px] font-medium tracking-[0.2px] text-ink">
                    Rhea Leckie, Founder &amp; CEO of CDNA Consulting
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* Quatro pilares, largura cheia, como o outline descreve.
            `items-stretch` dá altura igual aos quatro.

            ⚠️ O FUNDO DA FAIXA MUDOU EM 09-09, e o histórico explica por quê a
            solução não é "reforçar a borda".

            Versão 1: card `bg-white` sobre `bg-ink-2`. O card era desenhado pelo
            CONTRASTE COM O FUNDO ESCURO — não precisava de borda nenhuma.
            Versão 2 (08-09): a faixa virou branca com a referência da Explore, e
            branco sobre branco some. Entrou uma borda em `line` (#ece9e6) para
            devolver a silhueta.
            Versão 3 (agora): a borda não deu conta. #ece9e6 sobre #fff são cinco
            por cento de diferença — no monitor de quem desenhou ela aparece, num
            monitor comum ela é invisível, e os quatro cards voltam a ler como
            quatro blocos de texto soltos no branco.

            O conserto devolve o mecanismo da versão 1 em vez de engrossar o
            traço da versão 2: o card volta a ser desenhado pelo fundo, não pela
            borda. A faixa recebe `bg-paper` (#f3f3f3) e o card volta a `bg-white`
            SEM borda — dez por cento de diferença em vez de cinco, e a silhueta
            aparece pelo campo inteiro do card, não por uma linha de 1px.

            É a MESMA construção do bloco de escritórios lá embaixo — card branco
            sobre faixa `paper`, sem borda —, então a página passa a ter um jeito
            só de fazer card, em vez de dois. Engrossar a borda teria resolvido o
            contraste e criado um terceiro.

            O `<div>` extra por fora existe porque a faixa cinza tem de ir até a
            borda da janela enquanto o conteúdo continua preso em 1440: fundo no
            container de 1440 deixaria duas tarjas brancas nas laterais em tela
            grande. */}
        <div className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-12 md:px-10 md:pb-20 md:pt-16">
          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <div key={p.heading} className="bg-white p-6">
                {/* ⚠️ 20px, e NÃO os 28px que a grade dá para "h3 dentro de
                    cards". A grade descreve um card de título curto; estes
                    quatro têm FRASES por título ("We earn the right as your
                    trusted ally."). Em quatro colunas de 1440 o card mede
                    ~312px, ~264px de texto útil: a 28px a frase mais longa cai
                    em quatro linhas e o card fica com título de 140px de altura
                    e corpo de 60px, que é um card virado do avesso. A 20px são
                    duas linhas e a proporção volta ao lugar.

                    O peso, esse sim, segue a grade: 500 no lugar do 700. Vale
                    reparar que é a mesma correção do h1 — em card pequeno ela
                    aparece ainda mais, porque negrito em corpo pequeno é onde a
                    geométrica mais fecha. */}
                <h3 className="text-[19px] font-medium leading-[1.25] text-brand md:text-[20px]">
                  {p.heading}
                </h3>
                <p className="mt-3 font-serif text-[15px] leading-[1.6] text-ink/75">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* ── Block 3 · Our Purpose ─────────────────────────────────────
          "Single column, centred, generous margins." A frase de abertura é o
          maior tipo da página depois do herói, como o outline pede.

          ⚠️ O "LIGHT GROUND" DO OUTLINE CAIU em 09-09. O cliente mandou a seção
          equivalente da Explore Performance (`docs/rhea-feedback/`, a mesma
          referência que já reorganizou o bloco de identidade) e pediu este
          tratamento: foto de sangria total no fundo, escurecida, texto branco
          centralizado por cima. É decisão posterior ao documento, então ganha
          dele — mesma precedência do breadcrumb removido no bloco 1. Fica
          registrado porque a contradição é literal: o outline pede fundo claro
          em letra.

          O QUE FOI MEDIDO NA REFERÊNCIA, e não estimado de olho: a faixa deles é
          `background-size: cover` centralizada com um `::after` de
          `rgba(27, 54, 65, .8)` por cima — um azul-petróleo escuro a 80%. Aqui a
          cor é o `ink` do site (55, 50, 52) na MESMA opacidade: o que importa
          copiar é a densidade do véu, não o matiz, que é da paleta deles.

          A 80% a foto vira textura, não assunto. É de propósito, e é o que
          permite usar uma imagem de 1280px de largura numa faixa que em telas
          grandes pede o dobro: a esta opacidade o upscale não aparece. Mesmo
          raciocínio já anotado na foto do herói, lá em cima.

          A FOTO É A DA HOME (`dna-time-06`), a mulher no palco com o público em
          volta — a mesma que a HeroV2 e a HeroV3 usam. Reaproveitar em vez de
          pedir arte nova tem um efeito bom aqui: o bloco que fala do PROPÓSITO
          mostra o trabalho acontecendo, que é o argumento do texto.

          ORDEM DOS ELEMENTOS, copiada da referência: rótulo → frase grande →
          citação → assinatura → RÉGUA VERMELHA CENTRALIZADA → prosa. A régua é
          o detalhe que muda de lugar: no resto da página ela abre o rótulo, à
          esquerda; aqui ela desce e vira separador entre a citação e a prosa.
          Por isso o rótulo desta seção é escrito à mão em vez de usar o
          <TypeLabel> — ele viria com a régua colada, e ela já está embaixo. */}
      <section id="purpose" className="relative isolate overflow-hidden bg-ink text-white">
        <Image
          src={purposePhoto}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="-z-20 object-cover object-center"
        />
        {/* HISTÓRICO DO TRATAMENTO, porque a versão final inverte a lógica das
            duas primeiras e isso não se adivinha lendo o código.

            V1 — véu chapado a 80%, copiado da referência. Medido com o conteúdo
            oculto: texto branco 6,7:1 (passa), rótulo vermelho 1,83:1 (não passa
            em nada). O problema é físico: #d84339 tem luminância 0,187, então
            contra BRANCO PURO ele dá 4,39:1 — o teto absoluto dessa cor. Não
            existe fundo que a leve ao AA.
            V2 — véu 78% + vinheta escurecendo o miolo. Levou o branco a
            8,9–10,5:1 e o vermelho a 2,32:1. Melhor, mas ainda escondia a foto
            justamente onde o olho vai primeiro.

            V3, esta — PAINEL DE VIDRO, pedido de 09-09 ("deixar aparecer
            levemente mais a imagem, com um efeito de glassmorphism").

            O que muda não é a estética, é de ONDE vem o contraste. Nas duas
            primeiras versões o texto era protegido escurecendo a SEÇÃO INTEIRA:
            para o texto ficar legível, a foto toda tinha de sumir junto. Os dois
            objetivos brigavam por um único controle.

            Com o painel eles se separam em dois controles independentes:

              véu da seção  68%  → manda em quanto da foto aparece
              painel        65%  → manda em quanto contraste o texto tem

            Por isso o véu pôde cair de 78% para 68% SEM que o texto perdesse
            nada: o que segura a legibilidade agora é o painel, não o véu. A
            vinheta saiu junto — ela existia só para simular o assento que o
            painel agora dá de verdade.

            O 68% é o segundo valor. A primeira tentativa foi 42%, aproveitando
            toda a folga que o painel abriu, e a foto ficou dominante demais — o
            pedido era "levemente mais", não "o máximo que der". 68% é o
            meio-termo entre os 78% de antes e aquele 42%.

            O DESFOQUE não é enfeite: `backdrop-filter: blur` apaga o detalhe
            fino do que está atrás. Uma foto de salão cheio tem alta frequência —
            cabeças, cadeiras, luminárias — e é isso, não a luminância média, que
            atrapalha ler texto por cima. Borrado, o fundo vira campo de cor. É
            legibilidade, e o visual de vidro sai de brinde.

            A BORDA É RETA. Glassmorphism costuma vir com canto arredondado, e
            aqui não vem: o site inteiro é de canto vivo, e o próprio comentário
            do topo deste arquivo registra que os cards arredondados da
            referência da Maliha foram descartados por isso. O vidro aqui é feito
            de translucidez, desfoque e um fio de borda clara — que é a parte
            essencial do efeito; o raio de canto é só convenção. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ backgroundColor: "rgba(55, 50, 52, 0.68)" }}
        />
        <div className="mx-auto max-w-[900px] px-6 py-20 md:px-10 md:py-28">
          {/* ⚠️ O FUNDO DO PAINEL TEM DOIS VALORES, e o mais escuro é o padrão.
              `backdrop-filter` não existe em todo navegador; onde ele falha, o
              painel vira um retângulo translúcido comum e o desfoque — que é
              metade do contraste — some sem aviso. Então o padrão é 72%, que se
              sustenta sozinho, e `supports-[backdrop-filter]` ALIVIA para 55%
              quando o desfoque está de fato disponível. Progressivo na direção
              certa: quem tem menos recurso recebe mais opacidade, não menos. */}
          <div className="border border-white/10 bg-[rgba(55,50,52,0.8)] px-6 py-12 backdrop-blur-[14px] supports-[backdrop-filter]:bg-[rgba(55,50,52,0.65)] md:px-14 md:py-16">
          <div className="flex flex-col items-center text-center">
            {/* O RÓTULO É VERMELHO POR DECISÃO DO CLIENTE (09-09), contra a
                recomendação registrada aqui. Fica o número para quem reabrir
                isto depois: no `brand-light`, dentro do painel, ele dá 3,56:1
                no pior ponto e 4,28:1 na média — acima da régua de 3:1 de
                elemento gráfico, abaixo dos 4,5:1 que o AA pede para texto. O
                branco daria 9,9:1, e o vermelho CHEIO daria 2,25:1, que é o
                motivo de o tom aqui ser o `brand-light` e não o `brand`.

                Uma versão intermediária chegou a subir com o rótulo branco e o
                vermelho só na régua e nas aspas. O cliente pediu o vermelho de
                volta, e o pedido ganha — é a cor da marca no lugar onde a marca
                se anuncia, e a página inteira usa esse rótulo assim.

                O QUE FOI FEITO PARA MELHORAR O NÚMERO sem desfazer o pedido
                anterior: o painel escureceu de 55% para 65%, e SÓ o painel. Foi
                o que levou o rótulo de 2,56:1 para 3,56:1. Isso não custou nada
                da foto — a opacidade do painel governa o contraste do texto, o
                véu da seção governa quanta imagem aparece, e são controles
                separados desde que este bloco virou vidro. Fechar o véu teria
                custado a imagem; fechar o painel não custa.

                O teto continua existindo: nem o tom claro chega aos 4,5:1 dentro
                de um painel translúcido sobre foto clara. Para isso o painel
                teria de ser praticamente opaco, e aí não é mais vidro. */}
            <span className="mb-5 block text-[14px] font-medium uppercase leading-none tracking-[1.3px] text-brand-light">
              Why Corporate DNA exists.
            </span>
            {/* h2 — Geist 500 a 40px, entrelinha 1,1, direto da grade. O h1 do
                herói está em 52px, então a distância entre os dois níveis é de
                12px: suficiente para hierarquia, pequena o bastante para os
                dois lerem como a mesma voz. Era 60/44 antes, com peso 700 nos
                dois — dois blocos, não dois níveis. */}
            {/* PESO 600 aqui, e 500 nos outros h2, pelo mesmo motivo do h1: o
                título passou a ser branco sobre fundo escuro, e nessa
                combinação a letra afina opticamente. Um degrau de peso repõe o
                que a inversão tira — é o mesmo ajuste, na mesma página, pela
                mesma razão. */}
            <h2 className="max-w-[720px] text-[28px] font-semibold leading-[1.1] tracking-[-0.5px] text-white sm:text-[34px] md:text-[40px]">
              Our purpose is to keep leadership real.
            </h2>
          </div>

          {/* A citação PERDEU A RÉGUA DA ESQUERDA. Ela era o que destacava o
              trecho do corpo enquanto o bloco era alinhado à esquerda; num
              layout centralizado uma borda esquerda desalinha o eixo inteiro —
              o texto centraliza dentro de uma caixa que começa 24px adentro, e
              o olho lê como erro. O destaque agora vem da inversão de fundo, que
              é mais forte do que a régua era. As aspas vermelhas ficam. */}
          <blockquote className="mt-8 text-center">
            <p className="font-serif text-[17px] leading-[1.65] text-white/85 md:text-[18px]">
              <span aria-hidden className="mr-1 text-[28px] leading-none text-brand-light">
                “
              </span>
              <strong className="font-semibold">With roots in Big 4 Consulting</strong>, the
              genesis of CorporateDNA is that a consultant’s obligation is to cut
              through complexity, connect the threads and deliver the truth. We
              want to take off language which hides real problems and bring
              solutions and transformations that are true to the lived realities
              of our clients. Accessing this truth and the powerful
              transformation that it entails, depends on honesty, courage, and
              authenticity.
              <span aria-hidden className="ml-1 text-[28px] leading-none text-brand-light">
                ”
              </span>
            </p>
            <footer className="mt-5 text-[14px] font-medium tracking-[0.2px] text-white/60">
              Rhea Leckie, Founder &amp; CEO
            </footer>
          </blockquote>

          {/* A régua no lugar que a referência dá a ela: centralizada, entre a
              assinatura e a prosa, separando a fala citada do texto da seção.
              Largura de 56px — o dobro dos 28px que ela tem quando abre um
              rótulo, porque isolada no meio de uma coluna de 820px um traço
              curto some. */}
          <div aria-hidden className="mx-auto mt-10 h-[2px] w-14 bg-brand-light" />

          <div className="mt-10 space-y-5 text-center font-serif text-[17px] leading-[1.65] text-white/75 md:text-[18px]">
            <p>
              That obligation shapes everything we do. We release the power,
              humanity and honesty of leadership in all its parts: the values an
              organisation holds, the culture they produce, the teams that carry
              them, and what makes each individual leader stronger.
            </p>
            <p>
              We anchor the work in the inner and outer games, so change is
              inside out, complete, and rooted in truth and impact.
            </p>
          </div>
          </div>
        </div>
      </section>

      {/* ── Block 4 · Our Promise ─────────────────────────────────────
          "Single column prose. Narrower measure than the surrounding blocks, to
          signal a change of register." Daí `max-w-[680px]` contra os 820px do
          bloco anterior — a imagem põe isto em duas colunas, o texto escrito
          pede coluna única, e o texto ganha. */}
      <section id="promise" className="bg-paper">
        <div className="mx-auto max-w-[680px] px-6 py-16 md:px-10 md:py-20">
          <TypeLabel>What we promise.</TypeLabel>
          {/* Esta é a "linha de apoio" da grade: Source Serif 4 400 a 22px,
              entrelinha 1,4. Era 19px em NEGRITO grotesco, e o negrito estava
              fazendo o trabalho de hierarquia sozinho — o bloco não tem título,
              só o rótulo, então esta frase é o topo dele. Na serifa grande a
              hierarquia vem do corpo e do desenho, e não de engrossar o traço.
              Fica em `ink` cheio, e não no cinza que a grade sugere: aqui ela é
              a promessa, não uma legenda do que vem depois. */}
          <p className="font-serif text-[20px] leading-[1.4] text-ink md:text-[22px]">
            To keep our craft real: honest with ourselves, true to our clients.
          </p>
          <div className="mt-6 space-y-5 font-serif text-[17px] leading-[1.65] text-muted md:text-[18px]">
            <p>
              We do not hide behind language to sound more intelligent. We do not
              build layers that clients have to climb over to reach us. We listen
              as much as we talk. We hold the space for our clients to be their
              real, unedited selves, and meet us in true partnership.
            </p>
            <p>
              Boldness lives in duality with humility. Our designs, ideas and
              methods of challenging are bold enough to nudge traditional comfort
              zones, and incubated through humility so the results are
              sustainable. We are confident, but never arrogant.
            </p>
          </div>
          {/* "Closing line: standalone, larger, red." Em Geist, não na serifa:
              ela fecha o bloco como declaração, e a grotesca é a voz de título
              nesta página. É o mesmo papel da faixa final ("Let's make
              leadership real."), e as duas têm de soar igual. */}
          <p className="mt-10 text-[22px] font-medium leading-[1.35] tracking-[-0.3px] text-brand md:text-[26px]">
            We invite you to experience the DNA Partnership.
          </p>
        </div>
      </section>

      {/* ── Block 5 · Our Values ──────────────────────────────────────
          "Five cards, or a stacked list with a red rule between each. Not a
          carousel: all five must be visible without interaction." Grade de
          cinco com régua vermelha à esquerda de cada uma — no telefone a régua
          continua ali, empilhada, então nunca há interação para ver um valor.

          Sem os ícones da imagem: não existe esse jogo de ícones no site, e os
          campos de CMS do outline são { name, body }, sem ícone. */}
      <section id="values" className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <div className="flex flex-col items-center text-center">
            <TypeLabel>What we believe, and how we work.</TypeLabel>
            <p className="max-w-[760px] font-serif text-[20px] leading-[1.4] text-ink md:text-[22px]">
              <strong className="font-semibold">Our values</strong> are deeply
              human centric, and always in service of a client’s greatness. We do
              not compromise on them, however complex the circumstances.
            </p>
          </div>

          <Reveal className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((v) => (
              <div key={v.name} className="border-l-2 border-brand pl-5">
                {/* ⚠️ 20px pelo mesmo motivo dos pilares, e aqui o aperto é
                    maior: são CINCO colunas, ~250px cada em 1440, ~230px de
                    texto útil. "Relationship Centricity" a 28px pede ~300px e
                    quebraria em três linhas — com a régua vermelha ao lado, um
                    título de três linhas contra um corpo de cinco desmonta o
                    alinhamento das cinco colunas entre si. */}
                <h3 className="text-[20px] font-medium leading-[1.2] text-brand">
                  {v.name}
                </h3>
                <p className="mt-3 font-serif text-[15px] leading-[1.6] text-muted">
                  {v.body}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Block 6 · Our Regions ─────────────────────────────────────
          Cabeçalho e intro aqui; o mapa entra logo abaixo sem cabeçalho próprio
          (`eyebrow={null} title={null}`), senão a seção abriria dois títulos.

          O outline pede o mapa "region level only, with no per client pins" — o
          WorldCoverageMap pinta países e marca as cidades das regiões do CMS,
          nunca clientes, então já é esse nível. */}
      <section id="regions" className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 pt-16 md:px-10 md:pt-20">
          <TypeLabel>Where we work.</TypeLabel>
          <p className="mb-12 max-w-[620px] font-serif text-[20px] leading-[1.4] text-ink md:text-[22px]">
            With headquarters in London, Singapore, Dubai, Riyadh and Miami, and
            a faculty of over 75 senior practitioners, we deliver globally.
          </p>
        </div>
      </section>

      <WorldCoverageMap eyebrow={null} title={null} />

      {/* Escritórios: cidade, endereço, telefone e e-mail, os quatro campos que
          o outline lista.

          Três colunas, não cinco. O outline escreve "OFFICES: three cards" e
          logo abaixo tabela cinco cidades; a imagem mostra as cinco numa linha
          só. Medido: cinco cards em 1200px deixam ~170px de texto por card, e
          `corporatednaconsulting.com` em Poppins ocupa ~185px a 11,5px — o
          domínio quebrava no meio ("...consulting.c | om") em qualquer corpo
          ainda legível. A cinco cidades em três colunas cada card tem ~310px, o
          e-mail cabe inteiro em 14px como o telefone ao lado, e o layout passa a
          ser o que o texto do outline pede. As cinco regiões abaixo continuam em
          cinco, porque lá o texto é curto e cabe. */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OFFICES.map((o) => (
              <div key={o.city} className="flex flex-col bg-white p-6">
                {/* AQUI os 28px da grade cabem, e é por isso que ficam: o
                    título é uma palavra só, o card tem ~310px em três colunas,
                    e "Singapore" a 28px em Geist 500 ocupa ~145px dos ~262px
                    úteis. É o contraponto útil aos pilares e aos valores — a
                    regra não é "28px é grande demais", é "28px pede título
                    curto". Vendo os três blocos juntos dá para decidir se a
                    grade continua com um número só ou passa a ter dois. */}
                <h3 className="text-[24px] font-medium leading-[1.15] text-ink md:text-[28px]">
                  {o.city}
                </h3>
                <span className="mt-3 block h-[3px] w-8 flex-none bg-brand" />
                <p className="mt-4 font-serif text-[14px] leading-[1.6] text-muted">
                  {o.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <div className="mt-4 space-y-1.5 leading-[1.5]">
                  {o.tel && (
                    <a
                      href={`tel:${o.tel.replace(/\s/g, "")}`}
                      className="block text-[14px] text-muted transition-colors hover:text-brand"
                    >
                      {o.tel}
                    </a>
                  )}
                  {/* O <wbr> depois do @ fica mesmo com o card largo: é o ponto
                      de quebra que o navegador tem de usar primeiro se a coluna
                      apertar (telefone estreito), em vez de partir o domínio no
                      meio. `break-words` fica de rede. */}
                  <a
                    href={`mailto:${o.email}`}
                    className="block break-words text-[14px] text-brand transition-colors hover:text-brand-dark"
                  >
                    {o.email.split("@")[0]}@<wbr />
                    {o.email.split("@")[1]}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Cinco tiles de região. Sem foto: os campos de CMS do outline são
              { name, descriptor }. Os descritores estão em HOLD. */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {REGIONS.map((r) => (
              <div key={r.name} className="border-t-2 border-brand bg-white p-6">
                {/* SAIU DA CAIXA ALTA. Era 15px/700/maiúsculas — o mesmo
                    tratamento do rótulo vermelho, aplicado a um TÍTULO, e
                    caixa alta em grotesca pesada é exatamente o "quadrado" que
                    esta página está testando tirar. Em Geist 500 a 20px, caixa
                    baixa, o tile passa a ter título e legenda em vez de dois
                    rótulos empilhados, e alinha com os valores, que são a outra
                    grade de cinco da página. */}
                <h3 className="text-[20px] font-medium leading-[1.2] text-ink">
                  {r.name}
                </h3>
                <p className="mt-3 font-serif text-[14px] leading-[1.6] text-muted">
                  {r.descriptor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Block 7 · Fecho ───────────────────────────────────────────
          O outline diz "seven blocks" e descreve seis: o corpo do sétimo não
          veio no arquivo, sobrou só a linha de campos de CMS
          (`repeatable link_card { heading, body, cta_label, cta_url }`), que
          descreve cards de navegação e não a faixa da imagem.

          Montado como está na imagem — assinatura, frase e um botão — porque é
          a única versão do bloco que o cliente mandou. O `link_card` fica de
          fora até o texto do bloco 7 chegar. */}
      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-8 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="text-[28px] font-medium leading-[1.15] tracking-[-0.6px] md:text-[36px]">
            Let’s make leadership real.
          </p>
          {/* Botão — Geist 500 a 16px, caixa baixa, sem espacejamento. Era
              14px/600/maiúsculas. A caixa alta some pelo mesmo motivo que sumiu
              do menu: é o que dá voz de barra corporativa a um texto de três
              palavras.

              Os 0,5px de espacejamento que a grade pede saíram depois de medir
              o botão da própria Explore: 16px, peso 500, `letter-spacing:
              normal`. Os dois botões da página — este e o Contact do menu —
              seguem o mesmo par, que antes não tinham. */}
          <Link
            href="/#contact"
            className="inline-flex flex-none items-center gap-2 bg-brand px-7 py-3.5 text-[16px] font-medium text-white transition-colors hover:bg-brand-dark"
          >
            Get in touch
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
      </main>
      <SiteFooter />
    </div>
  );
}
