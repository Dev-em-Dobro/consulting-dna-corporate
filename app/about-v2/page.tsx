/**
 * /about-v2 — a About reorganizada, para o cliente aprovar. NÃO é o site.
 *
 * De onde vem: a Maliha mandou em 08-09 dois anexos — `CDNA_About_Page_Dev_Outline.docx`
 * (o "text breakdown": sete blocos, cada campo marcado FINAL ou HOLD) e uma
 * imagem de página inteira mostrando a ordem dos blocos. A imagem é referência
 * de ARRANJO, não de design: ela vem com header branco, cards arredondados e
 * ícones que não são deste site. O que se aproveita dela é a sequência dos
 * blocos; a linguagem visual continua sendo a nossa (PageHero em `bg-ink`,
 * Eyebrow vermelho, régua vermelha, Counter, alternância white/paper).
 *
 * Onde o documento e a imagem discordam, o documento ganha — ele é a instrução
 * escrita para o time de desenvolvimento. Dois casos:
 *   • Our Promise: a imagem põe o corpo em duas colunas; o texto pede "single
 *     column prose, narrower measure than the surrounding blocks".
 *   • Region tiles: a imagem mostra foto em cada tile; os campos de CMS do
 *     documento são só { name, descriptor }, sem imagem.
 *
 * Rota separada, `noindex`, fora do sitemap e fora do menu, pelo mesmo motivo
 * da /home-v2: enquanto é proposta, a /our-identity no ar não pode depender de
 * nada que esta página mexa. Se for aprovada, o conteúdo sobe para a página
 * real e esta pasta some.
 *
 * ⚠️ O documento também pede renomear rotas (/about, /services, /team,
 * /clients-impact, /contact, /books) com 301 das atuais. Isso NÃO está feito
 * aqui — é trabalho de redirects e sitemap, separado desta página, e foi
 * levantado com o cliente.
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NavV2 from "@/components/NavV2";
import SiteFooter from "@/components/SiteFooter";
import { buildSiteNav } from "@/lib/nav-server";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import WorldCoverageMap from "@/components/WorldCoverageMap";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";
import heroPhoto from "@/public/about-hero.jpeg";

export async function generateMetadata(): Promise<Metadata> {
  const title = "About V2 (proposta) — Corporate DNA";
  return {
    title,
    description:
      "Our purpose, our promise, what we believe, and where we work.",
    // Sem `alternates`: o canonical de /our-identity é da página real.
    robots: { index: false, follow: false },
    openGraph: { title },
    twitter: { title },
  };
}
export const revalidate = 300;

/* ────────────────────────────────────────────────────────────────────────────
   Conteúdo do outline de 08-09. Tudo abaixo é transcrição — nada foi escrito
   por nós. O que está marcado HOLD no documento leva comentário no lugar.

   Estes arrays vivem na página, e não em `lib/`, de propósito: enquanto isto
   for proposta, nenhum dado que a página real usa pode mudar por causa dela.
   ──────────────────────────────────────────────────────────────────────── */

/**
 * Block 1, faixa de estatísticas. FINAL no documento, com uma ressalva: o `36`
 * aparece como `[36] countries`, entre colchetes — número pendente de
 * confirmação, junto com o "over 75 senior practitioners" do bloco de regiões.
 *
 * Não vem de `getSiteStats()`: aquelas quatro são outras (90% sponsored, 18
 * years, 36 countries, 75 faculty) e alimentam a home e a Our Impact. O
 * documento diz que estas "pull from the global fields in section 0" — uma
 * seção que não veio no anexo. Até ela chegar, ficam aqui.
 */
const STATS = [
  { value: "18 years", label: "of senior leadership advisory, since London, 2007", icon: "calendar" },
  { value: "36 countries", label: "programmes delivered, across five regions", icon: "globe" },
  { value: "1,000+", label: "leaders coached and teams developed", icon: "people" },
  { value: "5 of the top 10", label: "FTSE 100 companies are long standing clients", icon: "chart" },
];

/**
 * Os quatro ícones da faixa de números, desenhados aqui dentro.
 *
 * POR QUE INLINE, e não um pacote: o site não tem biblioteca de ícones. O único
 * jogo de SVG que existe é o das redes no rodapé e as setas soltas, cada uma
 * escrita no ponto de uso. Instalar lucide/heroicons por causa de quatro
 * desenhos numa página de PROPOSTA seria colocar uma dependência no
 * `package.json` do site inteiro para servir uma rota `noindex` que pode ser
 * descartada. Se a página for aprovada e os ícones aparecerem também nos cinco
 * valores (a referência mostra outros cinco lá), aí sim vale a conversa sobre
 * adotar um set de verdade.
 *
 * O DESENHO segue a referência: contorno, sem preenchimento, canto e junta
 * arredondados, traço de 1,5 num quadro de 24. `stroke="currentColor"` para a
 * cor vir do `text-brand` do container e não ficar cravada aqui — é assim que
 * um `hover` ou uma versão em fundo claro continuam funcionando sem tocar no
 * path. `aria-hidden`: o ícone repete o que o número ao lado já diz.
 */
function StatIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
    /* O meridiano é um <ellipse> e não um <path> curvo escrito à mão. A
       primeira versão tentava desenhar a elipse com dois arcos em `d` e saía
       uma amêndoa torta — arco de Bézier com raios desiguais é fácil de errar
       e impossível de conferir lendo o atributo. `rx`/`ry` diz a mesma coisa
       sem margem para erro. */
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="3.8" ry="9" />
        <path d="M3.2 9h17.6M3.2 15h17.6" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.2 20a5.8 5.8 0 0 1 11.6 0" />
        <circle cx="17" cy="7" r="2.4" />
        <path d="M16.2 12.4a5 5 0 0 1 4.6 5" />
      </>
    ),
    chart: (
      <>
        <path d="M3.5 20.5h17" />
        <path d="M7 20.5V14M12 20.5V9.5M17 20.5V5" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-9 w-9"
    >
      {paths[name]}
    </svg>
  );
}

/** Block 2, os quatro pilares. FINAL. */
const PILLARS = [
  {
    heading: "We invest in Identity beyond role.",
    body: "When leaders shift Identity (Who am I), they accelerate skills faster.",
  },
  {
    heading: "We lead with care and candour.",
    body: "We empower leaders by balancing compassion and action.",
  },
  {
    heading: "We tackle root causes, not symptoms.",
    body: "We achieve success through robust discovery and laser focus.",
  },
  {
    heading: "We earn the right as your trusted ally.",
    body: "By Keeping It Real, we develop Talent and build relationships.",
  },
];

/**
 * Block 5, os cinco valores. Os corpos são FINAL; o documento diz que três dos
 * cinco NOMES estão em HOLD ("shown in brackets, pending confirmation") e pede
 * que os nomes sejam campos de CMS para trocar sem deploy. O documento não
 * marca quais três — a tabela dele traz os cinco sem colchete. Ficam como
 * escritos, e viram campo de CMS quando a página real for montada.
 */
const VALUES = [
  {
    name: "Creative Flow",
    body: "Our creativity lives in the big ideas and equally in the details and frameworks that hold them together. Execution should feel like flow.",
  },
  {
    name: "Bold Humility",
    body: "Boldness lives in duality with humility. Bold enough to move people beyond their comfort zones, humble enough to be sustainable. Confident, never arrogant.",
  },
  {
    name: "Relationship Centricity",
    body: "We believe in mutually empowered relationships where we learn from each other. Clients should always feel us as deeply invested in their present and their future.",
  },
  {
    name: "Real Results",
    body: "Our relentless quest for excellence is anchored in real issues and real results: engagement up, performance up, collaboration up.",
  },
  {
    name: "Trust & Truth",
    body: "Trust and truth live in one cycle. We help our clients with the hard right rather than the easy wrong, and hold ourselves accountable for breakthrough results.",
  },
];

/**
 * Block 6, os escritórios — endereço, telefone e e-mail como o documento pede.
 *
 * ⚠️ Local de propósito, e NÃO `lib/offices.ts`. Três destes registros
 * divergem do que está no ar hoje:
 *   • Singapore: o documento traz "1 Raffles Place, Level 24, Tower 1, 048616"
 *     e +65 6408 0636; o site serve "The Great Room, Afro Asia, 63 Robinson
 *     Road, Level 8, 068894" e +65 6995 2480. São endereços diferentes.
 *   • Dubai: o documento dá um telefone (+971 58 141 2901) e, duas linhas
 *     abaixo, diz que Dubai "has no contact details published anywhere".
 *   • Miami: o documento não traz telefone; o site publica +1 305-374-4611.
 * Escrever isso em `lib/offices.ts` mudaria a home e a Our Team sem ninguém ter
 * confirmado qual versão está certa. Fica aqui até o cliente decidir.
 */
const OFFICES = [
  {
    city: "London",
    address: ["60 St Martin’s Lane, Covent Garden", "London WC2N 4JS"],
    tel: "+44 20 3755 5329",
    email: "london@corporatednaconsulting.com",
  },
  {
    city: "Singapore",
    address: ["1 Raffles Place, Level 24", "Tower 1, Singapore 048616"],
    tel: "+65 6408 0636",
    email: "singapore@corporatednaconsulting.com",
  },
  {
    city: "Dubai",
    address: ["Sheikh Rashid Tower, 4th Floor", "Dubai World Trade Centre, Dubai"],
    tel: "+971 58 141 2901",
    email: "dubai@corporatednaconsulting.com",
  },
  {
    city: "Riyadh",
    address: [
      "2888 King Fahd Road, Saudi Journalists",
      "Association Building, 2nd Floor, Al Sahafah",
      "Dist. 13671, Riyadh 13321, RASA6101",
    ],
    tel: null,
    email: "riyadh@corporatednaconsulting.com",
  },
  {
    city: "Miami",
    address: ["1221 Brickell Ave, Suite 900", "Miami, FL 33131"],
    tel: null,
    email: "miami@corporatednaconsulting.com",
  },
];

/**
 * Block 6, as cinco regiões. Os NOMES são FINAL; os descritores são HOLD ("one
 * line descriptor per region, max 120 characters"). Os textos abaixo são os que
 * aparecem na própria imagem da Maliha — placeholder do cliente, não copy nossa
 * — e devem virar campo de CMS.
 */
const REGIONS = [
  { name: "Americas", descriptor: "Driving leadership impact across North and South America." },
  { name: "UK & Europe", descriptor: "Partnering with organisations to build resilient leaders across Europe." },
  { name: "GCC & Middle East", descriptor: "Supporting transformation across the GCC and wider Middle East." },
  { name: "Asia", descriptor: "Developing leaders for a fast-changing Asia." },
  { name: "India", descriptor: "Enabling people and organisations to realise their potential." },
];

