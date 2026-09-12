import type { Metadata } from "next";
import Image from "next/image";
import heroPhoto from "@/public/solutions/service-hero-fallback.jpg";
/**
 * A hélice de DNA sobre a Terra à noite, mandada em 11-09. É a primeira imagem
 * deste projeto que NÃO é fotografia de evento: não tem rosto, não tem marca de
 * terceiro na parede, não insinua relação com cliente nenhum. Por isso ela pode
 * repetir-se nas dez páginas sem o problema que tirou as fotos daqui — repetição
 * de ilustração lê como identidade; repetição de fotografia lê como falta de
 * material.
 *
 * Veio PNG de 2,6 MB; convertida para JPEG de 303 KB (qualidade 82), porque o
 * arquivo mora no repositório e o Next só otimiza o que serve, não o que versiona.
 *
 * ⚠️ A COMPOSIÇÃO DECIDE O LAYOUT, e não o contrário. A hélice arqueia no TERÇO
 * SUPERIOR; o globo e as luzes de cidade ocupam os dois terços de baixo, com o
 * ponto mais brilhante embaixo à esquerda. O espaço realmente escuro e vazio é o
 * alto ao centro-direita, entre as voltas da hélice. Texto claro só é legível ali
 * ou sobre escurecimento — e é isso que separa as versões 7 e 8 abaixo.
 */
import dnaEarth from "@/public/solutions/dna-earth.jpg";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Service section tests",
  robots: { index: false, follow: false },
};

/**
 * ⚠️ PÁGINA DESCARTÁVEL — seis tratamentos para os blocos 2 e 3 do template de
 * serviço ("The Outcome" e "How CorporateDNA Helps"). Some quando um for
 * escolhido, como sumiu a `/hero-tests`.
 *
 * O PROBLEMA. Hoje os dois blocos são o MESMO layout duas vezes seguidas:
 * rótulo numa coluna de 1fr, texto numa de 1.6fr, fundo branco e depois
 * `paper`. Dois parágrafos empilhados com a mesma silhueta, e o leitor não tem
 * como saber que trocou de assunto sem ler o rótulo. É o "sem graça" do pedido.
 *
 * DE ONDE VEIO A ORIGINAL, e por que ela ficou assim: a versão anterior tinha
 * foto e alternava o lado a cada bloco, no arranjo da Explore Performance. A
 * foto saiu em 11-09 porque era import fixo, a MESMA nas dez páginas, e portanto
 * a única coisa da página que o cliente não poderia trocar ao assumir o conteúdo
 * (`solutionSchema` tem um campo de imagem só, o do herói). Com a foto foi
 * embora a alternância, que existia para dar ritmo entre fotos — e o ritmo
 * passou a depender só da troca de fundo. É exatamente o que não está bastando.
 *
 * AS DUAS REFERÊNCIAS MANDADAS EM 11-09 dizem coisas diferentes, e as duas
 * cabem aqui:
 *   • `ref service 1` (Prisma) — cena fotográfica em sangria total, tipo
 *     enorme por cima, texto curto no canto oposto. Atmosfera vinda de FOTO.
 *   • `ref service 2` (cosmos) — quase nada de imagem: um traço de luz em
 *     diagonal sobre preto, e a tipografia fazendo o trabalho. Atmosfera vinda
 *     de GRADIENTE.
 * A segunda importa mais do que parece: ela mostra que dá para ter presença sem
 * fotografia — e fotografia por serviço é justamente o que não existe e o que
 * foi pedido ao cliente. As versões 3 e 6 saem hoje sem depender de arquivo
 * nenhum; a 4 e a 5 dependem de material que ainda não chegou.
 *
 * A COPY É REAL, do `lib/services.ts` (Executive Coaching), e não texto de
 * exemplo: tratamento se julga com a medida verdadeira do parágrafo. Nenhuma
 * palavra aqui foi escrita por nós.
 */

const LABEL_A = "The Outcome";
const LABEL_B = "How CorporateDNA Helps";

const TEXT_A =
  "Greater leadership impact, decision quality, role readiness and performance under pressure at the moments where an executive’s behaviour has disproportionate organisational consequences.";

