import Link from "next/link";
import Counter from "@/components/Counter";
import Reveal from "@/components/Reveal";
import { factIsMeasure, type ServiceFact } from "@/lib/services";

/**
 * A FAIXA DE EVIDÊNCIA DO LAYOUT DE 24-09 — a afirmação de resultado, com os
 * logos dos clientes nas pontas e as medidas entre eles.
 *
 * Desenhada em `docs/meetings/senior-leadership-development-24-09.jpeg`, e
 * pedida assim: *"Evidence: usar a versão nova, com o texto exato."*
 *
 * ============================================================================
 * ⚠️ ISTO NÃO SUBSTITUI O `SolutionEvidence`, CONVIVE COM ELE
 * ============================================================================
 *
 * O `SolutionEvidence` conta UM caso: cliente, o que o trabalho foi, os números
 * daquele caso, uma foto e a citação. Quatro serviços continuam com ele, sem
 * uma linha mexida. Esta faixa faz outra coisa — afirma um resultado e mostra
 * duas marcas como lastro —, e por isso é componente separado em vez de uma
 * prop no outro: juntar os dois daria um componente com dois modos que não
 * compartilham nem o fundo nem a estrutura da grade.
 *
 * Quem desenha qual está em `SolutionView`; o dado, em `evidenceSummary`
 * (`lib/services.ts`), onde também está a conta do fundo claro.
 *
 * ============================================================================
 * O QUE FOI MEDIDO NO ARQUIVO
 * ============================================================================
 * O layout tem 1024px de largura. A faixa começa em y=1290, onde o fundo passa
 * de #f9f8f6 (a faixa de "How we work") para #fefefe — BRANCA, e não `paper`
 * nem `ink`. A fileira tem CINCO células de largura igual: logo, medida,
 * medida, medida, logo, com um filete vermelho claro entre cada par. Os
 * numerais são vermelhos e em serifa; os rótulos, em serifa escura, centrados,
 * em até duas linhas.
 *
 * ⚠️ O VERMELHO AQUI É `brand` CHEIO, e não o `brand-light` da faixa escura —
 * a regra de uma linha do `globals.css`: `brand` em fundo claro, `brand-light`
 * em fundo escuro. O numeral passa dos 24px que a norma trata como "texto
 * grande", então o teto de 4,39:1 desta cor fica muito acima do mínimo de 3,0.
 * O rótulo NÃO é vermelho, é `ink` — outra diferença para a faixa antiga, e é o
 * que o desenho mostra.
 */
type EvidenceLogoData = { src: string; alt: string; caseSlug?: string };

