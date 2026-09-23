/**
 * OS TEXTOS EDITÁVEIS DA HOME — o que a cliente pode trocar em `/edit-home`
 * sem passar por nós nem pelo CMS.
 *
 * O QUE ISTO É: uma fonte única, em código, de TODA a copy que a home escreve à
 * mão (herói, propósito, faixa de credibilidade, impacto, pessoas, livro e
 * contato). `app/page.tsx` e o `HeroV2` leem daqui em vez de trazer a frase
 * inline. O que a cliente salva no editor é guardado FORA do repo (ver
 * `lib/home-copy-server.ts`) e mesclado por cima destes padrões em cada
 * renderização da home — então o padrão continua sendo o que está aqui, e um
 * campo apagado no editor cai de volta nele em vez de sumir da tela.
 *
 * O QUE ISTO NÃO É: CMS. Não tem locale, não tem rascunho/publicado, não tem
 * histórico. Foi feito em 23-09 para a cliente poder mexer na copy da home na
 * mesma hora; quando isto migrar para o CMS, o `getHomeCopy()` passa a ler de
 * lá e este arquivo vira só o fallback — os consumidores não mudam.
 *
 * ⚠️ ESTE ARQUIVO É IMPORTADO PELO CLIENTE (o editor). Nada de `fs`, `blob` ou
 * variável de ambiente aqui — isso mora no `-server`.
 *
 * O QUE FICOU DE FORA, de propósito: os componentes compartilhados com outras
 * páginas (rodapé, faixa de prêmios, formulário de contato, endossos do livro,
 * mural de logos). Editá-los pela home mudaria as outras páginas também, e
 * isso é decisão para quando o CMS assumir. Os quatro NÚMEROS da faixa escura
 * já vêm do CMS (`page_home`); aqui só os rótulos deles são editáveis.
 */
import { books } from "./books.ts";

export type HomeCase = { client: string; sector: string; challenge: string; metric: string; metricLabel: string };
export type HomePillar = { title: string; body: string };

/** O formato — validado pelo zod em `home-copy-schema.ts`, que espelha isto. */
export type HomeCopy = {
  hero: { title: string; subtitle: string; primaryCta: string; secondaryCta: string };
  solve: { label: string; title: string; subtitle: string; purposeTitle: string; purposeAccent: string; reals: string[] };
  credibility: { label: string; statLabels: string[] };
  impact: { label: string; title: string; challengeLabel: string; readMore: string; cases: HomeCase[] };
  people: { label: string; title: string; subtitle: string; intro: string; pillars: HomePillar[]; partnersLabel: string };
  book: { kicker: string; headline: string; body: string[] };
  contact: { title: string; subtitle: string };
};

/**
 * Os padrões — a copy que estava inline na home em 23-09, sem alteração. O
 * livro vem de `lib/books.ts` porque a /insights mostra o mesmo cartão; o
 * editor da home só sobrepõe o texto NA HOME, o de lá segue o módulo.
 */
