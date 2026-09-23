/**
 * OS TEXTOS EDITÁVEIS DA CLIENTS & IMPACT (`/our-clients`) — o que a cliente
 * pode trocar em `/edit-clients`. Ver `docs/edit-paginas.md`.
 *
 * ⚠️ OS QUATRO NÚMEROS DA FAIXA "By the numbers" NÃO ESTÃO AQUI. Eles são os
 * mesmos quatro da About desde 18-09, a pedido da cliente, justamente para as
 * duas páginas não divergirem — e por isso moram em `lib/about-copy.ts` e se
 * editam em `/edit-about`. Duplicá-los aqui recriaria a divergência que juntar
 * as listas foi feito para impedir. A tela traz um aviso dizendo onde editá-los.
 *
 * ⚠️ OS TRÊS NÚMEROS DO "Global footprint" TAMBÉM NÃO: dois deles são CONTAGENS
 * calculadas (quantos logos de cliente existem, quantos cases o CMS publicou) e
 * o terceiro vem do CMS. Só os RÓTULOS entram — que é a mesma regra da faixa
 * escura da home.
 *
 * O QUE FICOU DE FORA, de propósito: os cases e os depoimentos (vêm do CMS), o
 * mural de logos, o mapa-múndi e o destino do botão do bloco de impacto social.
 *
 * ⚠️ Nada de `fs`, `blob`, zod ou `@/` — carregado pelos testes do Node.
 */
import type { EditorSection } from "./page-copy/fields.ts";

export type ClientsCopy = {
  hero: { eyebrow: string; title: string; subtitle: string };
  logos: { label: string };
  numbers: { label: string; kicker: string; rowLabel: string };
  cases: { label: string; kicker: string; empty: string };
  voices: { label: string; kicker: string };
  social: { title: string; body: string; ctaLabel: string };
  footprint: { label: string; kicker: string; statLabels: string[] };
  cta: { strapline: string; line: string; ctaLabel: string };
};

export const DEFAULT_CLIENTS_COPY: ClientsCopy = {
  hero: {
    eyebrow: "Clients & Impact",
    title: "Leadership change, measured where it matters.",
    subtitle:
      "From energy and pharma to luxury and financial services, advisory delivered where the stakes are highest.",
  },
  logos: {
    label: "Trusted by global organisations",
  },
  numbers: {
    label: "By the numbers",
    kicker: "Real change, a broader reach.",
    rowLabel: "Our scale",
  },
  cases: {
    label: "Case studies",
    kicker: "Real stories. Lasting change.",
    /* Só aparece quando o CMS não publicou case nenhum. Editável porque é
       texto que o visitante pode ler; invisível no dia a dia. */
    empty: "No case studies published yet.",
  },
  voices: {
    label: "What our clients say",
    kicker: "Real partnerships. Lasting perspectives.",
  },
  social: {
    title: "A force for good, beyond the boardroom.",
    body: "CorporateDNA is committed to being a force for good in the world. Our mission is to make transformative impact through humanity, honesty, and purpose. In acting on our deeply held values of social awareness, sustainability, and boldness, we have partnered with TERRAGRN, an organisation dedicated to sustainable community-led agroforestry.",
    ctaLabel: "Learn more",
  },
  footprint: {
    label: "Global footprint",
    kicker: "Where our clients create change.",
    /* Os três RÓTULOS. Os valores são contagens — ver a caixa no topo. */
    statLabels: ["Regions", "Clients", "Published case studies"],
  },
  cta: {
    strapline: "Let’s create real change, together.",
    line: "Speak to our team about how we can support your organisation.",
    ctaLabel: "Get in touch",
  },
};

export const EDITOR_SECTIONS: EditorSection[] = [
  {
    id: "hero",
    title: "Hero",
    anchor: "/our-clients",
    fields: [
      { path: "hero.eyebrow", label: "Small label", kind: "text" },
      { path: "hero.title", label: "Headline", kind: "text" },
      { path: "hero.subtitle", label: "Sub-headline", kind: "textarea" },
    ],
  },
  {
    id: "logos",
    title: "The client logos",
    anchor: "/our-clients#clients",
    fields: [
      {
        path: "logos.label",
        label: "Line above the logos",
        kind: "text",
        hint: "The logos themselves are not editable here.",
      },
    ],
  },
  {
    id: "numbers",
    title: "By the numbers",
    anchor: "/our-clients#numbers",
    fields: [
      { path: "numbers.label", label: "Small label", kind: "text" },
      { path: "numbers.kicker", label: "The phrase on the right", kind: "text" },
      {
        path: "numbers.rowLabel",
        label: "Label beside the row",
        kind: "text",
        hint: "The four numbers are the same as on the About page — edit them there, and both pages change together.",
      },
    ],
  },
  {
    id: "cases",
    title: "Case studies",
    anchor: "/our-clients#case-studies",
    fields: [
      { path: "cases.label", label: "Small label", kind: "text" },
      { path: "cases.kicker", label: "The phrase on the right", kind: "text" },
      {
        path: "cases.empty",
        label: "Text when there are no case studies",
        kind: "text",
        hint: "Only shown if the CMS has no published case studies.",
      },
    ],
  },
  {
    id: "voices",
    title: "What our clients say",
    anchor: "/our-clients#voices",
    fields: [
      { path: "voices.label", label: "Small label", kind: "text" },
      {
        path: "voices.kicker",
        label: "The phrase on the right",
        kind: "text",
        hint: "The quotes come from the case studies in the CMS.",
      },
    ],
  },
  {
    id: "social-impact",
    title: "A force for good",
    anchor: "/our-clients#social-impact",
    fields: [
      { path: "social.title", label: "Heading", kind: "text" },
      { path: "social.body", label: "Text", kind: "textarea" },
      { path: "social.ctaLabel", label: "Button", kind: "text", hint: "The button always links to Our Impact." },
    ],
  },
  {
    id: "footprint",
    title: "Global footprint",
    anchor: "/our-clients#footprint",
    fields: [
      { path: "footprint.label", label: "Small label", kind: "text" },
      { path: "footprint.kicker", label: "The phrase on the right", kind: "text" },
      { path: "footprint.statLabels.0", label: "Label for the 1st number", kind: "text" },
      { path: "footprint.statLabels.1", label: "Label for the 2nd number", kind: "text" },
      {
        path: "footprint.statLabels.2",
        label: "Label for the 3rd number",
        kind: "text",
        hint: "The numbers themselves are counted automatically.",
      },
    ],
  },
  {
    id: "cta",
    title: "Closing band",
    anchor: "/our-clients#clients-cta",
    fields: [
      { path: "cta.strapline", label: "Heading", kind: "text" },
      { path: "cta.line", label: "Supporting text", kind: "textarea" },
      { path: "cta.ctaLabel", label: "Button", kind: "text" },
    ],
  },
];
