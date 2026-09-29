/**
 * ⚠️ PÁGINA DESCARTÁVEL — a fusão das duas seções da home, em fundo claro.
 *
 * Terceira rodada. A primeira comparou cinco fusões possíveis; a escolhida foi a
 * DISPOSIÇÃO da B — o bloco "What we solve" à esquerda e o ciclo animado à direita. A segunda rodada refez a B mantendo a animação como está na home.
 * Esta explora só o FUNDO CLARO, com a disposição já fechada.
 *
 * O QUE ESTÁ SENDO FUNDIDO:
 *   `#real`  — "Our purpose is to make leadership real." + a segunda linha onde
 *              uma palavra é reescrita a cada 55ms.
 *   `#solve` — rótulo "What we solve", o título sobre desafios de liderança, e
 *              a linha em serifa sobre como a CDNA começa.
 *
 * A ESCURA FICA NO TOPO como referência, para a comparação ser justa: é a que
 * já foi aprovada em disposição, e o que muda daqui para baixo é só o fundo.
 *
 * ⚠️ NO CLARO O `RealCycle` VOLTA AO PADRÃO. A prop `onDark` só existe por causa
 * da versão escura — em fundo claro o "Real" fixo é `ink` e a palavra que cicla
 * é `brand` (#d84339), que é o vermelho cheio da marca e só é legível assim
 * sobre claro. Passar `onDark` aqui daria vermelho claro sobre branco: 2,3:1.
 */
import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import RealCycle from "@/components/RealCycle";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Home section tests",
  robots: { index: false, follow: false },
};

const REALS = ["pressures", "politics", "choices", "judgement", "people", "consequences"];
const PURPOSE = "Our purpose is to make leadership";
const EYEBROW = "What we solve";
const H2 = "The leadership challenges that determine enterprise performance.";
const SUB =
  "We start with what is at stake for the organisation, then bring the people, method and evidence to solve it.";

function Tag({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-50 bg-black px-5 py-3 text-[12px] font-semibold uppercase tracking-[2px] text-white">
      {id} · {children}
    </div>
  );
}

function EyebrowRow({ onDark = false }: { onDark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className={`inline-block h-0.5 w-9 ${onDark ? "bg-brand-light" : "bg-brand"}`} />
      <span
        className={`text-left text-[14px] font-medium uppercase leading-none tracking-[1.3px] ${
          onDark ? "text-brand-light" : "text-brand"
        }`}
      >
        {EYEBROW}
      </span>
    </div>
  );
}

/** O propósito + o ciclo. Vive à DIREITA desde a inversão de 10-09. */
function PurposeColumn({ onDark = false }: { onDark?: boolean }) {
  return (
    <div>
      <h2
        className={`font-serif text-[32px] font-semibold leading-[1.1] tracking-[-0.3px] md:text-[48px] ${
          onDark ? "text-white" : "text-ink"
        }`}
      >
        {PURPOSE}{" "}
        <span className={onDark ? "text-brand-light" : "text-brand"}>real.</span>
      </h2>
      {/* Fora do `h2` — a palavra é reescrita a cada 55ms, e um heading que se
          reescreve é hostil a leitor de tela e sem sentido para um crawler. O
          RealCycle é `aria-hidden` e carrega o próprio nome acessível. */}
      <p className="mt-4 font-serif text-[32px] font-semibold leading-[1.1] tracking-[-0.3px] md:text-[48px]">
        <RealCycle words={REALS} onDark={onDark} />
      </p>
    </div>
  );
}

/** O bloco COMPLETO da `#solve` — rótulo, título e a serifa. Vive à ESQUERDA. */
function SolveColumn({ onDark = false }: { onDark?: boolean }) {
  return (
    <div>
      <EyebrowRow onDark={onDark} />
      <h3
        className={`mt-6 text-[26px] font-semibold leading-[1.15] tracking-[-0.4px] md:text-[32px] ${
          onDark ? "text-white" : "text-ink"
        }`}
      >
        {H2}
      </h3>
      <p
        className={`mt-6 font-serif text-[18px] leading-[1.6] md:text-[20px] ${
          onDark ? "text-white/75" : "text-muted"
        }`}
      >
        {SUB}
      </p>
    </div>
  );
}

/**
 * O invólucro comum.
 *
 * `lg:items-center` e não `items-start`: uma coluna é duas linhas de título
 * grande e a outra são três blocos de tamanhos diferentes — alinhadas pelo topo,
 * uma termina muito abaixo da outra e o par lê como desequilibrado.
 *
 * ⚠️ AS COLUNAS FORAM INVERTIDAS em 10-09: o "What we solve" à esquerda, o
 * propósito e o ciclo à direita. A proporção acompanhou a troca — a fração
 * maior (1,15fr) segue o propósito, porque é ele que carrega o título de 48px e
 * a linha animada, que precisa da largura reservada da palavra mais longa.
 */
function Shell({
  bg,
  onDark = false,
  children,
}: {
  bg: string;
  onDark?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className={bg}>
      <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-24">
          {children ?? <SolveColumn onDark={onDark} />}
          <PurposeColumn onDark={onDark} />
        </div>
      </div>
    </section>
  );
}

export default function HomeTestsPage() {
  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell>
        <Tag id="ref">a escura já aprovada, referência de comparação</Tag>
        <Shell bg="bg-ink" onDark />

        <Tag id="1">branco puro</Tag>
        <Shell bg="bg-white" />

        <Tag id="2">paper (#f3f3f3), o cinza que o site já usa</Tag>
        <Shell bg="bg-paper" />

        {/* 3 — divisória vertical entre as colunas. O device que a faixa de
            números da /about usa, girado: separa as duas ideias sem precisar de
            fundo diferente para cada uma. */}
        <Tag id="3">branco com divisória vertical entre as colunas</Tag>
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-28">
            <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-0">
              <SolveColumn />
              <div className="lg:border-l lg:border-line lg:pl-24">
                <PurposeColumn />
              </div>
            </div>
          </div>
        </section>

        {/* 4 — a direita num painel branco sobre `paper`. É a única que dá
            "peso" diferente às duas colunas em vez de tratá-las como iguais. */}
        <Tag id="4">paper com a coluna direita num painel branco</Tag>
        <section className="bg-paper">
          <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-28">
            <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-20">
              <div className="border border-line bg-white p-10 md:p-12">
                <SolveColumn />
              </div>
              <PurposeColumn />
            </div>
          </div>
        </section>

        {/* 5 — régua vermelha grossa abrindo o bloco inteiro, à esquerda. Traz
            o acento da marca sem depender de fundo colorido. */}
        <Tag id="5">branco com régua vermelha abrindo o bloco</Tag>
        <section className="bg-white">
          <div className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-28">
            <div className="border-l-4 border-brand pl-8 md:pl-14">
              <div className="grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-20">
                <SolveColumn />
                <PurposeColumn />
              </div>
            </div>
          </div>
        </section>
      </SiteShell>
    </div>
  );
}