/**
 * UMA MARCA DA FILEIRA — clicável quando o cliente tem case publicado.
 *
 * Componente próprio, e não um ternário dentro do `map`: a marca tem duas
 * formas (com e sem link) e as duas compartilham a mesma `<img>`. Escrito
 * inline, ou a imagem aparecia duas vezes no JSX ou o ramo virava uma função
 * anônima no meio da lista.
 *
 * ============================================================================
 * ⚠️ `<img>` CRU, E NÃO `next/image`
 * ============================================================================
 * A mesma correção que o `CaseLine` registra: o `next/image` exige
 * `width`/`height`, esse par vira a proporção da CAIXA, e as marcas de
 * `public/logos/` têm proporções muito diferentes entre si. Com
 * `object-contain` numa proporção alheia a marca desenha bem menor que o teto
 * pedido. Sem proporção declarada, o teto limita e a outra medida sai da
 * proporção REAL do arquivo.
 *
 * ✅ A MEDIDA É A DO DESENHO desde 24-09, quando os arquivos grandes chegaram:
 * no layout as marcas ocupam ~15% da largura da página, o que a 1440 dá ~240px.
 *
 * ⚠️ DOIS TETOS, E O DE ALTURA NÃO É DECORATIVO. Frasers, Heineken e BT são
 * lockups HORIZONTAIS (~2,8:1) e batem no teto de largura; a DP World é um
 * lockup EMPILHADO (globo em cima, nome embaixo, 1,79:1), e só com `max-w` ela
 * desenharia 240x134 — quase o dobro da altura das outras, dominando a fileira
 * que deveria tratar as marcas como iguais. Com os dois tetos, cada marca
 * encolhe até caber na caixa e as áreas ficam comparáveis.
 *
 * ⚠️ `w-auto` E NÃO `w-full`: com `w-full` a largura é imposta e o `max-h`
 * passa a ser ignorado na prática, porque a altura vira consequência da
 * largura. Os dois tetos só funcionam com as duas medidas em `auto`.
 *
 * ⚠️ O TETO SÓ FUNCIONA PORQUE OS ARQUIVOS FORAM RECORTADOS pela caixa do alfa
 * — ver a caixa de `evidenceSummary` em `lib/services.ts`. Com a margem
 * transparente original, o `max-w` mediria o quadro vazio e a marca desenharia
 * bem menor que 240px.
 *
 * ============================================================================
 * O LINK — 24-09, *"the logos should point to the case page"*
 * ============================================================================
 * Sem `caseSlug` a marca desenha igual, só não é link. Hoje é o estado da
 * HEINEKEN, cujo case está despublicado no CMS desde 17-09; a Frasers Property
 * aponta para `/cases/frasers-property-leadership`. Qual case é de quem, e por
 * quê, está na caixa de `evidenceSummary` em `lib/services.ts`.
 *
 * ⚠️ `aria-label` NO LINK, E NÃO SÓ O `alt` DA IMAGEM. Sem ele o leitor de tela
 * anuncia o link como "Frasers Property" — um nome de empresa não diz que
 * aquilo leva a algum lugar, nem a quê. É a mesma decisão do botão do
 * `CaseLine`. O `alt` continua lá para quando a imagem não carrega.
 *
 * ⚠️ `opacity` E NÃO ESCALA NO HOVER. As duas marcas são PNG com transparência
 * sobre fundo branco, e um `scale` sobre transparência mostra a interpolação
 * nas bordas do traçado — que nestas duas é fino (o "TRADE MARK" da HEINEKEN,
 * os filetes da Frasers). O `focus-visible` vem junto porque o alvo é uma
 * imagem: sem anel, quem navega por teclado não vê onde está.
 */
function EvidenceLogo({ logo }: { logo: EvidenceLogoData }) {
  const img = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={logo.src}
      alt={logo.alt}
      loading="lazy"
      className="h-auto w-auto max-h-[64px] max-w-[180px] lg:max-h-[86px] lg:max-w-[240px]"
    />
  );
  if (!logo.caseSlug) return img;
  return (
    <Link
      href={`/cases/${logo.caseSlug}`}
      aria-label={`Read the full story: ${logo.alt}`}
      className="inline-block transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
    >
      {img}
    </Link>
  );
}

