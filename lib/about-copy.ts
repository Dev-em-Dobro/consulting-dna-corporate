/**
 * OS TEXTOS EDITÁVEIS DA ABOUT — o que a cliente pode trocar em `/edit-about`
 * sem passar por nós nem pelo CMS. Mesma máquina da home; ver `lib/home-copy.ts`
 * para o desenho, e `docs/edit-paginas.md` para o todo.
 *
 * O QUE ISTO É: uma fonte única, em código, de TODA a copy que a
 * `app/about/page.tsx` escrevia à mão — herói, os quatro números, propósito,
 * promessa, identidade, valores, regiões, escritórios e o bloco do time. A
 * página lê daqui via `getAboutCopy()`; o que a cliente salva fica FORA do repo
 * (Vercel Blob, ver `lib/page-copy/store.ts`) e é mesclado por cima destes
 * padrões a cada renderização.
 *
 * ⚠️ OS QUATRO NÚMEROS (`stats`) SÃO TAMBÉM OS DA CLIENTS & IMPACT. Eles eram o
 * `FIRM_STATS` de `lib/stats.ts` — que, desde 18-09, as duas páginas importavam
 * justamente para não divergirem ("19 anos numa página e 18 na outra" é o
 * defeito que a caixa de lá registra). Pôr os números no editor da About e
 * deixar a outra página lendo a constante teria recriado a divergência na
 * PRIMEIRA edição. Então a direção se inverteu: os valores e rótulos moram
 * AQUI, o `FIRM_STATS` passou a derivar deste objeto (só acrescentando o
 * `icon`, que é desenho e não texto), e a `/our-clients` lê a mesma copy salva
 * por `getFirmStats()`. Ver a caixa em `lib/stats.ts`.
 *
 * ⚠️ NADA DE `fs`, `blob`, zod OU VARIÁVEL DE AMBIENTE AQUI. Este arquivo é
 * carregado pelos testes do Node (`npm test`) com import relativo e extensão
 * `.ts` explícita — por isso o único import abaixo é de TIPO, e relativo.
 *
 * O QUE FICOU DE FORA, de propósito: os ícones (`StatIcon` e `ValueIcon`, que
 * são chave de desenho e casam por posição), as fotos, o `WorldCoverageMap`, a
 * `NavV2`, o `SiteFooter` e a metadata de SEO — mesma regra da home.
 */
import type { EditorField, EditorSection } from "./page-copy/fields.ts";

export type AboutStat = { value: string; label: string };
export type AboutPillar = { heading: string; body: string };
export type AboutValue = { name: string; body: string };
export type AboutRegion = { name: string; offices: string; descriptor: string };
/** `tel` vazio = escritório sem telefone publicado (Riyadh e Miami, hoje). */
export type AboutOffice = { city: string; address: string[]; tel: string; email: string };

/** O formato — validado pelo zod em `about-copy-schema.ts`, que espelha isto. */
export type AboutCopy = {
  hero: { label: string; title: string; subtitleLines: string[] };
  stats: AboutStat[];
  purpose: {
    label: string;
    title: string;
    titleNowrap: string;
    quote: string;
    attribution: string;
    body: string[];
  };
  promise: { label: string; lead: string; accent: string; body: string[] };
  identity: { label: string; quote: string[]; pillars: AboutPillar[] };
  values: { label: string; intro: string; items: AboutValue[] };
  regions: { label: string; intro: string; items: AboutRegion[] };
  offices: AboutOffice[];
  people: { label: string; title: string; body: string; cta: string };
};

/**
 * Os padrões — a copy que estava inline em `app/about/page.tsx` em 23-09, sem
 * uma palavra alterada. Ela vem do outline de 08-09 da Maliha, com as correções
 * das dailies de 17-09 e 18-09; a procedência de cada bloco continua anotada no
 * ponto de uso, na página.
 *
 * ⚠️ DUAS MARCAÇÕES viajam dentro do texto e não são enfeite:
 *   • `**…**` vira negrito na renderização (`inlineEmphasis`, em
 *     `lib/page-copy/text.ts`). Usado em `purpose.quote` e `values.intro`.
 *     Não aninha — `**a **b** c**` corrompe em silêncio.
 *   • `purpose.titleNowrap` é a PARTE FINAL do título que não pode quebrar
 *     linha; o `whitespace-nowrap` fica no JSX, e o texto, aqui.
 */
