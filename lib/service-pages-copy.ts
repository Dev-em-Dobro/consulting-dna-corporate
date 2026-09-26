/**
 * OS TEXTOS EDITÁVEIS DAS DEZ PÁGINAS INTERNAS DE SERVIÇO — o que a cliente
 * pode trocar em `/edit-services/<serviço>`. Mesma máquina das outras;
 * ver `docs/edit-paginas.md`.
 *
 * ⚠️ DEZ PÁGINAS, UM TEMPLATE, UM OBJETO SÓ. As dez são renderizadas pelo mesmo
 * `SolutionView` a partir de um `Service`, e a copy das dez vive num objeto só,
 * indexado por slug (`bySlug`). Isso é o que permite uma TELA POR SERVIÇO sem
 * dez lojas no Blob: cada tela mostra os campos de um slug e salva o objeto
 * inteiro. São 196 campos de texto no total; numa página só, seria inutilizável.
 *
 * ⚠️ O TÍTULO E O BANNER DE UM SERVIÇO APARECEM EM TRÊS LUGARES: a dobra da
 * própria página interna, o card dele na `/services` e o card dele no "Related
 * services" das outras nove. Editar aqui muda os três — que é o certo, e é o
 * motivo de a rota revalidar `/services` e as dez internas.
 *
 * ⚠️ OS PADRÕES SÃO DERIVADOS DE `lib/services.ts`, e não copiados. Aquele
 * arquivo é a copy FINAL do cliente, transcrita dos dez documentos, com a
 * procedência de cada campo anotada no ponto de uso; este lê de lá. Mesma
 * decisão da Team — ver `lib/team-copy.ts`.
 *
 * ⚠️ NADA DE `fs`, `blob`, zod OU `@/` AQUI: este arquivo é carregado pelos
 * testes do Node, que exigem extensão `.ts` explícita nos imports relativos e
 * não resolvem o alias.
 *
 * O QUE FICOU DE FORA, de propósito: o `slug` (é a URL — renomear um serviço
 * no editor muda o título, não o endereço), as imagens (`cardImage`, a foto de
 * cada audience, a do case), o `caseSlug` que liga o bloco de evidência ao case
 * no CMS, e o rótulo "Our Services" da dobra, que é o mesmo nas dez e vive no
 * `SolutionView`.
 */
import { services, type Service } from "./services.ts";
import type { EditorField, EditorSection } from "./page-copy/fields.ts";

export type ServiceAudienceCopy = { label: string; title: string; body: string; credential: string[] };
export type ServiceEvidenceCopy = {
  client: string;
  title: string;
  body: string;
  facts: { value: string; label: string }[];
};
/**
 * A faixa de evidência do layout de 24-09 — ver `ServiceEvidenceSummary` em
 * `lib/services.ts`. É OUTRA COISA que o `ServiceEvidenceCopy` acima: aquele
 * edita um case (cliente, o que o trabalho foi, o texto), este edita uma
 * afirmação de resultado.
 *
 * ⚠️ OS LOGOS NÃO ENTRAM, pela mesma régua que já deixa de fora `cardImage` e
 * as fotos dos cartões de público: o editor troca TEXTO. Escolher qual marca
 * aparece é mudar o que a página afirma sobre clientes, e isso continua sendo
 * trabalho de código.
 */
export type ServiceEvidenceSummaryCopy = {
  headline: string;
  lead: string;
  facts: { value: string; label: string }[];
};

/**
 * A FORMA É UNIFORME NAS DEZ, mesmo que nove não tenham audiences, closing nem
 * evidência: um formato só é um schema só e uma mescla só. Quem decide o que
 * APARECE na tela é o `sectionsFor()`, lá embaixo, que monta a lista de campos
 * a partir do que aquele serviço tem de verdade.
 *
 * ⚠️ `whatWeDoBody` E `howWeWorkBody` SÃO O CAMPO QUE RENDERIZA, não um campo
 * do `Service`. O template resolve `whatWeDo ?? outcome` e
 * `howWeWork ?? howWeHelp`: nove serviços caem no segundo de cada par e a
 * Senior Leadership Development no primeiro. Achatar isso aqui é o que evita
 * dois campos na tela para um texto só.
 */
