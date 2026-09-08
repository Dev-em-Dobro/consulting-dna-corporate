/**
 * /home-v3 — a terceira home para o grupo comparar. NÃO é o site.
 *
 * A DIFERENÇA PARA A V2 É SÓ O HERÓI. Do fim do herói para baixo, esta página é
 * byte a byte a `/home-v2`: mesmas seções, mesma ordem, mesmo tratamento. Foi o
 * pedido de 07-09 — "pode mexer só na hero e deixar o resto como está". Quem
 * comparar `/home-v2` e `/home-v3` está comparando dois heróis, e só isso.
 *
 * REFERÊNCIA DIFERENTE DA V2. A V2 segue a Explore Performance, que a Rhea
 * mandou em 03-09. Esta segue a TRIONN (`ref 10.png`), que é um estúdio de
 * design e um site de estética oposta: fundo quase preto, tipografia leve e
 * enorme, conteúdo empurrado para os CANTOS em vez de centrado, e o miolo da
 * tela deixado quase vazio. O mapeamento está comentado em `HeroV3.tsx`.
 *
 * Como está montada: cópia da `app/home-v2/page.tsx`, não refactor. Mesma
 * lógica de sempre neste projeto — enquanto é proposta, nada que está no ar
 * pode depender de arquivo que a proposta mexa. Se a V3 vencer, ela sobe para
 * `/` e as duas pastas somem; se não, apaga-se a pasta e não sobrou nada atrás.
 * O preço é drift: mudanças na `/home-v2` a partir de hoje não aparecem aqui
 * sozinhas.
 *
 * `noindex` porque é conteúdo duplicado da home — não pode ser indexado nem
 * concorrer com ela na busca. Não está no `app/sitemap.ts` (a lista lá é
 * explícita) e não está no menu (o nav vem do CMS).
 */
import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import methodology from "@/public/5H-methodology.jpg";
import HeroV3 from "@/components/HeroV3";
import NavV2 from "@/components/NavV2";
import Reveal from "@/components/Reveal";
import LogoMarquee from "@/components/LogoMarquee";
import RealCycle from "@/components/RealCycle";
import PhotoCarousel from "@/components/PhotoCarousel";
import Counter from "@/components/Counter";
import PeopleGrid from "@/components/PeopleGrid";
import SiteFooter from "@/components/SiteFooter";
import BookEndorsements from "@/components/BookEndorsements";
import AwardsMentions from "@/components/AwardsMentions";
import { getPeople } from "@/lib/cms/map";
import { buildSiteNav } from "@/lib/nav-server";
import ContactForm from "@/components/ContactForm";
import LocationsBlock from "@/components/LocationsBlock";
import WorldCoverageMap from "@/components/WorldCoverageMap";
import JsonLd from "@/components/JsonLd";
import { bookLd, personLd } from "@/lib/seo/jsonld";
import { clientLogoRows, logoRowDuration } from "@/lib/logos";
import { getSiteStats } from "@/lib/stats";

// Serifa para o corpo — item 2.1 da leitura da referência: o par "sans no
// título + serifa no corpo" é o que dá o ar editorial, em vez de ar de SaaS.
// A Explore Performance usa freight-text-pro, que é da Adobe; a Source Serif é
// o equivalente livre mais próximo em desenho e em altura de x.
//
// Carregada AQUI, e não no layout: assim a home real não baixa mais uma fonte
// por causa de uma proposta. Escolha de família é do Guli — isto é um lugar
// para ele decidir em cima, e trocar é uma linha.
const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-serif-v2",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const title = "Home V3 (proposta) | Corporate DNA";
  return {
    title,
    description: SITE_DESCRIPTION,
    // Sem `alternates`: o canonical de "/" é da home real. Esta página é
    // duplicata para revisão interna e não pode reivindicá-lo.
    robots: { index: false, follow: false },
    openGraph: { title, description: SITE_DESCRIPTION },
    twitter: { title, description: SITE_DESCRIPTION },
  };
}

// The curated client wall now lives in lib/logos.ts, shared with /our-clients
// so the two walls cannot drift apart (27-08 brief, item 8).
const [logoRow1, logoRow2] = clientLogoRows;