export const DEFAULT_ABOUT_COPY: AboutCopy = {
  hero: {
    label: "About",
    title: "Keeping Leadership Real.",
    /* DUAS LINHAS CONTROLADAS: no desktop cada uma cai na sua, por
       `<span className="md:block">`; no telefone elas correm como um parágrafo
       só. É lista de linhas, e não um texto com quebra, porque a quebra é
       decisão de composição e tem de sobreviver à edição. */
    subtitleLines: ["Our purpose, our promise,", "what we believe, and where we work."],
  },
  stats: [
    { value: "19 years", label: "of senior leadership advisory, since London, 2007" },
    /* 23-09 (main): eram cinco até a Índia entrar em Asia (16-09). Americas,
       UK & Europe, Middle East & North Africa, Asia. */
    { value: "4 regions", label: "of global programme delivery" },
    { value: "10,000+", label: "leaders coached and teams developed" },
    { value: "5 of the top 10", label: "FTSE 100 companies are long standing clients" },
  ],
  purpose: {
    label: "Why CorporateDNA exists.",
    title: "Our purpose is to keep",
    titleNowrap: "leadership real.",
    quote:
      "**With roots in Big 4 Consulting**, the genesis of CorporateDNA is that a consultant’s obligation is to cut through complexity, connect the threads and deliver the truth. We want to take off language which hides real problems and bring solutions and transformations that are true to the lived realities of our clients. Accessing this truth and the powerful transformation that it entails, depends on honesty, courage, and authenticity.",
    attribution: "Rhea Leckie, Founder & CEO",
    body: [
      "That obligation shapes everything we do. We release the power, humanity and honesty of leadership in all its parts: the values an organisation holds, the culture they produce, the teams that carry them, and what makes each individual leader stronger.",
      "We anchor the work in the inner and outer games, so change is inside out, complete, and rooted in truth and impact.",
    ],
  },
  promise: {
    label: "What we promise.",
    lead: "To keep our craft real: honest with ourselves, true to our clients.",
    accent: "We invite you to experience the DNA Partnership.",
    body: [
      "We do not hide behind language to sound more intelligent. We do not build layers that clients have to climb over to reach us. We listen as much as we talk. We hold the space for our clients to be their real, unedited selves, and meet us in true partnership.",
      "Boldness lives in duality with humility. Our designs, ideas and methods of challenging are bold enough to nudge traditional comfort zones, and incubated through humility so the results are sustainable. We are confident, but never arrogant.",
    ],
  },
  identity: {
    label: "Keeping Leadership Real",
    /* AS ASPAS DECORATIVAS NÃO ESTÃO NO TEXTO. A de abertura é um `<span>`
       vermelho fora da coluna, no primeiro parágrafo; a de fechamento gruda na
       ÚLTIMA PALAVRA do último parágrafo, por um `nowrap`, para não cair
       sozinha numa linha. As duas são desenho e ficam no JSX — se viessem no
       texto, a cliente teria de manter as duas casadas à mão. */
    quote: [
      "When a client trusts us as a consulting firm, that trust starts from the very first interaction with the people who represent CorporateDNA and how we live our purpose in the moments that matter.",
      "How we listen. How we challenge. How we add value. How we navigate difficult decisions and conversations. And how we use our discernment to know when to lead, when to question and when to listen.",
      "For us, Keeping Leadership Real starts from the inside out. It shapes how we work with each other and how we show up with our clients, with honesty, care, candour and experience.",
      "Because before our clients experience our work, they experience our people. And our people bring our purpose to life.",
    ],
    pillars: [
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
    ],
  },
  values: {
    label: "What we believe, and how we work.",
    intro:
      "**Our values** are deeply human centric, and always in service of a client’s greatness. We do not compromise on them, however complex the circumstances.",
    /* Os ÍCONES não entram: `bulb / leaf / pair / target / shield` são chave de
       desenho e casam POR POSIÇÃO com esta lista. Reordenar os cinco valores no
       editor reordena os nomes e os textos, e os ícones ficam onde estavam. */
    items: [
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
    ],
  },
  regions: {
    label: "Where we work.",
    intro:
      "With headquarters in London, Singapore, Dubai, Riyadh and Miami, and a faculty of 60+ senior practitioners, we deliver globally.",
    items: [
      {
        name: "Americas",
        offices: "Miami",
        descriptor: "Driving leadership impact across North and South America.",
      },
      {
        name: "UK & Europe",
        offices: "London",
        descriptor: "Partnering with organisations to build resilient leaders across Europe.",
      },
      {
        name: "Middle East & North Africa",
        offices: "Dubai and Riyadh",
        descriptor: "Supporting transformation across the Middle East and North Africa.",
      },
      {
        name: "Asia",
        offices: "Singapore",
        descriptor: "Developing leaders for a fast-changing Asia.",
      },
    ],
  },
  /**
   * ⚠️ ESTES ENDEREÇOS DIVERGEM DE `lib/offices.ts` DE PROPÓSITO, em três
   * registros (Singapore, Dubai, Miami) — a caixa em `app/about/page.tsx`
   * conta qual é a discordância entre o documento do cliente e o que o site
   * publica. Editar aqui muda SÓ a About.
   *
   * ⚠️ O NOME DA CIDADE CASA COM `lib/offices.ts` para buscar a coordenada do
   * mapa. Na About o mapa está desligado (`showMap={false}`), então renomear
   * não quebra nada HOJE; se alguém ligar o mapa um dia, uma cidade renomeada
   * cai na coordenada nula.
   */
  offices: [
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
      tel: "",
      email: "riyadh@corporatednaconsulting.com",
    },
    {
      city: "Miami",
      address: ["1221 Brickell Ave, Suite 900", "Miami, FL 33131"],
      tel: "",
      email: "miami@corporatednaconsulting.com",
    },
  ],
  people: {
    label: "The people behind it",
    title: "Identity is what the team does under pressure.",
    body: "Our leadership, our global faculty and the regions we deliver from now have an area of their own.",
    cta: "Meet the team",
  },
};

