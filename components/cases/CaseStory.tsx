import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import RichText from "@/components/RichText";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import SolutionCta from "@/components/solutions/SolutionCta";
import type { CaseArticle, CaseListEntry } from "@/lib/cms/map";

/**
 * ============================================================================
 * A PÁGINA DE CASE NO LAYOUT DE 16-09 (o template da adidas)
 * ============================================================================
 *
 * Desenho: `5. Clients& Impact/efa52866-….png`, mandado por ela no drive e
 * confirmado na daily — *"this will be the detailed view of each of the case
 * studies against each client (…) there will be the challenge, what we do, what
 * we did, what changed, client voice, and a few metrics to hold at the top"*.
 *
 * A ORDEM É A DO DESENHO, e ela é um argumento:
 *
 *   herói (marca + promessa) → THE IMPACT → 01 The challenge · 02 What we did
 *   → 03 What changed · 04 Client voice → 05 Related case studies → CTA
 *
 * OS NÚMEROS VÊM ANTES DA HISTÓRIA. É a mesma régua do brief de 27-08 ("evidence
 * before prose") e é o que a faixa escura faz: quem abre a página vê o resultado
 * antes de decidir se vai ler os quatro blocos.
 *
 * ⚠️ QUEM RENDERIZA O QUÊ. Este componente serve os cases com o modelo novo —
 * os nove aprovados pela cliente em 16-09, que têm headline por seção, figuras e
 * fecho. Os antigos (Shell, Levi's, Coca-Cola, Aviva, Unilever, HEINEKEN) só têm
 * o corpo em rich text e continuam na `CaseView`, que decide entre os dois.
 *
 * ⚠️ O QUE ISSO CUSTA NO GSK E NO MORGAN STANLEY: esses dois têm as duas coisas
 * — o corpo antigo em `text` E o modelo novo. Aqui vence o novo, e o `text`
 * deixa de aparecer na tela (segue gravado no CMS, sem perda). É a conversa que
 * ficou em aberto no doc de correções: apagar aquele corpo ou trazê-lo como
 * seção extra é decisão de conteúdo, não de código.
 */
