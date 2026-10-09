import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import RichText from "@/components/RichText";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import SolutionCta from "@/components/solutions/SolutionCta";
import { getService } from "@/lib/services";
import type { CaseArticle, CaseListEntry } from "@/lib/cms/map";
import {
  CASE_HERO_LOGO_SCALE_PERCENT,
  CASE_HERO_MOBILE_LOGO_HEIGHT,
  CASE_HERO_MOBILE_LOGO_SRC,
  CASE_HERO_MOBILE_WHITE_LOGOS,
} from "@/lib/case-hero-covers";

/**
 * ============================================================================
 * A PÁGINA DE CASE NO LAYOUT DE 16-09 (o template da adidas)
 * ============================================================================
 *
 * Desenho: `5. Clients& Impact/efa52866-….png`, mandado por ela no drive e
 * confirmado na daily  -  *"this will be the detailed view of each of the case
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
 * ⚠️ QUEM RENDERIZA O QUÊ. Este componente serve os cases com o modelo novo  - 
 * os nove aprovados pela cliente em 16-09, que têm headline por seção, figuras e
 * fecho. Os antigos (Shell, Levi's, Coca-Cola, Aviva, Unilever, HEINEKEN) só têm
 * o corpo em rich text e continuam na `CaseView`, que decide entre os dois.
 *
 * ⚠️ O QUE ISSO CUSTA NO GSK E NO MORGAN STANLEY: esses dois têm as duas coisas
 *  -  o corpo antigo em `text` E o modelo novo. Aqui vence o novo, e o `text`
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
  const clientQuote = c.quote?.trim();
  const moreQuotes = (story.moreQuotes ?? []).filter((q) => q.quote.trim());
  const hasClientVoice = !!clientQuote || moreQuotes.length > 0;
  const heroCoverUrl = c.heroCoverUrl ?? c.coverUrl;
  const heroLogoScale = CASE_HERO_LOGO_SCALE_PERCENT[c.slug] ?? 100;
  const heroLogoIsWhite = [
    "dubai-holding-leadership-accountability",
    "dyson",
    "frasers-property-hrlt",
    "frasers-property-leadership",
    "morgan-stanley",
  ].includes(c.slug);
  const mobileLogoHeight = CASE_HERO_MOBILE_LOGO_HEIGHT[c.slug] ?? 72;
  const mobileLogoIsWhite = heroLogoIsWhite || CASE_HERO_MOBILE_WHITE_LOGOS.has(c.slug);
  const mobileLogoSrc = CASE_HERO_MOBILE_LOGO_SRC[c.slug] ?? c.logoUrl;
  const mobileHeroContentTop =
    c.slug === "vodafone"
      ? "pt-[214px]"
      : mobileLogoHeight > 72
        ? "pt-[260px]"
        : "pt-[228px]";

  // A linha de meta do herói: setor · período · mercados. Cada pedaço só entra
  // se existir  -  nos nove cases da planilha o setor ainda não está classificado
  // (`facets.industry` vazio), então a maioria abre com período e mercados.
  const meta = [c.tags[0], story.partnershipYears, story.markets].filter(Boolean);

  /* A MANCHETE, EM TRÊS TENTATIVAS. O DP World mostrou por que: a cliente
     deixou em branco a célula de hero headline E a de sub-head, e o herói abria
     com "DP World." sozinho num campo escuro de 640px  -  tecnicamente correto e
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
          desenho. Sem foto  -  que é o caso dos quinze hoje  - , o `ink` sólido
          segura a composição: o que carrega o herói é a manchete, não a
          fotografia. */}
      <section className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-ink text-white min-[1100px]:min-h-[640px]">
        {heroCoverUrl && (
          <>
            <Image
              src={heroCoverUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="-z-10 object-cover object-center"
            />
            <div
              aria-hidden
              className="absolute inset-0 z-0"
              style={{
                backgroundColor:
                  c.slug === "dubai-holding-leadership-accountability"
                    ? "rgba(0, 0, 0, 0.04)"
                    : c.slug === "heineken-inner-outer-game"
                      ? "rgba(0, 0, 0, 0.4)"
                      : "rgba(0, 0, 0, 0.2)",
              }}
            />
            {c.logoUrl && (
              <div
                className="absolute left-6 top-[132px] z-[1] w-[calc(100vw-3rem)] min-[1100px]:hidden"
                style={{ height: `${mobileLogoHeight}px` }}
              >
                <Image
                  src={mobileLogoSrc!}
                  alt={c.title}
                  fill
                  sizes="calc(100vw - 3rem)"
                  className={`object-contain object-left ${mobileLogoIsWhite ? "brightness-0 invert" : ""}`}
                />
              </div>
            )}
            {c.logoUrl && (
              <div className="case-hero-logo-panel absolute inset-y-0 right-0 z-[1] hidden w-[52%] items-center justify-center px-8 min-[1100px]:flex">
                <Image
                  src={c.logoUrl}
                  alt=""
                  width={900}
                  height={300}
                  className={`case-hero-logo h-auto max-w-none object-contain ${heroLogoIsWhite ? "brightness-0 invert" : ""}`}
                  style={{ width: `${heroLogoScale}%` }}
                />
              </div>
            )}
          </>
        )}

        <div className={`relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-16 ${mobileHeroContentTop} min-[1100px]:px-10 min-[1100px]:pb-20 min-[1100px]:pt-32`}>
          {/* ⚠️ SEM BREADCRUMB VISÍVEL  -  16-09, a pedido. O desenho dela tem a
              trilha "Home / Clients & Impact / adidas" no alto do herói; na
              tela, com a nav flutuante logo acima, eram duas linhas de
              navegação empilhadas antes de a página dizer qualquer coisa.

              A TRILHA CONTINUA EXISTINDO para o Google: o `breadcrumbLd` da
              rota (`app/cases/[slug]/page.tsx`) publica a mesma hierarquia em
              JSON-LD, que é o que alimenta o caminho exibido no resultado de
              busca. O que saiu foi só o desenho dela na tela. */}
          <div className="case-hero-copy max-w-[720px]">
            {heroCoverUrl && c.logoUrl ? null : c.logoUrl ? (
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
                  className={`h-7 w-auto object-contain md:h-8 ${c.slug === "shunkhlai" ? "brightness-0" : ""}`}
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

            {/* As manchetes do hero ficam sem ponto final para manter o padrão
                editorial entre todos os cases. */}
            <h1 className="case-hero-title font-serif text-[34px] font-semibold leading-[1.12] tracking-[-0.5px] text-white">
              {stripFullStop(headline)}
            </h1>

            {c.intro && (
              <RichText
                html={c.intro}
                className="mt-6 max-w-[62ch] !text-[16px] !leading-[1.65] [&_*]:!text-white/75 min-[1100px]:!text-[17px]"
              />
            )}
          </div>
        </div>
      </section>

      {/* ── THE IMPACT ────────────────────────────────────────────────────
          A faixa escura de números. As figuras VERMELHAS são as de impacto e as
          CARVÃO são as de escala  -  a distinção não é nossa, vem escrita na
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
                  <Reveal className="grid grid-cols-1 gap-y-10 sm:grid-cols-3">
                    {story.impactFigures.map((f) => (
                      <div key={f.label} className="min-w-0 sm:border-l sm:border-white/12 sm:px-8 sm:[&:nth-child(3n+1)]:border-l-0 sm:[&:nth-child(3n+1)]:pl-0">
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
                          /* Célula sem número  -  a cliente escreve achados na
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
                      do trabalho, não o catálogo de `lib/services.ts`  -  só
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

      {/* What changed, optional photo, and Client voice when a quote exists. */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <div className={`grid grid-cols-1 gap-10 lg:gap-14 ${
            c.coverUrl
              ? hasClientVoice ? "lg:grid-cols-[1fr_380px_1fr]" : "lg:grid-cols-[minmax(0,1fr)_380px]"
              : hasClientVoice ? "lg:grid-cols-2" : ""
          }`}>
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

              {/* Additional content continues the story in this column. */}
              {story.additionalContent && (
                <div className="mt-9 border-t border-line pt-7">
                  <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[1.4px] text-muted">
                    More on this work
                  </p>
                  <Body>{story.additionalContent}</Body>
                </div>
              )}
            </div>

            {c.coverUrl ? (
            <div className="hidden lg:block">
              {c.coverUrl ? (
                /* ⚠️ ESTE SLOT FICOU IRRECONHECÍVEL QUANDO OS CASES GANHARAM
                   CAPA, em 18-09. Até ali os quinze cases estavam sem
                   `coverUrl` e o que aparecia aqui era sempre o slot
                   tracejado  -  o defeito existia desde 16-09 e nunca tinha
                   sido visto.

                   ERAM DOIS DEFEITOS SOMADOS:

                     1. `sizes="300px"` DESCREVIA A CAIXA, NÃO A IMAGEM. Com
                        `fill` + `object-cover`, o `sizes` manda o navegador
                        baixar uma versão de 300px de LARGURA da foto inteira.
                        A capa do Ma'aden é 2560x1139 (2,25:1), então 300px de
                        largura são 133px de ALTURA  -  e a caixa 3:4 pede 400px
                        de altura. O navegador esticava 133 para 400, três
                        vezes, e o resultado era uma foto lavada.

                        A CONTA CERTA: numa caixa de proporção `p` preenchida
                        por `cover` a partir de uma foto de proporção `P`, com
                        P > p, a largura útil da foto é `larguraDaCaixa × P/p`.
                        Aqui: 380 × (2,25 / 0,8) ≈ 1069. Daí `sizes="1100px"`,
                        que cobre as capas panorâmicas e continua barato  -  o
                        arquivo inteiro tem 140KB.

                     2. A CAIXA ERA ESTREITA E MUITO ALTA para foto de grupo.
                        300px de largura em 4:3 de recorte sobre uma panorâmica
                        deixavam uma tira vertical de uma sala com dez pessoas:
                        ilegível. A coluna foi para 380px e a caixa para 4:5,
                        que é menos alta  -  o recorte perde bem menos das
                        laterais e a foto volta a ser uma fotografia.

                   ⚠️ O QUE ISTO NÃO RESOLVE: esta é a MESMA foto do herói.
                   O desenho quer uma segunda fotografia aqui, e o CMS não tem
                   campo para ela  -  `coverMediaId` é o único. Enquanto não
                   existir, a página mostra a mesma imagem duas vezes, em
                   recortes diferentes. Pendência registrada com a cliente. */
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={c.coverUrl}
                    alt=""
                    fill
                    sizes="1100px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <ImagePlaceholder label="Photo" className="aspect-[4/5] w-full" />
              )}
            </div>
            ) : null}

            {hasClientVoice && <div>
              <NumberedLabel number="04" label="Client voice" />
              <figure>
                  {clientQuote && (
                    <>
                  <blockquote className="font-serif text-[19px] leading-[1.45] tracking-[-0.2px] text-ink md:text-[21px]">
                    <span aria-hidden className="mr-1 text-brand">
                      “
                    </span>
                    {stripQuotes(clientQuote)}
                    <span aria-hidden className="ml-1 text-brand">
                      ”
                    </span>
                  </blockquote>
                  {c.quoter && (
                    <figcaption className="mt-6 border-t border-line pt-5 text-[13px] leading-[1.5] text-muted">
                      {c.quoter}
                    </figcaption>
                  )}
                    </>
                  )}
                  {/* 01-10: as citações a mais dos cases do site antigo, no
                      mesmo desenho, empilhadas abaixo da principal. */}
                  {moreQuotes.map((q, index) => (
                    <div key={q.quote} className={clientQuote || index > 0 ? "mt-10" : ""}>
                      <blockquote className="font-serif text-[17px] leading-[1.5] tracking-[-0.2px] text-ink md:text-[18px]">
                        <span aria-hidden className="mr-1 text-brand">“</span>
                        {stripQuotes(q.quote)}
                        <span aria-hidden className="ml-1 text-brand">”</span>
                      </blockquote>
                      {q.quoter && (
                        <p className="mt-5 border-t border-line pt-4 text-[13px] leading-[1.5] text-muted">{q.quoter}</p>
                      )}
                    </div>
                  ))}
              </figure>
            </div>}
          </div>
        </div>
      </section>

      {/* Related case studies follow the last visible numbered section. */}
      {related.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
            <NumberedLabel number={hasClientVoice ? "05" : "04"} label="Related case studies" />
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
                          className={`h-7 w-auto object-contain ${r.slug === "shunkhlai" ? "brightness-0" : ""}`}
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
                      {(r.service && getService(r.service)?.title) ?? r.service ?? "Case study"}
                      <span aria-hidden className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                  {r.coverUrl ? (
                  <div className="relative w-[38%] shrink-0 overflow-hidden bg-paper">
                    {r.coverUrl ? (
                      <Image
                        src={r.coverUrl}
                        alt=""
                        fill
                        /* Mesma correção de 18-09 do slot de "What changed":
                           a caixa é estreita (38% da linha) e alta, e a capa é
                           panorâmica, então o `cover` corta as laterais e o que
                           limita a nitidez é a ALTURA. As larguras antigas
                           (25vw/40vw) descreviam a caixa e entregavam metade da
                           resolução necessária. */
                        sizes="(min-width: 768px) 40vw, 70vw"
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
                  ) : null}
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

/** "01 · THE CHALLENGE"  -  o numeral vermelho em serifa e o rótulo em versalete. */
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
  /* 01-10: linhas que começam com "- " viram LISTA, com a seta vermelha dos
     cases do site antigo, e "**trecho**" vira negrito  -  os cases herdados
     escrevem assim, e achatar em parágrafo perderia a estrutura. */
  const blocks: (string | string[])[] = [];
  for (const p of paragraphs) {
    const item = p.match(/^\s*-\s+(.*)$/);
    const last = blocks[blocks.length - 1];
    if (item) {
      if (Array.isArray(last)) last.push(item[1]);
      else blocks.push([item[1]]);
    } else blocks.push(p);
  }
  return (
    <div className="space-y-4">
      {blocks.map((b, i) =>
        Array.isArray(b) ? (
          <ul key={i} className="max-w-[58ch] space-y-2.5">
            {b.map((li) => (
              <li key={li} className="flex gap-3 text-[15.5px] leading-[1.6] text-muted md:text-[16px]">
                <span aria-hidden className="flex-none font-semibold text-brand">›</span>
                <span>{withBold(li)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={i} className="max-w-[58ch] text-[15.5px] leading-[1.7] text-muted md:text-[16px]">
            {withBold(b)}
          </p>
        ),
      )}
    </div>
  );
}

/** "**trecho**" em negrito, na cor cheia do texto. */
function withBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

/**
 * Tira o ponto final da manchete  -  o desenho fecha o `h1` com um ponto VERMELHO,
 * e a frase da planilha já vem com o dela. Sem isto sairiam dois.
 */
const stripFullStop = (t: string) => t.replace(/\s*[.]+\s*$/, "");

/** Aspas já gravadas no valor não podem somar com as que o bloco desenha. */
const stripQuotes = (t: string) =>
  t.trim().replace(/^["“”']+|["“”']+$/g, "").trim();