export type ServiceCopy = {
  title: string;
  banner: string;
  whatWeDoHeadline: string;
  whatWeDoBody: string;
  howWeWorkHeadline: string;
  howWeWorkBody: string;
  pillars: string[];
  audiences: ServiceAudienceCopy[];
  closing: { lead: string; accent: string };
  evidence: ServiceEvidenceCopy;
  evidenceSummary: ServiceEvidenceSummaryCopy;
  testimonial: { quote: string; attribution: string };
  cta: { strapline: string; line: string; label: string };
};

export type ServicePagesCopy = { bySlug: Record<string, ServiceCopy> };

const copyOf = (s: Service): ServiceCopy => ({
  title: s.title,
  banner: s.banner,
  whatWeDoHeadline: s.whatWeDoHeadline ?? s.outcomeHeadline ?? "",
  whatWeDoBody: s.whatWeDo ?? s.outcome,
  howWeWorkHeadline: s.howWeWorkHeadline ?? s.howWeHelpHeadline ?? "",
  howWeWorkBody: s.howWeWork ?? s.howWeHelp,
  pillars: s.practices?.items ?? s.pillars ?? [],
  audiences: (s.audiences ?? []).map((a) => ({
    /* `?? ""` desde 24-09: o rótulo sobreposto virou opcional (o layout do
       Executive Coaching não o desenha), e a forma da copy continua uniforme. */
    label: a.label ?? "",
    title: a.title,
    body: a.body,
    credential: a.credential ?? [],
  })),
  closing: { lead: s.closing?.lead ?? "", accent: s.closing?.accent ?? "" },
  evidence: {
    client: s.evidence?.client ?? "",
    title: s.evidence?.title ?? "",
    body: s.evidence?.body ?? "",
    facts: (s.evidence?.facts ?? []).map((f) => ({ value: f.value, label: f.label ?? "" })),
  },
  evidenceSummary: {
    headline: s.evidenceSummary?.headline ?? "",
    lead: s.evidenceSummary?.lead ?? "",
    facts: (s.evidenceSummary?.facts ?? []).map((f) => ({ value: f.value, label: f.label ?? "" })),
  },
  testimonial: { quote: s.testimonial?.quote ?? "", attribution: s.testimonial?.attribution ?? "" },
  cta: { ...s.cta },
});

export const DEFAULT_SERVICE_PAGES_COPY: ServicePagesCopy = {
  bySlug: Object.fromEntries(services.map((s) => [s.slug, copyOf(s)])),
};

/**
 * Devolve o `Service` como deve ser renderizado: o que está em `lib/services.ts`
 * com a copy salva por cima.
 *
 * ⚠️ NÃO RESSUSCITA BLOCO QUE NÃO EXISTE. `audiences`, `closing`, `evidence` e
 * `testimonial` só voltam se o serviço JÁ os tinha — a forma uniforme acima
 * guarda strings vazias para os nove que não têm, e devolvê-las como objeto
 * faria a página desenhar um bloco em branco. Acrescentar um bloco novo a um
 * serviço continua sendo trabalho de código, e é assim de propósito: o editor
 * troca texto, não muda a estrutura da página.
 *
 * ⚠️ `whatWeDo` E `howWeWork` SÃO SEMPRE DEFINIDOS na saída, e é isso que faz o
 * texto editado vencer o `??` do template nos nove serviços que hoje caem em
 * `outcome`/`howWeHelp`. Os campos originais ficam intactos ao lado, porque o
 * `ServiceCard` e a `BreadthMatrix` não os leem e ninguém ganha nada em apagá-los.
 */
