/**
 * ⚠️ PÁGINA DESCARTÁVEL — a seção "Global faculty" da /team em cinco
 * tratamentos, para escolher um.
 *
 * ⏸️ PARADA EM 11-09, ANTES DE ESCOLHER UM. As cinco foram montadas e
 * comparadas na tela, e a comparação terminou num lugar que nenhuma delas
 * resolve: as cinco discutem COMO tratar a foto que entra na seção, e a foto
 * que o documento pede nunca chegou. É o slot 06 do outline de Team — "A
 * representative selection or mosaic image per region" —, cinco imagens, uma
 * por região. O que está no ar continua sendo a faixa de texto.
 *
 * ESCOLHER AGORA SERIA ESCOLHER DUAS VEZES: a decisão muda quando as cinco
 * imagens chegarem, porque três das cinco variantes (1, 2 e 3) usam UMA foto de
 * fundo para a seção inteira e deixam de fazer sentido no dia em que houver uma
 * por região. As que sobreviveriam são a 4 e a 5 — e a 5 é literalmente o
 * mosaico, com uma foto só onde vão as cinco.
 *
 * O QUE FOI FEITO NO LUGAR DE DECIDIR: `docs/mensagem-grupo-team-imagens-11-09
 * .ENVIAR.txt`, que pede as imagens e devolve as duas perguntas que o pedido
 * deixa em aberto (uma foto por região ou colagem; a faculty ou o trabalho
 * acontecendo). A página fica aqui, fora do menu e fora do sitemap, para a
 * comparação ser retomada com as fotos na mão em vez de refeita do zero.
 *
 * O PROBLEMA DA VERSÃO NO AR. Ela é honesta e é a mais fraca da página: rótulo,
 * título, um parágrafo e cinco caixas brancas com um nome de região dentro. O
 * mosaico de imagens por região é HOLD (slot 06 do outline de Team) e nunca
 * chegou, então a faixa saiu em texto — decisão certa para não anunciar o
 * buraco, mas o resultado é a única seção da página sem nenhum peso visual,
 * justamente a que fala das 75 pessoas que fazem o trabalho.
 *
 * A REFERÊNCIA É O BLOCO 3 DA /about (`#purpose`): foto de sangria total,
 * escurecida, texto por cima. Vale reusar aqui por dois motivos — é tratamento
 * que o cliente já aprovou nesta linguagem, e resolve o HOLD sem inventar
 * conteúdo: UMA foto de grupo diz "somos muitos e somos de toda parte" melhor
 * que cinco retângulos cinza dizendo o mesmo em letra.
 *
 * O QUE FOI COPIADO DE LÁ, e o que não:
 *   • a cor do véu — rgb(22,19,20), o `ink` com a luminosidade lá embaixo. NÃO
 *     é o `ink` cru (#373234): véu feito dele deixa a seção cinza por
 *     definição, por mais opacidade que se ponha. Está anotado na /about.
 *   • o rótulo em `brand-light`, nunca no `brand` cheio — #d84339 sobre escuro
 *     dá 2,87:1 e não tem conserto pelo fundo.
 *   • a ideia dos DOIS CONTROLES separados (véu manda em quanta foto aparece,
 *     painel manda em quanto contraste o texto tem), usada na 2.
 *   • o que não vem: o texto centralizado. Lá o bloco é uma declaração de
 *     propósito e centraliza; aqui a página inteira é alinhada à esquerda e a
 *     faixa de regiões é uma grade — centralizar brigaria com as duas.
 *
 * A FOTO É A `dna-time-15`, o grupo grande no pátio em Singapura: ~20 pessoas,
 * visivelmente de origens diferentes, que é literalmente o argumento do texto
 * ("over twenty nationalities"). As alternativas estão no bloco 6, no fim —
 * tratamento e foto são duas escolhas separadas e a página pergunta as duas.
 *
 * ONDE ISSO VAI PARAR, se algum ganhar: `app/team/page.tsx`, a seção
 * `#faculty` (hoje `bg-paper`). Nenhuma copy muda em nenhuma das cinco.
 */