export default async function AboutV2Page() {
  const nav = await buildSiteNav();
  return (
    /* SEM <SiteShell> — e essa é a razão de o shell estar montado à mão aqui.
       O SiteShell embute a NavV1: barra vermelha, `sticky`, ocupando 76px do
       fluxo. O pedido de 08-09 foi o menu SEM FUNDO sobre o herói, como na
       /home-v2, e isso é a NavV2: `absolute`, transparente, flutuando sobre a
       primeira dobra. Não dá para pedir isso ao SiteShell sem mudar o shell de
       todas as páginas do site.

       `relative` no wrapper porque a NavV2 é `absolute`: sem um ancestral
       posicionado ela se prenderia ao documento inteiro, não a esta árvore.

       `maxWidthClass` em 1440 para a barra correr na mesma margem do conteúdo,
       que também subiu para 1440. */
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white">
      <NavV2 items={nav} maxWidthClass="max-w-[1440px]" />
      <main className="flex-1">
      <JsonLd
        data={breadcrumbLd([{ name: "About", path: "/about-v2" }])}
      />

      {/* ── Primeira dobra · Breadcrumb + Block 1 (hero) + Block 1b (números)
          ───────────────────────────────────────────────────────────────
          UMA seção só, de tela cheia, pedido em 08-09: "a hero e a parte com os
          números ocupando 100vh". Os três pedaços já eram `bg-ink` e liam como
          uma faixa escura só; agora são de fato um bloco, com a foto atrás dos
          três e o espaço livre distribuído entre eles — breadcrumb no topo, o
          título no meio, os números na base.

          ALTURA: `min-h-svh` (100svh CHEIOS) com `pt-[76px]`.
            • Era `calc(100svh-76px)` enquanto o menu era a NavV1 `sticky`, que
              OCUPA lugar no fluxo: descontar a barra era o que impedia a faixa
              dos números de cair abaixo da dobra. Com a NavV2, que é `absolute`
              e flutua POR CIMA, não há nada a descontar — se o desconto tivesse
              ficado, sobrariam 76px de branco no fim da dobra.
            • O `pt-[76px]` substitui o desconto: ele não muda a altura total
              (a caixa é `border-box`), só impede que o eyebrow nasça debaixo do
              menu flutuante.
            • `svh` e não `vh` porque no telefone `100vh` conta a tela COM a
              barra de endereço retraída: a base do bloco fica escondida atrás
              do navegador até o usuário rolar.
          É `min-h`, não `h`: no telefone os quatro números empilham em quatro
          linhas e não cabem em uma tela — aí o bloco cresce e rola, em vez de
          cortar conteúdo.

          A ARTE é a que a Maliha mandou em 08-09 (`public/about-hero.jpeg`): o
          skyline montado — Big Ben, Marina Bay, Burj Khalifa, Kingdom Centre —
          com a hélice de DNA atravessando o céu. Ela é a imagem definitiva da
          seção, não mais o placeholder da home V2. Duas ressalvas de arquivo
          estão anotadas no <Image> logo abaixo. */}
      <section className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink pt-[76px] text-white">
        {/* ⚠️ O ARQUIVO É PEQUENO E QUASE QUADRADO: 1373x1145 (1,2:1), 229 KB,
            e veio pelo WhatsApp, que recomprime. Duas consequências:

            1. LARGURA. A dobra pede algo em torno de 1920px. Em telas de até
               1440 o upscale é 1,05x e não aparece; num monitor de 1920 é 1,4x e
               num 2560 é 1,86x, aí a imagem amolece. O escurecimento perdoa
               muito disso (é arte escura, monocromática e granulada), mas o
               conserto de verdade é pedir o original à Maliha — o que veio é a
               cópia que o WhatsApp gerou, não o arquivo dela.

            2. PROPORÇÃO. É 1,2:1, quase quadrada, contra uma dobra de ~1,9:1.
               Essa diferença é o motivo de a imagem NÃO ser de sangria total —
               ver a caixa logo abaixo. */}

        {/* A IMAGEM NÃO OCUPA A LARGURA TODA: ela vive numa caixa de 72% presa
            à DIREITA, e os 28% da esquerda são `ink` puro, sem imagem nenhuma
            por baixo. Isso responde aos dois pedidos de 08-09 sobre a
            referência, e o motivo de não dar para resolver com `object-position`
            merece ficar escrito, porque é contraintuitivo:

              Com `fill` + `object-cover` de sangria total, a imagem é escalada
              PELA LARGURA (o arquivo é mais "gordo" que a caixa). Aí não sobra
              folga horizontal nenhuma — o corte é 100% vertical, e mexer no eixo
              X do `object-position` não move absolutamente nada no desktop. Foi
              o que travou a primeira tentativa de descentralizar a torre.

            Encolhendo a caixa para 72% os dois problemas caem juntos:

            • "DÁ PRA VER BEM MAIS O DNA". A caixa fica menos alongada (1,4:1 em
              vez de 1,9:1 numa tela de 1600), então o `object-cover` corta bem
              menos altura: aparecem ~86% da imagem contra os ~62% de antes. A
              hélice inteira e o skyline inteiro entram no quadro.
            • "A TORRE NÃO FICA TÃO CENTRALIZADA". O Burj está a ~51% da largura
              do arquivo; com a caixa começando em 28% da tela, ele cai em
              28 + 0,72x0,51 = ~65% da largura da dobra, à direita do centro,
              como na referência.

            No telefone (`w-full`) volta a ser sangria total — 72% de 390px não
            daria imagem nenhuma —, e aí sim o eixo X funciona: `62%` puxa o
            enquadramento para as torres em vez de deixar meia foto de céu. */}
        <div className="absolute inset-y-0 right-0 -z-10 w-full md:w-[72%]">
          <Image
            src={heroPhoto}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center] md:object-center"
          />
        </div>

        {/* O TRATAMENTO, refeito em 08-09 contra a referência que o cliente
            mandou (`docs/rhea-feedback/hero-about.png`): "dava pra ver mais da
            imagem e ela aparecer mais na direita".

            A versão anterior era uma camada chapada de `ink/75` sobre tudo. Isso
            atendia o contraste do texto e destruía a arte junto: a hélice, que é
            o motivo de a imagem existir, virava um chiado cinza. A referência
            faz o contrário — a metade direita é a foto LIMPA, com o branco da
            hélice e as nuvens em contraste cheio, e o texto mora num campo
            escuro à esquerda para onde a foto se dissolve.

            Daí as duas camadas serem DIRECIONAIS, e não chapadas:

            1. LAVADO LATERAL. Ele tem uma função a mais desde que a imagem
               passou a viver numa caixa de 72%: ESCONDER A EMENDA. A borda
               esquerda da caixa é um corte reto em 28% da largura, e sem nada
               por cima ela apareceria como uma linha vertical atravessando a
               dobra. Por isso o gradiente fica opaco até passar dos 28% e só
               então abre, morrendo a 60% — o olho lê "a foto se dissolve no
               escuro", que é o que a referência faz, e não "tem uma imagem
               colada ali". Da metade para a direita não há camada nenhuma, então
               o skyline e a hélice ficam com o contraste original do arquivo.
               O preço é o Big Ben, que fica no primeiro terço do arquivo e some;
               a referência faz a mesma escolha, e é ela que manda.
            2. FECHO DA BASE. Necessário porque os números atravessam a largura
               inteira, inclusive a parte clara: "1,000+" e "5 of the top 10"
               caem justamente sobre os arranha-céus iluminados. O gradiente sobe
               pela metade de baixo e chega opaco na borda, então os números
               ficam sobre `ink` sólido. Isso não briga com a referência — nela a
               orla também é escura.

            Não há mais camada chapada: as duas direcionais já se cruzam na
            esquerda e somam o suficiente para o texto. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgb(55,50,52) 0%, rgb(55,50,52) 28%, rgba(55,50,52,.82) 36%, rgba(55,50,52,.5) 45%, rgba(55,50,52,.2) 53%, rgba(55,50,52,0) 60%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-1/2"
          style={{
            backgroundImage:
              "linear-gradient(to top, rgb(55,50,52) 0%, rgba(55,50,52,.96) 22%, rgba(55,50,52,.72) 48%, rgba(55,50,52,.3) 76%, rgba(55,50,52,0) 100%)",
          }}
        />

        {/* ⚠️ O BREADCRUMB VISÍVEL SAIU em 08-09, a pedido. Vale registrar que
            isso CONTRARIA o outline da Maliha, que pede em letra: "Breadcrumb at
            the top of the page: Home / About" (bloco 3). Foi decisão posterior
            ao documento, então ganha dele — mas quando a página for revisada com
            o cliente é bom saber que a ausência é deliberada, e não esquecimento.

            O `breadcrumbLd` no topo do componente FICOU. Ele é dado estruturado
            invisível, descreve a posição da página na hierarquia do site e não
            depende de haver uma trilha desenhada na tela. Como a rota é
            `noindex` e está fora do sitemap, hoje ele não faz diferença nenhuma;
            se esta página virar a /about de verdade, aí sim vale decidir se
            mantém o dado sem a trilha visível. */}
        {/* O título. Escrito aqui, e não com <PageHero>, porque o PageHero é uma
            <section> com `bg-ink` OPACO próprio: dentro deste bloco ele taparia
            a foto e a imagem viraria uma tarja no meio da tela, em vez de fundo
            da dobra inteira. As classes abaixo são as do PageHero não-compacto,
            copiadas, para o herói continuar idêntico ao das outras páginas
            internas. Se um dia isto virar a /about de verdade, o caminho é dar
            ao PageHero uma variante de tela cheia — não mexer nele agora, que a
            página real depende dele. */}
        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-[1440px] px-6 py-12 md:px-10 md:py-16">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-block h-0.5 w-9 bg-brand" />
              <span className="text-[12.5px] font-semibold uppercase tracking-[2px] text-brand">
                About
              </span>
            </div>
            <h1 className="max-w-[900px] text-[38px] font-bold leading-[1.03] tracking-[-1.5px] text-white [text-wrap:balance] sm:text-[48px] md:text-[60px]">
              Keeping Leadership Real.
            </h1>
            {/* A QUEBRA É MANUAL, e por isso são dois <span> em vez de uma
                frase só com `max-width` deixando o navegador decidir: o pedido
                de 08-09 foi por um ponto de quebra específico ("Our purpose, our
                promise" / "what we believe, and where we work"), e largura
                máxima não garante ponto nenhum — ela muda com a fonte carregada,
                com o zoom e com o tamanho da tela.

                `md:block` e não `block`: no telefone a segunda metade sozinha já
                ocupa duas linhas, e forçar a quebra ali criaria três linhas com
                a primeira quase vazia. Abaixo de `md` os spans ficam em linha e
                o texto reflui normalmente. */}
            <p className="mt-5 max-w-[620px] text-xl leading-[1.45] text-white/75 md:text-2xl">
              <span className="md:block">Our purpose, our promise,</span>{" "}
              <span className="md:block">what we believe, and where we work</span>
            </p>
          </div>
        </div>

        {/* Block 1b · Estatísticas, refeito em 08-09 contra
            `docs/rhea-feedback/about-pagina-inteira.jpeg`. Três mudanças, e as
            três vieram da referência:

            1. ÍCONE no lugar da régua vermelha. A faixa da home e da Our Impact
               abre cada número com um traço de 3px; a referência põe um ícone de
               contorno vermelho. Aqui ganha a referência — ver StatIcon, no topo
               do arquivo, para o porquê de serem desenhados à mão.
            2. DIVISÓRIA vertical entre os itens.
            3. O NÚMERO NÃO PODE QUEBRAR em duas linhas. "36 countries" e "5 of
               the top 10" quebravam, e uma coluna com título de duas linhas
               desalinha a linha de rótulo de todas as outras.

            A CONTA, porque o conserto NÃO é só `whitespace-nowrap`. Sozinho ele
            troca um defeito por outro pior: em vez de quebrar em duas linhas, o
            número TRANSBORDA a coluna e invade a vizinha. Foi o que aconteceu na
            primeira tentativa, e só apareceu porque foi medido.

            Tudo gira em torno de "5 of the top 10", o mais longo dos quatro.
            Medido no navegador, não estimado: ele ocupa 246px a 38px de fonte,
            e escala junto com ela. As colunas que recebem divisória perdem mais
            40px para o `pl-10`, então são elas que apertam:

              1280px de tela → coluna útil de 229px. A 38px pedia 246. ESTOURAVA.
                                A 34px pede 220. Cabe.
              1440/1536+     → coluna útil de 270px. A 42px pediria 272 —
                                estouraria por 2px. A 40px pede 259. Cabe.
              1024px         → seriam 4 colunas de ~206px no antigo
                                `lg:grid-cols-4`. Não cabe em tamanho nenhum que
                                ainda pareça número de destaque.

            Daí as três correções juntas: a grade de quatro colunas subiu de `lg`
            (1024) para `xl` (1280), então entre 1024 e 1280 ficam duas colunas
            largas em vez de quatro espremidas; a fonte CAI para 34px na faixa de
            quatro colunas apertada (xl) e só sobe para 40px em `2xl`; e o teto
            é 40px, não 42px, por causa dos tais 2px.

            O `text-[34px] md:text-[38px] xl:text-[34px]` parece errado de tão
            vai-e-volta, e não é: 38px é a faixa de DUAS colunas, onde sobra
            espaço; xl volta a 34px porque ali entram quatro. O tamanho segue a
            largura da coluna, não a da tela.

            O `whitespace-nowrap` fica como trava final: se alguém editar um
            número para algo mais longo, ele transborda de forma visível na
            revisão em vez de quebrar em silêncio. */}
        <div className="mx-auto w-full max-w-[1440px] px-6 pb-14 md:px-10 md:pb-20">
          <Reveal className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                /* A divisória mora no ITEM, não no container, porque precisa
                   sumir em quem abre cada linha da grade — e "primeiro da
                   linha" muda com o breakpoint, coisa que `divide-x` não sabe
                   fazer. Com quatro itens fixos dá para resolver pelo índice:
                     • 2 colunas (sm+): borda nos ímpares, que são a coluna da
                       direita;
                     • 4 colunas (xl+): borda em todos menos o primeiro.
                   No telefone, uma coluna só, não há borda vertical nenhuma. */
                className={[
                  i % 2 === 1 ? "sm:border-l sm:border-white/15 sm:pl-10" : "",
                  i > 0 ? "xl:border-l xl:border-white/15 xl:pl-10" : "",
                ].join(" ")}
              >
                <span className="mb-4 block text-brand">
                  <StatIcon name={s.icon} />
                </span>
                <div className="whitespace-nowrap text-[34px] font-bold leading-none tracking-[-1.2px] text-white md:text-[38px] xl:text-[34px] 2xl:text-[40px]">
                  <Counter value={s.value} />
                </div>
                <div className="mt-3 max-w-[240px] text-[15px] leading-[1.45] text-white/70">
                  {s.label}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Block 2 · Our Identity ────────────────────────────────────
          "Two column. Photograph left, quote right. Four pillar cards in a row
          beneath, full width." (outline)

          REDESENHADO em 08-09 sobre a referência da Explore Performance que a
          Rhea aprovou (`docs/rhea-feedback/about-explore.png`): fundo BRANCO,
          foto ocupando a altura inteira da faixa, texto na outra metade. A
          Explore põe o texto à esquerda e a foto à direita; aqui é espelhado —
          foto à esquerda —, que é o lado que o outline da Maliha pede e o que a
          imagem de página inteira dela mostra.

          A FOTO NÃO SANGRA. Em 08-09 ela ia até a borda da janela, como na
          Explore. Em 09-09 o cliente pediu o contrário: ela fica CONTIDA no
          mesmo `max-w-[1440px]` de todos os outros blocos, inclusive em telas
          maiores que isso. Daí o container em volta da grade — era o único
          `mx-auto max-w-[1440px] px-6 md:px-10` que faltava na página, e é ele
          que faz a borda esquerda da foto cair na mesma linha vertical do logo,
          do título do hero e dos quatro números.

          O respiro entre as colunas passou a ser `lg:gap-14` na grade. Antes
          vinha do `lg:px-14` da coluna de texto, que agora não pode existir: com
          o container por fora, padding horizontal na coluna somaria ao dele e a
          citação terminaria ~96px antes da margem em vez de alinhar com ela.

          A foto é uma COLUNA DA GRADE, sem padding e sem `aspect`, e é o texto
          ao lado que define a altura — as duas células de uma grade se esticam
          para a mais alta por padrão, então `absolute inset-0` na foto faz ela
          preencher o que sobrar, seja qual for o tamanho do texto. É por isso
          que não há altura fixa em lugar nenhum aqui.

          `min-h-[360px]` só vale abaixo de `lg`: empilhado, a coluna da foto não
          tem irmã para copiar a altura e colapsaria para zero. Em `lg` o
          `min-h-0` devolve o controle para o esticamento da grade.

          OS QUATRO PILARES ficaram FORA do split, em faixa própria de largura
          cheia, como o outline manda ("in a row beneath, full width"). A
          consequência é que a foto preenche a altura do par foto+citação, não a
          da seção inteira até o fim dos cards. Para a foto descer até lá os
          pilares teriam de ir para dentro da coluna da direita, em 2x2 — o que
          contraria o outline e espreme quatro textos em meia largura. Fica como
          está até alguém pedir o contrário. */}
      <section id="identity" className="bg-white text-ink">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-14">
            {/* ⚠️ A FOTO DO TIME AINDA NÃO EXISTE. O outline pede "the CDNA team
                group photograph supplied with the slide", que não veio com os
                anexos, e não há substituto no repositório: as 25 fotos de
                `public/dna-time` são de eventos e de turmas de programa, não do
                time da CDNA. Passar uma delas por foto do time seria dizer algo
                falso na página, então fica o placeholder — agora do tamanho real
                que a foto vai ocupar, o que também serve para o cliente ver o
                recorte que precisa mandar (vertical, alto). */}
            <div className="relative min-h-[360px] lg:min-h-0">
              <ImagePlaceholder
                className="absolute inset-0 h-full w-full"
                label="CDNA team photograph"
              />
            </div>

            <div className="flex items-center py-16 md:py-20">
              <div className="w-full max-w-[680px]">
                <Eyebrow>Keeping Leadership Real</Eyebrow>
                {/* AS ASPAS FICAM AO LADO DO TEXTO, não por cima dele — corrigido
                    em 08-09 contra a referência.

                    Como estava: a aspa de abertura era `absolute -left-1 -top-6`,
                    ou seja, pendurada ACIMA da primeira linha e quase colada na
                    margem. Na referência ela está na mesma altura da primeira
                    linha, recuada num vão à esquerda, e o texto todo começa depois
                    dela. É a diferença entre "aspa flutuando sobre a citação" e
                    "citação recuada com a aspa na margem", que é o desenho certo.

                    Por isso o `pl-9` no <blockquote>: ele abre o vão de 36px onde
                    a aspa mora, e todo o corpo passa a se alinhar à direita dela,
                    inclusive as linhas seguintes e a assinatura. Sem o padding a
                    aspa `absolute` cairia por cima da primeira palavra.

                    `aria-hidden` nas duas: quem usa leitor de tela já recebe a
                    citação pelo <blockquote>, e "aspas duplas" lido em voz alta é
                    ruído. */}
                <blockquote className="relative pl-9">
                  <span
                    aria-hidden
                    className="absolute left-0 top-0 select-none font-serif text-[44px] leading-[0.9] text-brand"
                  >
                    “
                  </span>
                  <p className="text-[16.5px] leading-[1.65] text-ink/80 md:text-[17.5px]">
                    At CDNA, <span className="font-semibold text-brand">Keeping It Real</span>{" "}
                    isn’t a slogan; it’s how we work. We speak with honesty, design
                    with truth, and deliver with the same authenticity we expect
                    from leaders. Our conversations are candid, our relationships
                    are human, and our programmes are built from real, lived
                    experience, not theory.
                  </p>
                  <p className="mt-5 text-[16.5px] leading-[1.65] text-ink/80 md:text-[17.5px]">
                    CEOs and CHROs respect us for keeping it relevant, resilient,
                    and{" "}
                    {/* A aspa de fechamento acompanha a de abertura: mesmo corpo
                        (44px) e na altura da linha, não pendurada abaixo dela.

                        `leading-[0]` é o detalhe que faz funcionar. Sem ele, um
                        glifo de 44px dentro de um parágrafo de 17,5px ESTICA a
                        caixa da última linha e abre um buraco entre ela e a
                        assinatura. Com altura de linha zero o glifo transborda da
                        própria caixa sem empurrar nada, e o `translate-y` o traz
                        para o nível do texto — a aspa serifada nasce muito acima
                        da linha de base.

                        `whitespace-nowrap` na última palavra + aspa, desde 09-09:
                        ao conter a faixa em 1440 a medida do texto caiu de 680
                        para 652px, e nessa largura a linha quebrava EXATAMENTE
                        entre "real." e a aspa, deixando o glifo sozinho numa
                        linha só dele. Presos, os dois descem juntos quando não
                        couberem — que é uma quebra normal de parágrafo, não um
                        órfão. */}
                    <span className="whitespace-nowrap">
                      real.
                      <span
                        aria-hidden
                        className="ml-1.5 inline-block translate-y-[0.22em] select-none font-serif text-[44px] leading-[0] text-brand"
                      >
                        ”
                      </span>
                    </span>
                  </p>
                  <footer className="mt-6 text-[14px] font-semibold tracking-[0.2px] text-ink">
                    Rhea Leckie, Founder &amp; CEO of CDNA Consulting
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* Quatro pilares, largura cheia, como o outline descreve.
            `items-stretch` dá altura igual aos quatro.

            O CARD GANHOU BORDA porque a faixa virou branca. Antes ele era
            `bg-white` puro sobre `bg-ink-2`, e o contraste com o fundo escuro é
            que desenhava o card. Em cima de branco, branco no branco some — não
            haveria card nenhum, só quatro blocos de texto soltos. A borda em
            `line` (#ece9e6) é o traço mais leve do sistema, o mesmo que o
            ImagePlaceholder usa, e devolve a silhueta sem pesar. */}
        <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-12 md:px-10 md:pb-20 md:pt-16">
          <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <div key={p.heading} className="border border-line bg-white p-6">
                <h3 className="text-[16px] font-bold leading-[1.25] text-brand">
                  {p.heading}
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.55] text-ink/75">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Block 3 · Our Purpose ─────────────────────────────────────
          "Single column, centred, generous margins. Light ground." A frase de
          abertura é o maior tipo da página depois do herói, como o outline pede. */}
      <section id="purpose" className="bg-white">
        <div className="mx-auto max-w-[820px] px-6 py-16 md:px-10 md:py-24">
          <div className="flex flex-col items-center text-center">
            <Eyebrow>Why Corporate DNA exists.</Eyebrow>
            <h2 className="max-w-[720px] text-[30px] font-bold leading-[1.1] tracking-[-0.9px] text-ink sm:text-[38px] md:text-[44px]">
              Our purpose is to keep leadership real.
            </h2>
          </div>

          {/* Pull quote destacada do corpo: régua vermelha à esquerda e aspas
              vermelhas, o mesmo par gráfico do bloco de identidade acima. */}
          <blockquote className="mt-10 border-l-2 border-brand pl-6 md:pl-8">
            <p className="text-[16.5px] leading-[1.7] text-ink/85 md:text-[17px]">
              <span aria-hidden className="mr-1 font-serif text-[28px] leading-none text-brand">
                “
              </span>
              <strong className="font-semibold">With roots in Big 4 Consulting</strong>, the
              genesis of CorporateDNA is that a consultant’s obligation is to cut
              through complexity, connect the threads and deliver the truth. We
              want to take off language which hides real problems and bring
              solutions and transformations that are true to the lived realities
              of our clients. Accessing this truth and the powerful
              transformation that it entails, depends on honesty, courage, and
              authenticity.
              <span aria-hidden className="ml-1 font-serif text-[28px] leading-none text-brand">
                ”
              </span>
            </p>
            <footer className="mt-4 text-[14px] font-semibold text-muted">
              Rhea Leckie, Founder &amp; CEO
            </footer>
          </blockquote>

          <div className="mt-10 space-y-5 text-[16.5px] leading-[1.7] text-muted md:text-[17px]">
            <p>
              That obligation shapes everything we do. We release the power,
              humanity and honesty of leadership in all its parts: the values an
              organisation holds, the culture they produce, the teams that carry
              them, and what makes each individual leader stronger.
            </p>
            <p>
              We anchor the work in the inner and outer games, so change is
              inside out, complete, and rooted in truth and impact.
            </p>
          </div>
        </div>
      </section>

      {/* ── Block 4 · Our Promise ─────────────────────────────────────
          "Single column prose. Narrower measure than the surrounding blocks, to
          signal a change of register." Daí `max-w-[680px]` contra os 820px do
          bloco anterior — a imagem põe isto em duas colunas, o texto escrito
          pede coluna única, e o texto ganha. */}
      <section id="promise" className="bg-paper">
        <div className="mx-auto max-w-[680px] px-6 py-16 md:px-10 md:py-20">
          <Eyebrow>What we promise.</Eyebrow>
          <p className="text-[18px] font-semibold leading-[1.5] text-ink md:text-[19px]">
            To keep our craft real: honest with ourselves, true to our clients.
          </p>
          <div className="mt-6 space-y-5 text-[16px] leading-[1.7] text-muted md:text-[16.5px]">
            <p>
              We do not hide behind language to sound more intelligent. We do not
              build layers that clients have to climb over to reach us. We listen
              as much as we talk. We hold the space for our clients to be their
              real, unedited selves, and meet us in true partnership.
            </p>
            <p>
              Boldness lives in duality with humility. Our designs, ideas and
              methods of challenging are bold enough to nudge traditional comfort
              zones, and incubated through humility so the results are
              sustainable. We are confident, but never arrogant.
            </p>
          </div>
          {/* "Closing line: standalone, larger, red." */}
          <p className="mt-10 text-[21px] font-semibold leading-[1.35] tracking-[-0.3px] text-brand md:text-[24px]">
            We invite you to experience the DNA Partnership.
          </p>
        </div>
      </section>

      {/* ── Block 5 · Our Values ──────────────────────────────────────
          "Five cards, or a stacked list with a red rule between each. Not a
          carousel: all five must be visible without interaction." Grade de
          cinco com régua vermelha à esquerda de cada uma — no telefone a régua
          continua ali, empilhada, então nunca há interação para ver um valor.

          Sem os ícones da imagem: não existe esse jogo de ícones no site, e os
          campos de CMS do outline são { name, body }, sem ícone. */}
      <section id="values" className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <div className="flex flex-col items-center text-center">
            <Eyebrow>What we believe, and how we work.</Eyebrow>
            <p className="max-w-[760px] text-[18px] leading-[1.5] text-ink md:text-[20px]">
              <strong className="font-semibold">Our values</strong> are deeply
              human centric, and always in service of a client’s greatness. We do
              not compromise on them, however complex the circumstances.
            </p>
          </div>

          <Reveal className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((v) => (
              <div key={v.name} className="border-l-2 border-brand pl-5">
                <h3 className="text-[17px] font-bold leading-[1.2] text-brand">
                  {v.name}
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.6] text-muted">
                  {v.body}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Block 6 · Our Regions ─────────────────────────────────────
          Cabeçalho e intro aqui; o mapa entra logo abaixo sem cabeçalho próprio
          (`eyebrow={null} title={null}`), senão a seção abriria dois títulos.

          O outline pede o mapa "region level only, with no per client pins" — o
          WorldCoverageMap pinta países e marca as cidades das regiões do CMS,
          nunca clientes, então já é esse nível. */}
      <section id="regions" className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 pt-16 md:px-10 md:pt-20">
          <Eyebrow>Where we work.</Eyebrow>
          <p className="mb-12 max-w-[620px] text-[18px] leading-[1.5] text-ink md:text-[20px]">
            With headquarters in London, Singapore, Dubai, Riyadh and Miami, and
            a faculty of over 75 senior practitioners, we deliver globally.
          </p>
        </div>
      </section>

      <WorldCoverageMap eyebrow={null} title={null} />

      {/* Escritórios: cidade, endereço, telefone e e-mail, os quatro campos que
          o outline lista.

          Três colunas, não cinco. O outline escreve "OFFICES: three cards" e
          logo abaixo tabela cinco cidades; a imagem mostra as cinco numa linha
          só. Medido: cinco cards em 1200px deixam ~170px de texto por card, e
          `corporatednaconsulting.com` em Poppins ocupa ~185px a 11,5px — o
          domínio quebrava no meio ("...consulting.c | om") em qualquer corpo
          ainda legível. A cinco cidades em três colunas cada card tem ~310px, o
          e-mail cabe inteiro em 14px como o telefone ao lado, e o layout passa a
          ser o que o texto do outline pede. As cinco regiões abaixo continuam em
          cinco, porque lá o texto é curto e cabe. */}
      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OFFICES.map((o) => (
              <div key={o.city} className="flex flex-col bg-white p-6">
                <h3 className="text-[17px] font-bold tracking-[0.2px] text-ink">
                  {o.city}
                </h3>
                <span className="mt-3 block h-[3px] w-8 flex-none bg-brand" />
                <p className="mt-4 text-[14px] leading-[1.6] text-muted">
                  {o.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
                <div className="mt-4 space-y-1.5 leading-[1.5]">
                  {o.tel && (
                    <a
                      href={`tel:${o.tel.replace(/\s/g, "")}`}
                      className="block text-[14px] text-muted transition-colors hover:text-brand"
                    >
                      {o.tel}
                    </a>
                  )}
                  {/* O <wbr> depois do @ fica mesmo com o card largo: é o ponto
                      de quebra que o navegador tem de usar primeiro se a coluna
                      apertar (telefone estreito), em vez de partir o domínio no
                      meio. `break-words` fica de rede. */}
                  <a
                    href={`mailto:${o.email}`}
                    className="block break-words text-[14px] text-brand transition-colors hover:text-brand-dark"
                  >
                    {o.email.split("@")[0]}@<wbr />
                    {o.email.split("@")[1]}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Cinco tiles de região. Sem foto: os campos de CMS do outline são
              { name, descriptor }. Os descritores estão em HOLD. */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {REGIONS.map((r) => (
              <div key={r.name} className="border-t-2 border-brand bg-white p-6">
                <h3 className="text-[15px] font-bold uppercase tracking-[1px] text-ink">
                  {r.name}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.55] text-muted">
                  {r.descriptor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Block 7 · Fecho ───────────────────────────────────────────
          O outline diz "seven blocks" e descreve seis: o corpo do sétimo não
          veio no arquivo, sobrou só a linha de campos de CMS
          (`repeatable link_card { heading, body, cta_label, cta_url }`), que
          descreve cards de navegação e não a faixa da imagem.

          Montado como está na imagem — assinatura, frase e um botão — porque é
          a única versão do bloco que o cliente mandou. O `link_card` fica de
          fora até o texto do bloco 7 chegar. */}
      <section className="bg-ink text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-8 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="text-[26px] font-bold leading-[1.15] tracking-[-0.6px] md:text-[32px]">
            Let’s make leadership real.
          </p>
          <Link
            href="/#contact"
            className="inline-flex flex-none items-center gap-2 bg-brand px-7 py-3.5 text-[14px] font-semibold uppercase tracking-[0.6px] text-white transition-colors hover:bg-brand-dark"
          >
            Get in touch
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
      </main>
      <SiteFooter />
    </div>
  );
}
