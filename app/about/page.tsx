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
import HeroIntro from "@/components/HeroIntro";
import Counter from "@/components/Counter";
import WorldCoverageMap from "@/components/WorldCoverageMap";
import LocationsBlock from "@/components/LocationsBlock";
import { offices as siteOffices, type Office } from "@/lib/offices";
import { FIRM_STATS } from "@/lib/stats";
import TypeLabel from "@/components/TypeLabel";
import HoverFillButton from "@/components/HoverFillButton";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import { localeAlternates } from "@/lib/seo/alternates";
import heroPhoto from "@/public/skyline-dna.jpg";
import teamStairs from "@/public/team-stairs-about-six.jpg";
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
  /* 500 entrou com a inversão de 09-09: os títulos de card, que passaram para a
     serifa, usam `font-medium`. Sem ele o navegador engorda o 400 sozinho, e
     negrito sintético em serifa é pior que em grotesca — as hastes finas
     engrossam junto com as grossas e o desenho perde o contraste que define a
     família. */
  weight: ["400", "500", "600"],
  variable: "--font-serif-v3",
  display: "swap",
});


export async function generateMetadata(): Promise<Metadata> {
  const title = "About — Corporate DNA";
  return {
    title,
    description:
      "Our purpose, our promise, what we believe, and where we work.",
    // PROMOVIDA EM 09-09. Era `/about-v2`, uma proposta `noindex` sem canonical
    // porque a página de verdade era `/our-identity`. Agora esta É a página de
    // verdade, e as duas linhas abaixo mudaram juntas de propósito:
    //
    //   • entra o `alternates`, que faltava — sem canonical próprio a página
    //     não tem como se declarar a versão boa de si mesma.
    //   • sai o `robots: noindex`. Ele não podia ficar: `/about` entrou no
    //     `sitemap.ts` no mesmo commit, e sitemap dizendo "indexe" com a página
    //     dizendo "não indexe" é pior que qualquer um dos dois sozinho — é
    //     sinal contraditório, e o Google resolve contra a gente.
    //
    // O que sustenta a decisão: o `robots.ts` do site libera tudo menos `/v1` e
    // `/preview/`, e o domínio real ainda serve o WordPress antigo — o que está
    // exposto é um endereço `vercel.app`. Quem for revisar antes do lançamento,
    // revise por lá.
    alternates: localeAlternates("/about"),
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
 * aparecia como `[36] countries`, entre colchetes — número pendente de
 * confirmação, junto com o "over 75 senior practitioners" do bloco de regiões
 * (que virou "60+" em 17-09 — ver a caixa lá).
 *
 * ✅ OS TRÊS PRIMEIROS FORAM CONFIRMADOS NA DAILY DE 17-09, e é essa a origem
 * dos números de hoje: *"trocar todas as menções de 18 years para 19 years /
 * trocar 36 países para 5 regions / trocar 1,000 leaders para 10 000+."* O
 * `[36]` entre colchetes deixou de existir porque a resposta não foi um número
 * de países — foi trocar a UNIDADE: a firma conta alcance por REGIÃO, que é a
 * mesma unidade do bloco 6 desta página (`REGIONS`, logo abaixo) e não colide
 * mais com "across five regions" no rótulo, que por isso saiu.
 *
 * ⚠️ A HOME E A OUR IMPACT AINDA DIZEM 18/36/75. Não vem de `getSiteStats()`:
 * aquelas quatro são outras (90% sponsored, 18 years, 36 countries, 75 faculty),
 * vêm do CMS (`page_home`) e alimentam a home e a Our Impact. Mudar os fallbacks
 * de `lib/stats.ts` daqui não resolveria — o valor publicado no CMS ganha deles.
 * Enquanto os dois lados não forem alinhados, a mesma firma diz 18 anos numa
 * página e 19 na outra, e a correção é no CMS.
 *
 * ⚠️ A LISTA MUDOU DE CASA EM 18-09. Ela era um `const STATS` aqui dentro — e
 * a caixa acima ("estes arrays vivem na página, e não em `lib/`, de propósito")
 * ainda vale para os OUTROS blocos. Esta é a exceção: na daily de 18-09 a
 * cliente pediu os mesmos quatro números na "By the numbers" da Clients &
 * Impact, e uma lista copiada em duas páginas é o que gera a próxima
 * divergência. Os valores são os mesmos de antes, só que em `lib/stats.ts`
 * (`FIRM_STATS`); o `StatIcon` abaixo continua aqui, porque só esta página
 * desenha ícone.
 */
const STATS = FIRM_STATS;

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
    icon: "bulb",
    body: "Our creativity lives in the big ideas and equally in the details and frameworks that hold them together. Execution should feel like flow.",
  },
  {
    name: "Bold Humility",
    icon: "leaf",
    body: "Boldness lives in duality with humility. Bold enough to move people beyond their comfort zones, humble enough to be sustainable. Confident, never arrogant.",
  },
  {
    name: "Relationship Centricity",
    icon: "pair",
    body: "We believe in mutually empowered relationships where we learn from each other. Clients should always feel us as deeply invested in their present and their future.",
  },
  {
    name: "Real Results",
    icon: "target",
    body: "Our relentless quest for excellence is anchored in real issues and real results: engagement up, performance up, collaboration up.",
  },
  {
    name: "Trust & Truth",
    icon: "shield",
    body: "Trust and truth live in one cycle. We help our clients with the hard right rather than the easy wrong, and hold ourselves accountable for breakthrough results.",
  },
];

/**
 * Os cinco ícones dos valores (09-09).
 *
 * ⚠️ ISTO CONTRARIA O QUE ESTAVA ESCRITO AQUI. O comentário do bloco de valores
 * dizia "sem os ícones da imagem: não existe esse jogo de ícones no site, e os
 * campos de CMS do outline são { name, body }, sem ícone". Era verdade e deixou
 * de ser: o cliente pediu os ícones em 09-09, e a referência da Maliha
 * (`docs/rhea-feedback/about-pagina-inteira.jpeg`) já os trazia — lâmpada,
 * folha, duas pessoas, alvo e escudo, nessa ordem. Os desenhos abaixo seguem a
 * referência dela, um a um.
 *
 * FICA O EFEITO NO CMS: `{ name, body }` vira `{ name, body, icon }`, e `icon`
 * não é texto livre — é uma chave para um desenho que existe aqui dentro. Se
 * esta página for aprovada, o campo tem de virar uma LISTA FECHADA no CMS, não
 * um campo aberto, senão um valor novo cadastrado pela Rhea sai sem ícone
 * nenhum e ninguém descobre até alguém abrir a página.
 *
 * DESENHADOS À MÃO pelo mesmo motivo do StatIcon, lá em cima: o site não tem
 * biblioteca de ícones, e agora são NOVE desenhos nesta página. Nove já é o
 * número em que vale a conversa sobre adotar um set de verdade — o comentário
 * do StatIcon previa exatamente este momento. Não instalei nada porque a rota
 * ainda é proposta `noindex`, e uma dependência no `package.json` do site
 * inteiro por causa dela continua sendo o negócio errado.
 *
 * Mesma gramática do StatIcon para os nove ficarem parentes: contorno sem
 * preenchimento, canto e junta arredondados, traço 1,75 num quadro de 24,
 * `stroke="currentColor"` para a cor vir do container.
 */
function ValueIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    /* Lâmpada com raios. O bulbo é UM path só — a primeira versão era um
       <circle> com o gargalo desenhado por baixo, e sobrava um vão de ~1px de
       cada lado porque a corda do círculo naquela altura é mais estreita que o
       gargalo. Path único não tem emenda para desalinhar. */
    bulb: (
      <>
        <path d="M12 5.6a4.2 4.2 0 0 0-2.4 7.6c.4.3.6.7.6 1.1v.5h3.6v-.5c0-.4.2-.8.6-1.1A4.2 4.2 0 0 0 12 5.6z" />
        <path d="M10.2 17.2h3.6M11 19.6h2" />
        <path d="M12 1.7v1.6M5 5.2l1.1 1.1M19 5.2l-1.1 1.1M2.3 11.5h1.6M20.1 11.5h1.6" />
      </>
    ),
    leaf: (
      <>
        <path d="M4.8 19.2c0-8 5.5-13.5 13.5-13.5 0 8-5.5 13.5-13.5 13.5z" />
        <path d="M3.1 20.9 16.2 7.8" />
      </>
    ),
    /* Duas pessoas SIMÉTRICAS, e não o par assimétrico do `people` da faixa de
       números lá em cima. Os dois ícones dizem "pessoas" e aparecem na mesma
       página; se fossem o mesmo desenho, a repetição leria como descuido. Aqui
       a simetria também é o conteúdo — "relationship centricity" é mútuo. */
    pair: (
      <>
        <circle cx="8.2" cy="8.4" r="2.7" />
        <circle cx="15.8" cy="8.4" r="2.7" />
        <path d="M4.8 19.4a3.4 3.4 0 0 1 6.8 0" />
        <path d="M12.4 19.4a3.4 3.4 0 0 1 6.8 0" />
      </>
    ),
    /* Alvo com a flecha entrando pela direita. Só dois anéis: no corpo em que
       este ícone é usado (26px) um terceiro anel vira um borrão cinza, e a
       ponta da flecha já marca o centro. */
    target: (
      <>
        <circle cx="12" cy="12" r="8.4" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 12 20.6 3.4" />
        <path d="M15.8 3.4h4.8v4.8" />
      </>
    ),
    shield: (
      <>
        <path d="M12 2.6 4.7 5.6v5.9c0 4.5 3 8.2 7.3 9.3 4.3-1.1 7.3-4.8 7.3-9.3V5.6L12 2.6z" />
        <path d="M8.9 12.1l2.3 2.3 4-4.4" />
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
      /* 30px, contra os 26px do StatIcon. Os dois são o mesmo desenho de
         traço, mas fazem trabalhos diferentes: na faixa de números o ícone é
         subordinado — ele acompanha um número que é o assunto —, e aqui ele
         ABRE o card, é a primeira coisa que o olho encontra em cada coluna. Na
         referência da Maliha ele tem cerca de uma vez e meia a altura do título;
         30px contra um título de 20px é essa proporção. */
      className="h-[30px] w-[30px]"
    >
      {paths[name]}
    </svg>
  );
}

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
 * O `OFFICES` acima no formato que o `LocationsBlock` lê — 14-09, item 4.
 *
 * POR QUE ADAPTAR EM VEZ DE PASSAR `lib/offices.ts`: é a caixa do `OFFICES`
 * inteira. Aquela lista existe justamente porque três registros do documento do
 * cliente divergem do que a home publica; o bloco lendo a fonte da home
 * reverteria os três sem ninguém notar.
 *
 * `coords` E `zoom` VÊM DE `lib/offices.ts`, por cidade. Eles não são usados
 * aqui — o bloco roda com `showMap={false}` —, mas o tipo `Office` os exige, e
 * preenchê-los com zeros deixaria uma bomba armada para quem ligasse o mapa
 * nesta página um dia: cinco pinos no Golfo da Guiné. A coordenada de um
 * escritório é a mesma nos dois arquivos; o que diverge entre eles é o texto.
 *
 * ⚠️ O CASAMENTO É PELO NOME DA CIDADE, e as cinco batem hoje. Se alguém
 * acrescentar um escritório só aqui, o `find` volta `undefined` e o `?? 0`
 * abaixo entrega a coordenada nula — de novo, sem efeito enquanto o mapa estiver
 * desligado. É o motivo de este aviso existir em vez de um `throw`: quebrar o
 * build da About por um campo que nada renderiza seria pior que o defeito.
 */