export const DEFAULT_HOME_COPY: HomeCopy = {
  hero: {
    title: "Keeping Leadership Real",
    subtitle:
      "We help CEOs, CHROs & CLOs build real leadership when the stakes are high — through real conversations, real choices and real decisions that deliver in the moments that matter.",
    primaryCta: "Discuss a leadership challenge",
    secondaryCta: "See the work",
  },
  solve: {
    label: "What we solve",
    title: "The leadership challenges that determine enterprise performance.",
    subtitle:
      "We start with what is at stake for the organisation — then bring the people, method and evidence to solve it.",
    purposeTitle: "Our purpose is to make leadership",
    purposeAccent: "real.",
    reals: ["pressures", "politics", "choices", "judgement", "people", "consequences"],
  },
  credibility: {
    label: "Trusted by leadership teams at",
    statLabels: [
      "Work sponsored by Chairman / CXO",
      "Years advising senior leaders",
      "Regions of global delivery",
      "Faculty of senior practitioners",
    ],
  },
  impact: {
    label: "Client impact",
    title: "Results, not promises — measured where it matters.",
    challengeLabel: "Challenge",
    readMore: "read more here",
    cases: [
      {
        client: "Heineken",
        sector: "FMCG",
        challenge:
          "Accelerate the readiness and advancement of high-potential leaders across the group.",
        metric: "45%",
        metricLabel: "higher promotion rate for programme participants",
      },
      {
        client: "Coca-Cola",
        sector: "FMCG",
        challenge:
          "Reset a legacy beverage brand by embedding new mindsets and behaviours across a newly formed APAC leadership team.",
        metric: "43",
        metricLabel: "leaders transformed across APAC & Japan",
      },
      {
        client: "Shell",
        sector: "Energy",
        challenge:
          "Scale women's leadership development across a global engineering workforce.",
        metric: "6,300",
        metricLabel: "women leaders impacted across the programme",
      },
    ],
  },
  people: {
    label: "Our people",
    title: "Senior advisors who have sat where our clients sit.",
    subtitle:
      "A leadership team of seasoned advisors, backed by a global faculty of 75 practitioners delivering across 36 countries.",
    intro: "With our “One DNA TEAM” principle, we execute as one collaborative team.",
    pillars: [
      {
        title: "The DNA Experience",
        body:
          "We blend our individual talents with the collective expertise of our global pool of 75 members across 36 countries, and deliver the power of the “DNA experience” to every client. Each time, every time.",
      },
      {
        title: "Trusted Relationships",
        body:
          "Relationships are at the core of who we are. We build long-term, deep relationships with our people and become part of each other’s stories. We are part of a family who care about each other, stay close and grow, laugh and unmask together.",
      },
      {
        title: "Inclusion & Diversity",
        body:
          "Our best-in-class people are full of great character and personality, representing a range of backgrounds in the behavioural sciences and business; coming from different markets around the world, and representing a wide range of social identities.",
      },
    ],
    partnersLabel: "In partnership with",
  },
  book: {
    kicker: books[0].kicker,
    headline: books[0].headline,
    body: books[0].body,
  },
  contact: {
    title: "What is changing, and where does leadership need to go?",
    subtitle:
      "Tell us the leadership challenge you are facing. We will respond with a considered, confidential point of view — not a sales pitch.",
  },
};


/* ------------------------------------------------------------------------- */
/* O MAPA DO EDITOR — cada campo que a tela `/edit-home` mostra, na ordem da   */
/* página. `path` é o caminho dentro de `HomeCopy`; `kind` decide o controle:  */
/* `text` (uma linha), `textarea` (parágrafo), `lines` (lista, uma por linha), */
/* `paragraphs` (lista, um parágrafo por bloco separado por linha em branco).  */
/* ------------------------------------------------------------------------- */

export type FieldKind = "text" | "textarea" | "lines" | "paragraphs";
export type EditorField = { path: string; label: string; kind: FieldKind; hint?: string };
export type EditorSection = { id: string; title: string; anchor: string; fields: EditorField[] };

const caseFields = (i: number, name: string): EditorField[] => [
  { path: `impact.cases.${i}.client`, label: `${name} — client name`, kind: "text" },
  { path: `impact.cases.${i}.sector`, label: `${name} — sector`, kind: "text" },
  { path: `impact.cases.${i}.challenge`, label: `${name} — challenge`, kind: "textarea" },
  { path: `impact.cases.${i}.metric`, label: `${name} — headline number`, kind: "text", hint: "e.g. 45% or 6,300" },
  { path: `impact.cases.${i}.metricLabel`, label: `${name} — what the number means`, kind: "text" },
];

const pillarFields = (i: number, n: string): EditorField[] => [
  { path: `people.pillars.${i}.title`, label: `${n} — heading`, kind: "text" },
  { path: `people.pillars.${i}.body`, label: `${n} — text`, kind: "textarea" },
];