import type { Metadata } from "next";
import Image, { type StaticImageData } from "next/image";
import SiteShell from "@/components/SiteShell";
import TypeLabel from "@/components/TypeLabel";
import Counter from "@/components/Counter";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";
import { facultyRegions } from "@/lib/team";
import facultyPhoto from "@/public/dna-time/dna-time-15.jpeg";
import altLausanne from "@/public/dna-time/dna-time-27.jpeg";
import altPosters from "@/public/dna-time/dna-time-02.jpeg";

export const metadata: Metadata = {
  title: "Faculty section tests",
  robots: { index: false, follow: false },
};

/* A copy é a que está no ar, sem uma palavra nova. */
const EYEBROW = "Global faculty";
const H2 = "A faculty of 75 senior practitioners across 36 countries.";
const LEAD =
  "Our facilitators and coaches come from the behavioural sciences, organisation development, psychology and business. They span over twenty nationalities and a wide range of social identities. They are senior enough to have sat where our clients sit.";

/* Os três números já estão na copy, em letra. A 3 só os tira de dentro da frase
   — não inventa dado nenhum. */
const FIGURES = [
  { value: "75", label: "senior practitioners" },
  { value: "36", label: "countries" },
  { value: "20+", label: "nationalities" },
];

function Tag({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-50 bg-black px-5 py-3 text-[12px] font-semibold uppercase tracking-[2px] text-white">
      {id} · {children}
    </div>
  );
}

/**
 * A foto sangrada mais o véu, nos moldes do `#purpose` da /about.
 *
 * ⚠️ `object-[50%_70%]` E NÃO `object-center`. A seção é larga e baixa, então o
 * `object-cover` escala PELA LARGURA e toda a folga é vertical: centralizado, o
 * corte mostra prédio e céu em cima e corta as pessoas nos pés. As figuras
 * ocupam a faixa de 48% a 86% da altura do arquivo; empurrando o foco para 70%
 * elas entram inteiras e o prédio vira fundo, que é o papel dele.
 *
 * No telefone a conta se inverte — caixa estreita e alta, escala pela altura,
 * folga horizontal — e aí o eixo Y não tem efeito. O grupo ocupa a largura toda
 * do arquivo, então o padrão horizontal já serve e não há o que corrigir. É a
 * mesma armadilha anotada duas vezes na /about: o eixo que funciona depende de
 * qual lado sobra, e ele troca com a proporção da caixa.
 */
function Backdrop({
  photo,
  veil = 0.78,
  focus = "50% 70%",
}: {
  photo: StaticImageData;
  /** Quanto da foto aparece. Nada a ver com o contraste do texto na 2. */
  veil?: number;
  /**
   * `object-position`, em `style` e não em classe: o valor muda por variante
   * (a faixa baixa da 5 precisa de outro ponto que a seção alta da 1), e a
   * Tailwind varre o código atrás de nomes de classe LITERAIS — `object-[${x}]`
   * montado em tempo de execução sai no HTML sem regra nenhuma por trás.
   */
  focus?: string;
}) {
  return (
    <>
      <Image
        src={photo}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="-z-20 object-cover"
        style={{ objectPosition: focus }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: `rgba(22, 19, 20, ${veil})` }}
      />
    </>
  );
}

/**
 * Rótulo + título + parágrafo. `onDark` troca o vermelho pelo tom claro e o
 * cinza do corpo por branco a 75% — os dois tons que a /about já usa sobre véu.
 *
 * O TÍTULO CRESCE NO ESCURO (28/34 → 30/38). Não é capricho: na página clara
 * ele divide a tela com o resto do bloco; numa faixa de sangria total ele é o
 * único texto grande sobre uma foto inteira, e na medida da página some. O peso
 * 600 continua o mesmo das duas — sobre fundo escuro a letra afina
 * opticamente, e o degrau repõe o que a inversão tira.
 */