const OFFICE_CARDS: Office[] = OFFICES.map((o) => {
  const onMap = siteOffices.find((s) => s.city === o.city);
  return {
    slug: o.city.toLowerCase(),
    city: o.city,
    country: onMap?.country ?? "",
    addressLines: o.address,
    tel: o.tel,
    email: o.email,
    coords: onMap?.coords ?? { lng: 0, lat: 0 },
    zoom: onMap?.zoom ?? 12,
  };
});

/**
 * Block 6, as cinco regiões. Os NOMES são FINAL; os descritores são HOLD ("one
 * line descriptor per region, max 120 characters"). Os textos abaixo são os que
 * aparecem na própria imagem da Maliha — placeholder do cliente, não copy nossa
 * — e devem virar campo de CMS.
 */
const REGIONS = [
  { name: "Americas", descriptor: "Driving leadership impact across North and South America." },
  { name: "UK & Europe", descriptor: "Partnering with organisations to build resilient leaders across Europe." },
  /* ⚠️ ERA "GCC & Middle East" ATÉ 17-09 — *"na seção 'Where we work.' trocar
     GCC & Middle East para Middle East and North Africa."* Não é sinônimo: a
     região deixou de ser o Golfo com o Oriente Médio em volta e passou a ser
     MENA, que estende para o norte da África. O descritor acompanha, senão a
     linha de baixo continuaria dizendo "GCC". */
  { name: "Middle East & North Africa", descriptor: "Supporting transformation across the Middle East and North Africa." },
  { name: "Asia", descriptor: "Developing leaders for a fast-changing Asia." },
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
      <NavV2
        items={nav}
        maxWidthClass="max-w-[1440px]"
        outlined
        /* Sem `activeHref` desde 09-09, e isso é o conserto e não uma omissão.
           Enquanto esta rota era `/about-v2`, o item "About" do menu apontava
           para `/our-identity` e a marcação de item ativo precisava ser forçada
           à mão. Agora a rota e o `href` do menu são o mesmo `/about`, então o
           casamento acontece sozinho — era o que o comentário anterior previa. */
      />
      <main className="flex-1">
      <JsonLd
        data={breadcrumbLd([{ name: "About", path: "/about" }])}
      />

      {/* ── Primeira dobra · Breadcrumb + Block 1 (hero) + Block 1b (números)
          ───────────────────────────────────────────────────────────────
          UMA seção só, de tela cheia, pedido em 08-09: "a hero e a parte com os
          números ocupando 100vh". Os três pedaços já eram `bg-ink` e liam como
          uma faixa escura só; agora são de fato um bloco, com a foto atrás dos
          três e o espaço livre distribuído entre eles — breadcrumb no topo, o
          título no meio, os números na base.

          ALTURA: `min-h-[84svh]` com `pt-[76px]` — eram 100svh cheios até 17-09.
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

          ⚠️ OS 100svh VIRARAM 84svh EM 17-09, mesmo pedido que encolheu o
          `SolutionHero` das outras rotas — ver a caixa de lá, que é onde o
          porquê está escrito por inteiro. O caso desta página é o mais forte
          dos treze: aqui a dobra cheia termina justamente na faixa de números,
          que é um FIM visual convincente (régua, quatro blocos, base da foto), e
          quem para nela não descobre que existe a página inteira abaixo. Com
          84svh, a foto do time assoma na base e desmente esse fim.

          A ARTE é a que a Maliha mandou em 08-09 (`public/skyline-dna.jpg`): o
          skyline montado — Big Ben, Marina Bay, Burj Khalifa, Kingdom Centre —
          com a hélice de DNA atravessando o céu. Ela é a imagem definitiva da
          seção, não mais o placeholder da home V2, e desde 14-09 é também o
          herói da /services, a pedido dela. Uma ressalva de arquivo está
          anotada no <Image> logo abaixo. */}
      <section className="relative isolate flex min-h-[84svh] flex-col overflow-hidden bg-ink pt-[76px] text-white">
        {/* ✅ A RECOMPRESSÃO DO WHATSAPP SAIU EM 15-09. O que estava aqui era
            a `about-hero.jpeg`, 229 KB de JPEG que o WhatsApp já havia
            recomprimido: céu em blocos e os pontos da hélice empastados. O
            pacote do Drive daquele dia trouxe o PNG de origem (2,2 MB), que
            virou `public/skyline-dna.jpg` com uma compressão só, em q90. O nome
            mudou de propósito — trocar os bytes mantendo a URL não adianta
            contra o cache longo do `/_next/image`. A `about-hero.jpeg` fica no
            repositório ao lado, para comparar e para voltar atrás numa linha.

            ⚠️ O ARQUIVO CONTINUA PEQUENO E QUASE QUADRADO: 1373x1145 (1,2:1). O
            PNG novo é a mesma imagem sem a segunda compressão, não uma maior.
            Duas consequências, e as duas seguem valendo:

            1. LARGURA. A dobra pede algo em torno de 1920px. Em telas de até
               1440 o upscale é 1,05x e não aparece; num monitor de 1920 é 1,4x e
               num 2560 é 1,86x, aí a imagem amolece. O escurecimento perdoa
               muito disso (é arte escura, monocromática e granulada), mas o
               conserto de verdade é o arquivo em largura de dobra, que continua
               pendente com a Maliha.

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
            só para si, em vez de ficar atrás de tudo com o texto por cima.

            ⚠️ "INTEIRA" ERA O PROBLEMA — corrigido em 10-09, a pedido ("a foto
            teria que aparecer mais, talvez até dar um leve zoom na torre").

            O que a medição mostrou: mostrar o arquivo inteiro num telefone é
            desperdício, porque o arquivo tem 23% de ÁGUA na base e um terço de
            céu vazio no topo. Medido em 390x844, com `ink` (#373234) valendo
            luminância 52 — ou seja, "52 = fundo chapado, sem imagem nenhuma":

              y 304–420  topo da foto (céu vazio)  → compositava a 48–51
              y 430–620  a hélice de DNA           → 73–101
              y 680–844  água / reflexo            → 49–55

            Das duas pontas saía a MESMA COISA que pintar a cor de fundo. Dos
            540px de caixa, ~190px carregavam imagem visível — e eram os 190px
            mais vazios do arquivo. O `object-position` não resolve, pelo motivo
            já escrito acima: no telefone o eixo Y não tem folga nenhuma.

            A SAÍDA É A IMAGEM SER MAIOR QUE A CAIXA QUE A CORTA. O `<Image>`
            passou a viver num wrapper de 172,4% de altura (1/0,58) deslocado
            24,1% para cima, dentro de uma caixa `overflow-hidden`. Isso recorta
            a janela do arquivo em 14%–72%: fora o céu morto, fora a água,
            dentro a hélice e a torre. Percentagem pura, sem JS — o `top` em %
            resolve contra a altura do bloco continente, que é a caixa.

            O QUE O ZOOM CUSTA, e não é pouco: recorte come resolução. A largura
            de render no telefone sobe de 647px para 1117px contra um arquivo de
            1373px. Num telefone DPR 3 isso pede 3351px e temos 1373 — upscale
            de 2,44x, contra 1,41x antes. Nos screenshots de revisão (DPR 1) não
            aparece; num iPhone de verdade vai amolecer. A arte é escura,
            monocromática e granulada, o que perdoa bastante, mas isto promove
            "pedir o original à Maliha" de item de backlog a PRÉ-REQUISITO: o
            que temos é a cópia que o WhatsApp recomprimiu.

            A DOSE É A LEVE, e o teto tem motivo. Testados 58% (leve), 50%
            (médio) e 44% (forte) de janela. Do médio para cima a hélice sai do
            quadro e sobra uma torre sozinha — que é trocar a imagem DESTA
            empresa por uma foto de banco de imagens. A hélice é o motivo de o
            arquivo existir; ela é o teto do zoom, não o enquadramento da torre.

            ⚠️ A CAIXA É ANCORADA EM PIXEL (`top-[344px]`), E NÃO MAIS EM `h-[64%]`.
            Isto é conserto de um defeito que a percentagem escondia, encontrado
            medindo o iPhone SE (375x667) depois de o zoom entrar.

            O TEXTO NÃO ENCOLHE COM A TELA. O bloco da mensagem é ancorado no
            topo (`items-start` + `pt-16`), então o rótulo, o h1 e a linha de
            apoio caem SEMPRE nos mesmos y — h1 em 174–253, linha de apoio em
            273–326 — em qualquer altura de telefone. A caixa em percentagem,
            não: em 844 ela começava em 304 (22px depois do texto, tudo bem) e
            em 667 começava em 240, ou seja 86px ANTES de o texto acabar. A
            linha de apoio inteira caía em cima da foto.

            E o gradiente novo não salva, justamente porque ele é curto de
            propósito: aos 20% da caixa já abriu. Medido no SE, contraste de
            pior caso da linha de apoio (branco/75):

              antes            4,12
              com `h-[64%]`    1,38   ← ilegível
              ancorado         7,84

            344px = os 326 onde o texto acaba + 18 de folga. Em 844 a foto
            começa 40px mais abaixo do que começava (500px de caixa em vez de
            540) e o brilho medido dela cai de 111 para 90 — ainda 23% acima dos
            73 de antes. É a troca certa: 21 pontos de brilho num telefone
            grande valem menos que uma linha de apoio ilegível num pequeno.

            SE O TÍTULO MUDAR, ESTE NÚMERO MUDA. Ele é a única coisa aqui que
            depende do texto que está escrito — e o degrau em `min-[360px]` é
            exatamente isso acontecendo: abaixo de 360 de largura o h1 quebra em
            TRÊS linhas em vez de duas, e a linha de apoio termina em 393 em vez
            de 326. Um anular só serviria a um dos dois casos.

              < 360   h1 em 3 linhas, texto acaba em 393 → caixa em 412
              ≥ 360   h1 em 2 linhas, texto acaba em 326 → caixa em 344

            Medido em 320, 360, 375, 390 e 430. O `min-[360px]:` é o mesmo
            recurso que a faixa de números já usa logo abaixo.

            ⚠️ 320 CONTINUA SENDO UMA TELA RUIM AQUI, e isso é anterior a este
            trabalho: com o h1 em três linhas a dobra mede 746px numa tela de
            568, ou seja os números nascem fora dela. (Antes deste commit era
            pior — 1581px, quase três telas.) O que o anular resolve é só o
            texto em cima da foto; o resto é a faixa de números não caber, que é
            decisão de conteúdo e está anotada mais abaixo. */}
        <div className="absolute inset-x-0 bottom-0 top-[412px] -z-10 w-full overflow-hidden min-[360px]:top-[344px] md:inset-y-0 md:left-auto md:right-0 md:top-0 md:h-auto md:w-[72%]">
          {/* O wrapper do zoom. Só existe no telefone: em `md` ele volta a ser
              do tamanho da caixa (`md:top-0 md:h-full`) e o desktop continua
              exatamente como estava — sangria de 72% à direita, arquivo inteiro,
              escala pela largura. */}
          <div className="absolute inset-x-0 top-[-24.1%] h-[172.4%] md:top-0 md:h-full">
            <Image
              src={heroPhoto}
              alt=""
              aria-hidden
              fill
              priority
              /* ⚠️ O RAMO DO TELEFONE NÃO É `100vw`. Era, e estava errado antes
                 mesmo do zoom: com `object-cover` escalando pela ALTURA, a
                 largura de render no telefone nunca foi a da tela. Com 390 de
                 viewport ela é 1117px, ou seja 287vw — dizer `100vw` fazia o
                 navegador pedir a variante de 640px e depois esticá-la.

                 O DESKTOP FICA EM `100vw`, e não nos 72vw da caixa, porque lá a
                 largura de render é `max(0,72·W, 1,199·H)` — o cover escolhe o
                 maior dos dois eixos, e em janela alta quem manda é a altura.
                 Em 1920x1080 dá 72vw; em 1440x900, 75vw; em 1280x1024, 96vw.
                 Cravar 72vw sub-pediria a imagem justamente nas janelas mais
                 altas. Sobra-pedir custa bytes, sub-pedir custa nitidez. */
              sizes="(max-width: 767px) 287vw, 100vw"
              className="object-cover object-center"
            />
          </div>
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
        {/* ⚠️ AS DUAS CAMADAS DO TELEFONE FORAM SEPARADAS EM 10-09, e essa é a
            mudança que permitiu o zoom sem quebrar a leitura dos números.

            O ERRO ERA ESTRUTURAL, não de valor: a emenda (`h-[64%]`, do topo da
            foto para baixo) e o fecho (`h-[58%]`, da base para cima) SE
            SOBREPUNHAM em 490px de uma dobra de 844. Duas camadas empilhadas
            somam por 1-(1-a1)(1-a2), então a cobertura no meio era o produto de
            duas curvas que ninguém consegue ler olhando o código — e o piso
            resultante nunca descia de 0,36. Na prática: o brilho máximo da
            hélice (238 no arquivo) saía a 156. A arte nunca aparecia a mais de
            ~65% do valor dela, em lugar nenhum da dobra.

            E os dois trabalhos são em pontas OPOSTAS da tela: esconder o corte
            reto no topo da foto, e proteger os números na base. Escurecer o meio
            não servia a nenhum dos dois — só apagava a foto.

            Agora são duas camadas QUE NÃO SE TOCAM:

              costura  y 304–434  (24% da caixa da foto)  → ink → transparente
              livre    y 434–464  → sem camada nenhuma, a foto no valor cheio
              scrim    y 464–844  (45% da seção)          → transparente → ink

            MEDIDO, contraste de pior caso (o pixel mais claro atrás de cada
            texto) contra branco/75, e brilho médio da foto:

                                      antes   agora
              "18 years"               2,62    3,47
              legenda esq. de cima     4,22    5,07
              "36 countries"           2,67    3,97
              legenda dir. de cima     3,92    5,21
              "1,000+"                 6,17    6,76
              "5 of the top 10"        6,23    6,67
              brilho da foto y330-460    60      94

            A foto fica 57% mais clara E todo texto melhora. Não há troca — o
            que havia era desperdício.

            Vale registrar que a primeira linha de números JÁ FALHAVA antes:
            2,62 e 2,67 estão abaixo dos 3:1 que texto grande pede. A versão
            anterior escondia isso escurecendo tudo por igual, o que faz um
            defeito de composição parecer resolvido. */}
        {/* COSTURA. A caixa da imagem começa num corte reto; sem nada por cima,
            essa borda apareceria como uma linha horizontal atravessando a dobra
            — o mesmo defeito que o lavado lateral resolve no desktop, girado
            90°. Este é o único trabalho dela: morre aos 24% da caixa e não
            encosta no resto.

            O `top` É COPIADO DA CAIXA DA FOTO, degrau de 360 inclusive, e não
            `h-[64%]`: os dois têm de cobrir exatamente o mesmo retângulo. Se um
            for percentagem e o outro pixel, eles descolam a cada altura de tela
            e a costura passa a cobrir o lugar errado — que é pior do que não
            existir. Mexeu num, mexe no outro. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 top-[412px] -z-10 min-[360px]:top-[344px] md:hidden"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgb(55,50,52) 0%, rgba(52,47,49,.72) 7%, rgba(44,40,42,.24) 15%, rgba(40,36,38,0) 24%)",
          }}
        />
        {/* SCRIM DOS NÚMEROS — telefone. Começa em 45% da seção (y 464), logo
            acima da primeira linha de células (y 552), e não em 58% como antes:
            fechar mais alto não protegia nada e custava a hélice inteira.
            Termina em `ink` cheio na borda, que é o que casa com o `bg-ink` da
            seção e com o corte para o bloco branco seguinte. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-[45%] md:hidden"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgb(55,50,52) 0%, rgba(55,50,52,.97) 22%, rgba(46,42,44,.88) 48%, rgba(40,36,38,.72) 72%, rgba(38,34,36,.35) 90%, rgba(38,34,36,0) 100%)",
          }}
        />
        {/* FECHO DA BASE — desktop, INTOCADO. Separado do telefone em 10-09
            porque `style` não aceita variante responsiva: mudar o gradiente de
            um elemento só mudaria as duas telas junto. A composição do desktop
            é outra (foto sangrando à direita, arquivo inteiro, sem zoom) e não
            tem o problema que o telefone tinha — os números aqui atravessam a
            largura toda e continuam precisando da metade de baixo opaca. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 hidden h-1/2 md:block"
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
          {/* A ENTRADA DO HERÓI É A DA HOME, desde 11-09 — a escada de
              `lib/hero-timeline.ts`, rodada por `HeroIntro`. O resto da página
              já revelava por rolagem, mas o herói está acima da dobra: o
              `Reveal` dispararia na hora e tudo entraria junto, num fade só.

              SEM `h-bar` E SEM `h-cta` aqui: o rótulo desta página traz a
              própria régua dentro do `TypeLabel` (por isso a classe vai NELE, e
              os dois entram como uma peça), e o herói não tem botão. A timeline
              pula o que não encontra. */}
          <HeroIntro className="mx-auto w-full max-w-[1440px] px-6 pb-12 pt-16 md:px-10 md:py-16">
            <TypeLabel onDark className="h-eyebrow">
              About
            </TypeLabel>
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
            <h1 className="h-title font-serif max-w-[900px] text-[36px] font-semibold leading-[1.1] tracking-[-0.2px] text-white [text-wrap:balance] sm:text-[44px] md:text-[52px]">
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
            <p className="h-sub mt-5 max-w-[620px] text-[19px] leading-[1.4] text-white/75 md:text-[22px]">
              <span className="md:block">Our purpose, our promise,</span>{" "}
              <span className="md:block">what we believe, and where we work.</span>
            </p>
          </HeroIntro>
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
        {/* ⚠️ O `md:pb-12` VIROU `md:pb-9` EM 21-09, em dois passos. Não é
            ajuste de respiro: a faixa de números deixou de ser a última coisa da
            dobra. A lista de escritórios entrou logo abaixo dela (ver a caixa a
            seguir), e os 48px que fechavam o bloco passariam a separar os
            números dos escritórios em vez de fechar a seção.

            OS DOIS VÃOS PASSARAM POR TRÊS ESTADOS NA MESMA DATA, e o último é o
            que está no ar: 24/48 (a linha encostada nos números e boiando sobre a
            borda), depois 36/36 pedindo simetria sem crescer a dobra, e agora
            36 aqui em cima com 24 embaixo — o `pb-6` da lista.

            ⚠️ 36 E 24 SÃO O QUE FICA IGUAL NA TELA, e é por isso que os números
            não batem. Medido no navegador a 1440x1000: com 36/36 o vazio VISÍVEL
            era de 23px acima da linha e 42px abaixo. A assimetria vem da caixa
            de linha do texto — os 13px da lista deixam ~5px de folga sob os
            glifos, que somam ao padding de baixo, enquanto em cima o padding
            nasce do rodapé da grade de números, que já está justo. Igualar os
            valores de CSS era desigualar o resultado.

            A dobra não cresce: ela é `min-h-[84svh]` e o conteúdo ficou 12px mais
            curto, não mais longo.

            No telefone o `pb-10` continua igual, porque lá a lista não aparece e
            a faixa de números segue sendo o fim da dobra. */}
        <div className="mx-auto w-full max-w-[1440px] px-6 pb-10 md:px-10 md:pb-9">
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
                {/* ⚠️ O ÍCONE FICOU ESCONDIDO NO TELEFONE POR UM TEMPO, e a
                    razão deixou de valer sem que ninguém percebesse. Ele saiu
                    quando a dobra do telefone estava estourando — a seção media
                    1102px numa tela de 844 e o quarto número ficava fora — e
                    26px por célula vezes duas linhas era espaço que não existia.

                    Duas mudanças depois (a foto descendo para os 64% de baixo e
                    o título encostando no topo) a dobra passou a fechar em 844px
                    exatos, e a restrição simplesmente evaporou. Medido ao
                    restaurar: os ícones custam 40px, tirados do vão VAZIO entre
                    a linha de apoio e os números — a seção continua em 844px, o
                    respiro do menu continua em 64px e a foto continua começando
                    em 304px. Custo real: nenhum.

                    Fica registrado porque é o tipo de decisão que envelhece mal:
                    ela estava certa quando foi tomada e virou dívida silenciosa
                    duas mudanças depois.

                    A MARGEM CAI PARA 8px NO TELEFONE (`mb-2`), 12px de `sm` para
                    cima. Restaurados com os 12px de todo lugar, os ícones cabiam
                    em 390x844 mas estouravam o iPhone SE por 8px — 675px numa
                    tela de 667. São 4px por linha vezes duas linhas vezes... na
                    verdade 4px por célula em duas fileiras, e a conta fecha
                    porque é exatamente o que faltava. Vale medir na tela mais
                    apertada, não na mais comum: 844 dava folga e escondia o
                    problema.

                    `text-brand-light` e não `text-brand` pelo mesmo motivo do
                    rótulo do herói: o vermelho cheio sobre `ink` dá 2,87:1,
                    abaixo até da régua de 3:1 que vale para elemento gráfico. */}
                <span className="mb-2 block text-brand-light sm:mb-3">
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
                <div className="mt-2 max-w-[240px] text-[13px] leading-[1.45] text-white/75 sm:mt-3 sm:text-[14px] sm:leading-[1.5]">
                  {s.label}
                </div>
              </div>
            ))}
          </Reveal>
        </div>

        {/* ── Os escritórios no canto inferior direito do herói — 21-09.

            AS DUAS FORMULAÇÕES SÃO A MESMA COISA, e vale registrar porque de
            início não parecem: o e-mail diz *"Add offices to bottom right of
            hero image"* e a anotação do Roberto diz *"colocar os escritorios
            embaixo dos numeros"*. O e-mail é o autoritativo, e nesta dobra ele
            entrega a anotação de brinde: os números já ocupam a base do herói,
            então qualquer coisa colada no canto inferior direito nasce LOGO
            ABAIXO deles. Não houve escolha entre as duas leituras — a
            composição da página já as fazia coincidir.

            ✅ CENTRALIZADA (`justify-center`) DESDE A REVISÃO DE 21-09. Nasceu
            em `justify-end`, que era o *"bottom right"* do e-mail lido à letra,
            e a revisão pediu o centro.

            O ARGUMENTO QUE SUSTENTAVA A DIREITA NÃO SE PERDE NA TROCA, e é por
            isso que ele fica escrito: a lógica era cair sobre o skyline, que
            vive numa caixa de 72% presa à direita, e não sobre os 28% de `ink`
            chapado da esquerda. Centrada, a linha mede ~510px num campo útil de
            1360px, ou seja começa por volta dos 425px — já depois dos 403px em
            que a foto começa numa tela de 1440. Ela continua inteira sobre a
            fotografia; o que mudou foi a margem, não o assento.

            E mesmo que uma tela estreita empurrasse a ponta esquerda para fora
            da foto, o fecho da base é de LARGURA TOTAL (`inset-x-0`, alguns
            blocos acima) — ou seja, o contraste da linha não depende de ela
            estar de um lado ou do outro.

            O CONTRASTE É O QUE A DOBRA JÁ TEM. O fecho da base (o gradiente
            `to top` de meia altura, algumas linhas acima) chega OPACO na borda
            inferior justamente para os números poderem atravessar a parte clara
            da foto. A lista fica ainda mais embaixo que eles, ou seja no trecho
            mais fechado do gradiente — sobre `ink` praticamente sólido, o mesmo
            assento que a linha "1,000+" já usa e que foi medido em 6,76:1.
            Nenhuma camada nova: reaproveitar o que existe é o que impede a foto
            de escurecer mais um degrau.

            ⚠️ NÃO APARECE NO TELEFONE. A dobra de lá é apertada por medida, não
            por estilo — a caixa acima registra a conta inteira: 844px de tela
            para 844px de conteúdo, com o iPhone SE (667) já estourando quando
            os ícones da faixa voltaram. Cinco cidades ali teriam de virar duas
            ou três linhas de texto pequeno sobre a foto, e a página já publica
            os cinco endereços por inteiro na seção de escritórios. Some em
            `md`, que é o mesmo corte do lavado lateral e do fecho da base —
            ou seja, some exatamente onde a composição deixa de ser horizontal.

            TEXTO, E NÃO LINKS. A âncora `#offices` existe (é o `id` do
            `LocationsBlock`) e seria fácil ligar cada cidade a ela, mas as cinco
            iriam para o MESMO lugar: cinco links que fazem a mesma coisa leem
            como cinco destinos diferentes. É a mesma regra dos pilares, anotada
            lá embaixo — não prometer interação que não existe.

            OS DADOS SÃO O `OFFICES` DESTA PÁGINA, a lista do documento do
            cliente, e não `lib/offices.ts`: aqui só sai o nome da cidade, onde
            as duas listas batem, mas ler a outra fonte abriria a porta para as
            duas divergirem dentro da mesma página. A caixa do `OFFICES`, no topo
            do arquivo, tem as três divergências conhecidas. */}
        <div className="mx-auto hidden w-full max-w-[1440px] px-6 pb-6 md:block md:px-10">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[13px] font-semibold uppercase tracking-[2px] text-white/70">
            {OFFICES.map((o, i) => (
              <span key={o.city} className="flex items-center gap-x-3">
                {i > 0 && (
                  <span aria-hidden className="text-white/30">
                    ·
                  </span>
                )}
                {o.city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Block 3 · Our Purpose ─────────────────────────────────────
          "Single column, centred, generous margins." A frase de abertura é o
          maior tipo da página depois do herói, como o outline pede.

          ⚠️ OS NÚMEROS DOS BANNERS SÃO OS DO OUTLINE DE 08-09, NÃO A ORDEM DA
          PÁGINA — e desde 21-09 as duas coisas deixaram de coincidir. A Maliha
          pediu por e-mail: *"Move block one to block 3, block 2 and 3 should
          become 1 and 2."*, e a anotação da mesma call confirma qual é o bloco
          um: *"o bloco da foto seria o 3 da pagina"* — a faixa com a fotografia
          do time, que é o `#identity`. Então:

            era   1 identity (foto do time)  2 purpose  3 promise
            virou 1 purpose  2 promise  3 identity (foto do time)

          Os banners continuam dizendo "Block 2 · Our Identity" etc. porque esse
          número é o do DOCUMENTO do cliente, que é a referência de conteúdo e
          não mudou. Quem for conferir a ordem lê o arquivo de cima para baixo.

          ÂNCORAS: nenhuma mudou de seção — `#purpose`, `#promise` e `#identity`
          viajaram com o bloco delas. A única âncora da /about apontada de fora é
          `#values` (dois 301 no `next.config.mjs`, vindos do site antigo), e a
          seção de valores não se moveu.

          A EMENDA COM O HERÓI, para quem for olhar no ar: os dois são escuros e
          agora se tocam. Não é o defeito que a emenda do bloco da foto era (ali
          uma dobra escura encostava numa fotografia clara, ver a caixa do
          `#identity`); aqui a faixa começa com a mesma cor e o que muda é a
          textura da foto atrás do véu. Se ficar duro na revisão, o ajuste é
          desta seção — um respiro no topo —, não do herói.

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
        {/* NO TELEFONE O ENQUADRAMENTO VAI PARA A DIREITA (09-09), onde está a
            mulher de pé no palco. Centralizado, o corte mostrava o meio do
            salão — plateia de costas — e a pessoa que dá sentido à foto ficava
            fora da tela.

            A CONTA. Numa seção de 1028px de altura por 390 de largura, a caixa
            tem proporção 0,38:1 contra 1,50:1 do arquivo, então o `object-cover`
            escala PELA ALTURA: a imagem sai com 1543px de largura dentro de uma
            caixa de 390. Sobram 1153px de folga horizontal e nenhuma vertical —
            só o eixo X manda. A mulher está a ~80% da largura do arquivo, o que
            a põe a 1242px da borda esquerda da imagem escalada; a 85% de
            deslocamento a janela abre em 980px e ela cai a dois terços da tela,
            à direita do centro e inteira.

            `md:object-center` DEVOLVE O PADRÃO no desktop, e ali o eixo X não
            teria efeito nenhum de qualquer forma: numa dobra larga a caixa fica
            mais alongada que o arquivo, a escala passa a ser pela LARGURA e a
            folga vira vertical. É a mesma armadilha já documentada duas vezes
            neste arquivo, no herói — o eixo que funciona depende de qual lado
            sobra, e ele troca com a proporção da caixa. */}
        <Image
          src={purposePhoto}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="-z-20 object-cover object-[85%_center] md:object-center"
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

              véu da seção  78%  → manda em quanto da foto aparece
              painel        62%  → manda em quanto contraste o texto tem

            ⚠️ A COR DOS DOIS NÃO É MAIS O `ink` (09-09, terceiro ajuste). O
            `ink` é #373234 — um cinza QUENTE, não um preto —, e um véu feito
            dele deixa a seção inteira cinza por definição, por mais opacidade
            que se ponha. O pedido foi "mais preto mesmo", e isso é cor, não
            opacidade: as duas camadas passam a rgb(22,19,20), que é o mesmo
            matiz do `ink` com a luminosidade lá embaixo. Continua quente — não
            é preto puro, que ao lado de uma foto de luz incandescente ficaria
            azulado por contraste simultâneo.

            O PAINEL TEVE DE ACOMPANHAR, e não é detalhe: ele é composto POR CIMA
            do véu. Deixá-lo em `ink` cinza enquanto o entorno vira quase-preto
            faria dele a área mais CLARA da seção, invertendo exatamente o papel
            que ele tem — o assento escuro do texto viraria uma mancha clara no
            meio de um campo escuro.

            Por isso o véu pôde abrir sem que o texto perdesse nada: o que
            segura a legibilidade é o painel, não o véu. A vinheta saiu junto —
            ela existia só para simular o assento que o painel agora dá de
            verdade.

            O 78% é o terceiro valor. A primeira tentativa foi 42%, aproveitando
            toda a folga que o painel abriu, e a foto ficou dominante demais — o
            pedido era "levemente mais", não "o máximo que der". Veio 68% como
            meio-termo, e depois 78% a pedido ("aumentar em 15%"), que é o 68
            acrescido de 15% dele mesmo e não de 15 pontos.

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
          style={{ backgroundColor: "rgba(22, 19, 20, 0.78)" }}
        />
        <Reveal className="mx-auto max-w-[900px] px-6 py-12 md:px-10 md:py-28">
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
            {/* A MEDIDA SUBIU DE 720 PARA 820px em 09-09, e o número não é
                estético: medido, o título de então ("Our purpose is to keep
                leadership real.") pedia 744px a 40px numa linha só. Preso em 720
                ele quebrava por 24px e largava "real." sozinho na segunda linha.
                820px é a largura cheia do container (900 menos os 80 de
                padding), então é o teto real, não um valor escolhido — e por
                isso ele fica, mesmo com o título novo, que é mais curto.

                `whitespace-nowrap` nas duas últimas palavras, de volta em 22-09
                junto com o título que ele protege. A Maliha pediu o texto
                anterior a 21-09 ("Our purpose is to keep leadership real.").
                Sem a trava, "real." desce sozinho quando a linha quebra. */}
            <h2 className="font-serif max-w-[820px] text-[28px] font-semibold leading-[1.1] tracking-[-0.5px] text-white sm:text-[34px] md:text-[40px]">
              Our purpose is to keep{" "}
              <span className="whitespace-nowrap">leadership real.</span>
            </h2>
          </div>

          {/* ⚠️ 22-09 O TEXTO DE 21-09 SAIU DESTA SEÇÃO, a pedido da Maliha:
              voltar a versão anterior de "Why Corporate DNA exists". O h2, a
              citação e os dois parágrafos abaixo são os de antes do commit
              b1c431e. Os quatro parágrafos que estavam aqui ("When a client
              trusts us…") foram para o cartão Keeping Leadership Real, no
              bloco da foto. */}
          <blockquote className="mt-8 text-center">
            <p className="text-[17px] leading-[1.65] text-white/85 md:text-[18px]">
              <span aria-hidden className="mr-1 font-serif text-[28px] leading-none text-brand-light">
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
              <span aria-hidden className="ml-1 font-serif text-[28px] leading-none text-brand-light">
                ”
              </span>
            </p>
            <footer className="mt-5 text-[14px] font-medium tracking-[0.2px] text-white/60">
              Rhea Leckie, Founder &amp; CEO
            </footer>
          </blockquote>

          <div aria-hidden className="mx-auto mt-10 h-[2px] w-14 bg-brand-light" />

          <div className="mt-10 space-y-5 text-center text-[17px] leading-[1.65] text-white/75 md:text-[18px]">
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
        </Reveal>
      </section>

      {/* ── Block 4 · Our Promise ─────────────────────────────────────
          Declaração à esquerda, explicação à direita. Escolhido em 09-09 entre
          três versões montadas e comparadas na tela — as outras duas eram texto
          empilhado, variando só a medida e a posição.

          POR QUE ESTA. Das sete seções da página, seis empilham texto. O medo
          registrado era o leitor cansar antes do fim, e a resposta não é mudar
          corpo de letra: é ter, em algum ponto da leitura, uma seção que se lê
          de outro jeito. Esta é a candidata natural porque o conteúdo já vem
          partido em dois — uma promessa e a explicação dela. O arranjo não foi
          imposto ao texto; ele estava no texto.

          ⚠️ TENSÃO COM O OUTLINE, e ela é real. O documento diz "Type: single
          column prose. Narrower measure than the surrounding blocks, to signal a
          change of register." A imagem que a Maliha mandou mostra este bloco em
          duas colunas; o texto pede uma, e a regra do cabeçalho deste arquivo é
          que o documento ganha da imagem.

          O argumento para esta versão: a PROSA continua em coluna única. O que o
          documento rejeita é partir o corpo do texto em duas colunas, e não é o
          que acontece aqui — a coluna da esquerda é a declaração e o convite, a
          da direita é a prosa inteira, sem quebra. É argumento, não certeza. Se
          alguém do lado do cliente ler ao pé da letra, cai; as versões A (três
          tempos escalonados) e B (bloco estreito centrado) ficaram guardadas
          para esse caso.

          O CONVITE SOBE para junto da declaração, e não fica no pé da prosa. O
          outline manda ele "standalone, larger, red"; à esquerda, embaixo da
          promessa, ele fecha a coluna de voz — promessa e convite são as duas
          frases que a CDNA diz na primeira pessoa. A prosa da direita explica as
          duas. Deixá-lo embaixo da coluna direita o transformaria em conclusão
          do argumento, que é outra coisa.

          `md:col-span-5` e `md:col-start-7 md:col-span-6` de 12, com `gap-x-16`:
          a declaração fica em ~530px e a prosa em ~650px num container de 1440.
          A coluna direita é a mais larga de propósito — ela tem quatro vezes
          mais texto, e igualar as duas deixaria a esquerda com buraco embaixo. */}
      <section id="promise" className="bg-paper">
        <Reveal className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-28">
          <TypeLabel>What we promise.</TypeLabel>
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-serif text-[28px] font-medium leading-[1.2] tracking-[-0.4px] text-ink md:text-[36px]">
                To keep our craft real: honest with ourselves, true to our
                clients.
              </p>
              <p className="mt-8 font-serif text-[21px] font-medium leading-[1.35] tracking-[-0.3px] text-brand md:text-[25px]">
                We invite you to experience the DNA Partnership.
              </p>
            </div>
            <div className="space-y-5 text-[17px] leading-[1.7] text-muted lg:col-span-6 lg:col-start-7 md:text-[18px]">
              <p>
                We do not hide behind language to sound more intelligent. We do
                not build layers that clients have to climb over to reach us. We
                listen as much as we talk. We hold the space for our clients to
                be their real, unedited selves, and meet us in true partnership.
              </p>
              <p>
                Boldness lives in duality with humility. Our designs, ideas and
                methods of challenging are bold enough to nudge traditional
                comfort zones, and incubated through humility so the results are
                sustainable. We are confident, but never arrogant.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Block 2 · Our Identity ────────────────────────────────────
          "Two column. Photograph left, quote right. Four pillar cards in a row
          beneath, full width." (outline)

          ⚠️ É O TERCEIRO BLOCO DA PÁGINA DESDE 21-09 — *"o bloco da foto seria
          o 3 da pagina"*. O porquê inteiro está no banner do `#purpose`, que
          passou a abrir a leitura; aqui fica só o que a descida muda de fato:

          • O RESPIRO CONTRA O HERÓI PERDEU O DESTINATÁRIO. O `pt-12 md:pt-16`
            logo abaixo existia porque a foto do time nascia colada na base de
            uma dobra escura de sangria total. Agora o vizinho de cima é o
            `#promise`, que é `paper` e termina em padding. O respiro FICA — ele
            continua sendo o vão de entrada da faixa —, mas a razão registrada
            nele é histórica, não mais a atual.
          • O VIZINHO DE BAIXO VIROU O `#values`, que é branco. A faixa dos
            pilares, que fecha esta seção, voltou a `bg-paper` por causa disso —
            ver a caixa lá embaixo.

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
        {/* RESPIRO ENTRE O HERÓI E A FOTO (09-09). A foto nascia colada na base
            do herói — medido, zero pixel entre o fim de um e o começo da outra.

            Emenda direta entre uma dobra escura de sangria total e uma
            fotografia clara não lê como continuidade, lê como falha de
            espaçamento: são duas superfícies de peso muito diferente que se
            tocam sem transição, e o olho procura a borda que deveria existir.

            48px no telefone e 64px no desktop — deliberadamente MENOS que os
            64/80px que as outras seções usam de respiro. Aqui não se quer uma
            separação de seção: o herói e a foto do time contam a mesma coisa em
            sequência, então o vão precisa dizer "respira" sem dizer "acabou". */}
        <Reveal className="mx-auto max-w-[1440px] px-6 pt-12 md:px-10 md:pt-16">
          {/* A CITAÇÃO ENCAVALA A FOTO — referência de 09-09 (`ref
              testimonial.png`): foto de um lado, card do depoimento montado por
              cima da borda dela, deslocado na vertical.

              ⚠️ A SOBREPOSIÇÃO AQUI É CURTA DE PROPÓSITO, e é a única coisa que
              muda em relação à referência. Lá o card cobre cerca de um quarto da
              foto, e funciona porque é o retrato de UMA pessoa: o card entra
              pelo fundo, ao lado do rosto. A nossa é uma foto de GRUPO, e um
              quarto da largura significa duas ou três pessoas tapadas. São 64px,
              ~8% da largura da foto num container de 1440 — o suficiente para o
              olho ler "um está por cima do outro", pouco o bastante para caber
              na margem da fotografia.

              A SOMBRA existe porque o card é branco sobre seção branca: nas três
              bordas que não encostam na foto não haveria nada desenhando o card.
              É o segundo uso de sombra no site (o primeiro é o painel do submenu
              na nav), e por isso ela é larga, baixa e quase transparente — para
              dizer "isto está por cima" sem virar um estilo novo.

              CANTO RETO, ao contrário da referência. Mesma decisão já registrada
              no topo do arquivo sobre os cards arredondados da imagem da Maliha:
              o que se aproveita da referência é o arranjo, não a linguagem.

              NO TELEFONE não há lado nenhum para encavalar, então o card sobe
              32px por cima da BASE da foto e recolhe 16px de cada margem. A base
              é a parte mais segura de uma foto de grupo (é onde ficam os
              troncos, não os rostos), e o recuo lateral é o que faz a coisa ler
              como card sobreposto em vez de bloco de texto encostado. */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-0">
            {/* ✅ A FOTO DO TIME CHEGOU EM 15-09 — o time sentado na escada, que
                é a que a Maliha procurava na própria call de 14-09 ("do you guys
                already have the one of the teams sitting on the stairs?"). Ela
                veio na pasta `1.About Page` do Drive e com o nome
                `About page.jpeg`, ou seja endereçada a ESTA página.

                ⚠️ É O RETOQUE COM SEIS DESDE 17-09, e não mais a foto original.
                Na daily ela apontou esta imagem como "muito distorcida" e pediu
                para deixá-la "do tamanho real".

                MEDIDO ANTES DE MEXER, porque a queixa não se sustentava como
                estava escrita: o arquivo antigo era 1066x1333, a caixa é 4:5 e
                `object-cover` não deforma nada — a comparação contra o original
                2:3 bateu com um recorte centrado (diferença média de 1,85 num
                canal de 255, ou seja, o mesmo arquivo). Não havia distorção
                geométrica em lugar nenhum. O QUE HAVIA era uma foto DESATUALIZADA:
                a /team já rodava o retoque com seis pessoas desde 16-09 (as duas
                da fileira da frente foram trocadas por dois homens de terno) e
                esta página tinha ficado para trás com a versão anterior. É a
                diferença que ela viu.

                O RECORTE É NOSSO E ESTÁ ANOTADO para quem for refazê-lo: o
                retoque nasce PAISAGEM (`team/team-stairs-landscape-six.jpg`,
                2400x1600, 3:2) e o slot é retrato 4:5, então saem 1280x1600
                a partir de `left: 608` — a janela mais larga que cabe na altura
                cheia, centrada no grupo. Ninguém é cortado: sobram ~110px de
                margem na mulher de blazer creme, à esquerda, e ~90px no homem de
                camisa azul, à direita. Mexer no `left` sem refazer essa conta
                come alguém numa das duas pontas.

                ⚠️ O NOME DO ARQUIVO MUDOU JUNTO (`team-stairs-about-six.jpg`),
                e isso não é cosmético: o otimizador do Next serve por URL e já
                entregou versão velha neste projeto por causa de troca de imagem
                com nome mantido.

                ⚠️ A MESMA FOTO RODA NA /team, em recorte diferente (lá ela vai
                paisagem, inteira). O `CDNA_04_Team.docx` avisa que usar a mesma
                fotografia nas duas páginas "is visible", e isso continua sendo
                verdade — foi decisão consciente de preencher os dois slots
                agora, com recortes que não leem como o mesmo arquivo repetido.
                A segunda foto continua valendo a pena pedir. */}
            <div className="relative aspect-[4/5] self-center">
              <Image
                src={teamStairs}
                alt="The Corporate DNA team on the office stairs"
                fill
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-cover object-center"
              />
            </div>

            <div className="relative z-10 mx-4 -mt-8 bg-white px-7 py-9 shadow-[0_18px_50px_-14px_rgba(55,50,52,0.28)] sm:mx-10 lg:mx-0 lg:-ml-16 lg:mt-0 lg:px-12 lg:py-12">
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
                  {/* 22-09: o corpo que estava em "Why Corporate DNA exists"
                      ("When a client trusts us…") veio para cá. A fala "Keeping
                      It Real isn’t a slogan" e a assinatura da Rhea saíram com
                      ele — aquele crédito era da citação, e estes quatro
                      parágrafos não são assinados. A aspa de fecho continua na
                      última linha, com `leading-[0]` para o glifo de 44px não
                      esticar o parágrafo. */}
                  <div className="space-y-5 text-[17px] leading-[1.65] text-ink/80 md:text-[18px]">
                    <p>
                      When a client trusts us as a consulting firm, that trust starts
                      from the very first interaction with the people who represent
                      CorporateDNA and how we live our purpose in the moments that
                      matter.
                    </p>
                    <p>
                      How we listen. How we challenge. How we add value. How we navigate
                      difficult decisions and conversations. And how we use our
                      discernment to know when to lead, when to question and when to
                      listen.
                    </p>
                    <p>
                      For us, Keeping Leadership Real starts from the inside out. It
                      shapes how we work with each other and how we show up with our
                      clients—with honesty, care, candour and experience.
                    </p>
                    <p>
                      Because before our clients experience our work, they experience
                      our people. And our people bring our purpose to{" "}
                      <span className="whitespace-nowrap">
                        life.
                        <span
                          aria-hidden
                          className="ml-1.5 inline-block translate-y-[0.36em] select-none font-serif text-[44px] leading-[0] text-brand"
                        >
                          ”
                        </span>
                      </span>
                    </p>
                  </div>
                </blockquote>
            </div>
          </div>
        </Reveal>

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
        {/* A BANDA VOLTA A BRANCA. O `bg-paper` entrou em 09-09 para o card
            BRANCO ter silhueta — a borda em #ece9e6 sobre #fff era invisível na
            prática. Com o card preto essa razão deixou de existir, e manter a
            faixa cinza colocaria TRÊS valores na mesma seção (branco da seção,
            cinza da faixa, preto do card) onde dois bastam. O pedido original
            era destaque para os cards; preto sobre branco entrega mais destaque
            do que branco sobre cinza jamais entregou.

            O <div> extra fica, em vez de ser desmontado: ele é o que faria a
            faixa sangrar até a borda da janela se ela voltar a ter cor, e voltar
            atrás nisso é uma classe.

            ⚠️ E É EXATAMENTE ISSO QUE ACONTECEU EM 21-09: voltou a `bg-paper`, a
            classe prevista acima. Não é volta atrás na decisão — o argumento dos
            "três valores na mesma seção" continua de pé —, é o efeito colateral
            da reordenação. Esta faixa passou a ser a ÚLTIMA coisa da seção que
            agora antecede o `#values`, e o `#values` é branco: branca aqui, o
            corte entre as duas seções simplesmente não existiria, e o visitante
            leria os pilares e os valores como uma lista só de nove caixas.

            Dos dois chãos disponíveis, `paper` é o que a página já usa para
            marcar essa fronteira, e ele devolve de brinde a silhueta ao card
            branco — que é a razão pela qual ele existiu aqui em 09-09. O card
            fica como está (branco, borda, sombra), porque é especificação
            escrita do cliente. */}
        <div className="bg-paper">
          <Reveal className="mx-auto max-w-[1440px] px-6 pb-10 pt-8 md:px-10 md:pb-20 md:pt-16">
          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              /* AS BLACK BOXES VOLTAM, agora como superfície (09-09).
                 A Rhea pediu de volta o device do site antigo, e ele já existe
                 aqui: as linhas da Solutions (`.sbox`, em globals.css) são a
                 leitura moderna dele. O que muda é o que se aproveita — lá o
                 preto é o estado de repouso de um LINK, e o gesto é o vermelho
                 inclinado atravessando no hover; aqui é só a superfície.

                 ⚠️ NÃO TRAGO O VARRIMENTO JUNTO, e é de propósito: estes quatro
                 cards não são clicáveis. Um preenchimento no hover promete uma
                 interação que não existe, e o visitante que passa o mouse e não
                 encontra link aprende que o hover deste site mente. O preto é a
                 superfície; o gesto continua sendo dos itens que levam a algum
                 lugar.

                 A LUZ VEM DA REFERÊNCIA MEDIDA, não estimada. A primeira
                 versão usava um gradiente LINEAR a 158° e ficou fraca — o
                 cliente reparou. Amostrando os pixels de `card ref.png`:

                   canto sup. esquerdo  #3d4759  ← o ponto mais claro
                   meio do topo         #232c3f
                   canto sup. direito   #1b2334
                   centro               #1b2334
                   base (meio)          #151c2e  ← o mais escuro

                 Ou seja: a luz é RADIAL e nasce no canto superior esquerdo, não
                 espalhada pela aresta de cima. E a queda é rápida — sobre a base
                 #1b2334, o canto tem 16% de branco por cima e no meio do topo já
                 caiu para 3,5%. Um gradiente linear distribui esse ganho pela
                 largura inteira e é exatamente por isso que a versão anterior
                 parecia lavada em vez de iluminada.

                 Daí as duas camadas: um radial ancorado em `0% 0%` e um linear
                 só na metade de baixo, para o pé do card fechar como na
                 referência. Escritas como CAMADAS sobre o `ink`, e não como
                 hexadecimais, para a cor da marca seguir sendo a fonte da
                 verdade — a referência é azul-petróleo, a nossa não, e o que se
                 copia é o comportamento da luz.

                 A ELIPSE É ALTA (85% x 110%), e essa proporção é o segundo
                 conserto. Uma primeira tentativa de radial usou 68% x 58% e
                 ainda ficava aquém: batia no canto e morria antes do meio da
                 lateral esquerda, onde a referência ainda tem +5% de luz. A luz
                 dela desce pela aresta, não só ilumina o vértice. Conferido
                 amostrando os mesmos pontos relativos nos dois:

                                    referência   aqui
                   canto sup. esq.     +16%      +16,5%
                   meio do topo        +3,5%     +4,5%
                   meio da esquerda    +5%       +7%
                   fundo sob o card    −6%       −7%

                 A SOMBRA também estava na referência e faltava aqui: fora do
                 card o fundo vai de #f9fafa nas laterais para #eaebec logo
                 abaixo dele, uma queda de ~6% concentrada embaixo. É uma sombra
                 larga, baixa e deslocada para baixo — a mesma família da que o
                 card da citação usa, dois blocos acima.

                 Canto reto, como todo o resto da página. */
              /* Especificação do cliente, 09-09, palavra por palavra: "White
                 cards, rounded corners, red bold heading, charcoal body. Equal
                 height, four across on desktop, two by two on tablet, stacked
                 on mobile."

                 Ela ganha de duas decisões anteriores, e as duas vinham do lado
                 deles — registro para ninguém tratar como capricho nosso:
                   • ERAM PRETOS A PEDIDO DA RHEA, que pediu de volta o device do
                     site antigo. Branco desfaz isso.
                   • CANTO ARREDONDADO CONTRARIA O SISTEMA. O cabeçalho desta
                     página registra que os cards arredondados da referência da
                     Maliha foram descartados porque o site é de canto vivo.
                     Estes quatro são os únicos cantos redondos da /about-v2.

                 "BOLD" É 600, NÃO 700: a Source Serif carrega 400/500/600 aqui.
                 Pedir 700 faria o navegador engordar o 600 sozinho, e negrito
                 sintético em serifa borra o contraste entre haste fina e grossa.
                 Para 700 de verdade, acrescentar "700" ao `weight` no topo.

                 ⚠️ TINHA UM QUARTO DE DISCO crescendo do canto no scroll, pedido
                 em 09-09 e removido no mesmo dia: sobre card preto ele era branco
                 e funcionava; sobre card branco virou rosa e não ficou bom. Saiu
                 junto o componente `PillarCard`, que existia só para animá-lo. */
              <div
                key={p.heading}
                className="rounded-xl border border-line bg-white p-6 shadow-[0_4px_16px_-6px_rgba(55,50,52,0.18)]"
              >
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
                <h3 className="font-serif text-[19px] font-semibold leading-[1.25] text-brand md:text-[20px]">
                  {p.heading}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-ink/80">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
          </Reveal>
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
        <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-10 md:py-20">
          {/* ALINHADO À ESQUERDA NO TELEFONE, centralizado a partir de `md`.
              Centralizado numa coluna de 342px o texto quebra em seis linhas
              esfarrapadas dos dois lados, e — o que pesa mais — fica fora do
              eixo da lista logo abaixo, que é toda alinhada à esquerda. Dois
              alinhamentos diferentes na mesma seção, num telefone, leem como
              descuido.

              No desktop a centralização continua fazendo sentido: são duas
              linhas curtas no meio de uma faixa de 1360px, e ali elas anunciam
              o bloco em vez de disputar eixo com ele. */}
          <div className="flex flex-col items-start text-left md:items-center md:text-center">
            <TypeLabel>What we believe, and how we work.</TypeLabel>
            <p className="max-w-[760px] text-[20px] leading-[1.4] text-ink md:text-[22px]">
              <strong className="font-semibold">Our values</strong> are deeply
              human centric, and always in service of a client’s greatness. We do
              not compromise on them, however complex the circumstances.
            </p>
          </div>

          {/* ⏸️ O QUE ESTEVE AQUI ENTRE 09-09 E 14-09, porque a decisão vai e
              volta e o histórico é o que impede a terceira rodada:

              Primeiro foram CINCO CARDS, construídos em 09-09 sobre a
              `card ref 4.png` — faixa rosa no topo, ícone dentro dela, sombra
              suave (commit 02cdc51). Saíram horas depois, no mesmo dia, por um
              detalhe do outline: ele pede "a red rule BETWEEN each", e para
              haver régua entre cards eles teriam de encostar, perdendo vão e
              sombra.

              Entrou então a LISTA EMPILHADA: cada valor uma fileira de largura
              cheia, ícone e título na coluna da esquerda (5fr), corpo na da
              direita (7fr), quatro réguas vermelhas entre os cinco. As colunas
              não eram estética — 1360px de medida corrida dariam ~180
              caracteres por linha, contra os 45–75 legíveis.

              Duas notas de implementação que sobrevivem às duas versões e
              custaram tempo:
              • A régua é `border-t-2` explícito, e NÃO `divide-y-2`. O
                `divide-*` da Tailwind v4 emite `border-width: calc(2px *
                var(--tw-divide-y-reverse))`, e aqui a variável não chegou
                inicializada na folha servida: o `calc` resolvia para zero e as
                réguas sumiam, com a COR aplicada — falha que passa despercebida
                numa revisão rápida.
              • Se algum dia isto voltar a ser UMA coluna com texto largo, o
                contêiner precisa de `grid-cols-[minmax(0,1fr)]` e não do `grid`
                de uma coluna que vem por padrão: a trilha implícita é `auto`,
                que se dimensiona pelo max-content, e isso faz um `max-w` de
                parágrafo virar largura PREFERIDA em vez de teto. Medido num
                telefone de 390px, o texto saía com 680px e transbordava. */}
          {/* ⚠️ VOLTARAM A SER CINCO CAIXAS EM 14-09 — É O ITEM 2 DA DAILY, e a
              lista horizontal descrita acima é exatamente o que ela estava
              vendo:
              *"can we make these like vertical by any chance, so you know
              currently they're in horizontals — can we have, is it five, five
              little boxes with the text underneath."*

              ONDE O PEDIDO ESTAVA ANCORADO ERRADO. O doc de correções mandou
              mexer nos tiles de REGIÃO (`lg:grid-cols-5`, bloco 6). Não é ali:
              na fita ela diz "these" e, na frase seguinte, *"and then THIS ONE,
              can we make the map a tiny bit smaller"* — logo "these" é o bloco
              imediatamente ANTES do mapa, que é esta lista. Os tiles de região
              vêm DEPOIS do mapa e já eram cinco em linha com o texto embaixo.

              "HORIZONTAIS" ERA LITERAL: cada valor era uma FILEIRA de largura
              cheia, com o ícone e o título na coluna da esquerda (5fr) e o corpo
              na da direita (7fr), cinco delas empilhadas com régua vermelha
              entre cada. Agora cada valor é uma COLUNA: ícone em cima, nome,
              corpo embaixo — e as cinco correm lado a lado, como no mockup dela
              de 08-09 e como nos cards que existiram nesta página até 09-09
              (commit 02cdc51).

              O OUTLINE DO CLIENTE SEMPRE PERMITIU AS DUAS, em letra: "Five
              cards, or a stacked list with a red rule between each. Not a
              carousel: all five must be visible without interaction." A lista
              foi escolhida em 09-09 porque a régua vermelha estava no texto e,
              entre cards com vão, não há onde pôr régua "entre cada". Com o
              pedido dela a escolha se inverte, e a régua vermelha sobrevive
              como `border-t-2` NO TOPO DE CADA CAIXA — que é onde ela já estava
              nos tiles de região, e o que dá as cinco marcas alinhadas num eixo
              só. Os cinco continuam visíveis sem interação, que é a parte
              inegociável do outline.

              O TÍTULO VOLTA A 20px, de 24/26. Não é gosto: a coluna caiu de
              ~440px para ~250px, que é a mesma medida dos cards de 09-09, e a
              caixa daquele dia registra o motivo — "Relationship Centricity" a
              26px pede ~300px e quebra em três linhas.

              O ÍCONE VOLTA PARA CIMA pela razão espelhada da que o mandou para
              o lado: numa fileira larga ele ficaria sozinho num canto, longe da
              palavra que ilustra; numa coluna de 250px ele ABRE a caixa, que é o
              que o mockup e a referência fazem.

              `sm:grid-cols-2 lg:grid-cols-5`: cinco colunas a 1024 dariam 180px
              por caixa e o corpo (até 160 caracteres) viraria uma tira de 20
              linhas. Duas colunas no meio do caminho, cinco só de `lg` para
              cima — a mesma escada dos tiles de região, que é a outra grade de
              cinco desta página. */}
          <Reveal className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((v) => (
              <div key={v.name} className="border-t-2 border-brand pt-5">
                <span className="block text-brand">
                  <ValueIcon name={v.icon} />
                </span>
                <h3 className="font-serif mt-4 text-[20px] font-medium leading-[1.2] text-ink">
                  {v.name}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.6] text-muted">
                  {v.body}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Block 6 · Our Regions ─────────────────────────────────────
          Cabeçalho, intro e mapa aqui. O mapa entra sem cabeçalho próprio
          (`eyebrow={null} title={null}`), senão a seção abriria dois títulos.

          O outline pede o mapa "region level only, with no per client pins" — o
          WorldCoverageMap pinta países e marca as cidades das regiões do CMS,
          nunca clientes, então já é esse nível.

          ⚠️ FUNDO `paper` NOS DOIS PEDAÇOS — 10-09. A região eram três irmãos
          no DOM (o cabeçalho, o mapa, e os escritórios abaixo — o mapa virou
          filho do cabeçalho em 15-09, ver abaixo), e eles estavam em `white`,
          `white` e `paper`. Duas consequências, ambas erradas: o único corte de
          cor da região caía DENTRO da seção, partindo o mapa das locations que
          ele ilustra; e a fronteira com o `#values` logo acima, que é onde a
          página realmente muda de assunto, não tinha corte nenhum — eram três
          faixas brancas seguidas.

          A borda do `paper` sobe para cá. Os pedaços passam a dividir um chão
          só, "Where we work" lê como um bloco, e o degrau branco→paper marca a
          passagem de "What we believe" para "Where we work".

          O `#values` acima fica `white` e o `#people` abaixo fica `ink`, então
          a faixa não encosta em nenhum vizinho da mesma cor. */}
      <section id="regions" className="bg-paper">
        {/* ⚠️ O ESPAÇO FINAL DA FAIXA É PADDING DAQUI (`pb-*`), nunca margem do
            último filho. Não é preferência de estilo: quando o vão até o mapa
            era `mb-12` no parágrafo, a página ganhava uma faixa BRANCA de 48px
            no meio da região.

            O motivo é colapso de margem. Quem é flex item nesta página é o
            `<main className="flex-1">` (linha 555) — as `section` dentro dele
            são blocos comuns, não itens de flex, e portanto NÃO abrem contexto
            de formatação próprio. A margem inferior do último filho então sobe
            por este `<div>` e por esta `<section>`, que não tinham
            padding-bottom nenhum, e vira margem DA SEÇÃO. O vão passa a mostrar
            o fundo do `<main>`, que é transparente, e por trás dele o `bg-white`
            do wrapper externo.

            Enquanto esta seção era branca ninguém via. Ao passar para `paper`
            (10-09) a margem fugida virou uma listra branca no meio da faixa.

            Padding não colapsa. Vale para qualquer seção colorida desta página:
            o espaçamento final tem de ser padding do container, nunca margem do
            último filho. */}
        <Reveal className="mx-auto max-w-[1440px] px-6 pb-16 pt-10 md:px-10 md:pb-20 md:pt-20">
          <TypeLabel>Where we work.</TypeLabel>

          {/* ⚠️ TEXTO À ESQUERDA, MAPA À DIREITA — item 3 da call de 14-09.
              Antes o parágrafo ficava sozinho numa linha e o mapa entrava
              abaixo, como seção própria, em largura cheia. A Maliha pediu
              *"the map just a tiny bit smaller and the text on the left hand
              side"*, e o lado — a fala tinha "left" e "right" em sequência, e o
              item ficou travado até 15-09 — foi confirmado como texto à
              esquerda.

              O rótulo "Where we work." FICA FORA DO GRID, em cima dos dois:
              *"Where we work can remain at the top, but the body of the text
              ... we can have that on the right"* — só o corpo desce para o lado
              do mapa.

              O mapa vem `bare`: sem a seção e o container de 1200px dele, senão
              abriria uma segunda faixa dentro da coluna e o SVG pararia de
              acompanhar a largura dela.

              4fr/8fr, não 6/6: o mapa é um SVG de viewBox fixo, e os rótulos das
              cidades (8,5 unidades de 880) encolhem junto com a coluna. Em
              meia largura eles caem a ~7px renderizados; em dois terços ficam
              em ~8,4px, que é o "tiny bit smaller" do pedido sem virar
              ilegível. O parágrafo cabe em ~440px sem viuvez.

              A quebra é `xl` (1280px) e não `lg`: a 1024px a coluna do mapa
              daria 620px e os rótulos caíriam a ~6px, ilegíveis. Abaixo de
              1280px o bloco empilha e o mapa volta à largura cheia, que é o
              layout que já estava aprovado.

              `items-center` alinha o texto ao meio da altura do mapa; empilhado
              o texto volta para cima dele. */}
          <div className="grid items-center gap-x-12 gap-y-6 xl:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
            {/* ⚠️ ERA "over 75 senior practitioners" ATÉ 17-09. O pedido da
                daily citava a seção Global faculty da /team (*"trocar 75 por 60+
                - a faculty of 60+"*), e esta linha é a MESMA afirmação em outra
                página — deixá-la em 75 faria a firma publicar dois tamanhos de
                faculty a um clique de distância.

                O "over" SAIU JUNTO, e não por estilo: o `+` já diz "mais de", e
                "over 60+" seria a mesma palavra duas vezes. A troca de 75 para
                60+ é, aliás, de número EXATO para PISO — ver a caixa do h2 na
                /team, que é onde isso está explicado. */}
            <p className="max-w-[620px] text-[20px] leading-[1.4] text-ink md:text-[22px]">
              With headquarters in London, Singapore, Dubai, Riyadh and Miami,
              and a faculty of 60+ senior practitioners, we deliver globally.
            </p>
            <WorldCoverageMap eyebrow={null} title={null} tone="paper" bare />
          </div>
        </Reveal>
      </section>

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
        <Reveal className="mx-auto max-w-[1440px] px-6 py-10 md:px-10 md:py-20">
          {/* Cinco tiles de região. Sem foto: os campos de CMS do outline são
              ORDEM, 09-09: as regiões passaram a vir LOGO ABAIXO DO MAPA, e os
              escritórios depois delas. O mapa mostra onde a CDNA opera; a régua
              seguinte natural é o nome dessas regiões, não o endereço de uma
              recepção. Endereço é dado de contato e fecha a seção.

              Some com a inversão o `mt-16` que separava estes tiles do link de
              contato — agora eles abrem o bloco e o vão fica com a lista, abaixo.

              { name, descriptor }. Os descritores estão em HOLD.

              `mt-16`, e não os `mt-5` de antes — 09-09. Os 20px vinham de casar
              com o `gap-5` da grade de cards que existia acima; sem a grade,
              eles deixavam o link "Contact" mais perto destes tiles do que da
              lista a que ele pertence, e o link passava a ler como rótulo desta
              faixa. O vão maior devolve o link ao grupo certo.

              SEM `bg-white` — 09-09. Tirados os cards dos escritórios, estes
              cinco eram as únicas caixas que sobravam na faixa e passavam a
              saltar como resto do desenho antigo. Ficam o filete vermelho no
              topo e o texto, direto sobre o `paper`: mesma leitura de coluna,
              sem a caixa. O `p-6` também sai, porque padding sem fundo só
              empurra o texto para longe do filete que o ancora. */}
          {/* ⚠️ ESTES TILES NÃO SÃO O ITEM 2, e chegaram a ser mexidos por
              engano em 14-09. O doc de correções ancorou o pedido dela aqui
              ("→ o `lg:grid-cols-5`"), e a fita mostra que não é: ela diz
              *"can we make these vertical... and then THIS ONE, can we make the
              map a tiny bit smaller"*, ou seja, "these" é o bloco IMEDIATAMENTE
              ANTES do mapa — e estes tiles vêm DEPOIS dele. O que vem antes é a
              lista de valores, que de fato corre em fileiras horizontais.

              E o mockup dela de 08-09 (`1.About Page/WhatsApp Image 2026-09-08
              at 18.28.29.jpeg`) desenha estas cinco regiões EM LINHA, com a
              imagem em cima e o texto embaixo — que é o que já está aqui, menos
              a imagem, que segue em HOLD (slot 06). Mexer nisto era desfazer o
              que ela aprovou.

              O ARRANJO EM LINHA FICA. O item 2 mora na seção `#values`.

              ⚠️ SÃO QUATRO COLUNAS DESDE 16-09, E ERAM CINCO — e a troca não
              desfaz nada do parágrafo acima. A Índia saiu da LISTA a pedido dela
              na daily ("India will be covered under Asia"), primeiro na /team e
              aqui logo depois, quando ela confirmou que valia para as duas. O
              que mudou foi a contagem, não o desenho: quatro tiles numa grade de
              cinco deixariam uma coluna vazia e um vão do tamanho de um tile na
              ponta direita.

              As duas listas continuam tendo de bater — é instrução do documento
              de Team ("tiles matching the About page regions"), e o `lib/team.ts`
              tem a metade de lá. */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {REGIONS.map((r) => (
              <div key={r.name} className="border-t-2 border-brand pt-5">
                {/* SAIU DA CAIXA ALTA. Era 15px/700/maiúsculas — o mesmo
                    tratamento do rótulo vermelho, aplicado a um TÍTULO, e
                    caixa alta em grotesca pesada é exatamente o "quadrado" que
                    esta página está testando tirar. Em Geist 500 a 20px, caixa
                    baixa, o tile passa a ter título e legenda em vez de dois
                    rótulos empilhados, e alinha com os valores, que são a outra
                    grade de cinco da página. */}
                <h3 className="font-serif text-[20px] font-medium leading-[1.2] text-ink">
                  {r.name}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.6] text-muted">
                  {r.descriptor}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Block 6c · Os escritórios, abertos e estáticos ──────────────── */}
      {/* ⚠️ E EM 21-09 A LISTA ESTÁTICA VOLTOU — `layout="static"`, a prop nova
          do `LocationsBlock`. O pedido veio nas duas línguas da mesma call: por
          e-mail *"Have offices static - 5 horizontal static."* e na anotação do
          Roberto *"na parte dos offices colocar eles abertos sempre"*. As duas
          dizem a mesma coisa e as duas revogam o pedido de 14-09 registrado
          logo abaixo, que é o motivo de ele continuar escrito aqui: o carrossel
          não foi um erro nosso, foi o que ela pediu na call anterior.

          NÃO É A LISTA DE 14-09 DE VOLTA. Aquela eram cinco FILEIRAS de largura
          cheia empilhadas; esta são cinco COLUNAS lado a lado, que é o
          "5 horizontal" literal do e-mail e o mesmo arranjo dos tiles de região
          e dos cinco valores desta página. Em telefone e tablet ela empilha —
          cinco colunas em 390px dariam 66px cada. A escada e o porquê estão na
          caixa da prop, em `components/LocationsBlock.tsx`.

          PROP, E NÃO UM COMPONENTE NOVO nem uma mudança no bloco: ele roda na
          home, na /our-clients, na /team e na /contact com o carrossel, e
          nenhuma delas pediu isso. O padrão da prop é o comportamento de hoje.

          ⚠️ O `showMap={false}` ABAIXO FICOU SEM EFEITO, e continua escrito de
          propósito: no `layout="static"` não há cidade ativa, então não há
          câmera de mapa para mover e o Leaflet nunca entra. Tirar a prop daqui
          não mudaria nada na tela, e mantê-la é o que documenta que a /about
          segue sem o segundo mapa — que é uma decisão dela, de 14-09, e não um
          efeito colateral do layout novo. */}
      {/* ⚠️ A LISTA ESTÁTICA SAIU EM 14-09. O pedido da Maliha na daily (item 4)
          foi trazer para cá a faixa de endereços da home: *"I did like on the
          original landing page that it was scrolling for the addresses — if we
          can have just the bottom bit, without the map."* A lista de cinco
          fileiras que vivia aqui (cidade em serifa grande, endereço, contato,
          separadas por filete) está no commit anterior, com o raciocínio inteiro
          de por que ela deixou de ser grade de cards em 09-09.

          `showMap={false}` É O "WITHOUT THE MAP". O mapa da /about é o
          `WorldCoverageMap` logo acima — um segundo mapa, do Leaflet, a 400px de
          distância, era exatamente a duplicação que ela apontou na home (item
          33). Sem ele o Leaflet nem entra no bundle desta página.

          ================================================================
          OS DADOS CONTINUAM SENDO OS DO DOCUMENTO DO CLIENTE
          ================================================================
          Esta é a parte que não pode se perder na troca. O `OFFICES` acima NÃO
          é `lib/offices.ts`, e a caixa dele explica por quê: três registros
          divergem do que está no ar (o endereço e o telefone de Singapura, o
          telefone de Dubai, o telefone de Miami), e ninguém confirmou qual
          versão vale. Passar o bloco a ler a fonte da home reverteria os três em
          silêncio — uma regressão de conteúdo que ninguém pediu e que só
          apareceria quando o cliente relesse a página.

          Por isso o `offices={...}`: o bloco recebe a lista DAQUI, adaptada ao
          tipo `Office`. O que ele não tem é `coords`/`zoom`, que são do mapa —
          e em vez de inventar zeros, que virariam armadilha no dia em que
          alguém ligasse o mapa aqui, eles vêm da entrada de mesma cidade em
          `lib/offices.ts`. Coordenada de escritório é a mesma nos dois arquivos;
          o que diverge é o texto.

          `showEmail` porque a lista que saiu publicava o e-mail de cada cidade e
          o painel do carrossel mostrava só endereço e telefone. Sem a prop, a
          troca custaria cinco endereços de contato. */}
      <LocationsBlock
        offices={OFFICE_CARDS}
        eyebrow="Our offices"
        /* SEM PARÁGRAFO DE CONTEXTO: o da home ("From our established hubs in
           London, Singapore…") repetiria, quase palavra por palavra, o "With
           headquarters in London, Singapore, Dubai, Riyadh and Miami" que abre
           a faixa do mapa duas seções acima. String vazia é falsy e o bloco
           simplesmente não renderiza o <p>. */
        context=""
        tone="paper"
        maxWidthClass="max-w-[1440px]"
        typeLabel
        showMap={false}
        showEmail
        layout="static"
      />

      {/* ── Block 6b · The people behind it ───────────────────────────
          Pedido pela Maliha em 09-09, apontando o bloco que já existe na
          /our-identity no ar (`app/our-identity/page.tsx:167`). Copy idêntica —
          rótulo, título, corpo e "Meet the team →" — porque o pedido foi trazer
          AQUELE bloco, não desenhar um novo.

          É também o que respondemos à pergunta dela sobre ligar a foto do time
          a uma galeria: em vez de fazer a fotografia do bloco 2 navegar em
          silêncio, a rota fica aqui, rotulada, no fim da leitura.

          POSIÇÃO — antes da faixa de fecho, e não depois dela. O pedido foi
          "última seção"; last CONTENT section é o que faz sentido. A faixa de
          fecho é a chamada final da página, e dois botões em sequência
          ("Meet the team", "Get in touch") disputam o mesmo clique. Assim o
          leitor termina a About, recebe a rota para o time, e só então a
          chamada comercial. Mover para depois é trocar duas linhas, se
          discordarem.

          FUNDO BRANCO, e não `paper` como o original. Aqui o bloco anterior (o
          mapa e os escritórios) já é `paper`; dois `paper` seguidos viram uma
          faixa só e o corte entre as seções some. Na /our-identity o vizinho é
          branco, por isso lá o `paper` funciona.

          MEDIDA — container de 1440 e alinhado à esquerda, como todo o resto
          desta página, em vez da coluna centrada de 820px do original. É a
          mesma razão da foto do bloco 2: a borda esquerda de tudo cai na mesma
          linha vertical. O texto fica preso em 680px para não virar linha
          longa demais numa tela grande.

          BOTÃO DE CONTORNO, não sólido. O sólido vermelho é da faixa logo
          abaixo, que é a ação principal. Dois preenchidos seguidos anulam a
          hierarquia — este é o caminho lateral, aquele é o convite. */}
      <section id="people" className="bg-ink text-white">
        <Reveal className="mx-auto max-w-[1440px] px-6 py-10 md:px-10 md:py-20">
          <TypeLabel onDark>The people behind it</TypeLabel>
          <h2 className="max-w-[680px] font-serif text-[30px] font-medium leading-[1.15] tracking-[-0.6px] text-white md:text-[38px]">
            Identity is what the team does under pressure.
          </h2>
          <p className="mt-5 max-w-[620px] text-[17px] leading-[1.7] text-white/70">
            Our leadership, our global faculty and the regions we deliver from
            now have an area of their own.
          </p>
          {/* O MESMO BOTÃO DA HOME, desde 10-09 — mesmo componente, mesmas
              cores, mesma animação (o bloco vermelho claro varrendo da seta para
              a esquerda). Ver `components/HoverFillButton.tsx`.

              ERA UM BOTÃO DE CONTORNO, e a nota acima explicava por quê: o
              sólido vermelho pertencia à faixa de fecho logo abaixo, que era a
              ação principal, e dois preenchidos seguidos anulariam a hierarquia.
              ESSA FAIXA SAIU em 09-09 (ver o comentário logo abaixo desta
              seção). Sem ela não há segundo botão para disputar nada, então o
              motivo do contorno morreu junto — este virou o único CTA da página
              e pode ser sólido.

              O rótulo passa a ser caixa alta, porque é o tratamento do
              componente. Se "Meet the team" tiver de voltar a ser em caixa
              mista, é uma prop de tipografia, não um botão diferente. */}
          <HoverFillButton label="Meet the team" href="/team" className="mt-8" />
        </Reveal>
      </section>

      {/* ⚠️ A FAIXA DE FECHO SAIU em 09-09, a pedido do cliente. Era o Block 7:
          fundo escuro, "Let’s make leadership real." e um botão "Get in touch".

          CONSEQUÊNCIA, para quem for cobrar depois: a About passou a ser a única
          página do site que termina SEM chamada de contato. O outline de Services
          registra que a faixa compartilhada roda em todas as outras. O contato
          continua alcançável — pelo link "Contact" no fim dos escritórios e pelo
          botão do menu — mas deixou de ser o último gesto da página.

          O que fecha a página agora é a seção "The people behind it", que passou
          a fundo escuro no mesmo pedido. O escuro no fim continua existindo; o
          que mudou é que ele carrega o time em vez da chamada comercial.

          O bloco 7 do OUTLINE, esse, nunca chegou: dele veio só a linha de campos
          de CMS (`repeatable link_card`), sem título e sem texto. Se aquele texto
          aparecer, é aqui que ele entra. */}
      </main>
      <SiteFooter />
    </div>
  );
}