export default function CaseStory({
  c,
  related = [],
}: {
  c: CaseArticle;
  /** Outros cases para o bloco 05. A rota manda; o preview não tem. */
  related?: CaseListEntry[];
}) {
  const { story } = c;

  // A linha de meta do herói: setor · período · mercados. Cada pedaço só entra
  // se existir — nos nove cases da planilha o setor ainda não está classificado
  // (`facets.industry` vazio), então a maioria abre com período e mercados.
  const meta = [c.tags[0], story.partnershipYears, story.markets].filter(Boolean);

  /* A MANCHETE, EM TRÊS TENTATIVAS. O DP World mostrou por que: a cliente
     deixou em branco a célula de hero headline E a de sub-head, e o herói abria
     com "DP World." sozinho num campo escuro de 640px — tecnicamente correto e
     visivelmente quebrado.
     A segunda tentativa é a manchete do CHALLENGE, que é uma frase inteira sobre
     o trabalho e está escrita em oito dos nove cases. Ela desce um degrau na
     narrativa (fala do problema, não do resultado), e esse é o preço; o nome do
     cliente sozinho não fala de nada. O nome fica como terceira. */
  const headline = c.headline ?? story.challengeHeadline ?? c.title;

  return (
    <>
      {/* ── Herói ─────────────────────────────────────────────────────────
          Foto de sangria total com o texto por cima, à esquerda, como no
          desenho. Sem foto — que é o caso dos quinze hoje —, o `ink` sólido
          segura a composição: o que carrega o herói é a manchete, não a
          fotografia. */}
      <section className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-ink text-white md:min-h-[640px]">
        {c.coverUrl && (
          <>
            <Image
              src={c.coverUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="-z-10 object-cover object-center"
            />
            {/* O véu vem da ESQUERDA, onde mora o texto, e abre para a direita,
                onde o desenho deixa a fotografia respirar. */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/25" />
          </>
        )}

        <div className="mx-auto w-full max-w-[1440px] px-6 pb-16 pt-28 md:px-10 md:pb-20 md:pt-32">
          {/* ⚠️ SEM BREADCRUMB VISÍVEL — 16-09, a pedido. O desenho dela tem a
              trilha "Home / Clients & Impact / adidas" no alto do herói; na
              tela, com a nav flutuante logo acima, eram duas linhas de
              navegação empilhadas antes de a página dizer qualquer coisa.

              A TRILHA CONTINUA EXISTINDO para o Google: o `breadcrumbLd` da
              rota (`app/cases/[slug]/page.tsx`) publica a mesma hierarquia em
              JSON-LD, que é o que alimenta o caminho exibido no resultado de
              busca. O que saiu foi só o desenho dela na tela. */}
          <div className="max-w-[720px]">
            {c.logoUrl ? (
              /* O LOGO DO CLIENTE ABRE A PÁGINA, como no desenho. Fundo branco
                 atrás dele porque a maioria dos PNGs do acervo é de marca
                 escura, feita para papel branco: sobre o herói escuro, metade
                 deles desapareceria. */
              <span className="mb-6 inline-flex items-center bg-white px-4 py-2.5">
                <Image
                  src={c.logoUrl}
                  alt={c.title}
                  width={160}
                  height={60}
                  className="h-7 w-auto object-contain md:h-8"
                />
              </span>
            ) : (
              <p className="mb-5 text-[20px] font-semibold tracking-[-0.3px] text-white">
                {c.title}
              </p>
            )}

            {meta.length > 0 && (
              <p className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] font-semibold uppercase tracking-[1.4px] text-white/70">
                <span aria-hidden className="inline-block h-0.5 w-7 bg-brand-light" />
                {meta.map((m, i) => (
                  <span key={m}>
                    {m}
                    {i < meta.length - 1 && (
                      <span aria-hidden className="pl-3 text-white/30">
                        |
                      </span>
                    )}
                  </span>
                ))}
              </p>
            )}

            {/* O PONTO FINAL EM VERMELHO é do desenho dela, e vale o detalhe: é
                o único lugar da página onde a cor da marca toca a manchete. */}
            <h1 className="font-serif text-[34px] font-semibold leading-[1.12] tracking-[-0.5px] text-white sm:text-[44px] md:text-[52px]">
              {stripFullStop(headline)}
              <span className="text-brand-light">.</span>
            </h1>

            {c.intro && (
              <RichText
                html={c.intro}
                className="mt-6 max-w-[62ch] !text-[16px] !leading-[1.65] [&_*]:!text-white/75 md:!text-[17px]"
              />
            )}
          </div>
        </div>
      </section>

      {/* ── THE IMPACT ────────────────────────────────────────────────────
          A faixa escura de números. As figuras VERMELHAS são as de impacto e as
          CARVÃO são as de escala — a distinção não é nossa, vem escrita na
          planilha dela ("Impact figures (render red)" / "Scale figures (render
          charcoal)"), e é o que separa "o que mudou" de "de que tamanho foi". */}
      {(story.impactFigures.length > 0 || story.scaleFigures.length > 0) && (
        <section className="bg-ink text-white">
          <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-10 md:py-14">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[210px_1fr] lg:gap-14">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[1.6px] text-white">
                  The impact
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[1.3px] text-white/45">
                  Real results. Lasting change.
                </p>
                <span className="mt-4 block h-0.5 w-7 bg-brand-light" />
              </div>

              <div>
                {story.impactFigures.length > 0 && (
                  <Reveal className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10 sm:divide-x sm:divide-white/12">
                    {story.impactFigures.map((f) => (
                      <div key={f.label} className="sm:px-8 sm:first:pl-0">
                        {f.value ? (
                          <>
                            <p className="font-serif text-[34px] font-semibold leading-none tracking-[-1px] text-brand-light sm:text-[40px]">
                              {f.value}
                            </p>
                            <p className="mt-2.5 text-[14.5px] font-medium leading-[1.35] text-white">
                              {f.label}
                            </p>
                          </>
                        ) : (
                          /* Célula sem número — a cliente escreve achados na
                             mesma coluna das métricas ("Radical Candour: a new
                             level of healthy challenge"). Ele entra como frase,
                             no corpo da métrica, e não fingindo ser número. */
                          <p className="font-serif text-[19px] leading-[1.35] text-brand-light sm:text-[21px]">
                            {f.label}
                          </p>
                        )}
                      </div>
                    ))}
                  </Reveal>
                )}

                {story.scaleFigures.length > 0 && (
                  <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-2.5 border-t border-white/12 pt-7 text-[12.5px] leading-[1.4] text-white/60">
                    {story.scaleFigures.map((f) => (
                      <li key={f} className="max-w-[34ch]">
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 01 The challenge · 02 What we did ─────────────────────────────
          Duas colunas com um fio entre elas, como o desenho. Em telefone viram
          duas seções empilhadas e o fio vira a borda de cima da segunda. */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-line">
            <div className="lg:pr-14">
              <NumberedLabel number="01" label="The challenge" />
              <SectionTitle>{story.challengeHeadline}</SectionTitle>
              <Body>{c.body.challenge}</Body>
            </div>

            <div className="lg:pl-14">
              <NumberedLabel number="02" label="What we did" />
              <SectionTitle>{story.approachHeadline}</SectionTitle>
              <Body>{c.body.approach}</Body>

              {story.services.length > 0 && (
                <>
                  <p className="mt-8 text-[11.5px] font-semibold uppercase tracking-[1.4px] text-ink">
                    CorporateDNA services
                  </p>
                  {/* AS PÍLULAS NÃO SÃO LINKS. Os rótulos que ela escreve aqui
                      ("Learning at Scale", "Behaviour Change") são a linguagem
                      do trabalho, não o catálogo de `lib/services.ts` — só
                      alguns têm página. Um chip clicável que leva a 404 em
                      metade dos casos é pior que um chip parado. */}
                  <ul className="mt-3.5 flex flex-wrap gap-2">
                    {story.services.map((s) => (
                      <li
                        key={s}
                        className="border border-line bg-paper px-4 py-2 text-[12.5px] text-ink"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 What changed · foto · 04 Client voice ──────────────────────
          Três colunas no desenho. A do meio é fotografia; sem arquivo, ela vira
          o slot tracejado — e some no telefone, onde o que importa é a leitura
          corrida do texto e da citação. */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px_1fr] lg:gap-14">
            <div>
              <NumberedLabel number="03" label="What changed" />
              <SectionTitle>{story.outcomeHeadline}</SectionTitle>
              <Body>{c.body.outcome}</Body>

              {story.closingThought && (
                /* O FECHO EM SERIFA, destacado por uma régua à esquerda: é a
                   frase que ela escreve para a história terminar em ideia, e
                   não em dado. Em corpo de texto normal ela se perderia no fim
                   do parágrafo anterior. */
                <p className="mt-8 border-l-2 border-brand pl-5 font-serif text-[18px] leading-[1.45] tracking-[-0.2px] text-ink md:text-[19px]">
                  {story.closingThought}
                </p>
              )}

              {/* ⚠️ O `additionalContent` MUDOU DE COLUNA em 16-09. Ele ocupava
                  a terceira quando o case não tinha citação; com o bloco 04
                  passando a existir sempre, ele volta para onde pertence — é
                  continuação da história, não uma voz de cliente. */}
              {story.additionalContent && (
                <div className="mt-9 border-t border-line pt-7">
                  <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[1.4px] text-muted">
                    More on this work
                  </p>
                  <Body>{story.additionalContent}</Body>
                </div>
              )}
            </div>

            <div className="hidden lg:block">
              {c.coverUrl ? (
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src={c.coverUrl}
                    alt=""
                    fill
                    sizes="300px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <ImagePlaceholder label="Photo" className="aspect-[3/4] w-full" />
              )}
            </div>

            <div>
              {/* O BLOCO 04 EXISTE SEMPRE — 16-09, a pedido. Antes ele sumia
                  quando o case não tinha citação, e como SETE DOS NOVE ainda
                  não têm (a Rhea está fechando isso com os clientes), a maioria
                  das páginas abria com duas colunas onde a referência tem três
                  — e a comparação com o desenho dava "faltou a quote".

                  MANTER O SLOT É A MESMA REGRA DAS FOTOS desta página: mostra a
                  composição real, deixa explícito o que falta e de quem é. */}
              <NumberedLabel number="04" label="Client voice" />
              {c.quote ? (
                <figure>
                  <blockquote className="font-serif text-[19px] leading-[1.45] tracking-[-0.2px] text-ink md:text-[21px]">
                    <span aria-hidden className="mr-1 text-brand">
                      “
                    </span>
                    {stripQuotes(c.quote)}
                    <span aria-hidden className="ml-1 text-brand">
                      ”
                    </span>
                  </blockquote>
                  {c.quoter && (
                    <figcaption className="mt-6 border-t border-line pt-5 text-[13px] leading-[1.5] text-muted">
                      {c.quoter}
                    </figcaption>
                  )}
                </figure>
              ) : (
                <div className="flex min-h-[180px] flex-col justify-center border border-dashed border-ink/20 bg-ink/[0.06] px-6 py-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[2px] text-ink/45">
                    Client quote
                  </p>
                  <p className="mt-3 max-w-[30ch] font-serif text-[17px] leading-[1.45] text-ink/35">
                    Awaiting sign-off from the client.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 Related case studies ───────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
            <NumberedLabel number="05" label="Related case studies" />
            <p className="-mt-3 mb-8 text-[12px] uppercase tracking-[1.3px] text-muted">
              Explore more client stories
            </p>

            <Reveal className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/cases/${r.slug}`}
                  className="group flex items-stretch border border-line transition-colors hover:border-ink"
                >
                  <div className="flex grow flex-col justify-between px-6 py-7">
                    <div>
                      {r.logoUrl ? (
                        <Image
                          src={r.logoUrl}
                          alt={r.client}
                          width={140}
                          height={56}
                          className="h-7 w-auto object-contain"
                        />
                      ) : (
                        <span className="text-[13px] font-semibold uppercase tracking-[1px] text-ink">
                          {r.client}
                        </span>
                      )}
                      <p className="mt-5 max-w-[26ch] font-serif text-[19px] leading-[1.3] tracking-[-0.3px] text-ink md:text-[21px]">
                        {r.headline ?? r.client}
                      </p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                      {r.service ?? "Case study"}
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                  <div className="relative w-[38%] shrink-0 overflow-hidden bg-paper">
                    {r.coverUrl ? (
                      <Image
                        src={r.coverUrl}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 25vw, 40vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="absolute inset-0 flex items-center justify-center bg-ink text-[44px] font-bold leading-none text-white/[.08]"
                      >
                        {r.client.charAt(0)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <SolutionCta
        strapline="Let’s create real change, together."
        line="Speak to our team about how we can support your organisation."
        ctaLabel="Get in touch"
      />
    </>
  );
}

/** "01 · THE CHALLENGE" — o numeral vermelho em serifa e o rótulo em versalete. */
function NumberedLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="mb-5 flex items-baseline gap-4">
      <span className="font-serif text-[19px] font-semibold leading-none text-brand">
        {number}
      </span>
      <span className="text-[11.5px] font-semibold uppercase tracking-[1.5px] text-ink">
        {label}
      </span>
    </div>
  );
}

/** A manchete serifada de cada bloco. Sem ela escrita no CMS, o bloco não abre título. */
function SectionTitle({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <h2 className="mb-5 max-w-[22ch] font-serif text-[26px] font-semibold leading-[1.15] tracking-[-0.4px] text-ink md:text-[30px]">
      {children}
    </h2>
  );
}

/**
 * O corpo dos blocos. Quebra em parágrafos nas linhas em branco: o
 * `additionalContent` vem da planilha com quebras de linha reais, e um bloco
 * único de texto corrido esconderia a estrutura que ela escreveu.
 */
function Body({ children }: { children?: string }) {
  if (!children) return null;
  const paragraphs = children.split(/\r?\n\s*\r?\n|\r?\n/).filter((p) => p.trim());
  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => (
        <p key={i} className="max-w-[58ch] text-[15.5px] leading-[1.7] text-muted md:text-[16px]">
          {p}
        </p>
      ))}
    </div>
  );
}

/**
 * Tira o ponto final da manchete — o desenho fecha o `h1` com um ponto VERMELHO,
 * e a frase da planilha já vem com o dela. Sem isto sairiam dois.
 */
const stripFullStop = (t: string) => t.replace(/\s*[.]+\s*$/, "");

/** Aspas já gravadas no valor não podem somar com as que o bloco desenha. */
const stripQuotes = (t: string) =>
  t.trim().replace(/^["“”']+|["“”']+$/g, "").trim();
