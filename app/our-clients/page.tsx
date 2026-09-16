import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import EmptyNotice from "@/components/EmptyNotice";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import SolutionHero from "@/components/solutions/SolutionHero";
import SolutionCta from "@/components/solutions/SolutionCta";
import SectionHead from "@/components/clients/SectionHead";
import LogoWall from "@/components/clients/LogoWall";
import IndustriesGrid from "@/components/clients/IndustriesGrid";
import CaseTile from "@/components/clients/CaseTile";
import WorldCoverageMap from "@/components/WorldCoverageMap";
import Reveal from "@/components/Reveal";
import { localeAlternates } from "@/lib/seo/alternates";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { clientLogos } from "@/lib/logos";
import { industries } from "@/lib/industries";
import { getSiteStats } from "@/lib/stats";
import { getCaseListEntries, type CaseListEntry } from "@/lib/cms/map";
/* O MESMO skyline da /about e da /services, importado e não copiado — ver a
   caixa em `app/services/page.tsx`. Ela ainda não mandou fotografia própria
   para esta página; quando mandar, é trocar esta linha. */
import skylinePhoto from "@/public/skyline-dna.jpg";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Clients & Impact — Corporate DNA",
    description:
      "The organisations Corporate DNA advises, the breadth of work behind each name, and what changed — measured.",
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
 * A ORDEM DAS SEÇÕES É A DA IMAGEM 1 do drive (`5. Clients& Impact/…01_33_16
 * PM.png`), com UM bloco trazido da imagem 2 — "Industries we work in" —, que é
 * exatamente o que ela pediu na call: *"the first image should be the landing
 * page (…) but include that middle bit"*.
 *
 *   herói → paredão de logos → by the numbers → industries → case studies →
 *   what our clients say → a force for good → global footprint → CTA
 *
 * ⚠️ "BREADTH BY SERVICE" SAIU EM 16-09, a pedido — a caixa no lugar onde ela
 * entrava explica o porquê e como devolvê-la.
 *
 * OS FUNDOS: branco → paper → branco → branco → paper → ink → branco. A única
 * repetição é `industries`/`case studies`, e ela é de propósito: os cartões de
 * depoimento são BRANCOS (pedido de 16-09, e é o que a referência desenha), o
 * que obriga a faixa deles a ser `paper` para os cartões existirem contra o
 * fundo — e daí para trás a alternância se resolve sozinha. O corte entre
 * industries e case studies não se perde porque a primeira termina numa fileira
 * de blocos escuros, que já faz a borda.
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
 *     usa os números do CMS. Trocar por outros é decisão da CDNA, não nossa.
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

  /* "REAL OUTCOMES" SAI DOS CASES, não de uma lista à parte. A imagem 2 desenha
     uma segunda fileira de números — "70%+ of Aviva delegates promoted", "88%
     NPS for Shell" — e é exatamente a forma da métrica que cada case já carrega
     desde 16-09. Só entram as que têm NÚMERO: uma evidência qualitativa é
     verdadeira, mas não se lê como número grande numa fileira de quatro. */
  const outcomes = cases
    .filter((c) => c.metricValue && c.metricLabel)
    .slice(0, 3);

  /* Os três números ao lado do mapa. Países vem do CMS (a mesma fonte da faixa
     acima); clientes é a contagem do paredão, que é a lista aprovada; cases é o
     que está publicado AGORA e sobe sozinho a cada case novo. */
  const footprint = [
    { value: stats.find((s) => s.label.includes("Countries"))?.value ?? "36", label: "Countries" },
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
          imageUrl={skylinePhoto}
          imagePosition="object-[50%_38%]"
        />

        {/* ── Paredão de logos ──────────────────────────────────────────── */}
        <section id="clients" className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
            <SectionHead
              label="Trusted by global organisations"
              kicker={`${clientLogos.length} clients across industries`}
            />
            <LogoWall logos={clientLogos} />
          </div>
        </section>

        {/* ── By the numbers ───────────────────────────────────────────── */}
        <section id="numbers" className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
            <SectionHead label="By the numbers" kicker="Real change, a broader reach." />

            {/* ⚠️ DUAS FILEIRAS ROTULADAS — 16-09, pedido dela apontando a
                imagem 2 do drive. Sem os rótulos as duas fileiras eram só
                "sete números", e o leitor tinha de descobrir sozinho que a de
                cima fala do TAMANHO da firma e a de baixo do RESULTADO em
                cliente nomeado. São afirmações de naturezas diferentes, e é o
                rótulo que faz essa diferença aparecer.

                O RÓTULO FICA À ESQUERDA DA FILEIRA, que é onde a imagem 2 o
                desenha. (O pedido dito em voz dizia "lado direito"; a mesma
                frase mandava seguir a imagem, e a imagem é inequívoca. Se for
                para a direita mesmo, é inverter a ordem das colunas do grid.)

                A RÉGUA VERMELHA CURTA ABAIXO DO RÓTULO é o mesmo objeto do
                `TypeLabel` — régua e palavra —, só que empilhado em vez de lado
                a lado, porque aqui ele rotula uma FILEIRA e não uma seção. */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[150px_1fr] lg:gap-10">
              <RowLabel>Our scale</RowLabel>
              {/* `divide-x` com borda só entre as células é o que o desenho faz
                  — as barras verticais separando os números sem caixa ao redor
                  de cada um. */}
              <Reveal className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:divide-x sm:divide-line">
                {stats.map((s) => (
                  <div key={s.label} className="px-2 text-center sm:px-5">
                    <p className="text-[34px] font-semibold leading-none tracking-[-1.5px] text-ink sm:text-[42px]">
                      {s.value}
                    </p>
                    <p className="mx-auto mt-3 max-w-[22ch] text-[11.5px] font-semibold uppercase leading-[1.4] tracking-[1.2px] text-muted">
                      {s.label}
                    </p>
                  </div>
                ))}
              </Reveal>
            </div>

            {outcomes.length > 0 && (
              <>
                <div className="my-10 h-px w-full bg-line md:my-12" />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[150px_1fr] lg:gap-10">
                  <RowLabel>Real outcomes</RowLabel>
                  {/* ⚠️ MESMA GRADE DA FILEIRA DE CIMA (quatro colunas, células
                      centradas, divisórias), e não três colunas como era — 16-09.
                      As duas fileiras são lidas como uma tabela de dois andares,
                      e com grades diferentes o primeiro número de baixo (`700+`)
                      caía no meio do caminho entre o primeiro e o segundo de
                      cima. Alinhados, os dois primeiros números dividem o mesmo
                      eixo vertical.

                      SÃO TRÊS ITENS NUMA GRADE DE QUATRO, de propósito: a quarta
                      célula fica vazia. Espremer três em três colunas realinharia
                      tudo de novo e desfaria o efeito. Se um dia houver um quarto
                      resultado, ele entra sem mudar nada aqui. */}
                  <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:divide-x sm:divide-line">
                    {outcomes.map((c) => (
                      <div key={c.slug} className="px-2 text-center sm:px-5">
                        <p className="text-[30px] font-semibold leading-none tracking-[-1px] text-brand sm:text-[34px]">
                          {c.metricValue}
                        </p>
                        <p className="mx-auto mt-2.5 max-w-[22ch] text-[14px] leading-[1.45] text-ink">
                          {c.metricLabel}
                        </p>
                        <p className="mt-1 text-[12px] uppercase tracking-[1px] text-muted">
                          {c.client}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── Industries ───────────────────────────────────────────────── */}
        <section id="industries" className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
            <SectionHead
              label="Industries we work in"
              kicker="Where the stakes are highest."
            />
            <IndustriesGrid items={industries} />
          </div>
        </section>

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

            {tiles.length === 0 ? (
              <EmptyNotice>No case studies published yet.</EmptyNotice>
            ) : (
              <Reveal className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {tiles.map((entry) => (
                  <CaseTile key={entry.slug} entry={entry} />
                ))}
              </Reveal>
            )}

            {cases.length > tiles.length && (
              <Link
                href="/cases"
                className="mt-10 inline-flex items-center gap-2 border border-ink px-7 py-3.5 text-[14px] font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Explore all case studies
                <span aria-hidden>→</span>
              </Link>
            )}
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
                Corporate DNA is committed to being a force for good in the
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
              <dl className="flex flex-row flex-wrap gap-x-12 gap-y-6 lg:flex-col lg:gap-8">
                {footprint.map((f) => (
                  <div key={f.label}>
                    <dt className="sr-only">{f.label}</dt>
                    <dd>
                      <span className="block text-[34px] font-semibold leading-none tracking-[-1px] text-ink sm:text-[40px]">
                        {f.value}
                      </span>
                      <span className="mt-2 block text-[11.5px] font-semibold uppercase tracking-[1.2px] text-muted">
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
function RowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="lg:pt-2">
      <p className="text-[11.5px] font-semibold uppercase leading-none tracking-[1.5px] text-muted">
        {children}
      </p>
      <span className="mt-2.5 block h-0.5 w-6 bg-brand" />
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
