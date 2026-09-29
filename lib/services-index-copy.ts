/**
 * OS TEXTOS EDITÁVEIS DA LISTAGEM DE SERVIÇOS (`/services`) — o que a cliente
 * pode trocar em `/edit-services`. Ver `docs/edit-paginas.md`.
 *
 * ⚠️ OS DEZ CARDS NÃO ESTÃO AQUI. O que cada card escreve é o nome e o
 * sub-título do serviço, e eles são editados na tela do PRÓPRIO serviço
 * (`/edit-services/<slug>`), que é onde a mesma frase também abre a página
 * interna. Duplicá-los aqui daria duas telas para o mesmo texto.
 *
 * ⚠️ A FAIXA DE FECHO usa o `SolutionCta` SEM PROP NENHUMA hoje, ou seja, os
 * padrões do componente — que também servem a outras rotas. Por isso ela entra
 * no editor com os padrões TRANSCRITOS abaixo: assim que a cliente salvar, esta
 * página passa a mandar as props, e as outras rotas seguem com os padrões do
 * componente, sem mudar. Editar aqui muda só a `/services`.
 *
 * ⚠️ Nada de `fs`, `blob`, zod ou `@/` — carregado pelos testes do Node.
 */
import type { EditorSection } from "./page-copy/fields.ts";

export type ServicesIndexCopy = {
  hero: { eyebrow: string; title: string; subtitle: string };
  whatWeDo: { label: string };
  partners: { label: string; title: string; body: string[] };
  cta: { strapline: string; line: string; ctaLabel: string };
};

export const DEFAULT_SERVICES_INDEX_COPY: ServicesIndexCopy = {
  hero: {
    eyebrow: "Our Services",
    title: "Real impact for individuals, leaders, teams and organisations.",
    subtitle: "Ten ways in. Everyone starts with what is at stake for the business.",
  },
  whatWeDo: {
    label: "What we do",
  },
  partners: {
    label: "Partners",
    title: "The work is ours. The partners are chosen.",
    body: [
      "Most work is designed and delivered by our own faculty. Where a bespoke programme calls for more, we bring partners in by design rather than by default.",
      "Harvard Business Impact for faculty research and a digital delivery spine that scales. Imperial College London for applied innovation and customised executive education. Each joins where the programme needs what they bring, and not otherwise.",
    ],
  },
  /* Os padrões do `SolutionCta`, transcritos — ver a caixa acima. O "Let’s
     talk" que aparece por cima do título NÃO é isto: é um rótulo fixo dentro do
     componente, compartilhado com as outras rotas, e fica de fora.

     ⚠️ A LINHA DE APOIO É VAZIA HOJE, e o componente simplesmente não desenha o
     parágrafo quando ela falta. Fica no editor mesmo assim: é a única maneira de
     a cliente ACRESCENTAR essa linha, que existe nas outras faixas do site. */
  cta: {
    strapline: "Ready to start the conversation?",
    line: "",
    ctaLabel: "Start a Conversation",
  },
};

export const EDITOR_SECTIONS: EditorSection[] = [
  {
    id: "hero",
    title: "Hero",
    anchor: "/services",
    fields: [
      { path: "hero.eyebrow", label: "Small label", kind: "text" },
      { path: "hero.title", label: "Headline", kind: "text" },
      { path: "hero.subtitle", label: "Sub-headline", kind: "textarea" },
    ],
  },
  {
    id: "what-we-do",
    title: "What we do",
    anchor: "/services#what-we-do",
    fields: [
      {
        path: "whatWeDo.label",
        label: "Small label",
        kind: "text",
        hint: "The ten cards below it are edited on each service’s own screen.",
      },
    ],
  },
  {
    id: "partners",
    title: "Partners",
    anchor: "/services#partners",
    fields: [
      { path: "partners.label", label: "Small label", kind: "text" },
      { path: "partners.title", label: "Heading", kind: "text" },
      {
        path: "partners.body",
        label: "Text",
        kind: "paragraphs",
        hint: "Leave an empty line between paragraphs. The partner logos are not editable here.",
      },
    ],
  },
  {
    id: "cta",
    title: "Closing band",
    anchor: "/services#services-cta",
    fields: [
      { path: "cta.strapline", label: "Heading", kind: "text" },
      {
        path: "cta.line",
        label: "Supporting text",
        kind: "textarea",
        hint: "Empty today — the page shows no line under the heading. Type something to add one.",
      },
      { path: "cta.ctaLabel", label: "Button", kind: "text" },
    ],
  },
];
