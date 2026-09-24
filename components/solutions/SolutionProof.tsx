import { CircleUser, Cog, TrendingUp, type LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { ServiceProof } from "@/lib/services";

/**
 * AS TRÊS PROVAS — o fecho do layout de Culture Transformation
 * (`docs/meetings/culture-transformation-24-09.jpeg`, 24-09).
 *
 * Três cartões `ink` sobre faixa branca. Cada um: um disco contornado com o
 * ícone, o título em caixa alta, uma linha em vermelho e o parágrafo.
 *
 * ============================================================================
 * ⚠️ O QUE ESTA FAIXA NÃO TEM, E POR QUE — É PEDIDO, NÃO RECORTE NOSSO
 * ============================================================================
 * No layout, esta região tem quatro peças: o rótulo "WE MAKE THE SHIFT
 * VISIBLE", uma manchete de duas colunas ("From culture intent to measurable
 * organisational change" com o parágrafo ao lado), os três cartões, e a fileira
 * "OUR MEASUREMENT JOURNEY" (BASELINE → 90 DAYS → 6 MONTHS → EMBED & SCALE).
 *
 * A cliente riscou a azul a manchete e a fileira, e a daily de 24-09 escreve as
 * duas instruções: *"apagar as partes em azul"* e *"no final, deixar só Behavior
 * proof, Operating proof e Business proof"*. Sobraram o rótulo e os cartões.
 *
 * ⚠️ O RÓTULO FICOU DE PROPÓSITO. O traço azul passa por baixo dele e corta a
 * manchete — no arquivo dá para ver que "WE MAKE THE SHIFT VISIBLE" está acima
 * da primeira linha de caneta. Sem ele os três cartões entrariam na página sem
 * nada que os anuncie, e a faixa perderia o único texto que diz do que ela
 * trata. É `label` no dado: quem discordar da leitura apaga o campo e o
 * componente para de desenhá-lo, sem tocar aqui.
 *
 * ⏳ A MANCHETE E A JORNADA NÃO FORAM TRANSCRITAS. Ao contrário dos dez
 * elementos do ecossistema — que estão guardados no dado porque o arquivo que
 * os carrega ainda vai chegar —, estas duas foram REMOVIDAS a pedido. Guardá-las
 * "por via das dúvidas" seria deixar no código copy que a cliente mandou tirar,
 * e o layout continua em `docs/meetings/` para quem precisar relê-las.
 */
const PROOF_ICONS: Record<string, LucideIcon> = {
  /* CHAVES GENÉRICAS, como no mapa de `SolutionSteps` e pelo mesmo motivo: o
     dado diz qual glifo quer, em vez de o componente adivinhar pelo título.

     ⚠️ OS TRÊS SÍMBOLOS SÃO OS DO LAYOUT — uma silhueta de pessoa, uma
     engrenagem e uma seta que sobe —, e a escolha deles é o começo do pedido de
     24-09 *"o mesmo ícone para o mesmo conceito em todas as páginas"*: pessoa =
     comportamento, engrenagem = processo, seta = resultado. Quando as outras
     páginas forem passadas a limpo, é este vocabulário que elas herdam. */
  person: CircleUser,
  process: Cog,
  growth: TrendingUp,
};

export default function SolutionProof({ proof }: { proof?: ServiceProof }) {
  const items = (proof?.items ?? []).filter((i) => i.title.trim());
  if (items.length === 0) return null;

  return (
    /* BRANCO, e não `paper`: no layout a faixa das provas divide o fundo com o
       que vem acima dela, e acima está a faixa `ink` do ecossistema. O degrau
       claro contra o escuro é o que separa as duas. */
    <section className="bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10 md:py-24">
        {proof?.label?.trim() ? (
          <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
            {proof.label}
          </p>
        ) : null}

        {/* `sm:grid-cols-3` como os cartões de público: três blocos de texto
            curto já cabem a 640px, e empilhá-los até 768 daria uma rolagem longa
            de caixas quase idênticas em tablet retrato.

            SEM `mt` QUANDO NÃO HÁ RÓTULO — `mt-10` é a distância do rótulo aos
            cartões, e sem ele o afastamento do topo é o `py` da seção. */}
        <Reveal
          className={`grid grid-cols-1 gap-6 sm:grid-cols-3 ${
            proof?.label?.trim() ? "mt-10" : ""
          }`}
        >
          {items.map((item) => {
            const Icon = item.icon ? PROOF_ICONS[item.icon] : undefined;
            return (
              /* `items-start` NO EIXO VERTICAL DO CARTÃO: no layout o ícone e o
                 texto começam na mesma linha de base do topo, e o cartão cresce
                 para baixo conforme o parágrafo. */
              <article
                key={item.title}
                className="flex gap-5 bg-ink p-7 md:gap-6 md:p-8"
              >
                {/* O DISCO É CONTORNADO E NÃO CHEIO, ao contrário do disco dos
                    passos em `SolutionSteps` — é o que o layout mostra, e a
                    diferença faz sentido: lá o disco rosa claro pousa sobre
                    fundo `paper`, aqui ele está sobre `ink` e um círculo cheio
                    viraria uma mancha.

                    `shrink-0` porque ele é medida fixa ao lado de um texto que
                    quebra: sem isso o flex o comprime no cartão mais estreito. */}
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/35 md:h-14 md:w-14">
                  {Icon ? (
                    <Icon
                      aria-hidden
                      size={24}
                      strokeWidth={1.5}
                      className="text-white"
                    />
                  ) : null}
                </span>

                <div>
                  {/* `h3` sob o `h2` que o ecossistema abre, mantendo a escada
                      de cabeçalhos — a mesma regra dos cartões de público. O
                      rótulo da faixa é um `<p>`, não um cabeçalho, então ele não
                      entra na conta. */}
                  <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.6px] text-white md:text-[17px]">
                    {item.title}
                  </h3>
                  {/* `brand-light` E NÃO `brand`: sobre `ink` o vermelho cheio
                     dá 2,87:1 e não passa na régua de contraste. Esta linha é
                     texto, não elemento gráfico, então a régua é a de 4,5:1 —
                     que o tom claro devolve. */}
                  <p className="mt-1 font-serif text-[15px] leading-[1.4] text-brand-light md:text-[16px]">
                    {item.subtitle}
                  </p>
                  <p className="mt-4 font-serif text-[14px] leading-[1.6] text-white/70 md:text-[15px]">
                    {item.body}
                  </p>
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
