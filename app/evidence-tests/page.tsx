/**
 * ⚠️ PÁGINA DESCARTÁVEL — cards do bloco Evidence, quatro iguais.
 *
 * Quarta rodada. As anteriores testaram tratamentos gerais e depois a grade
 * assimétrica com um número em destaque. A assimétrica foi DESCARTADA em 10-09
 * pelo motivo certo: "um dado maior que os outros pode parecer que ele é mais
 * importante e acho que não é a ideia". Os quatro voltam a ter o mesmo peso.
 *
 * ⚠️ ISSO REABRE UMA TENSÃO, e vale escrever. Foi montando a assimétrica que se
 * descobriu que o `.slice(0, 4)` estava jogando fora o `Impact` — o único dos
 * cinco que responde "funcionou?", contra quatro que respondem "quanto foi
 * grande?". O outline de Services faz essa crítica em letra sobre o Heineken:
 * "The figures are scale, not impact... Heineken needs one number that says what
 * changed." Com os quatro iguais, o Impact continua aparecendo (a correção da
 * ordem fica), mas volta a ter o mesmo peso visual dos números de escala.
 *
 * A REFERÊNCIA de estilo é `card ref services.png`: canto bem arredondado,
 * preenchimento em gradiente diagonal, ícone num badge quadrado arredondado no
 * topo, número grande e rótulo pequeno embaixo. O original é azul; aqui as
 * variações são em vermelho e preto, como pedido.
 *
 * OS ÍCONES seguem a gramática que a /about já usa (StatIcon e ValueIcon):
 * contorno sem preenchimento, canto e junta arredondados, traço 1,75 num quadro
 * de 24, `stroke="currentColor"`. São desenhados aqui pelo mesmo motivo de lá —
 * o site não tem biblioteca de ícones, e instalar uma por causa de uma página de
 * teste seria pôr dependência no `package.json` do site inteiro.
 */
import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { editorialFontClass, editorialFontVars } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Evidence tests",
  robots: { index: false, follow: false },
};

const CASE = "HEINEKEN";
const SLUG = "heineken";

/** Os quatro fatos, com o Impact liderando — a ordem que o componente já usa. */
const FACTS = [
  { icon: "target", label: "Impact", value: "45% higher promotion rate" },
  { icon: "globe", label: "Countries", value: "12" },
  { icon: "people", label: "Participants / Leaders", value: "450 leaders" },
  { icon: "chart", label: "Reach / Scale", value: "Global · 4 regions" },
];

function Icon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    target: (
      <>
        <circle cx="12" cy="12" r="8.4" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 12 20.6 3.4" />
        <path d="M15.8 3.4h4.8v4.8" />
      </>
    ),
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
      className="h-[22px] w-[22px]"
    >
      {paths[name]}
    </svg>
  );
}

function Tag({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-50 bg-black px-5 py-3 text-[12px] font-semibold uppercase tracking-[2px] text-white">
      {id} · {children}
    </div>
  );
}

function StoryLink() {
  return (
    <Link
      href={`/cases/${SLUG}`}
      className="mt-12 inline-flex items-center gap-2 border-b border-brand-light/50 pb-1 text-[14px] font-medium uppercase tracking-[1.3px] text-brand-light transition-colors hover:border-brand-light hover:text-white md:mt-14"
    >
      Read the client story <span aria-hidden>→</span>
    </Link>
  );
}

/**
 * Um card. `gradient` é o preenchimento; `badge` é o fundo do quadrado do ícone.
 *
 * ⚠️ `items-start` E `min-h` NO GRID, não aqui: os quatro valores têm
 * comprimentos muito diferentes ("12" contra "45% higher promotion rate"), e
 * sem altura mínima comum os cards saem de tamanhos diferentes — que é
 * exatamente o que a rodada anterior foi descartada por sugerir.
 */
function Card({
  fact,
  gradient,
  badge,
  border = "border-white/10",
}: {
  fact: (typeof FACTS)[number];
  gradient: string;
  badge: string;
  border?: string;
}) {
  return (
    <div
      className={`flex min-h-[230px] flex-col rounded-2xl border p-7 text-white md:p-8 ${border}`}
      style={{ backgroundImage: gradient }}
    >
      <span
        className={`mb-7 inline-flex h-11 w-11 items-center justify-center rounded-xl ${badge}`}
      >
        <Icon name={fact.icon} />
      </span>
      {/* `mt-auto` empurra número e rótulo para a base, então eles alinham entre
          os quatro cards mesmo com o ícone no topo e alturas de texto
          diferentes. É o que a referência faz. */}
      <div className="mt-auto">
        <div className="text-[24px] font-semibold leading-[1.12] tracking-[-0.5px] md:text-[27px]">
          {fact.value}
        </div>
        <div className="mt-2 font-serif text-[13px] leading-[1.45] text-white/70 md:text-[14px]">
          {fact.label}
        </div>
      </div>
    </div>
  );
}

function Block({
  bg,
  gradient,
  badge,
  border,
}: {
  bg: string;
  gradient: string;
  badge: string;
  border?: string;
}) {
  return (
    <section className={bg}>
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand-light">
          Evidence
        </p>
        <h2 className="font-serif mt-5 text-[30px] font-semibold leading-[1.15] tracking-[-0.2px] text-white md:text-[38px]">
          {CASE}
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {FACTS.map((f) => (
            <Card key={f.label} fact={f} gradient={gradient} badge={badge} border={border} />
          ))}
        </div>
        <StoryLink />
      </div>
    </section>
  );
}

export default function EvidenceTestsPage() {
  return (
    <div className={`${editorialFontClass} font-sans`} style={editorialFontVars}>
      <SiteShell floatingNav>
        <div className="h-[76px] bg-ink" />

        <Tag id="1">sóbrio — sem gradiente, só borda e preenchimento leve</Tag>
        <Block
          bg="bg-ink"
          gradient="linear-gradient(160deg, rgba(255,255,255,.07), rgba(255,255,255,.02))"
          badge="bg-white/10 text-brand-light"
          border="border-white/12"
        />

        <Tag id="2">vermelho da marca — gradiente diagonal, como a referência</Tag>
        <Block
          bg="bg-ink"
          gradient="linear-gradient(150deg, #e0503f 0%, #c93a30 45%, #96281f 100%)"
          badge="bg-white/18 text-white"
          border="border-white/15"
        />

        <Tag id="3">carvão — o mesmo efeito em preto</Tag>
        <Block
          bg="bg-ink-2"
          gradient="linear-gradient(150deg, #4a4244 0%, #332d2f 45%, #1e1a1b 100%)"
          badge="bg-brand/25 text-brand-light"
          border="border-white/12"
        />

        <Tag id="4">vinho — vermelho profundo, menos saturado</Tag>
        <Block
          bg="bg-ink"
          gradient="linear-gradient(150deg, #8f3a33 0%, #6d2822 50%, #431714 100%)"
          badge="bg-white/15 text-white"
          border="border-white/12"
        />

        <Tag id="5">carvão → vermelho — o duotone do herói, aplicado ao card</Tag>
        <Block
          bg="bg-ink-2"
          gradient="linear-gradient(145deg, #3a3436 0%, #5c2b28 55%, #a33a2e 100%)"
          badge="bg-white/15 text-white"
          border="border-white/12"
        />

        <Tag id="6">preto quase puro — o mais sóbrio dos escuros</Tag>
        <Block
          bg="bg-ink"
          gradient="linear-gradient(155deg, #2a2527 0%, #1b1819 55%, #121011 100%)"
          badge="bg-brand text-white"
          border="border-white/10"
        />
      </SiteShell>
    </div>
  );
}