export function applyServiceCopy(service: Service, copy?: ServiceCopy): Service {
  if (!copy) return service;
  const facts = copy.evidence.facts.map((f) => ({ value: f.value, label: f.label || undefined }));
  return {
    ...service,
    title: copy.title,
    banner: copy.banner,
    whatWeDoHeadline: copy.whatWeDoHeadline,
    whatWeDo: copy.whatWeDoBody,
    howWeWorkHeadline: copy.howWeWorkHeadline,
    howWeWork: copy.howWeWorkBody,
    ...(service.practices
      ? { practices: { ...service.practices, items: copy.pillars } }
      : { pillars: copy.pillars }),
    ...(service.audiences
      ? {
          audiences: service.audiences.map((a, i) => ({
            ...a,
            ...(copy.audiences[i] ? { ...copy.audiences[i], credential: copy.audiences[i].credential } : {}),
          })),
        }
      : {}),
    ...(service.closing ? { closing: copy.closing } : {}),
    ...(service.evidence
      ? {
          evidence: {
            ...service.evidence,
            client: copy.evidence.client,
            title: copy.evidence.title || undefined,
            body: copy.evidence.body,
            ...(service.evidence.facts ? { facts } : {}),
          },
        }
      : {}),
    /* ⚠️ `?.` E FALLBACK NO CAMPO DO SERVIÇO, e isto é CORREÇÃO DE DEFEITO — não
       defensividade decorativa. O `ServiceCopy` é tipado como tendo
       `evidenceSummary` sempre, e o `mergeCopy` de fato o preenche a partir do
       padrão. Mas ENTRE OS DOIS há um cache: `unstable_cache` guarda o resultado
       da mescla por um dia, com chave que NÃO inclui a forma do objeto. Uma
       entrada gravada antes de este campo existir volta sem ele, o tipo diz que
       ele está lá, e `copy.evidenceSummary.headline` estoura a página inteira
       com `Cannot read properties of undefined`.

       ACONTECEU AQUI, no dev, no primeiro render depois de o campo entrar: as
       DEZ internas e a `/services` deram 500 de uma vez, porque as três leem
       esta mesma função. Em produção o risco é o mesmo em qualquer campo NOVO,
       enquanto houver entrada de cache da versão anterior.

       O FALLBACK É O DADO DE CÓDIGO, que é a resposta certa: copy salva que não
       conhece o campo não tem opinião sobre ele, então vale o que está em
       `lib/services.ts`. Vale a mesma régua para qualquer bloco que se
       acrescente daqui para a frente. */
    ...(service.evidenceSummary
      ? {
          evidenceSummary: {
            ...service.evidenceSummary,
            headline: copy.evidenceSummary?.headline || service.evidenceSummary.headline,
            lead: copy.evidenceSummary?.lead || service.evidenceSummary.lead,
            /* CASADO POR POSIÇÃO com o que está em `lib/services.ts`, como os
               números do case e os cartões de público: o editor troca o texto
               de cada medida, não quantas medidas existem. */
            /* ⚠️ O `icon` VOLTA DO CÓDIGO, E NÃO DA COPY SALVA — 24-09, com as
               quatro medidas do Talent Development. Ele não é texto: é o campo
               que decide EM QUE ARRANJO a medida desenha (grade de ícones acima
               dos logos, ou a fileira intercalada com eles — a conta está em
               `SolutionEvidenceSummary`). Reconstruir o `ServiceFact` só com
               `value` e `label`, como esta linha fazia, apagava o ícone de toda
               página com copy salva e derrubava as quatro medidas na fileira
               antiga, espremidas entre seis logos.

               ⚠️ NÃO BASTA ACRESCENTÁ-LO AO `ServiceCopy`: ele não é editável e
               não deve ser. O editor troca as PALAVRAS de cada medida; qual
               glifo acompanha cada uma é decisão de layout, e o mapa que a
               resolve é fechado por rótulo (ver `SolutionPillars`).

               O pareamento é POR POSIÇÃO, como o do resto deste bloco. */
            ...(copy.evidenceSummary?.facts
              ? {
                  facts: copy.evidenceSummary.facts.map((f, i) => ({
                    value: f.value,
                    label: f.label || undefined,
                    icon: service.evidenceSummary?.facts?.[i]?.icon,
                    /* ⚠️ O `body` VOLTA DO CÓDIGO PELA MESMA RAZÃO DO `icon` —
                       24-09, com as quatro medidas do Executive Coaching. Ele
                       TAMBÉM decide arranjo (medida com descrição sai alinhada à
                       esquerda, com filete), então reconstruir o fato sem ele
                       apagaria as quatro descrições e devolveria a grade
                       centrada na primeira vez que alguém salvasse copy.
                       Diferença para o `icon`: este é texto, e pode virar campo
                       do editor no dia em que a cliente pedir. */
                    body: service.evidenceSummary?.facts?.[i]?.body,
                  })),
                }
              : {}),
          },
        }
      : {}),
    ...(service.testimonial ? { testimonial: copy.testimonial } : {}),
    cta: copy.cta,
  };
}