const book = {
  /**
   * The section's headline — a positioning line, NOT the book's name. Kept as
   * authored (CDNA confirmed on 01-09 that it is the same book, and that this
   * heading is deliberately not the title).
   */
  title:
    "Corporate DNA: How Great Companies Build What Competitors Can't Copy and clients want to emulate",
  /**
   * The published title, as it appears on the cover, in the endorsements and on
   * the Amazon listing the CTA points to. Separate from `title` because the
   * JSON-LD below declares it to search engines as the *name of the book*:
   * feeding the section headline there asserts a book that does not exist, and
   * attributes it to Rhea. The heading is copy; this is a fact.
   */
  name: "Leadership: It's In Your DNA",
  subtitle: "The book behind the method",
  body: [
    "What if the greatest competitive advantage isn't your strategy, products or technology—but your organisational DNA?",
    "Drawing on nearly two decades of advising CEOs and executive teams around the world, Rhea Leckie reveals the principles behind organisations that consistently outperform, adapt and endure.",
    "More than a leadership book, this is the story of how a boutique consultancy scaled through financial crises, wars and a global pandemic by intentionally building a Corporate DNA that clients now seek to emulate. Blending real-world leadership stories with a practical framework, the book explores how culture, leadership, decision-making and human behaviour become an organisation's greatest source of resilience and growth.",
    "For leaders who want to build companies that thrive through uncertainty—not just survive it—this is a blueprint for creating a legacy that lasts.",
  ],
};

const challenges = [
  { num: "01", title: "CEO & executive performance", body: "Support for new and established CEOs and C-suite leaders navigating transitions, first 100 days and sustained top-team pressure." },
  { num: "02", title: "Executive-team alignment", body: "Aligning senior teams behind strategy so decisions move faster and the organisation feels one coherent leadership voice." },
  { num: "03", title: "Leadership succession & talent", body: "Building credible successors and the enterprise leadership pipeline before the seat, not after the gap appears." },
  { num: "04", title: "Enterprise transformation & culture", body: "Closing the gap when transformation is moving faster than leadership capability and culture can currently sustain." },
];

/**
 * The six terms item 1 asks the homepage to explain "Keeping Leadership Real"
 * with. Not the seven-term list in its opening, which is about the experience of
 * the site as a whole.
 *
 * The e-mail writes them as "real pressures, real politics…". The word "real" is
 * dropped here because `RealCycle` supplies it once and holds it fixed while
 * these cycle — printing it on each term would put it back on screen six times,
 * which is the thing Guli's 01-09 treatment exists to stop.
 *
 * Lower case, as the brief writes them. The line reads "Real pressures." — one
 * sentence with one capital, not two words each starting upper. Capitalising
 * here also broke the `sr-only` sentence, which joins the six into "Real
 * pressures, politics, choices…" and would have carried a capital mid-clause.
 */
const reals = [
  "pressures",
  "politics",
  "choices",
  "judgement",
  "people",
  "consequences",
];

const differentiators = [
  { n: "1", title: "Identity and habits, not skills alone", body: "We change how leaders think and behave under pressure, so improvement holds long after the programme ends." },
  { n: "2", title: "High-stakes, senior-level experience", body: "Advisors who have operated at board and C-suite level and are trusted in genuinely high-stakes conversations." },
  { n: "3", title: "Proprietary 5H and DNA 360 methodology", body: "A rigorous, measurable framework — not a generic coaching approach borrowed from elsewhere." },
  { n: "4", title: "Global insight with local delivery", body: "A 75-strong faculty delivering consistently across 36 countries, tuned to regional context." },
];

// `caseSlug` deep-links a card to its published case detail page (/cases/<slug>).
// Cards without a slug fall back to the flagship-cases listing (/cases).
const cases: {
  client: string; sector: string; challenge: string;
  metric: string; metricLabel: string; caseSlug?: string;
}[] = [
  { client: "Heineken", sector: "FMCG", challenge: "Accelerate the readiness and advancement of high-potential leaders across the group.", metric: "45%", metricLabel: "higher promotion rate for programme participants", caseSlug: "heineken" },
  { client: "Coca-Cola", sector: "FMCG", challenge: "Reset a legacy beverage brand by embedding new mindsets and behaviours across a newly formed APAC leadership team.", metric: "43", metricLabel: "leaders transformed across APAC & Japan", caseSlug: "coca-cola" },
  // 6.300, não 2.582: a Rhea corrigiu o número na call de 03-09 (`[47:06]`).
  // Mesma correção aplicada na home no ar — este arquivo é cópia, então o
  // número tem que ser trocado nos dois lugares até a V2 ser decidida.
  { client: "Shell", sector: "Energy", challenge: "Scale women's leadership development across a global engineering workforce.", metric: "6,300", metricLabel: "women leaders impacted across the programme", caseSlug: "shell" },
];

