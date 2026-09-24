import {
  ArrowRight,
  FileText,
  Laptop,
  MessageCircle,
  Smartphone,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import type { ServiceStep } from "@/lib/services";

/**
 * A FILEIRA DE PASSOS DE "HOW WE WORK" — o percurso de seis etapas do layout de
 * Manager Development (`docs/meetings/manager-development-24-09.jpeg`, 24-09).
 *
 * Cada passo é: um disco rosa claro com o ícone, o título em negrito e a
 * descrição. Entre um passo e o seguinte, uma seta vermelha apontando para a
 * direita.
 *
 * ⛔ O NUMERAL SAIU EM 24-09, a pedido: *"na seção How we work pode tirar os
 * numeros"*. Era um disco vermelho cheio com o número em branco, encostado no
 * canto superior esquerdo do disco do ícone, como o layout desenha.
 *
 * ⚠️ O `<ol>` FICA, e isto não é descuido. A lista continua sendo uma
 * SEQUÊNCIA — é o que as setas dizem visualmente, e é o que o `<ol>` diz a quem
 * usa leitor de tela ("item 1 de 6"). Tirar o numeral tirou a marcação VISUAL
 * da ordem; trocar para `<ul>` tiraria a ordem de vez, para quem só tem o
 * texto. O numeral era `aria-hidden` justamente porque o `<ol>` já dizia aquilo.
 *
 * ============================================================================
 * ⚠️ ISTO NÃO É O `SolutionPillars`, E A DIFERENÇA É DE SIGNIFICADO
 * ============================================================================
 * Aquela fileira é uma LISTA: itens de igual peso, sem ordem, separados por
 * filetes. Esta é uma SEQUÊNCIA: as setas encadeiam um passo ao seguinte, e o
 * `<ol>` diz o mesmo a quem usa leitor de tela. Reordenar a lista de lá muda a ordem de leitura; reordenar a
 * de cá muda o que a CDNA afirma que acontece primeiro.
 *
 * Por isso os dois convivem, e por isso `steps` tem precedência sobre
 * `practices`/`pillars` em `SolutionView`: uma página não mostra as duas.
 *
 * ⚠️ AS SETAS SÓ EXISTEM A PARTIR DE `lg`. Abaixo disso a grade quebra em duas
 * ou três fileiras, e a seta do primeiro item de cada fileira nova apontaria
 * para o vazio à esquerda. É a mesma armadilha que o filete do `SolutionPillars`
 * tem, e a mesma solução.
 */
const STEP_ICONS: Record<string, LucideIcon> = {
  /* AS CHAVES SÃO GENÉRICAS ("people", "laptop") e não o nome do passo, ao
     contrário do mapa de `SolutionPillars`, que casa pelo rótulo exato. A razão
     é que aqui o dado JÁ diz qual ícone quer — os passos do layout não têm
     relação óbvia entre título e glifo ("Habit nudges" é um telefone), então
     derivar do texto seria adivinhar. */
  people: Users,
  peers: UsersRound,
  laptop: Laptop,
  speech: MessageCircle,
  document: FileText,
  phone: Smartphone,
};

export default function SolutionSteps({ items }: { items?: ServiceStep[] }) {
  const steps = (items ?? []).filter((s) => s.title.trim());
  if (steps.length === 0) return null;

  return (
    /* `bg-paper`, como a fileira de pilares: a faixa quente começa no rótulo
       "How we work" e só termina depois desta lista, sem emenda entre as duas.
       É o que o layout mostra. */
    <section className="bg-paper">
      <Reveal className="mx-auto max-w-[1440px] px-6 pb-20 md:px-10 md:pb-24">
        <ol className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))] lg:gap-x-0">
          {steps.map((step, i) => {
            const Icon = step.icon ? STEP_ICONS[step.icon] : undefined;
            return (
              <li key={`${step.title}-${i}`} className="relative text-center lg:px-4">
                {/* A SETA LIGA ESTE PASSO AO ANTERIOR, então não existe no
                    primeiro.

                    ⚠️ `top-7` E NÃO `top-1/2`: ela se alinha ao CENTRO do disco
                    do ícone, que mede 56px e começa no topo da célula — 28px é
                    a metade dele. Centrada na CÉLULA a seta desceria para o
                    meio da descrição, e como as descrições têm uma, duas ou
                    três linhas, as cinco setas sairiam em alturas diferentes.

                    ⚠️ ERA `top-9` ATÉ O NUMERAL SAIR, em 24-09: o disco do
                    ícone começava 8px abaixo, empurrado pelo disco do número.
                    Tirar o numeral sem mexer aqui deixaria as setas 8px baixas
                    — a conta anda junto com a altura do que está acima. */}
                {i > 0 ? (
                  <ArrowRight
                    aria-hidden
                    size={20}
                    strokeWidth={2}
                    className="absolute left-0 top-7 hidden -translate-x-1/2 -translate-y-1/2 text-brand lg:block"
                  />
                ) : null}

                {/* ⚠️ O `relative` SAIU COM O NUMERAL: ele existia só para
                    ancorar o disco do número, que era `absolute`. A seta, que
                    também é `absolute`, se ancora no `<li>` e não aqui. */}
                <div className="mx-auto h-14 w-14">
                  {/* O DISCO DO ÍCONE é rosa muito claro (`brand/10`) com o
                      glifo em `brand`. No layout ele é um círculo de fundo
                      lavado — o mesmo recurso do visto das trilhas, invertido:
                      lá o disco é cheio e o glifo é branco. */}
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
                    {Icon ? (
                      <Icon aria-hidden size={26} strokeWidth={1.5} className="text-brand" />
                    ) : null}
                  </span>
                </div>

                <p className="mt-4 text-[14px] font-semibold leading-[1.3] text-ink md:text-[15px]">
                  {step.title}
                </p>
                {step.body && (
                  <p className="mx-auto mt-2 max-w-[22ch] font-serif text-[13px] leading-[1.4] text-ink/70 md:text-[14px]">
                    {step.body}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </Reveal>
    </section>
  );
}
