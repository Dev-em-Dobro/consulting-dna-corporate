import { pillarIcon } from "@/components/solutions/SolutionPillars";
import Reveal from "@/components/Reveal";
import type { ServiceEntryPoints } from "@/lib/services";

/**
 * "WHERE WE TYPICALLY ENTER" — a faixa rosa do layout de Family Business
 * Consulting (24-09).
 *
 * Oito gatilhos com ícone e rótulo à esquerda; à direita, atrás de um fio
 * vermelho, as duas linhas do fecho ("The transition may begin with one
 * person." / "But its consequences ripple through the family and the
 * business.").
 *
 * ⚠️ NÃO É O `SolutionPillars`, e vale a distinção antes de alguém unificar os
 * dois. Aquela fileira ocupa a largura inteira sob o bloco "How we work" e
 * enumera o que o serviço FAZ; esta divide a faixa com uma coluna de texto e
 * enumera o que acontece com o CLIENTE — é parente da grade de
 * `SolutionInflectionPoints`, não da fileira de pilares. Fundir as duas
 * obrigaria o `SolutionPillars` a ganhar uma prop de coluna lateral que
 * nenhuma das outras nove páginas usaria.
 *
 * ⚠️ O CAMPO DE COR É `brand/5` E NÃO UM ROSA NOVO. O layout pinta a faixa de
 * um rosa muito lavado, que é o vermelho da marca a baixa opacidade — o mesmo
 * recurso do disco dos ícones em `SolutionSteps` (`brand/10`). Cravar o hex do
 * arquivo criaria uma cor que nenhuma outra página tem.
 *
 * ⚠️ OS ÍCONES VÊM DO MAPA DE `SolutionPillars`, via `pillarIcon`, casando pelo
 * rótulo exato. Rótulo sem linha no mapa cai no círculo de fallback.
 */
export default function SolutionEntryPoints({
  item,
}: {
  item?: ServiceEntryPoints;
}) {
  const points = (item?.items ?? []).filter((p) => p.trim());
  if (!item || points.length === 0) return null;

  return (
    <section className="bg-brand/5">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-20">
        {item.label?.trim() ? (
          <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
            {item.label}
          </p>
        ) : null}

        {/* A COLUNA DE TEXTO É A MENOR (2,6 contra 1), que é a proporção do
            desenho: oito células lado a lado pedem quase toda a largura, e o
            fecho são duas frases curtas. */}
        <Reveal
          className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)] lg:gap-12 ${
            item.label?.trim() ? "mt-10" : ""
          }`}
        >
          {/* `divide-brand/15` e não `divide-line`: sobre o campo rosa o filete
              cinza claro desaparece. Abaixo de `lg` os filetes somem junto com
              a fileira única, pela conta do traço órfão do `SolutionPillars`. */}
          <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-[repeat(auto-fit,minmax(104px,1fr))] lg:gap-x-0 lg:divide-x lg:divide-brand/15">
            {points.map((point) => {
              const Icon = pillarIcon(point);
              return (
                <li key={point} className="text-center lg:px-3">
                  {/* DECORATIVO: o rótulo logo abaixo diz a mesma coisa. */}
                  <Icon
                    aria-hidden
                    size={32}
                    strokeWidth={1.5}
                    className="mx-auto block text-brand"
                  />
                  <p className="mt-3 text-[13px] font-medium leading-[1.3] text-ink md:text-[14px]">
                    {point}
                  </p>
                </li>
              );
            })}
          </ul>

          {/* O FIO VERMELHO À ESQUERDA DO FECHO é o que o layout desenha, e é
              a mesma régua de 2px que abre as seções — virada de pé. */}
          <div className="border-l-2 border-brand pl-6">
            <p className="font-serif text-[19px] font-semibold leading-[1.3] text-ink md:text-[21px]">
              {item.noteLead}
            </p>
            <p className="mt-2 font-serif text-[19px] font-semibold leading-[1.3] text-brand md:text-[21px]">
              {item.noteAccent}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