export default async function HomeV3() {
  // `getTickerEntries()` saiu daqui em 07-09: o único consumidor era o selo do
  // herói, e ele virou uma faixa de credenciais escritas à mão (ver
  // HERO_CREDENTIALS em components/HeroV2.tsx). Sem consumidor, buscar o
  // segmento seria uma ida ao CMS para jogar fora o resultado.
  const [people, nav, stats] = await Promise.all([
    getPeople(),
    buildSiteNav(),
    getSiteStats(),
  ]);
  return (
    // `serif.variable` publica --font-serif-v2 para tudo que está dentro; quem
    // usa hoje é o subtítulo do herói. Fica no wrapper, e não no layout, para a
    // home real não herdar nada desta proposta.
    <div
      // --accent-on-dark: o vermelho da marca sobre fundo escuro mede 2,9:1,
      // que reprova para texto pequeno. Este tom clareado dá 4,7:1 sobre o ink
      // e é o mesmo do herói. Regra da V2, em uma frase: brand #d84339 sobre
      // fundo claro, este tom sobre fundo escuro. Está declarado aqui, e não
      // espalhado, para o Guli trocar em um lugar só quando escolher a accent
      // color definitiva.
      style={{ ["--accent-on-dark" as string]: "#f4796d" }}
      // [&_[data-awards-band]]: a faixa de prêmios tem fundo vermelho dentro do
      // AwardsMentions, que é componente compartilhado com o resto do site.
      // Em vez de duplicar o componente, a V2 sobrescreve pelo gancho
      // `data-awards-band` que ele já expõe. Escopado a esta árvore: nenhuma
      // outra página muda.
      // [&_button[type=submit]]: o botão do formulário é ink dentro do
      // ContactForm, também compartilhado. Com a seção de contato virando
      // escura, o vermelho sumiria justamente da ação principal da página — e a
      // referência faz o contrário, o acento vive no CTA. O `!` é porque a
      // classe original do componente tem a mesma especificidade.
      //
      // `relative` para o nav absoluto se prender aqui, e não no documento.
      // `scroll-mt` saiu junto com a barra fixa: sem nada por cima do conteúdo,
      // âncora não cai mais atrás de barra nenhuma.
      // [&_#awards_h2] / [&_#awards_h3]: os títulos do AwardsMentions são os
      // únicos fora da escala — 52px onde toda seção usa 40, e 30px onde os
      // cards usam 28. Medido no navegador, não estimado. Compartilhado com o
      // resto do site, então nivelado aqui em vez de no componente.
      className={`${serif.variable} relative w-full overflow-x-hidden bg-white [&_[data-awards-band]]:bg-ink [&_button[type=submit]]:bg-brand! [&_button[type=submit]]:hover:bg-brand-dark! [&_#awards_h2]:text-[40px]! [&_#awards_h2]:font-semibold! [&_#awards_h2]:tracking-[-0.5px]! [&_#awards_h3]:text-[28px]! [&_#awards_h3]:font-semibold!`}
    >
      <JsonLd
        data={[
          personLd({ name: "Rhea Leckie", jobTitle: "Founder" }),
          bookLd({
            name: book.name,
            author: "Rhea Leckie",
            path: "/#book",
            description: book.body[1],
            image: `${SITE_URL}/book-cover.jpg`,
          }),
        ]}
      />
      {/* NAV — flutuando sobre o herói em vez de faixa vermelha por cima dele.
          O porquê está na NavV2. */}
      <NavV2 items={nav} wide />

      {/* SEM TICKER AQUI — é a mudança mais visível da V2, e é uma proposta,
          não uma decisão tomada.

          O histórico: a faixa está no ar por causa do item 17 do briefing de
          27-08, foi ela que a Rhea reclamou na apresentação, e a escolha do que
          fazer ficou registrada como "decisão delegada a nós" (`[44:21]`). Na
          call interna o Guli propôs mover para baixo, sem caixa em volta
          (`[03:21]`), e o Guilherme concordou.

          Aqui ela sai inteira, e o conteúdo não se perde: o herói ganhou uma
          faixa de credenciais na base (o §4.4 da leitura da referência —
          "trocar o ticker por um bloco de selos" — porque rolando o texto
          trunca e não dá para ler), e a faixa de prêmios do rodapé
          (`AwardsMentions`, mais abaixo) continua onde está.

          Se o grupo preferir manter a faixa, ela volta em uma linha, logo antes
          do `AwardsMentions`, que é exatamente o que o Guli propôs.

          ATUALIZAÇÃO 07-09: até esta data o herói mostrava `ticker[0]`, a
          entrada mais RECENTE do segmento. Como o segmento mistura prêmios,
          regiões, escritórios e parcerias, o espaço de credencial do herói era
          sorteio — podia cair um escritório novo no lugar de um prêmio. Agora
          são dois prêmios escolhidos, escritos no componente. */}

      {/* HERO */}
      <HeroV3 />

      {/* WHAT "REAL" MEANS — 27-08 brief, item 1: "Precisamos explicar Keeping
          Leadership Real de maneira curta e visual, trazendo: real pressures,
          real politics, real choices, real judgement, real people and real
          consequences."

          The six terms are his, verbatim, and nothing else is written here —
          no invented copy. The heading is not ours either: on the old site,
          "Our Purpose... is to make leadership REAL" is the first section
          BELOW THE HERO, which is this exact slot. So the line is not being
          borrowed from somewhere else and dropped in; it is being kept where
          CDNA already had it, and the six terms become the concrete answer to
          it — purpose stated, then the six conditions it has to survive.

          Two earlier attempts were worse and are worth not repeating.
          "Keeping Leadership Real" as an eyebrow repeats the hero H1 word for
          word; "When the stakes are high, leadership must become real" repeats
          the hero sub-line. This one still echoes the hero's "Making
          Leadership Real" CTA — the hero says "real" five times before this
          section starts, so no heading can avoid an echo — but it is one echo
          instead of two, and "Our Purpose" itself appears nowhere above.

          What is deliberately NOT carried over: the two paragraphs that follow
          this heading on the old site ("We curate experiences to release the
          power, humanity and honesty…"). docs/analise.txt:108 singles that
          language out as too broad and conceptual, and item 16 asks for less
          text, not more. The heading is the part that earns its place.

          Not approved this cycle. Same category as the closing line on Our
          Clients, which Guli also took from the old site — both need CDNA to
          confirm they stay.

          Placed between the hero and the wall on purpose. Item 2 warns against
          "long explanation antes de proof"; this is the short, visual one item 1
          asks for, and it is the unpacking of the claim the hero just made. It
          also breaks the run of three dark bands (ticker, hero, wall) and gives
          the logo wall back the set-up line it lost in the reorder.

          Note there are two lists of "reals" in the e-mail and they are not
          interchangeable: the seven in the opening are about the experience of
          the whole site; these six are harder — pressures, politics,
          consequences — and are the ones item 1 attaches to the homepage. */}
      <section id="real" className="bg-paper">
        <div className="mx-auto max-w-[1200px] px-10 py-16 md:py-20">
          {/* One heading, no eyebrow. The old site splits the line as "Our
              Purpose... is to make leadership REAL"; kept whole here, because
              an eyebrow would leave the h2 reading as a fragment on its own,
              and the section only needs a title.

              "REAL" is all-caps on the old site. Here it takes the brand colour
              instead, the device the hero's own CTA uses for "Results, Not
              Promises." — no shout on a page with no other all-caps headline.

              `stagger={false}`: the grid below is already staggering. */}
          {/* One block, not a heading with a caption under it. Asked whether to
              join the two sentences, Guli answered *"Sim. Duas linhas do 'mesmo
              texto'"* and wrote the mobile break out:

                  Our purpose
                  is to make
                  leadership real.
                  Real pressures.

              So both lines carry the same size, weight and tracking, with no
              margin between them — the cycling line is the sentence continuing,
              not a subtitle. `stagger={false}` because the reveal has two
              children that must appear together, not in sequence.

              The mobile breaks are explicit `<br>`, not a width that happens to
              wrap there. The second line is retyped every 55ms, so any wrap the
              browser derives from content would shift as the word grows and
              shrinks. Above `sm` they are hidden and both lines flow on their
              own. */}
          <Reveal stagger={false} className="md:text-center">
            <h2 className="max-w-[900px] text-[30px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink [text-wrap:balance] sm:text-[34px] md:mx-auto md:text-[40px]">
              Our purpose
              <br className="sm:hidden" /> is to make
              <br className="sm:hidden" /> leadership{" "}
              {/* The stop is inside the span. Guli's mock sets "real." in one
                  colour; outside, it printed a dark dot hanging off the red
                  word — and the cycling line below ends in a red stop too, so
                  the two lines have to punctuate the same way. */}
              <span className="text-brand">real.</span>
            </h2>
            {/* Kept out of the `h2`: the word inside it changes every 55ms, and
                a heading that rewrites itself is hostile to screen readers and
                meaningless to a crawler. `RealCycle` is aria-hidden and carries
                its own accessible name. */}
            <p className="max-w-[900px] text-[30px] font-semibold leading-[1.15] tracking-[-0.5px] sm:text-[34px] md:mx-auto md:text-[40px]">
              <RealCycle words={reals} />
            </p>
          </Reveal>
        </div>
      </section>

      {/* CREDIBILITY — proof, before any explanation.
          The brief's ordering principle is "Claim → Proof → Explanation, e não
          long explanation antes de proof" (item 2), so the logo wall and the
          statistics now sit between the hero and "What we solve", which used to
          come first. */}
      <section className="bg-ink text-white">
        <div className="pb-[34px] pt-[70px]">
          <p className="mb-9 text-center text-[12px] font-semibold uppercase tracking-[2.5px] text-white/70">
            Trusted by leadership teams at
          </p>
          <div className="flex flex-col gap-5">
            <LogoMarquee logos={logoRow1} duration={logoRowDuration(logoRow1)} />
            <LogoMarquee logos={logoRow2} duration={logoRowDuration(logoRow2)} reverse />
          </div>
        </div>
        <div className="mx-auto max-w-[1200px] px-10 pb-20 pt-5">
          <Reveal className="mx-auto grid max-w-[760px] grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            {stats.map((s) => (
              <div key={s.label} className="flex items-start gap-5">
                <span className="mt-[38px] h-[3px] w-8 flex-none bg-brand md:mt-[50px]" />
                <div>
                  <div className="text-[44px] md:text-[56px] font-bold leading-none tracking-[-1.5px] text-brand">
                    <Counter value={s.value} />
                  </div>
                  <div className="mt-2 text-[16px] font-medium leading-snug text-white/80">{s.label}</div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* WHAT WE SOLVE — the explanation, now that the proof is above it. */}
      <section id="solve" className="bg-white">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24 md:text-center">
          <div className="mb-2.5 flex items-baseline gap-3 md:justify-center">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">What we solve</span>
          </div>
          <h2 className="mb-3 max-w-[720px] text-[30px] sm:text-[34px] md:text-[40px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink md:mx-auto">
            The leadership challenges that determine enterprise performance.
          </h2>
          {/* Subtítulo de seção em serifa — mesmo papel do subtítulo do herói.
              É o par tipográfico saindo da primeira dobra, que era o item 2.1
              da leitura da referência: "eyebrow em caps → título grande →
              subtítulo em serifa → grid", o mesmo padrão em toda seção.

              Só o subtítulo, e não todo o texto de corpo: o Guli descreveu o
              par ao contrário (Poppins no corpo, uma fonte expressiva nos
              títulos), e comprometer o corpo inteiro do site com serifa antes
              de ele bater o martelo seria decidir por ele. Este papel já estava
              decidido no herói; isto só o repete. */}
          <p
            className="max-w-[620px] text-[19px] leading-[1.65] text-muted md:mx-auto"
            style={{ fontFamily: "var(--font-serif-v2)" }}
          >
            We start with what is at stake for the organisation — then bring the people, method and evidence to solve it.
          </p>
        </Reveal>
      </section>

      {/* CHALLENGES — hidden for now (set the guard to true to restore) */}
      {false && (
      <section id="challenges" className="bg-white">
        <Reveal className="mx-auto max-w-[1200px] px-10 pb-24 pt-4">
          <div className="grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2">
            {challenges.map((ch) => (
              <div key={ch.num} className="bg-white p-10 hover:bg-[#fafafa]">
                <div className="mb-[18px] text-[13px] font-bold tracking-[1px] text-brand">{ch.num}</div>
                <h3 className="mb-3 text-2xl font-semibold tracking-[-0.3px] text-ink">{ch.title}</h3>
                <p className="text-base leading-[1.6] text-[#4a4548]">{ch.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
      )}

      {/* WHY CDNA — hidden for now (set the guard to true to restore) */}
      {false && (
      <section className="bg-paper">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24">
          <div className="mb-2.5 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Why Corporate DNA</span>
          </div>
          <h2 className="mb-[52px] max-w-[760px] text-[30px] sm:text-[34px] md:text-[40px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink">
            Four reasons senior teams choose us over a coaching directory.
          </h2>
          <div className="grid grid-cols-1 gap-x-14 gap-y-10 md:grid-cols-2">
            {differentiators.map((d) => (
              <div key={d.n} className="flex items-start gap-[22px]">
                <div className="flex h-11 w-11 flex-none items-center justify-center border-[1.5px] border-brand text-base font-bold text-brand">
                  {d.n}
                </div>
                <div>
                  <h3 className="mb-2 text-[21px] font-semibold tracking-[-0.3px] text-ink">{d.title}</h3>
                  <p className="text-base leading-[1.6] text-[#4a4548]">{d.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>
      )}

      {/* The compiled "metralhadora" testimonial reel used to sit here. Item 13
          of the 27-08 brief removes it from the public site: "Remover o compiled
          testimonial video atual do public website. Em vez disso, criar uma
          estrutura modular para individual client testimonial videos." That
          structure exists — the `testimonial_video` content type and its read
          layer — and stays empty until CDNA supplies the individual films.
          `components/TestimonialsVideo.tsx` is left in the repo for them. */}

      {/* CLIENT IMPACT — fundo escuro na V2, vermelho só nas marcações.

          O QUE ERA: o Guli pintou esta faixa de vermelho em 31-08, e por um
          motivo real. A reordenação tinha deixado esta seção e "What we solve"
          as duas brancas e coladas, com o alinhamento trocando de centrado para
          esquerda no meio da rolagem. Em vez de recolocar um divisor, ele deu
          cor própria à faixa: fundo vermelho, eyebrow e título brancos, cards
          brancos.

          POR QUE MUDA: o problema que ele resolveu continua resolvido com fundo
          escuro — o que separava as duas seções brancas era a faixa TER cor,
          não a cor ser vermelha. E o vermelho como área é exatamente o que a
          leitura da referência aponta como a mudança de maior efeito por menor
          esforço (§4.2: "na referência o acento nunca vira área, só marca").
          Trocando por ink, o vermelho volta a aparecer aqui onde ele funciona:
          o filete do eyebrow, o rótulo "Challenge", o traço e o número da
          métrica dentro de cada card branco.

          Ink e não outra cor porque a seção seguinte visível é `#people`, que é
          branca (o bloco `#approach`, que era escuro, está desligado logo
          abaixo). Escuro aqui mantém o ritmo claro-escuro-claro em vez de
          empilhar dois blocos da mesma cor, que foi o problema original. */}
      <section id="impact" className="bg-ink text-white">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24">
          {/* O filete e o eyebrow voltam a ser vermelhos — era isso que o fundo
              vermelho tinha tirado deles. No tom claro de fundo escuro: o
              #d84339 sobre ink mede 2,9:1 e reprovaria em 13px. */}
          <div className="mb-2.5 flex items-baseline gap-3">
            <span
              className="inline-block h-0.5 w-9"
              style={{ backgroundColor: "var(--accent-on-dark)" }}
            />
            <span
              className="text-[13px] font-semibold uppercase tracking-[2px]"
              style={{ color: "var(--accent-on-dark)" }}
            >
              Client impact
            </span>
          </div>
          <h2 className="mb-[52px] max-w-[720px] text-[30px] sm:text-[34px] md:text-[40px] font-semibold leading-[1.15] tracking-[-0.5px] text-white">
            Results, not promises — measured where it matters.
          </h2>
          {/* `bg-white` on the cards below is now load-bearing, not decoration:
              they used to inherit the section's white ground, and on red they
              would otherwise go transparent. Guli: "os cards continuam com
              fundo branco." */}
          <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
            {cases.map((c) => (
              <article key={c.client} className="flex flex-col border border-line bg-white">
                <div className="bg-ink px-[26px] py-[22px] text-white">
                  <div className="text-[19px] font-bold tracking-[0.5px]">{c.client}</div>
                  <div className="mt-1.5 text-[11px] font-semibold uppercase tracking-[1px] text-white/70">{c.sector}</div>
                </div>
                <div className="flex flex-1 flex-col px-[26px] py-7">
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[1.5px] text-brand">Challenge</p>
                  <p className="mb-[22px] text-[15px] leading-[1.55] text-[#4a4548]">{c.challenge}</p>
                  <div className="mt-auto pt-[22px]">
                    <span className="mb-[18px] block h-[3px] w-9 bg-brand" />
                    <div className="text-[40px] md:text-[52px] font-bold leading-none tracking-[-1.5px] text-brand">
                      <Counter value={c.metric} />
                    </div>
                    <div className="mt-2.5 text-[14.5px] font-medium leading-snug text-ink">{c.metricLabel}</div>
                    <a
                      href={c.caseSlug ? `/cases/${c.caseSlug}` : "/cases"}
                      className="mt-4 inline-block text-[14px] font-semibold text-brand underline underline-offset-4 transition-colors hover:text-brand-dark"
                    >
                      read more here
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      {/* 5H FRAMEWORK — hidden for now (set the guard to true to restore) */}
      {false && (
      <section id="approach" className="bg-ink text-white">
        <Reveal className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-[72px] px-10 py-24 md:grid-cols-2">
          <div>
            <div className="mb-2.5 flex items-baseline gap-3">
              <span className="inline-block h-0.5 w-9 bg-brand" />
              <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Our approach</span>
            </div>
            <h2 className="mb-5 text-[30px] sm:text-[34px] md:text-[40px] font-semibold leading-[1.15] tracking-[-0.5px] text-white">
              The 5H<span className="align-super text-xl font-semibold">®</span> Framework
            </h2>
            <p className="mb-[18px] text-[17px] leading-[1.65] text-white/80">
              Sustained leadership change comes from identity and habits — not skills alone. Our proprietary 5H methodology works across the{" "}
              <em className="font-semibold not-italic text-white">inner game</em> of the leader and the{" "}
              <em className="font-semibold not-italic text-white">outer game</em> of performance, so behaviour holds under real enterprise pressure.
            </p>
            <p className="mb-[30px] text-[17px] leading-[1.65] text-white/80">
              Paired with our DNA 360 Profiler, it turns diagnosis into a measurable development plan for individuals, teams and the wider organisation.
            </p>
            <Link href="/approach" className="border-b-2 border-brand pb-1 text-sm font-bold uppercase tracking-[0.5px] text-white hover:text-brand">
              Explore the methodology →
            </Link>
          </div>
          <div className="flex justify-center">
            <Image src={methodology} alt="The 5H Framework methodology" className="h-auto w-full max-w-[560px] border border-white/10" />
          </div>
        </Reveal>
      </section>
      )}

      {/* PEOPLE — hidden until the CMS has published people */}
      {people.length > 0 && (
        <section id="people" className="bg-white">
        <Reveal className="mx-auto max-w-[1200px] px-10 py-24">
          <div className="mb-2.5 flex items-baseline gap-3">
            <span className="inline-block h-0.5 w-9 bg-brand" />
            <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">Our people</span>
          </div>
          <h2 className="mb-3 max-w-[720px] text-[30px] sm:text-[34px] md:text-[40px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink">
            Senior advisors who have sat where our clients sit.
          </h2>
          <p
            className="mb-12 max-w-[640px] text-[19px] leading-[1.65] text-muted"
            style={{ fontFamily: "var(--font-serif-v2)" }}
          >
            A leadership team of seasoned advisors, backed by a global faculty of 75 practitioners delivering across 36 countries.
          </p>
          <PeopleGrid people={people} />
          {/* The DNA experience — copy on the left, life-at-DNA carousel on the
              right. Stacks on mobile (text first, then the images). */}
          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-14">
            <div>
              <p className="text-lg font-medium leading-[1.55] text-ink">
                With our “One DNA TEAM” principle, we execute as one
                collaborative team.
              </p>
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="mb-2 text-[17px] font-semibold tracking-[-0.3px] text-ink">
                    The DNA Experience
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-muted">
                    We blend our individual talents with the collective
                    expertise of our global pool of 75 members across 36
                    countries, and deliver the power of the “DNA experience” to
                    every client. Each time, every time.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-[17px] font-semibold tracking-[-0.3px] text-ink">
                    Trusted Relationships
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-muted">
                    Relationships are at the core of who we are. We build
                    long-term, deep relationships with our people and become
                    part of each other’s stories. We are part of a family who
                    care about each other, stay close and grow, laugh and unmask
                    together.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-[17px] font-semibold tracking-[-0.3px] text-ink">
                    Inclusion &amp; Diversity
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-muted">
                    Our best-in-class people are full of great character and
                    personality, representing a range of backgrounds in the
                    behavioural sciences and business; coming from different
                    markets around the world, and representing a wide range of
                    social identities.
                  </p>
                </div>
              </div>
            </div>
            <PhotoCarousel
              images={Array.from({ length: 28 }, (_, i) => i + 1)
                .filter((n) => n !== 5 && n !== 8 && n !== 14)
                .map(
                  (n) =>
                    `/dna-time/dna-time-${String(n).padStart(2, "0")}.jpeg`
                )}
            />
          </div>
          <div className="mt-14 flex flex-wrap items-center gap-x-14 gap-y-6 border-t border-line pt-10">
            <span className="text-[12px] font-semibold uppercase tracking-[2px] text-muted">In partnership with</span>
            <span className="text-[19px] font-bold text-ink">Harvard Business Impact</span>
            <span className="h-[22px] w-px bg-[#d9d5d1]" />
            <span className="text-[19px] font-bold text-ink">Imperial College London</span>
          </div>
        </Reveal>
        </section>
      )}

      {/* BOOK */}
      <section id="book" className="bg-paper">
        <Reveal className="mx-auto max-w-[1200px] py-14 md:px-10 md:py-24">
          <div className="bg-ink text-white md:border md:border-line md:p-14">
            {/* Blog-post layout: the cover floats and the copy wraps around it.
                `flow-root` contains the float so the endorsements block below
                starts on a clean line. */}
            <div className="flow-root px-6 pb-10 pt-12 md:p-0">
              <span className="text-[13px] font-semibold uppercase tracking-[2px] text-brand">{book.subtitle}</span>
              <h3 className="mb-6 mt-6 text-[24px] sm:text-[28px] font-semibold leading-[1.2] tracking-[-0.4px] text-white">
                {book.title}
              </h3>

              <figure className="mb-7 w-full md:float-right md:mb-4 md:ml-12 md:w-[400px]">
                <div className="relative aspect-[4/3] w-full overflow-hidden shadow-xl">
                  {/* The cover is a picture of the book, so it is named by the
                    book — not by the section headline. */}
                <Image src="/book-cover.png" alt={book.name} fill sizes="(min-width: 768px) 400px, 100vw" className="object-cover" />
                </div>
              </figure>

              <div className="space-y-4 text-[17px] leading-[1.65] text-white/80">
                {book.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <a
                href="https://www.amazon.com/Leadership-Its-Your-Rhea-Duttagupta/dp/1408168340"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block bg-brand px-7 py-3.5 text-sm font-bold uppercase tracking-[0.5px] text-white transition-colors hover:bg-brand-dark"
              >
                Buy on Amazon
              </a>
            </div>

            {/* Recovered from the legacy /book-endorsements page, which now
                redirects here. Inside the card so it reads as one block. */}
            <BookEndorsements />
          </div>
        </Reveal>
      </section>

      {/* OFFICES / REGIONS — interactive locations map + carousel (feature 003).
          `tone="dark"` is Guli's 31-08 fix: this block and the book block above
          were both light grey and touching. Homepage only — the same block runs
          light on Our Clients and Our Team, which have different neighbours. */}
      <LocationsBlock tone="dark" />

      {/* GLOBAL COVERAGE — world map of countries served (feature 008) */}
      <WorldCoverageMap />

      {/* AWARDS & MENTIONS — spec 009, design docs/Group 2.png.
          A faixa interna dele é vermelha; a V2 a escurece pelo `data-awards-band`
          no wrapper lá em cima, sem duplicar o componente. Os logos dos prêmios
          são claros, então funcionam sobre o ink do mesmo jeito que funcionavam
          sobre o vermelho. */}
      <AwardsMentions />

      {/* CONTACT — a terceira e última área vermelha da página.

          Vira ink pelo mesmo motivo das outras duas, e aqui a troca custa
          menos ainda: o formulário já é um card branco por cima do fundo, e o
          botão de enviar já é ink. O vermelho continua presente onde importa —
          os asteriscos de campo obrigatório e o link de política — que é
          marcação, não área.

          O rodapé logo abaixo é branco, então a seção escura não encosta em
          outra escura. */}
      <section id="contact" className="bg-ink text-white">
        <Reveal className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-[72px] px-10 py-[88px] md:grid-cols-[1.1fr_1fr]">
          <div>
            {/* Era 44px: o único título de seção fora do padrão de 40 no
                arquivo. Nivelado. */}
            <h2 className="mb-6 text-[30px] sm:text-[34px] md:text-[40px] font-semibold leading-[1.15] tracking-[-0.5px] text-white [text-wrap:balance]">
              What is changing, and where does leadership need to go?
            </h2>
            <p
              className="mb-2 max-w-[460px] text-[19px] leading-[1.65] text-white/90"
              style={{ fontFamily: "var(--font-serif-v2)" }}
            >
              Tell us the leadership challenge you are facing. We will respond with a considered, confidential point of view — not a sales pitch.
            </p>
          </div>
          <ContactForm />
        </Reveal>
      </section>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
}