/* ------------------------------------------------------------------------- */
/* O MAPA DO EDITOR — cada campo que a tela `/edit-about` mostra, na ordem da  */
/* página. O formato vem de `lib/page-copy/fields.ts`, igual ao da home.       */
/*                                                                            */
/* ONDE UMA SEÇÃO DA PÁGINA VIRA DUAS AQUI: `identity` e `regions`. Não é      */
/* capricho — cada seção do editor mostra UM print de como ela aparece no      */
/* site, numa coluna de 440px. A Identity inteira é foto + citação de quatro   */
/* parágrafos + quatro cartões, e a de regiões é texto + mapa-múndi + quatro   */
/* tiles; num print só, nessa largura, não se lê nada. Partidas em duas, cada  */
/* metade tem um print legível e uma lista de campos do tamanho de uma tela.   */
/* As duas metades apontam para a MESMA âncora no site.                       */
/* ------------------------------------------------------------------------- */

const statFields = (i: number, n: string): EditorField[] => [
  { path: `stats.${i}.value`, label: `${n} — the number`, kind: "text" },
  { path: `stats.${i}.label`, label: `${n} — what it means`, kind: "textarea" },
];

const pillarFields = (i: number, n: string): EditorField[] => [
  { path: `identity.pillars.${i}.heading`, label: `${n} — heading`, kind: "text" },
  { path: `identity.pillars.${i}.body`, label: `${n} — text`, kind: "textarea" },
];

const valueFields = (i: number, n: string): EditorField[] => [
  { path: `values.items.${i}.name`, label: `${n} — name`, kind: "text" },
  { path: `values.items.${i}.body`, label: `${n} — text`, kind: "textarea" },
];

const regionFields = (i: number, n: string): EditorField[] => [
  { path: `regions.items.${i}.name`, label: `${n} — region`, kind: "text" },
  { path: `regions.items.${i}.offices`, label: `${n} — offices`, kind: "text" },
  { path: `regions.items.${i}.descriptor`, label: `${n} — one-line descriptor`, kind: "textarea" },
];

const officeFields = (i: number, n: string): EditorField[] => [
  { path: `offices.${i}.city`, label: `${n} — city`, kind: "text" },
  { path: `offices.${i}.address`, label: `${n} — address`, kind: "lines", hint: "One line per line." },
  { path: `offices.${i}.tel`, label: `${n} — phone`, kind: "text", hint: "Leave empty for no phone." },
  { path: `offices.${i}.email`, label: `${n} — e-mail`, kind: "text" },
];

const BOLD_HINT = "Put **two asterisks** around words to make them bold.";

