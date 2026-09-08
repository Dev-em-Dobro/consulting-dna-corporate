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
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/PageHero";
import Eyebrow from "@/components/Eyebrow";
import Reveal from "@/components/Reveal";
import Counter from "@/components/Counter";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import WorldCoverageMap from "@/components/WorldCoverageMap";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo/jsonld";

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
  { value: "18 years", label: "of senior leadership advisory, since London, 2007" },
  { value: "36 countries", label: "programmes delivered, across five regions" },
  { value: "1,000+", label: "leaders coached and teams developed" },
  { value: "5 of the top 10", label: "FTSE 100 companies are long standing clients" },
];

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
  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbLd([{ name: "About", path: "/about-v2" }])}
      />

      {/* ── Breadcrumb ─────────────────────────────────────────────────
          "Breadcrumb at the top of the page: Home / About" (outline, bloco 3).
          Fica no mesmo `bg-ink` do PageHero logo abaixo, então os dois leem
          como uma faixa escura só, e não como duas. */}
      <nav aria-label="Breadcrumb" className="bg-ink">
        <ol className="mx-auto flex max-w-[1200px] items-center gap-2 px-6 pt-8 text-[13px] tracking-[0.3px] text-white/55 md:px-10">
          <li>
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
          </li>
          <li aria-hidden className="text-white/30">
            /
          </li>
          <li aria-current="page" className="text-white/85">
            About
          </li>
        </ol>
      </nav>

      {/* ── Block 1 · Hero ─────────────────────────────────────────────
          Sem `bgImageUrl`: a imagem da Maliha traz um skyline com uma hélice de
          DNA por cima que não existe entre os nossos arquivos. A faixa escura
          lisa é o que as outras páginas internas usam, e trocar por uma foto
          qualquer só para preencher seria inventar arte. Pedido no relatório. */}
      <PageHero
        eyebrow="About"
        title="Keeping Leadership Real."
        subtitle="Our purpose, our promise, what we believe, and where we work"
      />

      {/* ── Block 1b · Estatísticas, no escuro ────────────────────────
          Mesmo desenho da faixa da home e da Our Impact: régua vermelha, número
          grande em `brand` com count-up, uma linha de contexto embaixo. Quatro
          em linha no desktop, como a imagem pede — a home usa duas colunas
          porque lá os rótulos são mais longos. */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
          <Reveal className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <span className="mb-5 block h-[3px] w-8 bg-brand" />
                <div className="text-[34px] font-bold leading-none tracking-[-1.2px] text-white md:text-[42px]">
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
          beneath, full width." Fundo escuro, section label vermelho, aspas
          vermelhas como elemento de display — tudo isso é do outline. */}
      <section id="identity" className="bg-ink-2 text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
            {/* A foto de grupo do time pedida pelo outline ("the CDNA team group
                photograph supplied with the slide") não veio com os anexos, e
                não existe no repositório: as fotos de `public/dna-time` são de
                eventos e de turmas de programa, não do time da CDNA. Passar uma
                delas por foto do time seria dizer algo falso na página. */}
            <ImagePlaceholder
              className="aspect-[4/3] w-full border-white/15 bg-white/5 text-white/45"
              label="CDNA team photograph"
            />

            <div>
              <Eyebrow>Keeping Leadership Real</Eyebrow>
              {/* Aspas vermelhas de abertura e fechamento como elemento gráfico,
                  fora do fluxo do texto — `aria-hidden` porque quem usa leitor
                  de tela já recebe a citação pelo <blockquote>. */}
              <blockquote className="relative">
                <span
                  aria-hidden
                  className="absolute -left-1 -top-6 select-none font-serif text-[64px] leading-none text-brand"
                >
                  “
                </span>
                <p className="text-[16.5px] leading-[1.65] text-white/85 md:text-[17.5px]">
                  At CDNA, <span className="font-semibold text-brand">Keeping It Real</span>{" "}
                  isn’t a slogan; it’s how we work. We speak with honesty, design
                  with truth, and deliver with the same authenticity we expect
                  from leaders. Our conversations are candid, our relationships
                  are human, and our programmes are built from real, lived
                  experience, not theory.
                </p>
                <p className="mt-5 text-[16.5px] leading-[1.65] text-white/85 md:text-[17.5px]">
                  CEOs and CHROs respect us for keeping it relevant, resilient,
                  and real.
                  <span
                    aria-hidden
                    className="ml-2 inline-block translate-y-3 select-none font-serif text-[48px] leading-none text-brand"
                  >
                    ”
                  </span>
                </p>
                <footer className="mt-6 text-[14px] font-semibold tracking-[0.2px] text-white">
                  Rhea Leckie, Founder &amp; CEO of CDNA Consulting
                </footer>
              </blockquote>
            </div>
          </div>

          {/* Quatro cards brancos, título vermelho, corpo em `ink`. Quatro no
              desktop, dois por dois no tablet, empilhados no telefone — a grade
              é a que o outline descreve. `items-stretch` dá altura igual. */}
          <div className="mt-12 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <div key={p.heading} className="bg-white p-6">
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
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
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
        <div className="mx-auto max-w-[1200px] px-6 pt-16 md:px-10 md:pt-20">
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
        <div className="mx-auto max-w-[1200px] px-6 py-16 md:px-10 md:py-20">
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
        <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 px-6 py-14 md:flex-row md:items-center md:justify-between md:px-10">
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
    </SiteShell>
  );
}