/* ------------------------------------------------------------------------- */
/* O MAPA DO EDITOR — montado POR SERVIÇO, porque cada tela edita um slug.     */
/*                                                                            */
/* AS SEÇÕES VARIAM: só a Senior Leadership Development tem "Who we work with" */
/* e a assinatura de fecho, e seis das dez têm bloco de case. Seção que o      */
/* serviço não tem não aparece na tela dele.                                   */
/*                                                                            */
/* ⚠️ SEM PRINT DO GUIA nestas telas — decidido com o cliente em 23-09. O      */
/* template das dez é o mesmo, então a foto mostraria a mesma forma dez vezes  */
/* e custaria ~70 JPEGs versionados. O "See on site ↗" de cada seção abre a    */
/* página real. Ver a prop `guideDir` do `CopyEditor`.                         */
/* ------------------------------------------------------------------------- */

/**
 * O aviso do título de seção, e ele SÓ APARECE ONDE O CAMPO ESTÁ VAZIO.
 *
 * A `headlineOr()` de `lib/services.ts` publica "Headline to be confirmed."
 * quando o título falta — e nove dos dez serviços estão nessa situação nas DUAS
 * seções de texto. Expor o campo é o que tira esse texto do ar.
 *
 * ⚠️ CONDICIONAL, e não fixo: a Senior Leadership Development TEM os dois
 * títulos escritos, e um aviso dizendo "vazio hoje" ao lado de um campo cheio é
 * pior que aviso nenhum — ensina a cliente a não ler os avisos.
 */
const headlineHint = (current: string) =>
  current.trim()
    ? undefined
    : "Empty today, so the page shows “Headline to be confirmed.” — type something to replace it.";

const audienceFields = (i: number, name: string): EditorField[] => [
  { path: `bySlug.SLUG.audiences.${i}.label`, label: `${name} — small label`, kind: "text" },
  { path: `bySlug.SLUG.audiences.${i}.title`, label: `${name} — heading`, kind: "text" },
  { path: `bySlug.SLUG.audiences.${i}.body`, label: `${name} — text`, kind: "textarea" },
  {
    path: `bySlug.SLUG.audiences.${i}.credential`,
    label: `${name} — the words beside it`,
    kind: "lines",
    hint: "One per line.",
  },
];

const factFields = (i: number, n: string): EditorField[] => [
  { path: `bySlug.SLUG.evidence.facts.${i}.value`, label: `${n} — the number`, kind: "text" },
  { path: `bySlug.SLUG.evidence.facts.${i}.label`, label: `${n} — what it means`, kind: "text" },
];

const summaryFactFields = (i: number, n: string): EditorField[] => [
  { path: `bySlug.SLUG.evidenceSummary.facts.${i}.value`, label: `${n} — the number`, kind: "text" },
  { path: `bySlug.SLUG.evidenceSummary.facts.${i}.label`, label: `${n} — what it means`, kind: "text" },
];