export const EDITOR_SECTIONS: EditorSection[] = [
  {
    id: "hero",
    title: "Hero",
    anchor: "/about",
    fields: [
      { path: "hero.label", label: "Small label", kind: "text" },
      { path: "hero.title", label: "Headline", kind: "text" },
      {
        path: "hero.subtitleLines",
        label: "Sub-headline",
        kind: "lines",
        hint: "One per line. On a wide screen each line sits on its own row.",
      },
    ],
  },
  {
    id: "stats",
    title: "The four numbers",
    anchor: "/about#about-stats",
    fields: [
      ...statFields(0, "Number 1"),
      ...statFields(1, "Number 2"),
      ...statFields(2, "Number 3"),
      ...statFields(3, "Number 4"),
    ],
  },
  {
    id: "purpose",
    title: "Our purpose",
    anchor: "/about#purpose",
    fields: [
      { path: "purpose.label", label: "Small label", kind: "text" },
      { path: "purpose.title", label: "Heading (first part)", kind: "text" },
      {
        path: "purpose.titleNowrap",
        label: "Heading (last words)",
        kind: "text",
        hint: "These words are kept together on one line.",
      },
      { path: "purpose.quote", label: "Quote", kind: "textarea", hint: BOLD_HINT },
      { path: "purpose.attribution", label: "Who said it", kind: "text" },
      {
        path: "purpose.body",
        label: "Text below the quote",
        kind: "paragraphs",
        hint: "Leave an empty line between paragraphs.",
      },
    ],
  },
  {
    id: "promise",
    title: "What we promise",
    anchor: "/about#promise",
    fields: [
      { path: "promise.label", label: "Small label", kind: "text" },
      { path: "promise.lead", label: "Heading", kind: "textarea" },
      { path: "promise.accent", label: "Red line below the heading", kind: "textarea" },
      {
        path: "promise.body",
        label: "Text",
        kind: "paragraphs",
        hint: "Leave an empty line between paragraphs.",
      },
    ],
  },
  {
    id: "identity",
    title: "Identity — the quote",
    anchor: "/about#identity",
    fields: [
      { path: "identity.label", label: "Small label", kind: "text" },
      {
        path: "identity.quote",
        label: "Quote",
        kind: "paragraphs",
        hint: "Leave an empty line between paragraphs. The red quote marks are added automatically.",
      },
    ],
  },
  {
    id: "pillars",
    title: "Identity — the four cards",
    anchor: "/about#identity",
    fields: [
      ...pillarFields(0, "Card 1"),
      ...pillarFields(1, "Card 2"),
      ...pillarFields(2, "Card 3"),
      ...pillarFields(3, "Card 4"),
    ],
  },
  {
    id: "values",
    title: "What we believe",
    anchor: "/about#values",
    fields: [
      { path: "values.label", label: "Small label", kind: "text" },
      { path: "values.intro", label: "Opening text", kind: "textarea", hint: BOLD_HINT },
      ...valueFields(0, "Value 1"),
      ...valueFields(1, "Value 2"),
      ...valueFields(2, "Value 3"),
      ...valueFields(3, "Value 4"),
      ...valueFields(4, "Value 5"),
    ],
  },
  {
    id: "regions",
    title: "Where we work",
    anchor: "/about#regions",
    fields: [
      { path: "regions.label", label: "Small label", kind: "text" },
      { path: "regions.intro", label: "Text beside the map", kind: "textarea" },
    ],
  },
  {
    id: "region-tiles",
    title: "The four regions",
    anchor: "/about#region-tiles",
    fields: [
      ...regionFields(0, "Region 1"),
      ...regionFields(1, "Region 2"),
      ...regionFields(2, "Region 3"),
      ...regionFields(3, "Region 4"),
    ],
  },
  {
    id: "offices",
    title: "Our offices",
    /* #region-tiles, e não #offices: a faixa solta de escritórios saiu da
       About em 23-09 (main) e cada endereço passou a morar dentro da coluna
       da sua região. O que a cliente edita aqui aparece lá. */
    anchor: "/about#region-tiles",
    fields: [
      ...officeFields(0, "Office 1"),
      ...officeFields(1, "Office 2"),
      ...officeFields(2, "Office 3"),
      ...officeFields(3, "Office 4"),
      ...officeFields(4, "Office 5"),
    ],
  },
  {
    id: "people",
    title: "The people behind it",
    anchor: "/about#people",
    fields: [
      { path: "people.label", label: "Small label", kind: "text" },
      { path: "people.title", label: "Heading", kind: "text" },
      { path: "people.body", label: "Supporting text", kind: "textarea" },
      { path: "people.cta", label: "Button", kind: "text", hint: "The button always links to the team page." },
    ],
  },
];
