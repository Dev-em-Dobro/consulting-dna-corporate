/**
 * OS TEXTOS EDITÁVEIS DA TEAM — o que a cliente pode trocar em `/edit-team`
 * sem passar por nós nem pelo CMS. Mesma máquina da home e da About; ver
 * `docs/edit-paginas.md`.
 *
 * ⚠️ ESTA PÁGINA NÃO É SÓ COPY, e por isso o recorte é mais estreito que o das
 * outras duas. Ela mistura texto de seção com DADOS DE PESSOAS — seis líderes,
 * três programme managers e vinte e três da faculty —, e cada pessoa carrega
 * coisas que não são texto:
 *
 *   • `portrait`, que é um caminho de arquivo em `public/team/`;
 *   • `portraitPosition`, que é o recorte daquele arquivo específico;
 *   • `cmsSlug`, que é o que amarra o card ao perfil do CMS que o botão "+"
 *     abre — e que já casa por SLUG, e não por nome, justamente porque os nomes
 *     divergem entre as duas fontes (ver a caixa em `lib/team.ts`).
 *
 * DECIDIDO EM 23-09, com o cliente: entram os textos das seções e, das pessoas,
 * só o que é copy de verdade e envelhece — CARGO, REGIÃO e a FRASE dos seis
 * líderes. NOME e FOTO ficam em código. Um nome editável desamarraria o pop-up
 * do CMS sem aviso nenhum na tela, e foto não é texto.
 *
 * FORA, de propósito: as três programme managers e os vinte e três da faculty
 * (nome + região), que são quase só nome e retrato; os nomes das regiões da
 * faculty, que são derivados de uma tabela de códigos em `lib/team.ts`; e o
 * mosaico de fotos do "One team".
 *
 * ⚠️ OS PADRÃO SÃO DERIVADOS DE `lib/team.ts`, e não copiados. Cargo, região e
 * frase dos seis, mais o título e os quatro cartões da DNA experience, continuam
 * escritos lá, com a procedência de cada linha anotada no ponto de uso — e este
 * arquivo os lê. Copiá-los para cá criaria duas fontes para o mesmo texto, que
 * é o defeito que a faixa de números da About já custou caro (ver
 * `lib/about-copy.ts`).
 *
 * Consequência a saber: se alguém editar um desses textos em `lib/team.ts`
 * depois de a cliente ter salvo, o salvo continua ganhando — como em qualquer
 * campo deste editor. O padrão muda, o publicado não.
 */
import { dnaLead, dnaStrands, leaders } from "./team.ts";
import type { EditorField, EditorSection } from "./page-copy/fields.ts";

export type TeamLeaderCopy = { role: string; region: string; quote: string };
export type TeamStrand = { title: string; body: string };

/** O formato — validado pelo zod em `team-copy-schema.ts`, que espelha isto. */
export type TeamCopy = {
  hero: { eyebrow: string; title: string; subtitle: string };
  leadership: { label: string; title: string; managersTitle: string };
  /** Os SEIS, na ordem de `leaders` em `lib/team.ts`. Casa por posição. */
  leaders: TeamLeaderCopy[];
  oneTeam: { label: string; lines: string[] };
  faculty: { label: string; title: string; intro: string };
  dna: { label: string; title: string; strands: TeamStrand[] };
  cta: { strapline: string; line: string; ctaLabel: string };
};

export const DEFAULT_TEAM_COPY: TeamCopy = {
  hero: {
    eyebrow: "Practitioners first. Consultants second",
    title: "We’ve led. We’ve learned. We bring both",
    /* ⚠️ O "60+" E OS "36 countries" REPETEM O h2 DA GLOBAL FACULTY, a duas
       telas de distância — é a mesma afirmação dita duas vezes. Mudar um e
       esquecer o outro publica a página se contradizendo sobre o tamanho da
       própria faculty. Os dois campos estão no editor; o aviso está no `hint`
       dos dois. */
    subtitle:
      "A senior leadership team, backed by a global faculty of 60+ practitioners delivering across 36 countries.",
  },
  leadership: {
    label: "Leadership",
    title: "The team behind the work.",
    managersTitle: "Supported by a team of senior program managers.",
  },
  leaders: leaders.map((p) => ({ role: p.role, region: p.region, quote: p.quote })),
  oneTeam: {
    label: "One team",
    /* DUAS LINHAS CONTROLADAS: no site elas são separadas por um `<br>`, não
       pela largura da caixa. Do mockup da Maliha (14-09), não do Word. */
    lines: ["Different perspectives.", "A shared purpose."],
  },
  faculty: {
    label: "Global faculty",
    title: "A faculty of 60+ senior practitioners across 36 countries.",
    intro:
      "Our facilitators and coaches come from the behavioural sciences, organisation development, psychology and business. They span over twenty nationalities and a wide range of social identities. They are senior enough to have sat where our clients sit.",
  },
  dna: {
    label: "The DNA experience",
    title: dnaLead,
    strands: dnaStrands.map((s) => ({ title: s.title, body: s.body })),
  },
  cta: {
    strapline: "Ready to make leadership real?",
    line: "We partner with organisations to unlock real people, cultures and performance.",
    ctaLabel: "Get in touch",
  },
};

