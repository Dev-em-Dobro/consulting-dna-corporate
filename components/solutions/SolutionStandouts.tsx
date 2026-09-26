import { stepIcon } from "@/components/solutions/SolutionSteps";
import type { ServiceStep } from "@/lib/services";

/**
 * "WHY OUR COACHING STANDS OUT" — os quatro diferenciais que o layout do
 * Executive Coaching (24-09) desenha À DIREITA do "What we do", na mesma faixa
 * branca: rótulo vermelho, e uma fileira de quatro células com disco rosa,
 * título em caixa alta e descrição, separadas por filetes.
 *
 * Mora dentro do `SolutionSection` pela prop `aside`, e não numa faixa
 * própria: no desenho as duas metades são uma leitura só.
 *
 * ⚠️ OS FILETES SÓ EXISTEM A PARTIR DE `lg`, onde as quatro cabem numa linha.
 * Abaixo disso a grade quebra em 2×2 e a borda esquerda viraria um traço órfão
 * no começo da segunda linha.
 */
export default function SolutionStandouts({
  label,
  items,
}: {
  label?: string;
  items: ServiceStep[];
}) {
  const shown = items.filter((s) => s.title.trim());
  if (shown.length === 0) return null;

  return (
    <div>
      {label?.trim() ? (
        <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
          {label}
        </p>
      ) : null}
      <ul
        className={`grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-0 ${
          label?.trim() ? "mt-8" : ""
        }`}
      >
        {shown.map((item, i) => {
          const Icon = stepIcon(item.icon);
          return (
            <li
              key={item.title}
              className={`text-center lg:px-5 ${i > 0 ? "lg:border-l lg:border-line" : ""}`}
            >
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
                {/* DECORATIVO: o título logo abaixo diz a mesma coisa. */}
                {Icon ? (
                  <Icon aria-hidden size={30} strokeWidth={1.5} className="text-brand" />
                ) : null}
              </span>
              <h3 className="mt-5 text-[14px] font-semibold uppercase leading-[1.3] tracking-[0.4px] text-ink">
                {item.title}
              </h3>
              {item.body ? (
                <p className="mx-auto mt-3 max-w-[24ch] font-serif text-[14px] leading-[1.5] text-ink/70 md:text-[15px]">
                  {item.body}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
