import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import SolutionHero from "@/components/solutions/SolutionHero";
import SectionHead from "@/components/clients/SectionHead";
import ClientsStories from "@/components/clients/ClientsStories";
import SolutionCta from "@/components/solutions/SolutionCta";
import LogoMarquee from "@/components/LogoMarquee";
import Reveal from "@/components/Reveal";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { clientLogoRows, logoRowDuration } from "@/lib/logos";
import { getFirmStats } from "@/lib/stats";
import { getClientsCopy } from "@/lib/clients-copy-server";
/* 24-09 (hotfix): o herói passou a usar a foto que era do herói da /team, que
   ficou sem imagem. O paredão de logos da Rhea (`clients-impact.jpeg`, sem o
   título gravado na arte) continua em `public/hero`  -  é trocar o import. */
import clientsHero from "@/public/team/team-hero-24-09.jpg";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Our Clients | CorporateDNA",
    description:
      "The organisations CorporateDNA advises, the breadth of work behind each name, and what changed, measured.",
    alternates: localeAlternates("/our-clients"),
  };
}
export const revalidate = 300;


/**
 * ============================================================================
 * CLIENTS & IMPACT  -  reconstruída em 16-09
 * ============================================================================
 *
 * A PÁGINA QUE ESTAVA AQUI era da geração anterior: título em Poppins numa
 * caixa de 1000px, o paredão de logos em esteira, cinco faixas de case e o
 * mapa. Ela não foi ajustada  -  foi trocada, porque o pedido da daily de 16-09 é
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
 *   • "INDUSTRIES WE WORK IN" SAIU  -  era justamente o bloco importado da
 *     imagem 2 em 16-09, e voltou atrás um dia depois.
 *   • "REAL OUTCOMES" SAIU da faixa de números, e com ele a faixa voltou a ter
 *     um andar só.
 *
 * ⚠️ "BREADTH BY SERVICE" SAIU EM 16-09, a pedido  -  a caixa no lugar onde ela
 * entrava explica o porquê e como devolvê-la.
 *
 * OS FUNDOS: branco → paper → branco → paper → ink → branco. A repetição que
 * existia (`industries`/`case studies`, duas brancas coladas) deixou de existir
 * junto com a seção de industries, e a alternância agora fecha sozinha. Os
 * cartões de depoimento são BRANCOS (pedido de 16-09, e é o que a referência
 * desenha), o que obriga a faixa deles a ser `paper` para os cartões existirem
 * contra o fundo  -  é essa a âncora de onde a alternância se conta para trás.
 *
 * O QUE NÃO VEIO DO MOCKUP, e por quê:
 *
 *   • O HERÓI É O `SolutionHero`, o mesmo da /about e da /services, e não uma
 *     composição nova. Instrução dela na mesma call: *"we probably will use some
 *     of the layout of the other sections, the components, because if we don't
 *     do this, all pages will look different."* Consistência de componente acima
 *     de fidelidade ao desenho  -  dito pela cliente, não deduzido por nós.
 *
 *   • OS NÚMEROS SÃO OS NOSSOS. O mockup traz "6,300+ leaders reached", "27
 *     clients", "90% recommend us", "10+ years"; nenhum desses passou por
 *     aprovação e três contradizem o que o site publica hoje (`lib/stats.ts`, e
 *     a nota lá sobre a lista de aprovação de 06-08 que segue aberta). A faixa
 *     usava os números do CMS; DESDE 18-09 usa os quatro da About, a pedido
 *     da daily, e desde 23-09 eles vêm da copy que a cliente edita em
 *     `/edit-about` (`getFirmStats()`)  -  a caixa da seção conta. Trocar por
 *     outros continua sendo decisão da CDNA, não nossa.
 *
 *   • OS DEPOIMENTOS SÃO DOS CASES, com nome e cargo reais. Os três do mockup
 *     ("VP, Retail Banking, UK") são genéricos e sem fonte. Ela ficou de mandar
 *     os que faltam  -  até lá, a faixa mostra as vozes que o CMS realmente tem e
 *     some quando não tiver nenhuma.
 *
 * ⚠️ O QUE FALTA, E É DELA: as fotografias (herói, setores e a capa de cada
 * case  -  `coverMediaId` está vazio nos quinze), os depoimentos que faltam e a
 * informação de breadth por serviço para os seis cases antigos. Cada bloco
 * abaixo degrada sozinho quando o dado não está lá; nenhum deles quebra.
 */
