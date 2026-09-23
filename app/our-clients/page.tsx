import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import EmptyNotice from "@/components/EmptyNotice";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import SolutionHero from "@/components/solutions/SolutionHero";
import SolutionCta from "@/components/solutions/SolutionCta";
import SectionHead from "@/components/clients/SectionHead";
import LogoMarquee from "@/components/LogoMarquee";
import CaseLine from "@/components/clients/CaseLine";
import WorldCoverageMap from "@/components/WorldCoverageMap";
import Reveal from "@/components/Reveal";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { clientLogos, clientLogoRows, logoRowDuration } from "@/lib/logos";
import { getSiteStats, FIRM_STATS } from "@/lib/stats";
import { getCaseListEntries, type CaseListEntry } from "@/lib/cms/map";
/* 23-09: a Rhea mandou o paredão de logos (`clients-impact.jpeg`). O título
   que vinha gravado na arte saiu, porque o herói já escreve o h1 por cima.
   O arquivo limpo mora em `public/hero`. */
import clientsHero from "@/public/hero/clients-impact.jpeg";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Clients & Impact | CorporateDNA",
    description:
      "The organisations CorporateDNA advises, the breadth of work behind each name, and what changed, measured.",
    alternates: localeAlternates("/our-clients"),
  };
}
export const revalidate = 300;

/** Quantos cases a grade mostra antes de mandar para a biblioteca inteira. */
const TILE_COUNT = 12;
/** Quantas vozes de cliente entram na faixa de depoimentos. */
const VOICE_COUNT = 3;

/**
 * ============================================================================
 * CLIENTS & IMPACT — reconstruída em 16-09
 * ============================================================================
 *
 * A PÁGINA QUE ESTAVA AQUI era da geração anterior: título em Poppins numa
 * caixa de 1000px, o paredão de logos em esteira, cinco faixas de case e o
 * mapa. Ela não foi ajustada — foi trocada, porque o pedido da daily de 16-09 é
 * de OUTRA página: *"the team have showed you clients and impact. I've sent you
 * the templates (…) so this will be the kind of layout we want"*.
 *
 * A ORDEM DAS SEÇÕES SAIU DA IMAGEM 1 do drive (`5. Clients& Impact/…01_33_16
 * PM.png`). Ela encolheu na daily de 17-09, que tirou dois blocos:
 *
 *   herói → esteira de logos → by the numbers → case studies →
 *   what our clients say → a force for good → global footprint → CTA
 *
 * ⚠️ TRÊS MUDANÇAS DE 17-09, e as três vieram com a razão junto (cada seção tem
 * a sua caixa no corpo, aqui fica só o mapa):
 *   • O PAREDÃO PARADO VIROU A ESTEIRA DA HOME.
 *   • "INDUSTRIES WE WORK IN" SAIU — era justamente o bloco importado da
 *     imagem 2 em 16-09, e voltou atrás um dia depois.
 *   • "REAL OUTCOMES" SAIU da faixa de números, e com ele a faixa voltou a ter
 *     um andar só.
 *
 * ⚠️ "BREADTH BY SERVICE" SAIU EM 16-09, a pedido — a caixa no lugar onde ela
 * entrava explica o porquê e como devolvê-la.
 *
 * OS FUNDOS: branco → paper → branco → paper → ink → branco. A repetição que
 * existia (`industries`/`case studies`, duas brancas coladas) deixou de existir
 * junto com a seção de industries, e a alternância agora fecha sozinha. Os
 * cartões de depoimento são BRANCOS (pedido de 16-09, e é o que a referência
 * desenha), o que obriga a faixa deles a ser `paper` para os cartões existirem
 * contra o fundo — é essa a âncora de onde a alternância se conta para trás.
 *
 * O QUE NÃO VEIO DO MOCKUP, e por quê:
 *
 *   • O HERÓI É O `SolutionHero`, o mesmo da /about e da /services, e não uma
 *     composição nova. Instrução dela na mesma call: *"we probably will use some
 *     of the layout of the other sections, the components, because if we don't
 *     do this, all pages will look different."* Consistência de componente acima
 *     de fidelidade ao desenho — dito pela cliente, não deduzido por nós.
 *
 *   • OS NÚMEROS SÃO OS NOSSOS. O mockup traz "6,300+ leaders reached", "27
 *     clients", "90% recommend us", "10+ years"; nenhum desses passou por
 *     aprovação e três contradizem o que o site publica hoje (`lib/stats.ts`, e
 *     a nota lá sobre a lista de aprovação de 06-08 que segue aberta). A faixa
 *     usava os números do CMS; DESDE 18-09 usa os quatro da About
 *     (`FIRM_STATS`, em `lib/stats.ts`), a pedido da daily — a caixa da seção
 *     conta. Trocar por outros continua sendo decisão da CDNA, não nossa.
 *
 *   • OS DEPOIMENTOS SÃO DOS CASES, com nome e cargo reais. Os três do mockup
 *     ("VP, Retail Banking, UK") são genéricos e sem fonte. Ela ficou de mandar
 *     os que faltam — até lá, a faixa mostra as vozes que o CMS realmente tem e
 *     some quando não tiver nenhuma.
 *
 * ⚠️ O QUE FALTA, E É DELA: as fotografias (herói, setores e a capa de cada
 * case — `coverMediaId` está vazio nos quinze), os depoimentos que faltam e a
 * informação de breadth por serviço para os seis cases antigos. Cada bloco
 * abaixo degrada sozinho quando o dado não está lá; nenhum deles quebra.
 */