/* ------------------------------------------------------------------------- */
/* O MAPA DO EDITOR — cada campo que a tela `/edit-team` mostra, na ordem da   */
/* página. O formato vem de `lib/page-copy/fields.ts`, igual às outras duas.   */
/*                                                                            */
/* OS SEIS LÍDERES SÃO UMA SEÇÃO À PARTE da "Leadership", e os rótulos dos     */
/* campos trazem o NOME de cada um — sem isso ela teria de contar posições na  */
/* grade para saber de quem é o cargo que está editando. O nome vem de         */
/* `lib/team.ts`, que é onde ele continua morando.                             */
/* ------------------------------------------------------------------------- */

const leaderFields = (i: number, name: string): EditorField[] => [
  { path: `leaders.${i}.role`, label: `${name} — job title`, kind: "text" },
  { path: `leaders.${i}.region`, label: `${name} — region`, kind: "text" },
  { path: `leaders.${i}.quote`, label: `${name} — quote`, kind: "textarea" },
];

const strandFields = (i: number, n: string): EditorField[] => [
  { path: `dna.strands.${i}.title`, label: `${n} — heading`, kind: "text" },
  { path: `dna.strands.${i}.body`, label: `${n} — text`, kind: "textarea" },
];

/** O aviso que viaja nos dois campos que repetem o mesmo número. */
const FACULTY_SIZE_HINT =
  "The faculty size and country count also appear in the “Global faculty” heading below — change both, or the page contradicts itself.";

export const EDITOR_SECTIONS: EditorSection[] = [
  {
    id: "hero",
    title: "Hero",
    anchor: "/team",
    fields: [
      { path: "hero.eyebrow", label: "Small label", kind: "text" },
      { path: "hero.title", label: "Headline", kind: "text" },
      { path: "hero.subtitle", label: "Sub-headline", kind: "textarea", hint: FACULTY_SIZE_HINT },
    ],
  },
  {
    id: "leadership",
    title: "Leadership",
    anchor: "/team#leadership",
    fields: [
      { path: "leadership.label", label: "Small label", kind: "text" },
      { path: "leadership.title", label: "Heading", kind: "text" },
      {
        path: "leadership.managersTitle",
        label: "Heading above the programme managers",
        kind: "text",
        hint: "The people themselves — names and photos — are not editable here.",
      },
    ],
  },
  {
    id: "leaders",
    title: "The leadership cards",
    anchor: "/team#leaders",
    fields: leaders.flatMap((p, i) => leaderFields(i, p.name)),
  },
  {
    id: "one-team",
    title: "One team",
    anchor: "/team#one-team",
    fields: [
      { path: "oneTeam.label", label: "Small label", kind: "text" },
      {
        path: "oneTeam.lines",
        label: "The phrase",
        kind: "lines",
        hint: "One per line. Each line starts a new row on the site.",
      },
    ],
  },
  {
    id: "faculty",
    title: "Global faculty",
    anchor: "/team#faculty",
    fields: [
      { path: "faculty.label", label: "Small label", kind: "text" },
      { path: "faculty.title", label: "Heading", kind: "text", hint: FACULTY_SIZE_HINT },
      { path: "faculty.intro", label: "Supporting text", kind: "textarea" },
    ],
  },
  {
    id: "dna",
    title: "The DNA experience",
    anchor: "/team#dna-experience",
    fields: [
      { path: "dna.label", label: "Small label", kind: "text" },
      { path: "dna.title", label: "Heading", kind: "text" },
      ...strandFields(0, "Card 1"),
      ...strandFields(1, "Card 2"),
      ...strandFields(2, "Card 3"),
      ...strandFields(3, "Card 4"),
    ],
  },
  {
    id: "cta",
    title: "Closing band",
    anchor: "/team#team-cta",
    fields: [
      { path: "cta.strapline", label: "Heading", kind: "text" },
      { path: "cta.line", label: "Supporting text", kind: "textarea" },
      { path: "cta.ctaLabel", label: "Button", kind: "text", hint: "The button always links to the contact page." },
    ],
  },
];