export default async function ClientsAndImpactPage() {
  /* `copy` vem de `/edit-clients`; `firmStats` vem de `/edit-about`, porque
     os quatro números desta página são os mesmos da faixa de lá desde 18-09
      -  ver `lib/clients-copy.ts`. */
  const [firmStats, copy] = await Promise.all([
    getFirmStats(),
    getClientsCopy(),
  ]);

  /* UM CARD POR CLIENTE. A Frasers Property tem DOIS cases publicados  -  Top 150
     Leadership Development e HRLT Effectiveness  - , e são trabalhos diferentes,
     não duplicata de dados. Só que na grade os dois aparecem com o mesmo logo e
     o mesmo nome a dois cards de distância, e o que o olho lê é erro.

     A grade é um mural de CLIENTES; a biblioteca em /cases é a lista de CASES, e
     lá os dois continuam, cada um com sua página. Deduplicar aqui não esconde
     trabalho, escolhe o eixo certo para cada tela  -  e ainda libera um slot dos
     doze para mais um cliente, que é o que a seção existe para provar.

     FICA O QUE TEM NÚMERO. Entre dois cases do mesmo cliente, vence o que traz
     métrica: o card foi desenhado em volta dela, e sem número ele perde a linha
     que faz alguém parar. Empatados, vence o primeiro  -  a ordem do CMS. */
  /* AS TRÊS MAIS CURTAS, e não as três primeiras. Numa fileira de cartões a
     altura é a da citação mais longa, e as do CMS vão de uma frase (Unilever) a
     um parágrafo inteiro (GSK, HEINEKEN): pela ordem natural a faixa saía com um
     cartão cheio ao lado de dois com meio palmo de vazio. Ordenar por tamanho
     não é maquiagem  -  citação de depoimento funciona por concisão, e as curtas
     são as que alguém lê de fato numa varredura de página.

     Truncar era a outra saída e foi descartada: cortar a fala de um CEO nomeado
     no meio de uma frase é pior que não mostrá-la. */

  /* ⚠️ "REAL OUTCOMES" FOI RETIRADA EM 17-09  -  *"tirar real outcomes"*  - , um
     dia depois de entrar. Era a segunda fileira da faixa de números: as três
     métricas de case com número ("70%+ of Aviva delegates promoted", "88% NPS
     for Shell"), rotulada, alinhada à de cima.

     O CÁLCULO SAIU JUNTO e não ficou órfão aqui: era um `filter` + `slice` sobre
     `cases`, e deixá-lo sem quem o consumisse seria trabalho morto no servidor a
     cada revalidação.

     ⚠️ O DADO NÃO SE PERDEU, e é por isso que a remoção é barata: `metricValue`
     e `metricLabel` são exatamente o que a coluna de impacto de cada `CaseLine`
     mostra agora, uma seção abaixo. Os números que esta fileira publicava em
     três continuam publicados  -  ao lado do desafio que cada um responde, que é
     onde eles provam alguma coisa em vez de flutuarem soltos. Se ela pedir a
     fileira de volta, é ressuscitar estas quatro linhas. */
  /* Os três números ao lado do mapa. Regiões vem do CMS (`getSiteStats()`, o
     campo `countries` do `page_home`, que desde 17-09 publica 5 e é contado por
     REGIÃO); clientes é a contagem do paredão, que é a lista aprovada; cases é
     o que está publicado AGORA e sobe sozinho a cada case novo.

     ⚠️ ERA "COUNTRIES", E ESTAVA QUEBRADO DESDE 17-09: o `find` procurava
     "Countries" no rótulo, e o rótulo de `lib/stats.ts` virou "Regions of global
     delivery" naquele dia (commit 31a66ab). Sem match, caía no `?? "36"` e o
     mapa publicava "36 Countries"  -  o número velho, na unidade velha, ao lado
     de uma faixa que dizia "5 regions". Apareceu em 18-09 ao trocar os números
     da faixa acima; consertado junto: procura "Regions", rotula "Regions", e o
     fallback é o mesmo 5 dos fallbacks de lá.

     ⚠️ ESTA É A ÚNICA RAZÃO DE `getSiteStats()` AINDA SER CHAMADO NESTA PÁGINA:
     a faixa "By the numbers" passou a usar `FIRM_STATS` em 18-09. */
  /* ⚠️ OS VALORES CONTINUAM CALCULADOS e só os RÓTULOS são editáveis: dois
     dos três são contagens (quantos logos, quantos cases o CMS publicou) e o
     primeiro vem do CMS. O `find` por "Regions" é o mesmo de antes  -  a caixa
     acima conta por que ele procura essa palavra.

     ⚠️ O `find` CONTINUA CASANDO PELO RÓTULO DE `lib/stats.ts`, e NÃO por
     este daqui: aquele é o rótulo do CMS, este é o que esta página escreve.
     Trocar "Regions" no editor não pode desligar a busca. */

  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell footerTopBorder floatingNav>
        {/* O wrapper existe pelo `id`: o <SolutionHero> não recebe um, e o
            script do guia visual do editor precisa de um alvo. */}
        <div id="clients-hero">
        <SolutionHero
          eyebrow={copy.hero.eyebrow}
          title={copy.hero.title}
          subtitleAccent={copy.hero.subtitle}
          accentAsTitle
          imageUrl={clientsHero}
          imagePosition="object-top"
        />
        </div>

        {/* ── Esteira de logos ──────────────────────────────────────────────
            ⚠️ ERA O PAREDÃO PARADO ATÉ 17-09  -  *"na seção 'Trusted by global
            organisations' trocar os clientes pela barra animada de clientes da
            home"*. A decisão de 16-09 era a oposta, e o argumento dela está
            inteiro no cabeçalho de `components/clients/LogoWall.tsx`: a grade
            alinhada deixa o visitante PROCURAR o próprio setor e encontrá-lo; a
            esteira diz "muitos, passando" e não deixa ler nenhum.

            O PEDIDO VENCE, e o `LogoWall` FICA NO REPOSITÓRIO, sem uso: ele é
            uma peça pronta e comentada, e apagá-lo custaria a reescrita inteira
            se ela voltar atrás  -  é a segunda inversão nesta página em dois dias.

            AS DUAS ESTEIRAS CORREM EM SENTIDOS OPOSTOS, como na home: é o
            `reverse` da de baixo. Duas fileiras no mesmo sentido leem como uma
            faixa só rolando, e o cruzamento é o que dá a sensação de volume que
            a esteira existe para dar.

            ⚠️ `onLight` PORQUE A SEÇÃO É BRANCA  -  na home a mesma esteira corre
            sobre `bg-ink`. A caixa da prop, no componente, explica o que muda e
            como virar a faixa para escuro se for isso que ela quiser. */}
        <section id="clients" className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
            {/* ⚠️ SEM `kicker` DESDE 18-09  -  *"tirar a frase '27 clients across
                industries'"*. Era `${clientLogos.length} clients across
                industries`, a contagem do paredão à direita do rótulo. O
                `clientLogos` continua importado porque o `footprint`, no topo
                deste arquivo, ainda conta os clientes por ele. */}
            <SectionHead label={copy.logos.label} />
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
            da About  -  que ali ficam dentro do herói, sobre `ink` com texto
            branco  - , ela pediu os números "and maybe put it on a darker
            background as well, similar to this one, just to make it pop". Era
            `paper`, e o resumo escrito da call dizia só "cinza"; a gravação é
            que diz "darker, similar to this one", e "this one" é o `ink` da
            About. Sobre `ink` a regra do `globals.css` manda: régua e rótulo
            em `brand-light` (o `brand` cheio cai a 2,87:1), texto corrido em
            `white/xx`, fios em `white/15`  -  é o que `SectionHead onDark` e
            `RowLabel onDark` fazem. Vizinhas: a esteira acima e os cases
            abaixo são brancos, então a faixa escura fica isolada entre dois
            claros, como o herói. */}
        <section id="numbers" className="bg-ink text-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
            {/* 01-10: "Remove the heading - By the Numbers". */}
            <SectionHead onDark kicker={copy.numbers.kicker} />

            {/* ⚠️ OS NÚMEROS SÃO OS DA ABOUT DESDE 18-09  -  pedido da daily: a
                fileira passa a publicar os quatro da faixa da About (19 years /
                5 regions / 10,000+ / 5 of the top 10) no lugar dos quatro do
                CMS (`getSiteStats()`: 90% sponsored / 19 / 5 / 60+).

                ⚠️ A FONTE MUDOU DE NOVO EM 23-09, e agora ela é EDITÁVEL: os
                quatro entraram no editor `/edit-about`, então o texto vem da
                copy da About (padrão em `lib/about-copy.ts`, salvo no Blob) e
                chega aqui por `getFirmStats()`. O que a cliente salvar lá muda
                esta fileira junto  -  que é o ponto, e é por isso que a rota
                `/api/about-copy` revalida as DUAS páginas. O `getSiteStats()`
                continua sendo chamado aqui, mas só para o `footprint` ao lado
                do mapa. O ícone que a About desenha ao lado de cada número NÃO
                entra: esta fileira nunca teve ícone, e o pedido foi de números,
                não de composição.

                A nota "OS NÚMEROS SÃO OS NOSSOS" no cabeçalho deste arquivo
                continua verdadeira no que importa  -  os do mockup ("6,300+",
                "27 clients", "90% recommend") seguem fora  - , mas a fonte deixou
                de ser o CMS.

                ⚠️ SOBROU UMA FILEIRA. Eram DUAS, rotuladas  -  "Our scale" em
                cima e "Real outcomes" embaixo  - , e a de baixo saiu em 17-09
                (*"tirar real outcomes"*); a caixa no lugar do cálculo, no topo
                deste arquivo, conta o que ela era e para onde os números foram.

                O RÓTULO FICOU, e sozinho ele é mais fraco do que era: ele
                existia para DISTINGUIR duas afirmações de naturezas diferentes
                (tamanho da firma × resultado em cliente nomeado), e sem a
                segunda não há o que distinguir. Fica porque tirá-lo não foi
                pedido e porque ele ainda diz o que os quatro números são  -  mas
                é candidato natural a sair na próxima passada.

                O RÓTULO FICA À ESQUERDA DA FILEIRA, que é onde a imagem 2 o
                desenha. (O pedido dito em voz dizia "lado direito"; a mesma
                frase mandava seguir a imagem, e a imagem é inequívoca. Se for
                para a direita mesmo, é inverter a ordem das colunas do grid.)

                A RÉGUA VERMELHA CURTA ABAIXO DO RÓTULO é o mesmo objeto do
                `TypeLabel`  -  régua e palavra  - , só que empilhado em vez de lado
                a lado, porque aqui ele rotula uma FILEIRA e não uma seção. */}
            <div className="grid grid-cols-1 items-center gap-8 xl:grid-cols-[150px_1fr] xl:gap-10">
              <RowLabel onDark>{copy.numbers.rowLabel}</RowLabel>
              {/* `divide-x` com borda só entre as células é o que o desenho faz
                   -  as barras verticais separando os números sem caixa ao redor
                  de cada um. */}
              <Reveal className="grid grid-cols-2 items-start gap-x-4 gap-y-10 xl:grid-cols-4 xl:gap-x-0 xl:divide-x xl:divide-white/15">
                {firmStats.map((s) => (
                  <div key={s.label} className="min-w-0 px-2 text-center xl:px-5">
                    {/* "5 of the top 10" é uma FRASE onde os outros três são
                        um número curto, e no mesmo corpo ela quebrava em duas
                        linhas e pesava mais que os vizinhos. Na revisão de
                        18-09 (*"diminuir um pouco o tamanho de font do texto
                        5 of the top 10"*) o valor longo (>10 caracteres) desce
                        um degrau: 28/34px contra 34/42. O limiar é por
                        comprimento e não por índice para não depender da
                        ordem da lista; "5 regions" (9) e "19 years" (8)
                        ficam no corpo cheio. Com os valores editáveis desde
                        23-09, depender do comprimento é ainda mais certo:
                        qualquer número que ela escreva encontra o degrau
                        sozinho. Só aqui  -  a About tem a própria
                        composição, com ícones, e não foi pedida. */}
                    <p
                      className={`font-semibold leading-none tracking-[-1.5px] text-white ${
                        s.value.length > 10 ? "text-[28px] sm:text-[34px]" : "text-[34px] sm:text-[42px]"
                      }`}
                    >
                      {s.value}
                    </p>
                    <p className="mx-auto mt-3 max-w-[22ch] text-[11.5px] font-semibold uppercase leading-[1.5] tracking-[0.7px] text-white/75">
                      {s.label}
                    </p>
                  </div>
                ))}
              </Reveal>
            </div>

          </div>
        </section>

        {/* ── Industries  -  FORA DO AR DESDE 17-09 ──────────────────────────
            *"tirar a secao Industries we work in."* Eram oito blocos escuros com
            o nome de cada setor, e o bloco tinha UM DIA de vida: foi ele o
            "middle bit" que a imagem 2 do drive trouxe em 16-09, a pedido dela
            na call (*"the first image should be the landing page (…) but include
            that middle bit"*).

            COMO VOLTAR, se ela voltar atrás: `<IndustriesGrid items={industries} />`
            dentro de uma <section id="industries" className="bg-white"> com o
            `SectionHead`, entre a faixa de números e os case studies. O
            componente segue em `components/clients/IndustriesGrid.tsx` e a lista
            em `lib/industries.ts`, as duas intactas  -  é a segunda seção desta
            página a sair por este caminho (ver "Breadth by service", abaixo), e
            as duas saíram inteiras de propósito.

            ⚠️ A ALTERNÂNCIA DE FUNDO AGRADECEU. Esta seção era branca e a de
            case studies também: eram as duas únicas coladas na página, e o
            cabeçalho registrava a emenda como aceitável só porque a fileira de
            blocos escuros no fim desta fazia a borda no lugar do fundo. Sem ela,
            `paper` → branco volta a separar sozinho. */}

        {/* ── Breadth by service  -  FORA DO AR DESDE 16-09 ──────────────────
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

        <ClientsStories />
        <SolutionCta
          strapline={copy.cta.strapline}
          line={copy.cta.line}
          ctaLabel={copy.cta.ctaLabel}
          ctaHref="/contact"
        />

      </SiteShell>
    </div>
  );
}

/**
 * O rótulo de uma fileira da faixa "By the numbers"  -  a palavra em versalete
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
     que o `TypeLabel` faz  -  palavra em `white/45`, régua em `brand-light`. */
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