export default function SolutionEvidenceSummary({
  headline,
  lead,
  logos = [],
  facts = [],
}: {
  headline: string;
  lead?: string;
  logos?: EvidenceLogoData[];
  facts?: ServiceFact[];
}) {
  const shown = facts.filter((f) => f.value?.trim());

  /* AS CÉLULAS SÃO MONTADAS NUMA LISTA SÓ, e não em três grupos desenhados
     separadamente, porque o filete divisor é "todo mundo menos o primeiro" —
     uma regra que só se escreve limpa se a fileira for uma sequência. O layout
     põe uma marca em cada ponta; com três marcas e duas medidas a mesma conta
     continua de pé, e é por isso que o componente não fixa o número de
     nenhum dos dois. */
  const [first, ...rest] = logos;
  const cells = [
    ...(first ? [{ kind: "logo" as const, logo: first }] : []),
    ...shown.map((fact) => ({ kind: "fact" as const, fact })),
    ...rest.map((logo) => ({ kind: "logo" as const, logo })),
  ];

  return (
    /* `id` PARA A FAIXA SER ENDEREÇÁVEL, como `#related-services` no pé desta
       mesma página. Serve para linkar direto e, na prática, para conseguir
       FOTOGRAFAR só esta faixa: o herói é `84svh`, então qualquer janela alta o
       infla e desloca tudo o que vem depois — com âncora, a captura acontece
       numa janela de tamanho real. */
    <section id="evidence" className="bg-white">
      <Reveal className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
          Evidence
        </p>
        {/* ⚠️ SEM TETO DE LARGURA, a pedido de 24-09: *"na seção evidence o
            titulo nao precisa quebrar"*. A primeira versão tinha `max-w-[18ch]`,
            que é a medida de linha confortável para manchete e que aqui partia
            "Leadership shifts you can see in the business." em duas — o layout
            mostra a frase inteira numa linha só.

            ⚠️ ELA AINDA QUEBRA ABAIXO DE ~1100px, e isso não é o defeito que o
            pedido descreve: a 44px a frase mede ~990px e simplesmente não cabe
            em tela estreita. O `md:text-[44px]` já a devolve a 32px no
            telefone. O que saiu foi a quebra FORÇADA numa tela onde a linha
            cabia. */}
        <h2 className="mt-8 font-serif text-[32px] font-semibold leading-[1.1] tracking-[-0.4px] text-ink md:text-[44px]">
          {headline}
        </h2>
        {lead && (
          <p className="mt-4 max-w-[62ch] font-serif text-[18px] leading-[1.5] text-ink/70 md:text-[20px]">
            {lead}
          </p>
        )}

        {cells.length > 0 && (
          /* `items-stretch` É O QUE DÁ ALTURA AOS FILETES: o divisor é a borda
             esquerda da própria célula, então ele mede o que a célula medir. Com
             `items-center` as bordas encolheriam para a altura do conteúdo e as
             três seriam de tamanhos diferentes — o rótulo de duas linhas é mais
             alto que o de uma.

             ⚠️ OS FILETES SÓ EXISTEM A PARTIR DE `lg`. Abaixo disso a fileira
             QUEBRA, e borda esquerda em item que começa uma linha nova desenha
             um filete solto no canto esquerdo, sem nada à esquerda dele. */
          <ul className="mt-14 flex flex-wrap items-stretch justify-center gap-y-12 lg:mt-16 lg:flex-nowrap lg:gap-y-0">
            {cells.map((cell, i) => (
              <li
                key={i}
                className={`flex min-w-[150px] flex-1 flex-col items-center justify-center px-6 text-center lg:px-8 ${
                  i > 0 ? "lg:border-l lg:border-brand/30" : ""
                }`}
              >
                {cell.kind === "logo" ? (
                  <EvidenceLogo logo={cell.logo} />
                ) : (
                  <>
                    {/* MEDIDA E PALAVRA SEGUEM COM TRATAMENTOS DIFERENTES, e
                        quem decide é `factIsMeasure` — a mesma função da faixa
                        antiga, e vale ler a caixa dela em `lib/services.ts`,
                        porque "N-1 embedded" já derrubou uma versão dessa regra.
                        Os três números de hoje ("47%", "85%", "3x") começam com
                        dígito e saem os três no `Counter`; o ramo de palavra fica
                        para o dia em que esta faixa receber um "Enterprise
                        wide". */}
                    {factIsMeasure({ value: cell.fact.value }) ? (
                      <Counter
                        value={cell.fact.value}
                        className="block font-serif text-[40px] font-semibold leading-[1.02] tracking-[-1px] text-brand md:text-[52px]"
                      />
                    ) : (
                      <div className="font-serif text-[22px] font-semibold leading-[1.25] tracking-[-0.3px] text-ink md:text-[24px]">
                        {cell.fact.value}
                      </div>
                    )}
                    {cell.fact.label && (
                      /* `max-w-[16ch]` PARA O RÓTULO QUEBRAR ONDE O DESENHO
                         QUEBRA: no layout, "Leadership habits applied" e
                         "Greater enterprise exposure" saem em duas linhas e
                         "Promotion rate" também. Sem teto, numa coluna larga os
                         três sairiam em uma linha só e a fileira perderia o
                         alinhamento de baixo que o desenho tem. */
                      <div className="mt-3 max-w-[16ch] font-serif text-[16px] leading-[1.45] text-ink/80 md:text-[18px]">
                        {cell.fact.label}
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </section>
  );
}