export default async function ClientsAndImpactPage() {
  const [cases, stats] = await Promise.all([getCaseListEntries(), getSiteStats()]);

  /* UM CARD POR CLIENTE. A Frasers Property tem DOIS cases publicados — Top 150
     Leadership Development e HRLT Effectiveness —, e são trabalhos diferentes,
     não duplicata de dados. Só que na grade os dois aparecem com o mesmo logo e
     o mesmo nome a dois cards de distância, e o que o olho lê é erro.

     A grade é um mural de CLIENTES; a biblioteca em /cases é a lista de CASES, e
     lá os dois continuam, cada um com sua página. Deduplicar aqui não esconde
     trabalho, escolhe o eixo certo para cada tela — e ainda libera um slot dos
     doze para mais um cliente, que é o que a seção existe para provar.

     FICA O QUE TEM NÚMERO. Entre dois cases do mesmo cliente, vence o que traz
     métrica: o card foi desenhado em volta dela, e sem número ele perde a linha
     que faz alguém parar. Empatados, vence o primeiro — a ordem do CMS. */
  const tiles = Object.values(
    cases.reduce<Record<string, CaseListEntry>>((porCliente, c) => {
      const atual = porCliente[c.client];
      if (!atual || (!atual.metricValue && c.metricValue)) porCliente[c.client] = c;
      return porCliente;
    }, {}),
  ).slice(0, TILE_COUNT);
  /* AS TRÊS MAIS CURTAS, e não as três primeiras. Numa fileira de cartões a
     altura é a da citação mais longa, e as do CMS vão de uma frase (Unilever) a
     um parágrafo inteiro (GSK, HEINEKEN): pela ordem natural a faixa saía com um
     cartão cheio ao lado de dois com meio palmo de vazio. Ordenar por tamanho
     não é maquiagem — citação de depoimento funciona por concisão, e as curtas
     são as que alguém lê de fato numa varredura de página.

     Truncar era a outra saída e foi descartada: cortar a fala de um CEO nomeado
     no meio de uma frase é pior que não mostrá-la. */
  const voices = cases
    .filter((c) => c.quote && c.quoter)
    .sort((a, b) => (a.quote?.length ?? 0) - (b.quote?.length ?? 0))
    .slice(0, VOICE_COUNT);

  /* ⚠️ "REAL OUTCOMES" FOI RETIRADA EM 17-09 — *"tirar real outcomes"* —, um
     dia depois de entrar. Era a segunda fileira da faixa de números: as três
     métricas de case com número ("70%+ of Aviva delegates promoted", "88% NPS
     for Shell"), rotulada, alinhada à de cima.

     O CÁLCULO SAIU JUNTO e não ficou órfão aqui: era um `filter` + `slice` sobre
     `cases`, e deixá-lo sem quem o consumisse seria trabalho morto no servidor a
     cada revalidação.

     ⚠️ O DADO NÃO SE PERDEU, e é por isso que a remoção é barata: `metricValue`
     e `metricLabel` são exatamente o que a coluna de impacto de cada `CaseLine`
     mostra agora, uma seção abaixo. Os números que esta fileira publicava em
     três continuam publicados — ao lado do desafio que cada um responde, que é
     onde eles provam alguma coisa em vez de flutuarem soltos. Se ela pedir a
     fileira de volta, é ressuscitar estas quatro linhas. */
  /* Os três números ao lado do mapa. Regiões vem do CMS (`getSiteStats()`, o
     campo `countries` do `page_home`, que desde 17-09 publica 5 e é contado por
     REGIÃO); clientes é a contagem do paredão, que é a lista aprovada; cases é
     o que está publicado AGORA e sobe sozinho a cada case novo.

     ⚠️ ERA "COUNTRIES", E ESTAVA QUEBRADO DESDE 17-09: o `find` procurava
     "Countries" no rótulo, e o rótulo de `lib/stats.ts` virou "Regions of global
     delivery" naquele dia (commit 31a66ab). Sem match, caía no `?? "36"` e o
     mapa publicava "36 Countries" — o número velho, na unidade velha, ao lado
     de uma faixa que dizia "5 regions". Apareceu em 18-09 ao trocar os números
     da faixa acima; consertado junto: procura "Regions", rotula "Regions", e o
     fallback é o mesmo 5 dos fallbacks de lá.

     ⚠️ ESTA É A ÚNICA RAZÃO DE `getSiteStats()` AINDA SER CHAMADO NESTA PÁGINA:
     a faixa "By the numbers" passou a usar `FIRM_STATS` em 18-09. */
  const footprint = [
    { value: stats.find((s) => s.label.includes("Regions"))?.value ?? "5", label: "Regions" },
    { value: `${clientLogos.length}`, label: "Clients" },
    { value: `${cases.length}`, label: "Published case studies" },
  ];

  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        <SolutionHero
          eyebrow="Clients & Impact"
          title="Leadership change, measured where it matters."
          subtitle="From energy and pharma to luxury and financial services, advisory delivered where the stakes are highest."
          imageUrl={clientsHero}
          imagePosition="object-[62%_center]"
        />

        {/* ── Esteira de logos ──────────────────────────────────────────────
            ⚠️ ERA O PAREDÃO PARADO ATÉ 17-09 — *"na seção 'Trusted by global
            organisations' trocar os clientes pela barra animada de clientes da
            home"*. A decisão de 16-09 era a oposta, e o argumento dela está
            inteiro no cabeçalho de `components/clients/LogoWall.tsx`: a grade
            alinhada deixa o visitante PROCURAR o próprio setor e encontrá-lo; a
            esteira diz "muitos, passando" e não deixa ler nenhum.

            O PEDIDO VENCE, e o `LogoWall` FICA NO REPOSITÓRIO, sem uso: ele é
            uma peça pronta e comentada, e apagá-lo custaria a reescrita inteira
            se ela voltar atrás — é a segunda inversão nesta página em dois dias.

            AS DUAS ESTEIRAS CORREM EM SENTIDOS OPOSTOS, como na home: é o
            `reverse` da de baixo. Duas fileiras no mesmo sentido leem como uma
            faixa só rolando, e o cruzamento é o que dá a sensação de volume que
            a esteira existe para dar.

            ⚠️ `onLight` PORQUE A SEÇÃO É BRANCA — na home a mesma esteira corre
            sobre `bg-ink`. A caixa da prop, no componente, explica o que muda e
            como virar a faixa para escuro se for isso que ela quiser. */}
        <section id="clients" className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
            {/* ⚠️ SEM `kicker` DESDE 18-09 — *"tirar a frase '27 clients across
                industries'"*. Era `${clientLogos.length} clients across
                industries`, a contagem do paredão à direita do rótulo. O
                `clientLogos` continua importado porque o `footprint`, no topo
                deste arquivo, ainda conta os clientes por ele. */}
            <SectionHead label="Trusted by global organisations" />
            <div className="flex flex-col gap-4">
              <LogoMarquee
                logos={clientLogoRows[0]}
                duration={logoRowDuration(clientLogoRows[0])}
                onLight
              />
              <LogoMarquee
                logos={clientLogoRows[1]}
                duration={logoRowDuration(clientLogoRows[1])}
                reverse
                onLight
              />
            </div>
          </div>
        </section>

        {/* ── By the numbers ───────────────────────────────────────────── */}
        {/* ⚠️ A FAIXA É ESCURA DESDE 18-09. Na daily, olhando os quatro números
            da About — que ali ficam dentro do herói, sobre `ink` com texto
            branco —, ela pediu os números "and maybe put it on a darker
            background as well, similar to this one, just to make it pop". Era
            `paper`, e o resumo escrito da call dizia só "cinza"; a gravação é
            que diz "darker, similar to this one", e "this one" é o `ink` da
            About. Sobre `ink` a regra do `globals.css` manda: régua e rótulo
            em `brand-light` (o `brand` cheio cai a 2,87:1), texto corrido em
            `white/xx`, fios em `white/15` — é o que `SectionHead onDark` e
            `RowLabel onDark` fazem. Vizinhas: a esteira acima e os cases
            abaixo são brancos, então a faixa escura fica isolada entre dois
            claros, como o herói. */}
        <section id="numbers" className="bg-ink text-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
            <SectionHead onDark label="By the numbers" kicker="Real change, a broader reach." />

            {/* ⚠️ OS NÚMEROS SÃO OS DA ABOUT DESDE 18-09 — pedido da daily: a
                fileira passa a publicar os quatro da faixa da About (19 years /
                5 regions / 10,000+ / 5 of the top 10) no lugar dos quatro do
                CMS (`getSiteStats()`: 90% sponsored / 19 / 5 / 60+). A lista é
                `FIRM_STATS`, em `lib/stats.ts`, importada pelas duas páginas —
                a caixa de lá conta por que ela saiu de dentro da About. O
                `getSiteStats()` continua sendo chamado aqui, mas só para o
                `footprint` ao lado do mapa. O ícone que a About desenha ao lado
                de cada número NÃO entra: esta fileira nunca teve ícone, e o
                pedido foi de números, não de composição.

                A nota "OS NÚMEROS SÃO OS NOSSOS" no cabeçalho deste arquivo
                continua verdadeira no que importa — os do mockup ("6,300+",
                "27 clients", "90% recommend") seguem fora —, mas a fonte deixou
                de ser o CMS.

                ⚠️ SOBROU UMA FILEIRA. Eram DUAS, rotuladas — "Our scale" em
                cima e "Real outcomes" embaixo —, e a de baixo saiu em 17-09
                (*"tirar real outcomes"*); a caixa no lugar do cálculo, no topo
                deste arquivo, conta o que ela era e para onde os números foram.

                O RÓTULO FICOU, e sozinho ele é mais fraco do que era: ele
                existia para DISTINGUIR duas afirmações de naturezas diferentes
                (tamanho da firma × resultado em cliente nomeado), e sem a
                segunda não há o que distinguir. Fica porque tirá-lo não foi
                pedido e porque ele ainda diz o que os quatro números são — mas
                é candidato natural a sair na próxima passada.

                O RÓTULO FICA À ESQUERDA DA FILEIRA, que é onde a imagem 2 o
                desenha. (O pedido dito em voz dizia "lado direito"; a mesma
                frase mandava seguir a imagem, e a imagem é inequívoca. Se for
                para a direita mesmo, é inverter a ordem das colunas do grid.)

                A RÉGUA VERMELHA CURTA ABAIXO DO RÓTULO é o mesmo objeto do
                `TypeLabel` — régua e palavra —, só que empilhado em vez de lado
                a lado, porque aqui ele rotula uma FILEIRA e não uma seção. */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[150px_1fr] lg:gap-10">
              <RowLabel onDark>Our scale</RowLabel>
              {/* `divide-x` com borda só entre as células é o que o desenho faz
                  — as barras verticais separando os números sem caixa ao redor
                  de cada um. */}
              <Reveal className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:divide-x sm:divide-white/15">
                {FIRM_STATS.map((s) => (
                  <div key={s.label} className="px-2 text-center sm:px-5">
                    {/* "5 of the top 10" é uma FRASE onde os outros três são
                        um número curto, e no mesmo corpo ela quebrava em duas
                        linhas e pesava mais que os vizinhos. Na revisão de
                        18-09 (*"diminuir um pouco o tamanho de font do texto
                        5 of the top 10"*) o valor longo (>10 caracteres) desce
                        um degrau: 28/34px contra 34/42. O limiar é por
                        comprimento e não por índice para não depender da
                        ordem em `FIRM_STATS`; "5 regions" (9) e "19 years" (8)
                        ficam no corpo cheio. Só aqui — a About tem a própria
                        composição, com ícones, e não foi pedida. */}
                    <p
                      className={`font-semibold leading-none tracking-[-1.5px] text-white ${
                        s.value.length > 10 ? "text-[28px] sm:text-[34px]" : "text-[34px] sm:text-[42px]"
                      }`}
                    >
                      {s.value}
                    </p>
                    <p className="mx-auto mt-3 max-w-[22ch] text-[11.5px] font-semibold uppercase leading-[1.4] tracking-[1.2px] text-white/60">
                      {s.label}
                    </p>
                  </div>
                ))}
              </Reveal>
            </div>

          </div>
        </section>

        {/* ── Industries — FORA DO AR DESDE 17-09 ──────────────────────────
            *"tirar a secao Industries we work in."* Eram oito blocos escuros com
            o nome de cada setor, e o bloco tinha UM DIA de vida: foi ele o
            "middle bit" que a imagem 2 do drive trouxe em 16-09, a pedido dela
            na call (*"the first image should be the landing page (…) but include
            that middle bit"*).

            COMO VOLTAR, se ela voltar atrás: `<IndustriesGrid items={industries} />`
            dentro de uma <section id="industries" className="bg-white"> com o
            `SectionHead`, entre a faixa de números e os case studies. O
            componente segue em `components/clients/IndustriesGrid.tsx` e a lista
            em `lib/industries.ts`, as duas intactas — é a segunda seção desta
            página a sair por este caminho (ver "Breadth by service", abaixo), e
            as duas saíram inteiras de propósito.

            ⚠️ A ALTERNÂNCIA DE FUNDO AGRADECEU. Esta seção era branca e a de
            case studies também: eram as duas únicas coladas na página, e o
            cabeçalho registrava a emenda como aceitável só porque a fileira de
            blocos escuros no fim desta fazia a borda no lugar do fundo. Sem ela,
            `paper` → branco volta a separar sozinho. */}

        {/* ── Breadth by service — FORA DO AR DESDE 16-09 ──────────────────
            A matriz cliente x servico foi construida e retirada no mesmo dia, a
            pedido. Ela funciona; o que falta e CONTEUDO. Plotando so os nove
            cases de 16-09, a grade saia com oito clientes e seis servicos, e os
            seis cases da geracao anterior nao entravam porque o `facets.service`
            deles usa um vocabulario que nao existe mais. Uma matriz rala diz
            justamente o contrario do que ela existe para dizer.

            COMO VOLTAR, quando o conteudo chegar: `<BreadthMatrix entries={cases} />`
            dentro de uma <section> com o `SectionHead`, entre as industrias e os
            case studies, que e a posicao da imagem 1 do drive. O componente
            segue em `components/clients/BreadthMatrix.tsx`, comentado e pronto.

            O QUE DESTRAVA: retaguear os seis cases antigos com os rotulos de
            `lib/services.ts`, e a informacao de breadth que a cliente ficou de
            mandar (*"we'll give you this information"*, daily de 16-09). */}

        {/* ── Case studies ─────────────────────────────────────────────── */}
        <section id="case-studies" className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
            <SectionHead label="Case studies" kicker="Real stories. Lasting change." />

            {/* ⚠️ ERA UMA GRADE DE CARTÕES COM FOTO até 17-09 — *"mudar o
                estilo da seção 'case studies' deixar cada case em uma linha com
                logo texto The challenge, e os numeros de impactoo"*. O desenho
                de cada linha e o porquê da troca estão no cabeçalho do
                `CaseLine`; o que importa AQUI é o que a lista ganhou com ela.

                A CAPA DE CASE ERA O PROBLEMA MAIOR: `coverMediaId` está vazio
                nos quinze cases do CMS, então os doze cartões desta grade
                mostravam doze placeholders de imagem. Uma grade de placeholders
                numa página cujo trabalho é provar impacto era o defeito mais
                visível da página, e a linha não tem slot de foto para ficar
                vazio — ela mostra logo, desafio e número, que são os três campos
                que o CMS realmente preenche.

                ⚠️ O `CaseTile` FICA NO REPOSITÓRIO, sem uso, pelo mesmo motivo
                que o `LogoWall` duas seções acima: esta página inverteu duas
                decisões em dois dias, e a peça pronta é mais barata de devolver
                que de reescrever. Quando as capas chegarem, a conversa sobre
                cartão × linha volta com dado melhor do que tem hoje. */}
            {tiles.length === 0 ? (
              <EmptyNotice>No case studies published yet.</EmptyNotice>
            ) : (
              /* ⚠️ O `-mx` SAIU EM 17-09, junto com o realce de `hover` da
                 linha. Ele existia para a tarja transbordar a margem do conteúdo
                 sem mover o conteúdo; sem tarja, ele só deslocava a lista para
                 fora do eixo do `SectionHead` acima. Ver a caixa no `CaseLine`.

                 ⚠️ E O PAR `-mx`/`px` VOLTOU EM 18-09 — dentro do `CaseLine`, não
                 aqui. A cliente pediu as linhas alternando branco e cinza, e uma
                 faixa de fundo é exatamente a "tarja" para a qual o par existia:
                 o `-mx` estica a faixa até a borda do contêiner e o `px` do
                 mesmo tamanho devolve o conteúdo ao eixo do `SectionHead`. Sem o
                 par, ou a faixa começaria no pixel do texto, ou o texto
                 entraria 24px para dentro. A conta está na caixa do `CaseLine`. */
              <Reveal className="mt-2 flex flex-col">
                {tiles.map((entry) => (
                  <CaseLine key={entry.slug} entry={entry} />
                ))}
              </Reveal>
            )}

            {/* ⚠️ O "EXPLORE ALL CASE STUDIES" SAIU EM 17-09, a pedido. Ele era
                um botão de borda no pé da lista, condicionado a
                `cases.length > tiles.length` — só aparecia quando o CMS tinha
                mais cases publicados do que os `TILE_COUNT` que esta seção
                mostra.

                ⚠️ O CORTE EM 12 CONTINUA EXISTINDO. Ele não saiu junto, e é bom
                saber: se um dia houver mais de doze cases publicados, os
                excedentes deixam de ter QUALQUER caminho a partir desta seção —
                antes o botão era esse caminho. A biblioteca segue viva em
                `/cases` e alcançável pelo menu; o que se perdeu foi o atalho
                daqui. Hoje são nove cases contra um teto de doze, então a
                condição nem chegava a ser verdadeira e o botão não aparecia.

                COMO VOLTAR: é o `<Link href="/cases">` com a mesma linguagem de
                botão do "Read the full story" de cada linha, dentro do mesmo
                `cases.length > tiles.length`. Está no git. */}
          </div>
        </section>

        {/* ── What our clients say ─────────────────────────────────────────
            ⚠️ ERA UMA FAIXA ESCURA ATÉ 16-09, e ela apontou o erro olhando a
            referência: o bloco é CLARO nas duas imagens do drive, com cartões
            brancos de borda fina. E o motivo é de leitura, não de gosto — a
            faixa escura deste site é o registro de ÊNFASE (o CTA, a evidência
            de serviço), e usá-la aqui punha os depoimentos no mesmo peso do
            fecho da página, empurrando para baixo o que vem antes. Em claro,
            eles ficam onde devem: prova corrente, não clímax.

            A ESTRUTURA DO CARTÃO É A DA REFERÊNCIA: retrato à esquerda, citação
            à direita, atribuição embaixo e uma régua vermelha curta no pé. */}
        {voices.length > 0 && (
          <section id="voices" className="bg-paper">
            <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
              <SectionHead
                label="What our clients say"
                kicker="Real partnerships. Lasting perspectives."
              />
              <Reveal className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {voices.map((c) => (
                  <figure
                    key={c.slug}
                    className="flex h-full gap-5 border border-line bg-white px-5 py-6"
                  >
                    <div className="flex w-[84px] shrink-0 flex-col">
                      {/* ⚠️ NENHUM DEPOIMENTO TEM RETRATO. A referência desenha
                          o rosto de quem fala, e nós não temos essas fotos — ela
                          ficou de mandar os depoimentos que faltam e as imagens
                          são dela. O SLOT TRACEJADO é o recurso que o site já
                          usa para isso: mostra a composição real, deixa claro
                          que falta arquivo e não finge com foto de banco de
                          imagens, que num depoimento de cliente nomeado seria
                          pior que o vazio. */}
                      <ImagePlaceholder
                        label="Photo"
                        className="aspect-[3/4] w-full"
                      />
                      {/* A régua fica ABAIXO DO RETRATO e presa ao pé do
                          cartão, como na referência. */}
                      <span className="mt-auto block h-0.5 w-7 bg-brand" />
                    </div>

                    <div className="flex grow flex-col">
                      {/* A citação em SERIFA: é a única voz da página que não é
                          a nossa, e a troca de família marca isso sem precisar
                          de aspas decorativas. */}
                      <blockquote className="font-serif text-[15.5px] leading-[1.5] tracking-[-0.1px] text-ink md:text-[16px]">
                        “{unquote(c.quote)}”
                      </blockquote>
                      <figcaption className="mt-auto pt-5 text-[12.5px] leading-[1.45] text-muted">
                        {c.quoter}
                      </figcaption>
                    </div>
                  </figure>
                ))}
              </Reveal>
            </div>
          </section>
        )}

        {/* ── A force for good ─────────────────────────────────────────────
            ⚠️ REFEITA EM 16-09. A primeira versão repetia a forma das outras
            seções — `SectionHead` com a régua vermelha, fundo claro, texto em
            `muted`, link sublinhado — e por isso lia como "mais uma seção", que
            é justamente o que ela NÃO é na imagem 1 do drive: lá é uma FAIXA
            ESCURA DE SANGRIA TOTAL, com o título em versalete à esquerda e um
            botão claro à direita.

            E a diferença tem função. Tudo acima desta faixa é prova comercial —
            logos, números, cases, depoimentos. Este bloco muda de assunto: fala
            do que a firma faz fora do contrato. A quebra de fundo é o que avisa
            o leitor de que o assunto virou; em claro, com o mesmo rótulo das
            outras, o aviso não existia.

            SEM `SectionHead` AQUI, pelo mesmo motivo: o rótulo com régua é o
            objeto que marca "seção de conteúdo da página". Esta faixa é um
            intervalo.

            ⚠️ FALTA A FOTOGRAFIA. No desenho, a faixa tem folhagem escura ao
            fundo — é o trabalho de agrofloresta com a TERRAGRN. Não temos esse
            arquivo: o acervo tem fotos de evento (`/dna-time/*`), que são de
            pessoas em sala e diriam o contrário de "beyond the boardroom". A
            faixa fica no `ink` sólido até a imagem chegar; quando chegar, é um
            `<Image fill>` com um véu por cima, e nada mais muda aqui. */}
        <section id="social-impact" className="relative isolate overflow-hidden bg-ink text-white">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-9 px-6 py-16 md:flex-row md:items-center md:justify-between md:gap-14 md:px-10 md:py-20">
            <div>
              {/* VERSALETE COM ENTRELETRA, em serifa, como no desenho — e é a
                  única seção da página cujo título é o próprio texto grande, em
                  vez de um rótulo acima de um parágrafo. */}
              <h2 className="font-serif text-[19px] uppercase leading-[1.35] tracking-[2px] text-white sm:text-[22px]">
                A force for good, beyond the boardroom.
              </h2>
              {/* A COPY É A DA /our-impact, palavra por palavra. Ela já está no
                  ar e já passou pela cliente; o desenho traz uma versão mais
                  curta e mais bonita para a faixa, mas reescrita e sem fonte em
                  documento nenhum. Se ela quiser a do mockup, é pedido de copy.
                  `max-w` em ch para a linha não atravessar a faixa inteira. */}
              <p className="mt-5 max-w-[78ch] text-[15px] leading-[1.7] text-white/70 md:text-[16px]">
                CorporateDNA is committed to being a force for good in the
                world. Our mission is to make transformative impact through
                humanity, honesty, and purpose. In acting on our deeply held
                values of social awareness, sustainability, and boldness, we
                have partnered with TERRAGRN, an organisation dedicated to
                sustainable community-led agroforestry.
              </p>
            </div>
            {/* `shrink-0` para o botão não ser espremido pelo parágrafo quando
                a faixa fica estreita — no desenho ele tem largura própria e o
                texto é que cede. */}
            <Link
              href="/our-impact#social-impact"
              className="inline-flex shrink-0 items-center gap-3 self-start border border-white px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[1.5px] text-white transition-colors hover:bg-white hover:text-ink md:self-auto"
            >
              Learn more
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>

        {/* ── Global footprint ─────────────────────────────────────────────
            ⚠️ É O `WorldCoverageMap`, E NÃO O `LocationsBlock`. A versão
            anterior desta página usava o segundo, e ele está certo para o que
            fazia lá — mapa do Leaflet, tira de cidades e os ENDEREÇOS dos
            escritórios. Só que o desenho dela pede outra coisa: um planisfério
            com os países onde há trabalho, ao lado dos números. Com o Leaflet
            aberto em Covent Garden e um alfinete, a seção respondia "onde fica
            nosso escritório de Londres" numa página cujo assunto é alcance.

            `eyebrow`/`title` em `null` porque o cabeçalho é o `SectionHead`
            desta página; sem isso a seção abriria dois títulos. `bare` entrega o
            SVG cru para a grade daqui posicionar. */}
        <section id="footprint" className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
            <SectionHead
              label="Global footprint"
              kicker="Where our clients create change."
            />
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_260px] lg:items-center lg:gap-16">
              <WorldCoverageMap eyebrow={null} title={null} tone="white" bare />
              {/* OS NÚMEROS REPETEM os da faixa de cima de propósito: é o mesmo
                  fato dito em dois registros — a tabela e o mapa —, e é o que o
                  desenho dela faz. Sai daqui quem não tem fonte: "leaders
                  reached" é do mockup e não está aprovado. */}
              {/* ⚠️ GRADE DE TRÊS NO TELEFONE, e não `flex-wrap` — 16-09. Com
                  o wrap, os três entravam como 2 + 1: "36" e "27" dividiam a
                  linha e "15" caía sozinho embaixo, porque o rótulo
                  "PUBLISHED CASE STUDIES" é o dobro dos outros dois e estourava
                  a medida. Grade de colunas iguais resolve na origem: a largura
                  deixa de depender do comprimento do rótulo.

                  A ESCALA CAI JUNTO no telefone (26px contra 40px) — em três
                  colunas de ~106px, o corpo de desktop empurraria o número para
                  fora da célula. */}
              <dl className="grid grid-cols-3 gap-x-4 gap-y-6 lg:flex lg:flex-col lg:gap-8">
                {footprint.map((f) => (
                  <div key={f.label}>
                    <dt className="sr-only">{f.label}</dt>
                    <dd>
                      <span className="block text-[26px] font-semibold leading-none tracking-[-1px] text-ink sm:text-[34px] lg:text-[40px]">
                        {f.value}
                      </span>
                      <span className="mt-2 block text-[10.5px] font-semibold uppercase leading-[1.3] tracking-[1px] text-muted sm:text-[11.5px] sm:tracking-[1.2px]">
                        {f.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <SolutionCta
          strapline="Let’s create real change, together."
          line="Speak to our team about how we can support your organisation."
          ctaLabel="Get in touch"
        />
      </SiteShell>
    </div>
  );
}

/**
 * O rótulo de uma fileira da faixa "By the numbers" — a palavra em versalete
 * com a régua vermelha curta embaixo, como na imagem 2 do drive.
 *
 * FICA AQUI, e não em `components/`, porque é usado duas vezes na mesma página
 * e em lugar nenhum além dela. Promover para componente compartilhado no
 * primeiro uso é o que enche a pasta de peças de um site só.
 *
 * `lg:pt-2` ALINHA O RÓTULO COM O TOPO DOS NÚMEROS e não com o topo da caixa:
 * o número tem `leading-none`, então a caixa dele começa alguns pixels acima da
 * letra. Sem o empurrão, o rótulo parece subir.
 */
function RowLabel({ children, onDark = false }: { children: React.ReactNode; onDark?: boolean }) {
  /* `onDark` desde 18-09, quando a faixa dos números virou `ink`: mesma troca
     que o `TypeLabel` faz — palavra em `white/45`, régua em `brand-light`. */
  return (
    <div className="lg:pt-2">
      <p
        className={`text-[11.5px] font-semibold uppercase leading-none tracking-[1.5px] ${
          onDark ? "text-white/45" : "text-muted"
        }`}
      >
        {children}
      </p>
      <span className={`mt-2.5 block h-0.5 w-6 ${onDark ? "bg-brand-light" : "bg-brand"}`} />
    </div>
  );
}

/**
 * Tira as aspas que já vêm no valor gravado, para não somarem com as
 * tipográficas que o cartão desenha em volta.
 *
 * ⚠️ POR QUE NÃO É NO `lib/cms/map.ts`. Lá seria o lugar natural de normalizar,
 * mas a `CaseView` imprime a citação CRUA, sem aspas próprias — tirá-las na
 * origem deixaria a página de case com a fala solta, sem marca nenhuma de que
 * é citação. Enquanto as duas telas discordarem sobre quem desenha as aspas, o
 * conserto é de quem as desenha.
 *
 * O CMS tem os dois tipos: a planilha da cliente veio com aspas tipográficas
 * (“ ”) e os cases antigos, com as retas ("). Os dois casos entram aqui.
 */
function unquote(text?: string): string {
  return (text ?? "").trim().replace(/^["“”']+|["“”']+$/g, "").trim();
}