function Heading({
  onDark = false,
  className = "",
}: {
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <TypeLabel onDark={onDark}>{EYEBROW}</TypeLabel>
      <h2
        className={`font-serif max-w-[760px] font-semibold leading-[1.15] tracking-[-0.3px] ${
          onDark
            ? "text-[30px] text-white md:text-[38px]"
            : "text-[28px] text-ink md:text-[34px]"
        }`}
      >
        {H2}
      </h2>
      <p
        className={`mt-6 max-w-[720px] font-serif text-[17px] leading-[1.7] md:text-[18px] ${
          onDark ? "text-white/75" : "text-muted"
        }`}
      >
        {LEAD}
      </p>
    </div>
  );
}

/**
 * As cinco regiões como mosaico de vidro.
 *
 * O MESMO DESENHO DA VERSÃO NO AR — grade de cinco, `gap-px`, nome alinhado à
 * base — com as cores invertidas: a divisória de 1px é branco a 20% em vez do
 * `line`, e a célula é um vidro escuro em vez de branca. O `backdrop-blur` não
 * é enfeite: uma foto de grupo é toda alta frequência (rostos, folhas, janelas)
 * e é isso, não a luminância média, que atrapalha ler texto por cima. Borrado,
 * o fundo vira campo de cor.
 *
 * A célula fica com a foto VISÍVEL por dentro (é um vidro, não uma caixa), e é
 * o que aproxima a faixa do mosaico por região que o documento pede sem ter as
 * cinco imagens que o mosaico exigiria.
 */
function RegionTilesGlass() {
  return (
    <div className="mt-12 grid grid-cols-2 gap-px border border-white/20 bg-white/20 md:grid-cols-5">
      {facultyRegions.map((region) => (
        <div
          key={region.name}
          className="flex min-h-[120px] items-end bg-[rgba(22,19,20,0.45)] p-6 backdrop-blur-[3px]"
        >
          <span className="font-serif text-[18px] font-semibold leading-[1.2] text-white">
            {region.name}
          </span>
        </div>
      ))}
    </div>
  );
}

/** A faixa em UMA LINHA, para quando a grade de cinco pesaria demais. */
function RegionLine({ onDark = false }: { onDark?: boolean }) {
  return (
    <ul
      className={`mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-medium uppercase tracking-[1.3px] ${
        onDark ? "text-white/80" : "text-ink"
      }`}
    >
      {facultyRegions.map((region, i) => (
        <li key={region.name} className="flex items-center gap-4">
          {/* O separador é o vermelho da marca, e some antes do primeiro item.
              `aria-hidden` porque é pontuação visual: um leitor de tela já lê a
              lista como lista. */}
          {i > 0 && (
            <span
              aria-hidden
              className={`inline-block h-[3px] w-[3px] ${onDark ? "bg-brand-light" : "bg-brand"}`}
            />
          )}
          {region.name}
        </li>
      ))}
    </ul>
  );
}

