import Link from "next/link";
import Counter from "@/components/Counter";
import { pillarIcon } from "@/components/solutions/SolutionPillars";
import Reveal from "@/components/Reveal";
import {
  factIsMeasure,
  type ServiceFact,
  type ServiceTestimonial,
} from "@/lib/services";

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
function EvidenceLogo({
  logo,
  size,
}: {
  logo: EvidenceLogoData;
  size?: "small" | "medium";
}) {
  const img = (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={logo.src}
      alt={logo.alt}
      loading="lazy"
      className={
        size === "small"
          ? "h-auto w-auto max-h-[40px] max-w-[120px] lg:max-h-[52px] lg:max-w-[140px]"
          : size === "medium"
            ? "h-auto w-auto max-h-[52px] max-w-[150px] lg:max-h-[68px] lg:max-w-[190px]"
            : "h-auto w-auto max-h-[64px] max-w-[180px] lg:max-h-[86px] lg:max-w-[240px]"
      }
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
  label = "Evidence",
  headline,
  lead,
  logos = [],
  facts = [],
  outcomes = [],
  note,
  testimonial,
  experience,
  logoSize,
}: {
  /** O tamanho das marcas em coluna única — ver o campo em `lib/services.ts`.
   *  Em `split` elas saem sempre no tamanho pequeno. */
  logoSize?: "small" | "medium";
  /**
   * O RÓTULO DA FAIXA. O PADRÃO MORA AQUI, e não no dado, para que os dois
   * serviços que a escrevem como "Evidence" não precisem repetir a palavra —
   * ver a caixa do campo em `lib/services.ts`, que explica por que ela é copy e
   * por que o `id` da `<section>` não a acompanha.
   */
  label?: string;
  headline: string;
  lead?: string;
  logos?: EvidenceLogoData[];
  facts?: ServiceFact[];
  /**
   * ⬅ OS RESULTADOS EM PALAVRA — 24-09, com a migração da HRLT para o template.
   *
   * A página que a HRLT tinha antes fechava com seis frases de ícone
   * ("Stronger strategic influence", "A future-ready HR function"…) ao lado de
   * quatro logos sob o rótulo "Trusted by". As seis não são MEDIDAS — não têm
   * número nenhum — e por isso não podiam entrar como `facts`.
   *
   * ⚠️ POR QUE NÃO COUBE NA FILEIRA DE BAIXO, que é onde um `fact` moraria: ela
   * é uma linha só, dividida por filetes, desenhada para logo · número · número
   * · número · logo. Seis frases mais quatro marcas dariam dez células numa
   * fileira que o layout desenha com cinco — cada uma sairia com 144px a 1440,
   * e os rótulos de três palavras quebrariam em três linhas.
   *
   * Então elas saem ACIMA da fileira, numa grade própria de ícone + rótulo, e a
   * fileira de baixo fica só com as marcas. O ícone vem do mesmo mapa dos
   * pilares (`pillarIcon`), que é o que mantém "o mesmo ícone para o mesmo
   * conceito em todas as páginas", pedido na daily de 24-09.
   */
  outcomes?: string[];
  /** A linha de fecho ao lado das marcas — ver o campo em `lib/services.ts`. */
  note?: string;
  /**
   * ⬅ O RÓTULO E O PARÁGRAFO QUE APRESENTAM AS MARCAS — 24-09, com o Talent
   * Development. Desenham logo ACIMA da fileira de logos, que é a única
   * posição que faz sentido: a frase do layout termina em "including:" e o que
   * vem depois dos dois-pontos são os logos. Ver o campo em `lib/services.ts`
   * para a diferença entre ele e o `lead`.
   */
  experience?: { label?: string; lead?: string };
  /**
   * ⬅ A CITAÇÃO — 24-09, com o Executive Coaching.
   *
   * ⚠️ ELA ERA A TERCEIRA COLUNA DA FAIXA ANTIGA (`SolutionEvidence`), e é por
   * isso que passa a caber aqui: o Executive Coaching trocou `evidence` por esta
   * faixa, e sem este slot a única citação publicável do site sairia do ar. A
   * caixa em `SolutionView` que previa esse dia — *"a decisão é dar a ele um
   * bloco de evidência ou devolver a faixa própria"* — deixa de ter o que
   * decidir.
   *
   * ⏳ HOJE SÓ UM SERVIÇO TEM CITAÇÃO E ESTA FAIXA. Ausente = a faixa termina
   * como sempre, e as outras duas páginas com `evidenceSummary` não mudam.
   */
  testimonial?: ServiceTestimonial;
}) {
  /* ⚠️ MEDIDA COM ÍCONE SAI DA FILEIRA, e esta é a conta inteira da separação
     — 24-09, com o layout do Talent Development.

     A fileira de baixo intercala LOGO | medida | medida | LOGO, que é o que o
     layout do Senior Leadership Development desenha: duas marcas nas pontas e
     três números no meio, cinco células numa linha. O Talent Development tem
     QUATRO medidas e CINCO marcas: intercaladas, seriam nove células numa
     fileira só, cada uma com ~150px — números de 52px espremidos entre logos.

     E o desenho dele também não pede isso: as quatro medidas estão num bloco
     PRÓPRIO à esquerda, cada uma com um ícone em cima, e as marcas num quadro à
     direita. O ícone no dado é o que diz de qual dos dois arranjos a medida é —
     por isso a separação é por `icon` e não por uma prop de layout: o dado já
     carrega a distinção, uma prop a repetiria. */
  const shown = facts.filter((f) => f.value?.trim());
  const iconFacts = shown.filter((f) => f.icon?.trim());
  const rowFacts = shown.filter((f) => !f.icon?.trim());
  const shownOutcomes = outcomes.filter((o) => o.trim());
  /* ⚠️ A DESCRIÇÃO DECIDE O ARRANJO DA GRADE — ver a caixa no render. */
  const factsHaveBody = iconFacts.some((f) => f.body?.trim());

  /* AS CÉLULAS SÃO MONTADAS NUMA LISTA SÓ, e não em três grupos desenhados
     separadamente, porque o filete divisor é "todo mundo menos o primeiro" —
     uma regra que só se escreve limpa se a fileira for uma sequência. O layout
     põe uma marca em cada ponta; com três marcas e duas medidas a mesma conta
     continua de pé, e é por isso que o componente não fixa o número de
     nenhum dos dois. */
  /* ⚠️ O NÚMERO DE CÉLULAS DECIDE O DESENHO DA FILEIRA — ver a caixa junto do
     `<ul>`, mais abaixo. Cinco é a medida do layout que criou esta faixa; a
     partir de seis ela vira um quadro de três colunas. */
  const gridded = logos.length + rowFacts.length > 5;

  /* ⚠️ DUAS COLUNAS QUANDO EXISTE "OUR EXPERIENCE" — 24-09, a pedido: *"tenta
     colocar as seções the impact e our experience uma do lado da outra como
     esta no layout"*.

     QUEM LIGA O ARRANJO É O PRÓPRIO `experience`, e não um campo novo: ele é,
     por definição, a COLUNA DA DIREITA do layout (rótulo, parágrafo e marcas).
     Sem ele a faixa não tem duas colunas para dividir — é o caso dos outros
     dois serviços, que seguem numa coluna só, como sempre.

     ⚠️ SÓ A PARTIR DE `lg`. Abaixo disso as duas empilham na ordem em que estão
     escritas (resultado primeiro, marcas depois), que é a leitura do telefone e
     o que a faixa já fazia. */
  const split = Boolean(
    experience && (experience.label?.trim() || experience.lead?.trim()),
  );

  const [first, ...rest] = logos;
  const cells = [
    ...(first ? [{ kind: "logo" as const, logo: first }] : []),
    ...rowFacts.map((fact) => ({ kind: "fact" as const, fact })),
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
        {/* ⚠️ AS DUAS METADES — ver `split`, acima. `items-start` porque as
            colunas têm alturas diferentes e a da direita começa no mesmo topo
            da esquerda, em vez de flutuar no meio dela. */}
        <div className={split ? "lg:grid lg:grid-cols-2 lg:items-start lg:gap-16" : ""}>
        <div>
        <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
          {label}
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
        {/* ⚠️ EM DUAS COLUNAS O TÍTULO É MENOR — 24-09, Talent Development:
            *"na seção the impact pode deixar os numeros menores … e diminuir o
            titulo"*. A 44px a frase de uma linha só já era o pedido da Senior
            Leadership; aqui ela divide a faixa com "Our experience" e a 44px
            come a coluna. Sem `split` o tamanho antigo permanece. */}
        <h2
          className={`mt-8 font-serif font-semibold leading-[1.12] tracking-[-0.4px] text-ink ${
            split
              ? "text-[24px] md:text-[30px]"
              : "text-[32px] md:text-[44px]"
          }`}
        >
          {headline}
        </h2>
        {lead && (
          <p className="mt-4 max-w-[62ch] font-serif text-[18px] leading-[1.5] text-ink/70 md:text-[20px]">
            {lead}
          </p>
        )}

        {shownOutcomes.length > 0 && (
          /* A GRADE É `auto-fit` COM PISO DE 190px, e não três colunas fixas: a
             HRLT tem seis resultados e sai 3×2 a 1440, mas o campo é livre e um
             serviço com quatro sairia 4×1 sem ninguém reajustar nada.

             ⚠️ SEM FILETES, ao contrário da fileira de baixo e da faixa de
             pilares. Aqui a lista quebra em VÁRIAS linhas por desenho, não por
             falta de espaço, e `divide-x` desenharia um traço órfão no começo de
             cada linha nova — a mesma armadilha que aquelas duas evitam
             escondendo os filetes abaixo de `lg`. */
          <ul className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:mt-16 lg:grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
            {shownOutcomes.map((outcome) => {
              const Icon = pillarIcon(outcome);
              return (
                <li key={outcome} className="text-center">
                  {/* DECORATIVO: o rótulo logo abaixo diz a mesma coisa. Mesma
                      regra da faixa de pilares, e o `size={32}` é o degrau
                      abaixo dos 40 de lá — ali o ícone é a única peça gráfica
                      da seção, aqui ele divide a faixa com uma manchete de 44px
                      e com os logos. */}
                  <Icon
                    aria-hidden
                    size={32}
                    strokeWidth={1.5}
                    className="mx-auto block text-brand"
                  />
                  <p className="mx-auto mt-3 max-w-[20ch] font-serif text-[16px] leading-[1.35] text-ink md:text-[17px]">
                    {outcome}
                  </p>
                </li>
              );
            })}
          </ul>
        )}

        {iconFacts.length > 0 && (
          /* ⚠️ A GRADE É A MESMA DOS `outcomes` logo acima, com um degrau a
              mais: lá é ícone + frase, aqui é ícone + NÚMERO + rótulo. As duas
              partilham a medida do ícone (32px) e o `auto-fit` de propósito —
              são o mesmo móvel com conteúdo diferente, e um serviço que tivesse
              os dois campos veria duas fileiras alinhadas entre si.

              O DISCO ROSA VEM DO LAYOUT, e é o mesmo recurso do disco dos
              passos em `SolutionSteps` (`brand/10` com o glifo em `brand`). Nos
              `outcomes` o ícone é nu porque ali ele divide a faixa com seis
              frases; aqui são quatro medidas grandes e o disco é o que impede
              que o glifo suma ao lado de um número de 52px. */
          /* ⚠️ DOIS ARRANJOS PARA A MESMA GRADE, e quem decide é o DADO — a
              mesma régua do `icon` logo acima. Medida COM descrição (`body`) é
              o layout do Executive Coaching: ícone nu à ESQUERDA do número,
              texto alinhado à esquerda e um filete entre as células, porque
              cada uma carrega um parágrafo. Sem descrição continua o arranjo do
              Talent Development: disco rosa, número e rótulo centrados. Uma
              prop de layout repetiria o que o campo já diz. */
          /* ⚠️ EM DUAS COLUNAS A GRADE É UMA FILEIRA DE QUATRO, e não 4
              linhas — 24-09, Talent Development, *"nos numeros do the impact
              pode deixar os numeros um do lado do outro"*. Os números já são
              menores, então as quatro cabem na meia-largura. Sem `split` o
              arranjo antigo (2 colunas / `auto-fit`) permanece. */
          <ul
            className={
              factsHaveBody
                ? "mt-14 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-10 lg:mt-16 lg:grid-cols-4 lg:gap-x-0"
                : split
                  ? "mt-10 grid grid-cols-2 gap-x-4 gap-y-8 lg:mt-12 lg:grid-cols-4"
                  : "mt-14 grid grid-cols-2 gap-x-8 gap-y-12 lg:mt-16 lg:grid-cols-[repeat(auto-fit,minmax(170px,1fr))]"
            }
          >
            {iconFacts.map((fact, i) => {
              const Icon = pillarIcon(fact.icon ?? "");
              /* O MESMO `Counter` DA FILEIRA DE BAIXO — ver a caixa lá. As
                 medidas destes layouts ("35%", "80%", "3x") começam com dígito
                 e sobem animadas; o ramo de palavra continua valendo para quem
                 trouxer um "Enterprise wide". */
              const value = factIsMeasure({ value: fact.value }) ? (
                <Counter
                  value={fact.value}
                  className={`block font-serif font-semibold leading-[1.02] tracking-[-1px] text-brand ${
                    factsHaveBody
                      ? "text-[36px] md:text-[44px]"
                      : split
                        ? "mt-2 text-[24px] md:text-[28px]"
                        : "mt-5 text-[40px] md:text-[52px]"
                  }`}
                />
              ) : (
                <div
                  className={`font-serif font-semibold leading-[1.25] tracking-[-0.3px] text-ink ${
                    factsHaveBody
                      ? "text-[22px] md:text-[24px]"
                      : split
                        ? "text-[20px] md:text-[22px]"
                        : "mt-5 text-[22px] md:text-[24px]"
                  }`}
                >
                  {fact.value}
                </div>
              );

              /* DECORATIVO NOS DOIS ARRANJOS: o rótulo ao lado do número diz a
                 mesma coisa. Mesma regra da fileira de pilares. */
              return factsHaveBody ? (
                <li
                  key={fact.value + (fact.label ?? "")}
                  /* ⚠️ OS FILETES SÓ EXISTEM A PARTIR DE `lg`, onde as quatro
                     células cabem numa linha só. Abaixo disso a grade quebra e
                     a borda esquerda viraria um traço órfão no começo da
                     segunda linha — a mesma armadilha da fileira de logos. */
                  className={`lg:px-8 ${i > 0 ? "lg:border-l lg:border-brand/30" : "lg:pl-0"}`}
                >
                  <div className="flex items-center gap-4">
                    <Icon
                      aria-hidden
                      size={34}
                      strokeWidth={1.5}
                      className="shrink-0 text-brand"
                    />
                    <div>
                      {value}
                      {fact.label && (
                        <div className="mt-1 text-[15px] font-semibold leading-[1.25] text-ink md:text-[16px]">
                          {fact.label}
                        </div>
                      )}
                    </div>
                  </div>
                  {fact.body && (
                    <p className="mt-4 font-serif text-[15px] leading-[1.5] text-ink/70 md:text-[16px]">
                      {fact.body}
                    </p>
                  )}
                </li>
              ) : split ? (
                /* QUATRO CÉLULAS NUMA FILEIRA: disco, número e rótulo empilhados
                   e centrados, para os números sentarem um ao lado do outro. */
                <li
                  key={fact.value + (fact.label ?? "")}
                  className="text-center"
                >
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand/10">
                    <Icon
                      aria-hidden
                      size={18}
                      strokeWidth={1.5}
                      className="text-brand"
                    />
                  </span>
                  {value}
                  {fact.label && (
                    <div className="mx-auto mt-2 max-w-[12ch] font-serif text-[13px] leading-[1.3] text-ink/80 md:text-[14px]">
                      {fact.label}
                    </div>
                  )}
                </li>
              ) : (
                <li key={fact.value + (fact.label ?? "")} className="text-center">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
                    <Icon aria-hidden size={30} strokeWidth={1.5} className="text-brand" />
                  </span>
                  {value}
                  {fact.label && (
                    <div className="mx-auto mt-3 max-w-[16ch] font-serif text-[16px] leading-[1.45] text-ink/80 md:text-[18px]">
                      {fact.label}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        </div>

        {/* ⬅ A COLUNA DA DIREITA — "OUR EXPERIENCE". Ver `split`: em duas
            colunas ela é a metade da direita; sem `experience` nada disto
            renderiza e a faixa segue com uma coluna só.

            O ARRANJO É O DO LAYOUT: rótulo e parágrafo em largura cheia, e
            abaixo uma fileira — marcas à esquerda, frase de fecho à direita,
            um filete vermelho no meio. Pedido de 24-09, com o recorte:
            *"teria que ser assim"*. */}
        <div>

        {/* ⬅ "OUR EXPERIENCE" — ver a prop `experience`.

            ⚠️ O TOPO É MAIOR QUE O DA FILEIRA DE LOGOS QUE VEM DEPOIS (`mt-20`
            contra os `mt-10` dela): aqui começa o SEGUNDO assunto da faixa —
            no layout ele é a outra coluna, com rótulo próprio —, e o degrau de
            respiro é o que substitui a divisão vertical que a coluna única não
            tem. Com o mesmo `mt-14` das medidas, o rótulo pareceria legenda da
            última delas.

            ⚠️ EM DUAS COLUNAS O TOPO SOME (`lg:mt-0`): o degrau existia para
            separar dois assuntos empilhados, e a separação passou a ser a
            calha entre as colunas. Mantido, ele desalinharia o rótulo da
            direita em 96px contra o da esquerda.

            ⚠️ O PARÁGRAFO NÃO É CENTRADO, ao contrário de tudo o que vem
            abaixo: ele é texto corrido de três linhas, e centrado viraria um
            bloco em bandeira dupla no meio de uma faixa de 1440. */}
        {experience && (experience.label?.trim() || experience.lead?.trim()) ? (
          <div className={split ? "mt-20 lg:mt-0" : "mt-20 lg:mt-24"}>
            {experience.label?.trim() ? (
              <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
                {experience.label}
              </p>
            ) : null}
            {experience.lead?.trim() ? (
              <p
                className={`max-w-[62ch] font-serif text-[18px] leading-[1.5] text-ink/70 md:text-[20px] ${
                  experience.label?.trim() ? "mt-6" : ""
                }`}
              >
                {experience.lead}
              </p>
            ) : null}
          </div>
        ) : null}

        {/* ⚠️ A FILEIRA DE MARCAS E A LINHA DE FECHO SÃO UMA LINHA SÓ a partir
            de `lg` — ver a caixa da `note`, logo abaixo. `items-center` porque
            os dois lados têm alturas diferentes (as marcas são lockups de
            proporções variadas, a frase são quatro linhas curtas) e é o eixo do
            meio que os faz ler como uma fileira. */}
        {/* ⚠️ A LINHA DE FECHO SÓ FICA AO LADO DAS MARCAS NUMA COLUNA SÓ. Em
            duas colunas (`split`) ela mora com o parágrafo, à direita das
            marcas — o texto da coluna já está à direita, e a frase de fecho é
            texto. Sem `split` ela continua ao lado da fileira, como o Senior
            Leadership a desenha. */}
        <div className={split ? "mt-10 lg:mt-12 lg:flex lg:items-center lg:gap-8" : "lg:flex lg:items-center"}>
        {cells.length > 0 && (
          /* `items-stretch` É O QUE DÁ ALTURA AOS FILETES: o divisor é a borda
             esquerda da própria célula, então ele mede o que a célula medir. Com
             `items-center` as bordas encolheriam para a altura do conteúdo e as
             três seriam de tamanhos diferentes — o rótulo de duas linhas é mais
             alto que o de uma.

             ⚠️ OS FILETES SÓ EXISTEM A PARTIR DE `lg`. Abaixo disso a fileira
             QUEBRA, e borda esquerda em item que começa uma linha nova desenha
             um filete solto no canto esquerdo, sem nada à esquerda dele. */
          /* ⚠️ SEIS CÉLULAS OU MAIS VIRAM QUADRO, E NÃO FILEIRA — 24-09, com as
             seis marcas do Talent Development. A fileira de uma linha é
             desenhada para CINCO células (duas marcas e três medidas, o layout
             do Senior Leadership Development); com seis e a linha de fecho ao
             lado, cada célula fica com ~190px e as marcas, que medem até 240,
             transbordam por cima do filete da vizinha. Foi o que aconteceu.

             O QUADRO É O QUE O LAYOUT DESENHA: três marcas em cima, três
             embaixo, SEM filete entre elas. O único traço é o que separa o
             quadro da frase de fecho, à direita. */
          <ul
            className={
              split
                ? "grid min-w-0 flex-1 grid-cols-3 items-center justify-items-center gap-x-6 gap-y-8"
                : `mt-14 lg:mt-16 lg:min-w-0 lg:flex-1 ${
                    gridded
                      ? "grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-10 sm:grid-cols-3"
                      : "flex flex-wrap items-stretch justify-center gap-y-12 lg:flex-nowrap lg:gap-y-0"
                  }`
            }
          >
            {cells.map((cell, i) => (
              <li
                key={i}
                className={
                  split
                    ? "flex min-w-0 flex-col items-center justify-center text-center"
                    : gridded
                      ? "flex w-full min-w-0 flex-col items-center justify-center text-center"
                      : `flex min-w-[150px] flex-1 flex-col items-center justify-center px-6 text-center lg:px-8 ${
                          i > 0 ? "lg:border-l lg:border-brand/30" : ""
                        }`
                }
              >
                {cell.kind === "logo" ? (
                  <EvidenceLogo size={split ? "small" : logoSize} logo={cell.logo} />
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

        {/* ⬅ A LINHA DE FECHO — ver a prop `note`.

            ⚠️ ELA MORA AO LADO DOS LOGOS, e não abaixo deles — 24-09, a pedido:
            *"faltou a frase turn potential into... a direita dos logos"*. No
            layout ela é a última CÉLULA da fileira de marcas, encostada na
            Vodafone, e não um fecho por baixo dela. A primeira versão a punha
            embaixo, alinhada à direita, e isso lia como assinatura da faixa
            inteira.

            ⚠️ A COLUNA É ESTREITA DE PROPÓSITO (`max-w-[22ch]`): no desenho a
            frase quebra em quatro linhas curtas ao lado das marcas. Em largura
            livre ela sairia numa linha só e empurraria os seis logos para a
            esquerda.

            ⚠️ SÓ A PARTIR DE `lg`, que é quando a fileira de marcas ainda cabe
            numa linha. Abaixo disso ela volta para baixo e centrada, junto com
            os logos, porque uma coluna de 22 caracteres ao lado de marcas
            quebradas em duas fileiras deixaria os dois espremidos. */}
        {note?.trim() ? (
          <p
            className={`mt-10 font-serif text-[18px] font-semibold leading-[1.25] tracking-[-0.2px] text-ink md:text-[20px] ${
              split
                ? "lg:mt-0 lg:max-w-[14ch] lg:shrink-0 lg:border-l-2 lg:border-brand lg:pl-8 lg:text-left"
                : "text-center lg:mt-16 lg:max-w-[22ch] lg:shrink-0 lg:pl-8 lg:text-left"
            }`}
          >
            {note}
          </p>
        ) : null}
        </div>
        </div>
        </div>

        {/* ⬅ A CITAÇÃO — ver a prop. O filete vermelho à esquerda é o mesmo
            recurso do `SolutionCta`, e é o que a separa das medidas sem precisar
            de um fundo próprio: ela é a voz de uma pessoa no meio de uma faixa
            de números. */}
        {testimonial?.quote?.trim() ? (
          <figure className="mt-16 max-w-[70ch] border-l-2 border-brand pl-6 md:pl-8">
            <blockquote className="font-serif text-[20px] leading-[1.45] text-ink md:text-[24px]">
              “{testimonial.quote}”
            </blockquote>
            {testimonial.attribution?.trim() ? (
              <figcaption className="mt-4 text-[13px] font-medium uppercase tracking-[1.3px] text-muted">
                {testimonial.attribution}
              </figcaption>
            ) : null}
          </figure>
        ) : null}
      </Reveal>
    </section>
  );
}