const TEXT_B =
  "Our coaches work with senior leaders on the real challenges of their role, combining deep personal insight with the realities of the business. We strengthen the Inner Game and Outer Game required to navigate complexity, transition, relationships, performance and increasing leadership scale.";

/** A primeira frase vira destaque na v2; o resto segue como corpo. */
function splitFirstSentence(text: string): [string, string] {
  const i = text.indexOf(". ");
  if (i === -1) return [text, ""];
  return [text.slice(0, i + 1), text.slice(i + 2)];
}

function Divider({ n, name, note }: { n: number; name: string; note: string }) {
  return (
    <div className="border-y border-line bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-1 px-6 py-5 md:flex-row md:items-baseline md:gap-6 md:px-10">
        <p className="text-[13px] font-semibold uppercase tracking-[1.3px] text-brand">
          {String(n).padStart(2, "0")} · {name}
        </p>
        <p className="max-w-[820px] text-[14px] leading-[1.5] text-muted">{note}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   1 · ALTERNÂNCIA SECA
   A ideia literal do pedido, e a mais barata: uma linha com o rótulo à
   esquerda e o texto à direita, a seguinte invertida. Sem imagem nenhuma.
   O que resolve: as duas silhuetas deixam de ser iguais, então a troca de
   assunto fica visível antes de ler.
   O limite: continua sendo texto sobre fundo chapado. Se o problema for
   "falta presença", isto não resolve — resolve só a repetição.
   ───────────────────────────────────────────────────────────────────────── */
function V1() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-20 md:grid-cols-[1fr_1.6fr] md:gap-16 md:px-10 md:py-24">
          <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
            {LABEL_A}
          </p>
          <p className="max-w-[760px] font-serif text-[20px] leading-[1.55] text-ink md:text-[24px]">
            {TEXT_A}
          </p>
        </div>
      </section>
      <section className="bg-paper">
        {/* A INVERSÃO É DE VERDADE: o texto vai para a coluna larga da ESQUERDA
            e o rótulo para a estreita da direita, alinhado à direita. Só trocar
            a ordem mantendo o rótulo largo daria duas linhas quase iguais. */}
        <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-20 md:grid-cols-[1.6fr_1fr] md:gap-16 md:px-10 md:py-24">
          <p className="max-w-[760px] font-serif text-[20px] leading-[1.55] text-ink md:text-[24px]">
            {TEXT_B}
          </p>
          <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand md:text-right">
            {LABEL_B}
          </p>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   2 · A PRIMEIRA FRASE VIRA DESTAQUE
   Sem imagem também, mas ataca outra coisa: hoje o parágrafo inteiro tem um
   peso só, e o leitor não sabe onde começar. A primeira frase sobe para
   serifa grande, o resto fica em corpo de leitura.
   O que resolve: hierarquia dentro do bloco, e um "gancho" escaneável.
   O limite: só funciona quando a primeira frase se sustenta sozinha — no
   Outcome ela é a frase inteira, então o bloco fica sem corpo.
   ───────────────────────────────────────────────────────────────────────── */
function V2() {
  const [leadA, restA] = splitFirstSentence(TEXT_A);
  const [leadB, restB] = splitFirstSentence(TEXT_B);
  return (
    <>
      {[
        { label: LABEL_A, lead: leadA, rest: restA, tone: "bg-white" },
        { label: LABEL_B, lead: leadB, rest: restB, tone: "bg-paper" },
      ].map((b) => (
        <section key={b.label} className={b.tone}>
          <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
            <div className="flex items-center gap-3">
              <span className="inline-block h-0.5 w-9 bg-brand" />
              <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
                {b.label}
              </p>
            </div>
            <p className="mt-7 max-w-[980px] font-serif text-[28px] font-semibold leading-[1.2] tracking-[-0.3px] text-ink [text-wrap:balance] md:text-[38px]">
              {b.lead}
            </p>
            {b.rest && (
              <p className="mt-6 max-w-[680px] font-serif text-[18px] leading-[1.65] text-muted md:text-[19px]">
                {b.rest}
              </p>
            )}
          </div>
        </section>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   3 · FAIXA ESCURA COM TRAÇO DE LUZ  ← a `ref service 2`
   Zero fotografia: o fundo é `ink` com um gradiente diagonal em vermelho de
   marca, do canto para o meio. É a leitura da referência do cosmos, onde a
   "imagem" é só luz.
   O que resolve: presença de verdade, e sem depender de arquivo nenhum —
   pode ir para produção hoje.
   O limite: dois blocos escuros seguidos numa página que já tem herói escuro
   e faixa de evidência escura. Provavelmente só UM dos dois pode ser assim.
   ───────────────────────────────────────────────────────────────────────── */
function V3() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        {/* O traço: um gradiente cônico não serve, porque precisa de borda
            dura de um lado e queda suave do outro. Dois `radial-gradient`
            sobrepostos dão a lâmina e o halo. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(120% 90% at 108% -10%, rgba(216,67,57,.85) 0%, rgba(216,67,57,.32) 26%, rgba(216,67,57,0) 58%), radial-gradient(70% 60% at 92% 8%, rgba(255,180,150,.55) 0%, rgba(255,180,150,0) 55%)",
          }}
        />
        <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-28">
          <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand-light">
            {LABEL_A}
          </p>
          <p className="mt-7 max-w-[900px] font-serif text-[26px] font-semibold leading-[1.25] tracking-[-0.3px] text-white [text-wrap:balance] md:text-[34px]">
            {TEXT_A}
          </p>
        </div>
      </section>
      <section className="relative isolate overflow-hidden bg-ink-2 text-white">
        {/* Invertido: a luz entra pela esquerda e o texto encosta na direita,
            para os dois blocos não terem a mesma composição. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(120% 90% at -8% 110%, rgba(216,67,57,.72) 0%, rgba(216,67,57,.26) 28%, rgba(216,67,57,0) 60%)",
          }}
        />
        <div className="mx-auto flex max-w-[1440px] justify-end px-6 py-24 md:px-10 md:py-28">
          <div className="max-w-[760px]">
            <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand-light">
              {LABEL_B}
            </p>
            <p className="mt-7 font-serif text-[20px] leading-[1.6] text-white/90 md:text-[22px]">
              {TEXT_B}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   4 · FOTO EM SANGRIA COM ESCURECIMENTO  ← a `ref service 1`
   A seção inteira mora SOBRE a fotografia, com o mesmo escurecimento lateral
   do herói. O texto fica no lado escuro, e alterna de lado entre os blocos.
   O que resolve: é o tratamento de maior presença dos seis.
   ⚠️ O LIMITE É REAL E NÃO É DE DESENHO: a foto aqui é a mesma do herói,
   porque é a única sem marca de terceiro à vista. Usada assim, a página abre
   com ela e repete ela duas vezes — lê como falta de material, que é o que é.
   Este tratamento só vale a partir do dia em que existir foto POR SERVIÇO, e
   é o argumento mais forte do pedido de fotografia de 11-09.
   ───────────────────────────────────────────────────────────────────────── */
function V4() {
  return (
    <>
      {[
        { label: LABEL_A, text: TEXT_A, side: "left" as const },
        { label: LABEL_B, text: TEXT_B, side: "right" as const },
      ].map((b) => (
        <section
          key={b.label}
          className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-ink text-white"
        >
          <Image
            src={heroPhoto}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="-z-20 object-cover object-center saturate-[.65] brightness-[.68]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage:
                b.side === "left"
                  ? "linear-gradient(to right, rgba(35,31,33,.92) 0%, rgba(35,31,33,.62) 42%, rgba(35,31,33,.10) 100%)"
                  : "linear-gradient(to left, rgba(35,31,33,.92) 0%, rgba(35,31,33,.62) 42%, rgba(35,31,33,.10) 100%)",
            }}
          />
          <div
            className={`mx-auto flex w-full max-w-[1440px] px-6 py-20 md:px-10 md:py-24 ${
              b.side === "right" ? "justify-end" : ""
            }`}
          >
            <div className="max-w-[620px]">
              <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand-light">
                {b.label}
              </p>
              <p className="mt-7 font-serif text-[22px] leading-[1.5] text-white md:text-[26px]">
                {b.text}
              </p>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   5 · FOTO COMO FAIXA ESTREITA
   Meio-termo entre a 1 e a 4: a foto volta, mas como uma coluna de ~38% em
   vez de metade da tela, e alterna de lado. Menos tela para a imagem quer
   dizer menos peso sobre o fato de ela se repetir.
   O que resolve: ritmo com imagem, sem a página virar um álbum.
   O limite: mesma dependência de material da versão 4, em dose menor.
   ───────────────────────────────────────────────────────────────────────── */
function V5() {
  return (
    <>
      {[
        { label: LABEL_A, text: TEXT_A, imageLeft: true, tone: "bg-white" },
        { label: LABEL_B, text: TEXT_B, imageLeft: false, tone: "bg-paper" },
      ].map((b) => (
        <section key={b.label} className={b.tone}>
          <div
            className={`mx-auto flex max-w-[1440px] flex-col lg:items-stretch ${
              b.imageLeft ? "lg:flex-row" : "lg:flex-row-reverse"
            }`}
          >
            <div className="relative min-h-[240px] lg:min-h-[420px] lg:w-[38%]">
              <Image
                src={heroPhoto}
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover object-center"
              />
            </div>
            <div
              className={`flex items-center px-6 py-16 md:px-10 lg:w-[62%] lg:py-24 ${
                b.imageLeft ? "lg:pl-14 xl:pl-20" : "lg:pr-14 xl:pr-20"
              }`}
            >
              <div className="max-w-[620px]">
                <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
                  {b.label}
                </p>
                <p className="mt-5 font-serif text-[19px] leading-[1.6] text-ink md:text-[21px]">
                  {b.text}
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   6 · NUMERADA, COM O NÚMERO COMO GRÁFICO
   O "01/02" vira o elemento visual — grande, em vermelho, na coluna estreita
   —, e a alternância é de lado. Sem imagem.
   O que resolve: dá aos dois blocos uma relação de SEQUÊNCIA (primeiro o que
   muda, depois como), que hoje não está dita em lugar nenhum.
   O limite: numerar sugere um método de N passos, e são só dois blocos.
   ───────────────────────────────────────────────────────────────────────── */
function V6() {
  return (
    <>
      {[
        { n: "01", label: LABEL_A, text: TEXT_A, tone: "bg-white", flip: false },
        { n: "02", label: LABEL_B, text: TEXT_B, tone: "bg-paper", flip: true },
      ].map((b) => (
        <section key={b.n} className={b.tone}>
          <div
            className={`mx-auto grid max-w-[1440px] gap-8 px-6 py-20 md:gap-16 md:px-10 md:py-24 ${
              b.flip ? "md:grid-cols-[1.6fr_1fr]" : "md:grid-cols-[1fr_1.6fr]"
            }`}
          >
            <div className={b.flip ? "md:order-2" : ""}>
              <p className="font-serif text-[64px] font-semibold leading-none tracking-[-2px] text-brand md:text-[88px]">
                {b.n}
              </p>
              <p className="mt-4 border-t border-line pt-4 text-[14px] font-medium uppercase tracking-[1.3px] text-ink">
                {b.label}
              </p>
            </div>
            <p
              className={`max-w-[760px] font-serif text-[20px] leading-[1.55] text-ink md:text-[24px] ${
                b.flip ? "md:order-1" : ""
              }`}
            >
              {b.text}
            </p>
          </div>
        </section>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   7 · A HÉLICE AO FUNDO, TEXTO CENTRADO
   A imagem cobre a seção inteira e o texto vai para o meio, em coluna curta.
   O escurecimento é PAREJO — um véu de cima a baixo — porque texto centrado
   cruza a largura toda e não existe um lado seguro para deixar limpo.
   O que resolve: presença máxima com uma imagem que pode repetir nas dez
   páginas sem parecer falta de material.
   O limite: véu parejo é o que mais apaga a imagem. Ela vira textura, não
   assunto — e aqui ela TEM assunto (é a marca desenhada).
   ───────────────────────────────────────────────────────────────────────── */
function V7() {
  return (
    <>
      {[
        { label: LABEL_A, text: TEXT_A, pos: "object-[50%_28%]" },
        { label: LABEL_B, text: TEXT_B, pos: "object-[50%_72%]" },
      ].map((b) => (
        <section
          key={b.label}
          className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-ink text-white"
        >
          {/* O RECORTE MUDA ENTRE OS BLOCOS e é o que impede a repetição de
              parecer erro: o primeiro enquadra a hélice, o segundo desce para
              as luzes de cidade. Mesma imagem, dois assuntos. */}
          <Image
            src={dnaEarth}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className={`-z-20 object-cover ${b.pos}`}
          />
          {/* SUBIU DE .62/.78/.62 PARA .76/.86/.76. Texto centrado não tem lado
              seguro — ele cruza a largura inteira, então passa por cima da
              hélice, do limbo aceso do globo e das luzes de cidade no mesmo
              parágrafo. O véu tem de servir ao PIOR pedaço, e o pior pedaço
              aqui é claro. Esta versão paga isso apagando mais a imagem; é o
              preço de centralizar, e é exatamente o que a 08 evita. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(24,22,23,.76) 0%, rgba(24,22,23,.86) 50%, rgba(24,22,23,.76) 100%)",
            }}
          />
          <div className="mx-auto w-full max-w-[1440px] px-6 py-20 text-center md:px-10 md:py-24">
            <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand-light">
              {b.label}
            </p>
            {/* `mx-auto` com medida de 820: centrado não pode ser largo, senão
                a linha fica comprida e o olho perde o começo da seguinte. */}
            <p className="mx-auto mt-7 max-w-[820px] font-serif text-[22px] leading-[1.5] text-white [text-wrap:balance] md:text-[27px]">
              {b.text}
            </p>
          </div>
        </section>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   8 · A HÉLICE AO FUNDO, COM ELA VISÍVEL ONDE NÃO HÁ TEXTO
   A mesma imagem, e a diferença é só o escurecimento: em vez de um véu
   parejo, ele é LATERAL e para na metade. O texto encosta num lado e a
   imagem fica limpa no outro.
   Na primeira linha o texto vai para a DIREITA, que é onde o céu é escuro e
   vazio entre as voltas da hélice — e aí o globo aceso sobra livre à
   esquerda, que é a parte que vale a pena mostrar. Na segunda linha inverte.
   O que resolve: a imagem deixa de ser papel de parede e vira metade da
   composição, sem custar legibilidade.
   O limite: a área limpa tem de ser realmente escura na foto. Funciona com
   ESTA imagem; com outra, o escurecimento tem de ser remedido.
   ───────────────────────────────────────────────────────────────────────── */
function V8() {
  return (
    <>
      {[
        { label: LABEL_A, text: TEXT_A, textRight: true, pos: "object-[38%_30%]" },
        { label: LABEL_B, text: TEXT_B, textRight: false, pos: "object-[62%_70%]" },
      ].map((b) => (
        <section
          key={b.label}
          className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-ink text-white"
        >
          <Image
            src={dnaEarth}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className={`-z-20 object-cover ${b.pos}`}
          />
          {/* O PLATÔ ESCURO COBRE A COLUNA DE TEXTO INTEIRA e só então cai.
              A coluna tem 560px encostada numa borda de um container de 1440,
              ou seja, ela vive nos primeiros ~42% da largura contados a partir
              daquele lado — por isso o platô vai até 44% e não até 30%. A
              primeira versão começava a clarear no meio do parágrafo, e era ali
              que a leitura quebrava, não na borda.

              ⚠️ .95 E NÃO .90, e o motivo é a fotografia, não o gosto: no
              segundo bloco o texto cai sobre as luzes de cidade, que são a área
              mais clara do arquivo inteiro. Um véu calibrado pelo céu escuro do
              primeiro bloco não serve para o segundo. Medido depois de aplicar:
              o pior pixel sob o texto fica em 4,5:1 contra branco, que é a régua
              de AA para corpo de texto.

              A QUEDA CONTINUA RÁPIDA depois do platô — 44% → 88% — porque é ela
              que preserva o ponto desta versão: a metade sem texto fica com a
              imagem crua. Aumentar opacidade alargando o véu resolveria a
              leitura e mataria a ideia. */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: b.textRight
                ? "linear-gradient(to left, rgba(24,22,23,.95) 0%, rgba(24,22,23,.93) 44%, rgba(24,22,23,.44) 68%, rgba(24,22,23,0) 88%)"
                : "linear-gradient(to right, rgba(24,22,23,.95) 0%, rgba(24,22,23,.93) 44%, rgba(24,22,23,.44) 68%, rgba(24,22,23,0) 88%)",
            }}
          />
          <div
            className={`mx-auto flex w-full max-w-[1440px] px-6 py-20 md:px-10 md:py-24 ${
              b.textRight ? "justify-end" : ""
            }`}
          >
            <div className="max-w-[560px]">
              <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand-light">
                {b.label}
              </p>
              <p className="mt-7 font-serif text-[21px] leading-[1.5] text-white md:text-[25px]">
                {b.text}
              </p>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

export default function ServiceSectionTests() {
  const variants = [
    {
      name: "Alternância seca",
      note: "A ideia literal do pedido: rótulo à esquerda e texto à direita, a linha seguinte invertida. Sem imagem. Resolve a repetição, não resolve a falta de presença.",
      node: <V1 />,
    },
    {
      name: "Primeira frase em destaque",
      note: "Hierarquia dentro do bloco em vez de um peso só. O Outcome tem uma frase única, então ali o bloco fica sem corpo — é o teste real desta versão.",
      node: <V2 />,
    },
    {
      name: "Faixa escura com traço de luz  ·  ref 2",
      note: "Zero fotografia: o fundo é ink com gradiente vermelho em diagonal. É a única com essa presença que pode ir para produção hoje, sem depender de arquivo.",
      node: <V3 />,
    },
    {
      name: "Foto em sangria  ·  ref 1",
      note: "A de maior presença — e a que mais depende do que não temos. A foto é a mesma do herói, então a página a mostraria três vezes.",
      node: <V4 />,
    },
    {
      name: "Foto como faixa estreita",
      note: "Meio-termo: a imagem volta em 38% da largura e alterna de lado. Menos tela para a foto é menos evidência de que ela se repete.",
      node: <V5 />,
    },
    {
      name: "Numerada",
      note: "O número vira o gráfico e diz o que hoje não está dito: que os dois blocos são uma sequência — primeiro o que muda, depois como.",
      node: <V6 />,
    },
    {
      name: "Hélice ao fundo · texto centrado",
      note: "A imagem cobre a seção e o texto vai para o meio. O escurecimento é parejo, porque texto centrado cruza a largura toda e não sobra lado seguro — e é isso que mais apaga a imagem.",
      node: <V7 />,
    },
    {
      name: "Hélice ao fundo · imagem limpa onde não há texto",
      note: "Mesma imagem, escurecimento lateral que para na metade. Na primeira linha o texto vai para a direita, onde o céu é escuro, e o globo aceso fica livre à esquerda. Na segunda inverte.",
      node: <V8 />,
    },
  ];

  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <header className="border-b border-line bg-ink px-6 py-12 text-white md:px-10">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[13px] font-medium uppercase tracking-[1.3px] text-brand-light">
            Página descartável
          </p>
          <h1 className="mt-4 max-w-[900px] font-serif text-[30px] font-semibold leading-[1.15] tracking-[-0.4px] md:text-[40px]">
            Seis tratamentos para The Outcome e How CorporateDNA Helps
          </h1>
          <p className="mt-5 max-w-[760px] text-[16px] leading-[1.6] text-white/80">
            A copy é a real de Executive Coaching, tirada de <code>lib/services.ts</code> —
            tratamento se julga com a medida verdadeira do parágrafo. As versões 1, 2, 3 e 6
            não dependem de imagem nenhuma; a 4 e a 5 dependem de fotografia por serviço, que
            ainda não existe.
          </p>
        </div>
      </header>

      {variants.map((v, i) => (
        <div key={v.name}>
          <Divider n={i + 1} name={v.name} note={v.note} />
          {v.node}
        </div>
      ))}
    </div>
  );
}
