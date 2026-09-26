import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { ServiceShifts } from "@/lib/services";

/**
 * A COLUNA "WHAT SHIFTS" — layout do Talent Development, 24-09.
 *
 * Uma lista de pares "de → para": o que o talento é hoje à esquerda, o que ele
 * passa a ser à direita, com uma seta vermelha entre os dois.
 *
 * ⚠️ NO LAYOUT ELA É UMA COLUNA AO LADO DO "HOW WE WORK", e aqui é uma FAIXA
 * PRÓPRIA logo abaixo dele. A troca é deliberada e vale saber o que se ganhou e
 * o que se perdeu. Perdeu-se a leitura simultânea: no desenho o olho compara os
 * sete passos com os sete deslocamentos sem rolar. Ganhou-se o telefone — a
 * fileira de passos já é uma grade de sete células que quebra em duas colunas
 * em tela estreita, e espremer os pares ao lado dela obrigaria uma terceira
 * quebra, com os dois blocos disputando a mesma largura em todo tamanho
 * intermediário. A faixa própria dá largura cheia aos dois.
 *
 * ⚠️ A SETA É DECORATIVA E A PALAVRA "to" NÃO. O par é lido por quem usa leitor
 * de tela como "Potential to Demonstrated readiness" — sem a palavra escondida,
 * a lista sairia como uma sequência de substantivos soltos, que é justamente o
 * que a seta evita para quem enxerga.
 */
export default function SolutionShifts({ item }: { item?: ServiceShifts }) {
  const pairs = (item?.items ?? []).filter((p) => p.from.trim() && p.to.trim());
  if (!item || pairs.length === 0) return null;

  return (
    /* `paper` PORQUE A FILEIRA DE PASSOS ACIMA É `paper`: as duas faixas são o
       mesmo assunto ("como trabalhamos" e "o que muda"), e um degrau de fundo
       entre elas as separaria em dois blocos sem relação. O degrau volta na
       faixa de evidência, que é branca. */
    <section className="bg-paper">
      <Reveal className="mx-auto max-w-[1440px] px-6 pb-20 md:px-10 md:pb-24">
        {item.label?.trim() ? (
          <p className="text-[14px] font-medium uppercase tracking-[1.3px] text-brand">
            {item.label}
          </p>
        ) : null}

        {/* DUAS COLUNAS DE PARES A PARTIR DE `md`, e não uma lista longa: são
            sete linhas curtas, e numa coluna só elas desenhariam uma tira
            estreita no meio de uma faixa de 1440. O `auto-fit` não serve aqui
            porque as duas metades precisam da MESMA largura para as setas
            ficarem alinhadas entre si. */}
        <ul
          className={`grid grid-cols-1 gap-x-14 gap-y-4 md:grid-cols-2 ${
            item.label?.trim() ? "mt-10" : ""
          }`}
        >
          {pairs.map((pair) => (
            <li
              key={`${pair.from}-${pair.to}`}
              /* `items-start` E NÃO `items-center`: o lado direito tem frases
                 de duas linhas ("Leading through real business challenges") e o
                 esquerdo quase sempre uma. Centrado, a seta desceria para o
                 meio da frase mais alta e as sete sairiam em alturas
                 diferentes. O filete de baixo é o que separa um par do
                 seguinte — no layout as linhas são finas e cinzas. */
              className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-3 border-b border-line pb-4"
            >
              <span className="font-serif text-[15px] leading-[1.4] text-muted md:text-[16px]">
                {pair.from}
              </span>
              <ArrowRight
                aria-hidden
                size={18}
                strokeWidth={2}
                className="mt-1 shrink-0 text-brand"
              />
              <span className="font-serif text-[15px] leading-[1.4] text-ink md:text-[16px]">
                {/* A PALAVRA QUE A SETA DESENHA — ver a caixa no topo. */}
                <span className="sr-only">to </span>
                {pair.to}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