export default function TeamTestsPage() {
  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell floatingNav>
        {/* A NavV2 flutua e não ocupa fluxo — sem isto a primeira faixa nasce
            debaixo do menu. Mesma convenção da /about e da evidence-tests. */}
        <div className="h-[76px] bg-ink" />

        {/* ── ref ─────────────────────────────────────────────────────── */}
        <Tag id="ref">como está no ar hoje — referência de comparação</Tag>
        <section className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
            <Heading />
            <div className="mt-12 grid grid-cols-2 gap-px border border-line bg-line md:grid-cols-5">
              {facultyRegions.map((region) => (
                <div key={region.name} className="flex min-h-[120px] items-end bg-white p-6">
                  <span className="font-serif text-[18px] font-semibold leading-[1.2] text-ink">
                    {region.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 1 ───────────────────────────────────────────────────────────
            A tradução direta do bloco 3 da /about: véu chapado a 78%, texto
            alinhado à esquerda como o resto desta página, e a MESMA grade de
            cinco de hoje, virada em vidro. É a mudança mínima — nenhum elemento
            novo, nenhuma medida nova; só o fundo e as cores. */}
        <Tag id="1">foto + véu 78% — a grade de hoje, em vidro</Tag>
        <section className="relative isolate overflow-hidden bg-ink">
          <Backdrop photo={facultyPhoto} />
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
            <Heading onDark />
            <RegionTilesGlass />
          </div>
        </section>

        {/* ── 2 ───────────────────────────────────────────────────────────
            O PAINEL DE VIDRO, que é o estado final do bloco 3 da /about e o que
            o cliente pediu lá em 09-09 ("deixar aparecer levemente mais a
            imagem, com efeito de glassmorphism").

            A diferença com a 1 não é estética, é de onde vem o contraste. Na 1
            o texto é protegido escurecendo a SEÇÃO INTEIRA: para o texto ficar
            legível, a foto toda tem de sumir junto — um controle só para dois
            objetivos que brigam. Aqui eles se separam:

              véu da seção  52%  → quanta foto aparece
              painel        62%  → quanto contraste o texto tem

            Por isso o véu pode abrir mais que na 1 sem o texto perder nada: quem
            segura a legibilidade é o painel. As regiões entram DENTRO do painel,
            separadas por divisória vertical — fora dele ficariam sobre a foto
            crua e seria preciso fechar o véu de novo, desfazendo o ganho.

            BORDA RETA, sem canto arredondado: o site inteiro é de canto vivo, e
            o vidro aqui é feito de translucidez, desfoque e um fio de borda
            clara — o raio é só convenção. Mesma decisão registrada na /about. */}
        <Tag id="2">foto + painel de vidro — a versão final da /about</Tag>
        <section className="relative isolate overflow-hidden bg-ink">
          <Backdrop photo={facultyPhoto} veil={0.52} />
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-28">
            {/* ⚠️ O PAINEL NÃO OCUPA A LARGURA DO CONTAINER, e isto é o que faz
                a variante funcionar. Cheio, ele tapa a foto inteira e o que
                sobra à vista é a faixa de cima (prédio) e a de baixo (chão e
                pés) — a foto some justamente onde há gente. Em 1060px sobram
                ~190px de cada lado, e nessas colunas aparecem as pessoas das
                pontas do grupo. É o mesmo arranjo do `#purpose` da /about, onde
                o painel tem 900px dentro de uma seção de sangria total. */}
            <div
              className="mx-auto max-w-[1060px] border border-white/15 p-8 backdrop-blur-md md:p-14"
              style={{ backgroundColor: "rgba(22, 19, 20, 0.62)" }}
            >
              <Heading onDark />
              {/* `divide-x` só a partir de `md`: empilhadas no telefone, a
                  divisória vertical cairia entre uma linha e a de baixo. */}
              <div className="mt-12 grid grid-cols-2 gap-y-6 border-t border-white/15 pt-8 md:grid-cols-5 md:divide-x md:divide-white/15">
                {facultyRegions.map((region) => (
                  <div key={region.name} className="px-0 md:px-6 md:first:pl-0 md:last:pr-0">
                    <span className="font-serif text-[17px] font-semibold leading-[1.25] text-white md:text-[18px]">
                      {region.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3 ───────────────────────────────────────────────────────────
            OS NÚMEROS SAEM DA FRASE. 75, 36 e 20+ já estão na copy, ditos em
            letra no meio de um parágrafo de quatro linhas — que é onde ninguém
            os vê. Postos à direita, em corpo grande, eles viram o que a seção
            promete: escala.

            ⚠️ A /about JÁ TEM UMA FAIXA DE NÚMEROS (bloco 1b). Repetir o device
            aqui é assumido: são páginas diferentes, os números são outros, e a
            faixa de lá é sobre a empresa enquanto esta é sobre as pessoas. Se
            incomodar em revisão, é esta que cai — as outras quatro não dependem
            dela.

            As regiões descem para uma linha só: com três números grandes na
            tela, mais uma grade de cinco caixas seria o terceiro bloco tabular
            da mesma seção. */}
        <Tag id="3">foto + os três números fora do parágrafo</Tag>
        <section className="relative isolate overflow-hidden bg-ink">
          <Backdrop photo={facultyPhoto} veil={0.8} />
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
            <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-24">
              <Heading onDark />
              {/* Três linhas, não três colunas: "senior practitioners" não cabe
                  numa coluna de um terço sem quebrar feio, e empilhados os
                  números alinham pela esquerda e leem como uma escada. */}
              <dl className="divide-y divide-white/15 border-y border-white/15">
                {FIGURES.map((f) => (
                  <div key={f.label} className="flex items-baseline gap-6 py-6">
                    <dt className="sr-only">{f.label}</dt>
                    <dd className="flex items-baseline gap-6">
                      {/* `tabular-nums` e largura mínima fixa: o número CONTA de
                          zero até o valor quando entra na tela, e com algarismo
                          de largura variável o rótulo ao lado dança durante a
                          animação. A largura reservada é a do maior dos três
                          ("20+" a 64px), não um palpite. */}
                      <span className="min-w-[104px] text-[52px] font-semibold leading-none tracking-[-1.5px] tabular-nums text-white md:text-[64px]">
                        <Counter value={f.value} />
                      </span>
                      <span className="font-serif text-[16px] leading-[1.4] text-white/70 md:text-[18px]">
                        {f.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <RegionLine onDark />
          </div>
        </section>

        {/* ── 4 ───────────────────────────────────────────────────────────
            SEM VÉU: a foto vira assunto em vez de textura.

            As três de cima escurecem a imagem a ponto de ela virar campo de cor
            — é o que permite escrever por cima, e é o que a referência faz. O
            custo é que ninguém mais enxerga QUEM está na foto, e numa seção
            sobre 75 pessoas isso é justamente o que se queria mostrar. Aqui o
            texto e a imagem dividem a largura em vez de se sobrepor: a foto sai
            limpa, sem véu nenhum, e o contraste do texto não depende dela.

            É a versão que ainda funciona no dia em que chegarem as fotos por
            região do slot 06 — a coluna da direita vira o mosaico e o resto fica
            de pé. As outras três teriam de ser refeitas. */}
        <Tag id="4">metade texto, metade foto — sem véu, a foto limpa</Tag>
        <section className="bg-ink">
          <div className="grid items-stretch lg:grid-cols-2">
            <div className="px-6 py-20 md:px-10 md:py-24 lg:pl-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))]">
              <Heading onDark />
              {/* A régua vermelha à esquerda de cada região — o device dos
                  valores da /about, que existe justamente para listar cinco
                  coisas sem grade e sem carrossel. */}
              <ul className="mt-12 space-y-4">
                {facultyRegions.map((region) => (
                  <li key={region.name} className="flex items-center gap-4">
                    <span aria-hidden className="inline-block h-[2px] w-7 bg-brand-light" />
                    <span className="font-serif text-[18px] font-semibold leading-[1.2] text-white md:text-[20px]">
                      {region.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* `min-h` no telefone porque sem altura a caixa de um `fill`
                colapsa para zero — ela não tem conteúdo próprio. */}
            <div className="relative min-h-[380px] lg:min-h-[620px]">
              <Image
                src={facultyPhoto}
                alt="Members of the Corporate DNA faculty together at a firm gathering."
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-[50%_65%]"
              />
            </div>
          </div>
        </section>

        {/* ── 5 ───────────────────────────────────────────────────────────
            O TEXTO FICA CLARO E SÓ A FAIXA ESCURECE. A página tem três seções
            claras seguidas; esta acende no fim em vez de virar a seção inteira,
            e a foto entra exatamente onde o documento pede imagem — nos cinco
            quadros das regiões.

            A faixa é de sangria total (`w-screen` com o truque do
            `left-1/2/-ml-50vw`) e não respeita o container: são cinco quadros de
            uma foto só, e um mosaico que começa 40px adentro da tela lê como
            tabela, não como imagem.

            É a mais conservadora das cinco e a mais fácil de trocar depois: o
            dia em que chegarem as cinco fotos, cada célula troca a sua e o
            desenho continua idêntico.

            ⚠️ NO TELEFONE ESTA É A MAIS SENSÍVEL À ESCOLHA DA FOTO. A faixa
            vira 2×3 e fica mais alta que larga, então o `object-cover` passa a
            escalar pela ALTURA e a imagem aparece inteira na vertical — o ponto
            de foco deixa de ter efeito, porque não sobra folga nesse eixo. Com
            a `dna-time-15` a primeira fileira cai no prédio e as pessoas só
            aparecem da segunda para baixo. É argumento a favor da foto de
            Lausanne (6a) se esta variante ganhar: lá há gente em todo o quadro,
            e qualquer recorte pega rosto. */}
        <Tag id="5">texto claro, faixa de regiões escura e sangrada</Tag>
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 pt-20 md:px-10 md:pt-24">
            <Heading />
          </div>
          <div className="relative isolate mt-14 w-screen overflow-hidden bg-ink md:mt-16 left-1/2 -ml-[50vw]">
            {/* 58% E NÃO OS 70% DAS OUTRAS. A faixa tem 260px de altura contra
                ~700 das seções cheias, e o `object-cover` continua escalando
                pela largura: a janela mostra só 24% da altura do arquivo. A 70%
                ela cai na cintura das pessoas e corta as cabeças fora; a 58%
                ela pega a faixa dos rostos. Quanto mais baixa a caixa, mais o
                ponto de foco importa. */}
            <Backdrop photo={facultyPhoto} veil={0.45} focus="50% 58%" />
            {/* AQUI O VÉU É MAIS FRACO E O TEXTO NÃO PERDE NADA, porque cada
                célula tem o seu próprio gradiente: escuro na base, onde está o
                nome, e transparente em cima, onde está a foto. É o oposto do
                `backdrop-blur` das outras variantes — lá o texto corre por cima
                da imagem inteira e é preciso apagá-la; aqui ele fica numa faixa
                de 40px no rodapé, e só essa faixa precisa escurecer. */}
            <div className="grid grid-cols-2 gap-px bg-white/20 md:grid-cols-5">
              {facultyRegions.map((region) => (
                <div
                  key={region.name}
                  className="relative flex min-h-[200px] items-end p-6 md:min-h-[260px]"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[rgba(22,19,20,0.92)] via-[rgba(22,19,20,0.3)] to-transparent"
                  />
                  <span className="relative font-serif text-[18px] font-semibold leading-[1.2] text-white md:text-[20px]">
                    {region.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6 ───────────────────────────────────────────────────────────
            A OUTRA PERGUNTA, separada da primeira: qual foto. As duas abaixo
            estão no mesmo tratamento da 1, para a comparação ser só da imagem.

            `dna-time-27` — Lausanne, grupo grande de braços abertos. Mais
            energia; o ar é de evento, com crachás e sol forte.
            `dna-time-02` — seis pessoas diante dos pôsteres do Inner & Outer
            Game. Menos gente, mais trabalho: aparece o método na parede. */}
        <Tag id="6a">mesma 1, foto de Lausanne (dna-time-27)</Tag>
        <section className="relative isolate overflow-hidden bg-ink">
          <Backdrop photo={altLausanne} />
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
            <Heading onDark />
            <RegionTilesGlass />
          </div>
        </section>

        <Tag id="6b">mesma 1, foto dos pôsteres (dna-time-02)</Tag>
        <section className="relative isolate overflow-hidden bg-ink">
          <Backdrop photo={altPosters} />
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
            <Heading onDark />
            <RegionTilesGlass />
          </div>
        </section>
      </SiteShell>
    </div>
  );
}