/** Troca o marcador `SLUG` pelo slug de verdade, em todos os caminhos. */
const forSlug = (slug: string, fields: EditorField[]): EditorField[] =>
  fields.map((f) => ({ ...f, path: f.path.replace("bySlug.SLUG.", `bySlug.${slug}.`) }));

export function sectionsFor(slug: string): EditorSection[] {
  const service = services.find((s) => s.slug === slug);
  const copy = DEFAULT_SERVICE_PAGES_COPY.bySlug[slug];
  if (!service || !copy) return [];
  const at = `/services/${slug}`;
  const out: EditorSection[] = [
    {
      id: "hero",
      title: "Top of the page",
      anchor: at,
      fields: forSlug(slug, [
        {
          path: "bySlug.SLUG.title",
          label: "Service name",
          kind: "text",
          hint: "Also the card on the Services page. The web address does not change.",
        },
        { path: "bySlug.SLUG.banner", label: "Sub-headline", kind: "textarea", hint: "Also shown on the card." },
      ]),
    },
  ];

  /* ⚠️ A SEÇÃO SÓ EXISTE SE O BLOCO DESENHA — 24-09, com o Talent Development,
     que perdeu o "What we do" a pedido (`hideWhatWeDo`). Os dois campos
     continuam no padrão, porque a forma da copy é uniforme nos dez; o que sai é
     a TELA. Oferecê-los daria dois campos que não chegam a lugar nenhum — a
     mesma régua dos cartões de público e da assinatura de fecho, e
     `tests/services-copy.test.ts` casa as duas coisas. */
  if (!service.hideWhatWeDo) {
    out.push({
      id: "what-we-do",
      title: "What we do",
      anchor: at,
      fields: forSlug(slug, [
        {
          path: "bySlug.SLUG.whatWeDoHeadline",
          label: "Heading",
          kind: "text",
          hint: headlineHint(copy.whatWeDoHeadline),
        },
        {
          path: "bySlug.SLUG.whatWeDoBody",
          label: "Text",
          kind: "textarea",
          hint: "Leave an empty line between paragraphs. Put **two asterisks** around words to make them bold.",
        },
      ]),
    });
  }

  if (service.audiences?.length) {
    out.push({
      id: "audiences",
      title: "Who we work with",
      anchor: at,
      fields: forSlug(
        slug,
        copy.audiences.flatMap((a, i) => audienceFields(i, a.label || `Block ${i + 1}`)),
      ),
    });
  }

  out.push(
    {
      id: "how-we-work",
      title: "How we work",
      anchor: at,
      fields: forSlug(slug, [
        {
          path: "bySlug.SLUG.howWeWorkHeadline",
          label: "Heading",
          kind: "text",
          hint: headlineHint(copy.howWeWorkHeadline),
        },
        {
          path: "bySlug.SLUG.howWeWorkBody",
          label: "Text",
          kind: "textarea",
          hint: "Leave an empty line between paragraphs. Put **two asterisks** around words to make them bold.",
        },
      ]),
    },
    {
      id: "pillars",
      title: service.practices ? "Our practices" : "The strip of short phrases",
      anchor: at,
      fields: forSlug(slug, [
        {
          path: "bySlug.SLUG.pillars",
          label: "The phrases",
          kind: "lines",
          hint: "One per line. Add or remove lines to change how many appear.",
        },
      ]),
    },
  );

  /* ⚠️ A ASSINATURA DE FECHO (`closing`) NÃO ENTRA, e a condição é dupla de
     propósito. O template só a desenha quando o serviço NÃO tem `practices`:

         service.practices
           ? service.evidence && <SolutionClosing label="Featured case study" />
           : <SolutionClosing closing={service.closing} />

     Hoje o único serviço que TEM `closing` é a Senior Leadership Development —
     e ela também tem `practices`, então a assinatura dela nunca chega à tela
     (conferido no HTML publicado: zero ocorrências de "Different organisations.
     Different transformations."). Expor o campo daria à cliente dois controles
     que não mudam nada.

     A condição fica escrita em vez de o bloco sair: se um dia um serviço sem
     `practices` ganhar `closing`, a seção aparece sozinha na tela dele. */
  if (service.closing && !service.practices) {
    out.push({
      id: "closing",
      title: "The line before the case study",
      anchor: at,
      fields: forSlug(slug, [
        { path: "bySlug.SLUG.closing.lead", label: "First line", kind: "text" },
        { path: "bySlug.SLUG.closing.accent", label: "Second line", kind: "text" },
      ]),
    });
  }

  /* A FAIXA DE EVIDÊNCIA DO LAYOUT DE 24-09 — a de manchete, logos e números.
     É seção PRÓPRIA e não um caso a mais da de baixo: os campos são outros
     (manchete e linha de apoio, em vez de cliente e "o que o trabalho foi"), e
     os dois blocos nunca convivem na mesma página. Ver `evidenceSummary` em
     `lib/services.ts`.

     ⚠️ O TÍTULO DA SEÇÃO NÃO DIZ "case study", ao contrário do de baixo: esta
     faixa não conta um caso, e a tela da cliente não deve prometer que conta. */
  if (service.evidenceSummary) {
    out.push({
      id: "evidence-summary",
      title: "Evidence",
      anchor: at,
      fields: forSlug(slug, [
        { path: "bySlug.SLUG.evidenceSummary.headline", label: "Heading", kind: "text" },
        { path: "bySlug.SLUG.evidenceSummary.lead", label: "Supporting text", kind: "textarea" },
        ...copy.evidenceSummary.facts.flatMap((_, i) => summaryFactFields(i, `Number ${i + 1}`)),
      ]),
    });
  }

  if (service.evidence) {
    out.push({
      id: "evidence",
      title: "Featured case study",
      anchor: at,
      fields: forSlug(slug, [
        { path: "bySlug.SLUG.evidence.client", label: "Client", kind: "text" },
        { path: "bySlug.SLUG.evidence.title", label: "What the work was", kind: "text" },
        { path: "bySlug.SLUG.evidence.body", label: "Text", kind: "textarea" },
        ...copy.evidence.facts.flatMap((_, i) => factFields(i, `Number ${i + 1}`)),
        ...(service.testimonial
          ? [
              { path: "bySlug.SLUG.testimonial.quote", label: "Quote", kind: "textarea" as const },
              { path: "bySlug.SLUG.testimonial.attribution", label: "Who said it", kind: "text" as const },
            ]
          : []),
      ]),
    });
  }

  out.push({
    id: "cta",
    title: "Closing band",
    anchor: at,
    fields: forSlug(slug, [
      { path: "bySlug.SLUG.cta.strapline", label: "Heading", kind: "text" },
      { path: "bySlug.SLUG.cta.line", label: "Supporting text", kind: "textarea" },
      { path: "bySlug.SLUG.cta.label", label: "Button", kind: "text" },
    ]),
  });

  return out;
}

/** Os dez, para o índice `/edit` e para a navegação entre as telas. */
export const EDITABLE_SERVICES = services.map((s) => ({ slug: s.slug, title: s.title }));

/**
 * ⏸️ AS DEZ TELAS DE SERVIÇO ESTÃO ESCONDIDAS — 23-09, a pedido, e por
 * enquanto. A cliente recebeu seis editores de uma vez; as dez internas em cima
 * disso são tela demais para a primeira semana.
 *
 * O QUE "ESCONDIDO" QUER DIZER: só os LINKS somem — a lista no pé de
 * `/edit-services` e a menção a ela no índice `/edit`. As rotas
 * `/edit-services/<slug>` continuam de pé e funcionando, então um link antigo
 * que alguém tenha guardado ainda abre, e nada do que já foi salvo se perde.
 *
 * PARA TRAZER DE VOLTA: trocar por `true`. Não há mais nada a fazer — os dois
 * lugares que mostram a lista leem daqui.
 */
export const SHOW_SERVICE_PAGE_EDITORS = false;