export const EDITOR_SECTIONS: EditorSection[] = [
  {
    id: "hero",
    title: "Hero",
    anchor: "/",
    fields: [
      { path: "hero.title", label: "Headline", kind: "text", hint: "The red full stop is added automatically." },
      { path: "hero.subtitle", label: "Sub-headline", kind: "textarea" },
      { path: "hero.primaryCta", label: "Primary button", kind: "text" },
      { path: "hero.secondaryCta", label: "Secondary button", kind: "text" },
    ],
  },
  {
    id: "solve",
    title: "What we solve & our purpose",
    anchor: "/#solve",
    fields: [
      { path: "solve.label", label: "Small label", kind: "text" },
      { path: "solve.title", label: "Heading", kind: "text" },
      { path: "solve.subtitle", label: "Supporting text", kind: "textarea" },
      { path: "solve.purposeTitle", label: "Purpose line (first part)", kind: "text" },
      { path: "solve.purposeAccent", label: "Purpose line (red word)", kind: "text" },
      { path: "solve.reals", label: "Cycling words", kind: "lines", hint: "One per line. Shown after the word “Real”." },
    ],
  },
  {
    id: "credibility",
    title: "Logos & numbers",
    anchor: "/#solve",
    fields: [
      { path: "credibility.label", label: "Line above the logos", kind: "text" },
      { path: "credibility.statLabels.0", label: "Label for the 1st number (Chairman / CXO)", kind: "text" },
      { path: "credibility.statLabels.1", label: "Label for the 2nd number (years)", kind: "text" },
      { path: "credibility.statLabels.2", label: "Label for the 3rd number (regions)", kind: "text" },
      { path: "credibility.statLabels.3", label: "Label for the 4th number (faculty)", kind: "text", hint: "The numbers themselves come from the CMS." },
    ],
  },
  {
    id: "impact",
    title: "Client impact",
    anchor: "/#impact",
    fields: [
      { path: "impact.label", label: "Small label", kind: "text" },
      { path: "impact.title", label: "Heading", kind: "text" },
      { path: "impact.challengeLabel", label: "Label above each challenge", kind: "text" },
      { path: "impact.readMore", label: "Link text on each card", kind: "text" },
      ...caseFields(0, "Card 1"),
      ...caseFields(1, "Card 2"),
      ...caseFields(2, "Card 3"),
    ],
  },
  {
    id: "people",
    title: "Our people",
    anchor: "/#people",
    fields: [
      { path: "people.label", label: "Small label", kind: "text" },
      { path: "people.title", label: "Heading", kind: "text" },
      { path: "people.subtitle", label: "Supporting text", kind: "textarea" },
      { path: "people.intro", label: "Intro line", kind: "textarea" },
      ...pillarFields(0, "Block 1"),
      ...pillarFields(1, "Block 2"),
      ...pillarFields(2, "Block 3"),
      { path: "people.partnersLabel", label: "Line above the partner logos", kind: "text" },
    ],
  },
  {
    id: "book",
    title: "Book",
    anchor: "/#book",
    fields: [
      { path: "book.kicker", label: "Small label", kind: "text" },
      { path: "book.headline", label: "Heading", kind: "text" },
      { path: "book.body", label: "Text", kind: "paragraphs", hint: "Leave an empty line between paragraphs." },
    ],
  },
  {
    id: "contact",
    title: "Contact",
    anchor: "/#contact",
    fields: [
      { path: "contact.title", label: "Heading", kind: "text" },
      { path: "contact.subtitle", label: "Supporting text", kind: "textarea" },
    ],
  },
];

/** Lê `a.b.0.c` de dentro do objeto. */
export function getAtPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

/** Devolve uma CÓPIA do objeto com `a.b.0.c` trocado — nunca muta o original. */
export function setAtPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split(".");
  const clone = (node: unknown, i: number): unknown => {
    if (i === keys.length) return value;
    const key = keys[i];
    if (Array.isArray(node)) {
      const next = node.slice();
      next[Number(key)] = clone(node[Number(key)], i + 1);
      return next;
    }
    const src = (node ?? {}) as Record<string, unknown>;
    return { ...src, [key]: clone(src[key], i + 1) };
  };
  return clone(obj, 0) as T;
}

/** Texto do controle → valor no objeto, conforme o `kind`. */
export function fromInput(kind: FieldKind, text: string): unknown {
  if (kind === "lines") return text.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  if (kind === "paragraphs") return text.split(/\r?\n\s*\r?\n/).map((s) => s.trim()).filter(Boolean);
  return text;
}

/** Valor no objeto → texto do controle. */
export function toInput(kind: FieldKind, value: unknown): string {
  if (Array.isArray(value)) return value.join(kind === "paragraphs" ? "\n\n" : "\n");
  return typeof value === "string" ? value : "";
}
