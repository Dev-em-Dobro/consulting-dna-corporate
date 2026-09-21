import { BarChart3, Circle, Compass, Lightbulb, type LucideIcon } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { ServicePractices } from "@/lib/services";

/**
 * A TIRA QUE SUBSTITUIU O BLOCO "HOW WE WORK" — 21-09, segunda revisão.
 *
 * A referência é `docs/meetings/secao-atualizada-our-work.jpg`, a segunda das
 * duas imagens que a anotação da call menciona. Ela chegou junto com a primeira
 * mas passou despercebida, então o re-layout foi construído só sobre a outra; o
 * pedido de agora é literal: *"a seção How we work tem que ser assim"*.
 *
 * O QUE SAIU, e vale estar escrito porque some da tela sem deixar rastro: o
 * bloco de DUAS COLUNAS com o rótulo "How we work" (manchete em serifa à
 * esquerda, dois parágrafos à direita) e a FILEIRA DE OITO ÍCONES do primeiro
 * mockup. No lugar dos dois entra esta tira. A copy do bloco
 * que saiu continua em `lib/services.ts`, nos campos `howWeWork*`, e volta a
 * aparecer sozinha se `practices` sair do serviço.
 *
 * ⚠️ O ÍCONE FICA À ESQUERDA DO RÓTULO, e não acima dele. É a diferença de
 * desenho entre esta tira e o `SolutionPillars`, que continua servindo os nove
 * serviços sem copy nova — lá cada item é uma coluna centrada com o ícone em
 * cima. Aqui as células são horizontais, o que é o que permite caber "Moments
 * that matter in the flow of work" em duas linhas curtas ao lado do ícone sem
 * a célula ficar três vezes mais alta que as vizinhas.
 *
 * ⚠️ POR QUE UM COMPONENTE NOVO E NÃO UMA PROP NO `SolutionPillars`: o que muda
 * não é um detalhe de estilo. Muda o eixo de cada célula (vertical → horizontal)
 * e muda a origem do dado
 * (`pillars`, que são as palavras da frase de `howWeHelp`, → `practices`, que
 * são outra pergunta; ver a caixa de `ServicePractices`). Uma prop que troque
 * as três coisas ao mesmo tempo é um segundo componente escondido dentro do
 * primeiro, e os nove serviços que continuam no desenho antigo passariam a
 * depender de um arquivo que só existe para servir o décimo.
 *
 * `bg-paper` PELO MESMO MOTIVO DE ANTES: na imagem a tira é a faixa quente que
 * fecha a região dos cartões, e não uma seção nova. O corte de verdade vem
 * depois, no divisor "Featured case study".
 *
 * ⛔ O RÓTULO "A COMMON OUTCOME" SAIU EM 21-09, a pedido: *"na seção A common
 * outcome pode tirar essa frase e deixar só os ícones"*. Ele era a primeira
 * célula da tira — vermelho, sem ícone, `shrink-0` à esquerda — e nomeava o
 * que as três práticas à direita tinham em comum. A tira passou de quatro
 * células para três, e as três dividem a faixa inteira.
 *
 * O campo `lead` saiu junto, de `ServicePractices` e do dado. NÃO ficou como
 * opcional nunca usado: campo que ninguém preenche é a pergunta "isto ainda
 * vale?" deixada para a próxima pessoa. Para devolvê-lo são o campo, um `<li>`
 * com `md:shrink-0 md:pr-6` e o texto em `text-brand`.
 *
 * AUSENTE OU VAZIA NÃO RENDERIZA NADA, a régua do resto das páginas de serviço.
 */

/**
 * Rótulo → ícone. Os três do desenho, lidos dele: bússola em "Habits", lâmpada
 * em "Identity", barras em "Moments that matter in the flow of work".
 *
 * Mapa fechado, como o do `SolutionPillars`, e pelo mesmo motivo: os rótulos são
 * palavras da cliente, então rótulo novo só aparece quando o texto dela muda. O
 * que não estiver aqui cai no círculo do `FALLBACK_ICON` — a tira continua de
 * pé e o círculo é o aviso visual de que faltou uma linha.
 */
const PRACTICE_ICONS: Record<string, LucideIcon> = {
  Habits: Compass,
  Identity: Lightbulb,
  "Moments that matter in the flow of work": BarChart3,
};

const FALLBACK_ICON = Circle;

export default function SolutionPractices({
  practices,
}: {
  practices?: ServicePractices;
}) {
  const items = (practices?.items ?? []).filter((i) => i.trim());
  if (items.length === 0) return null;

  return (
    <section className="bg-paper">
      {/* MAIS BAIXA QUE AS OUTRAS SEÇÕES (`py-10 md:py-12` contra `py-20
          md:py-24`), e é medida do desenho, não economia: na imagem esta tira
          tem cerca de um sexto da altura do bloco de cartões acima dela. Ela é
          um rodapé da região, não um bloco de conteúdo — dar a ela o respiro
          das outras seções a promoveria a uma coisa que o desenho não quis. */}
      <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-10 md:py-12">
        {/* `stagger={false}`: as células entram juntas. Escaloná-las numa
            tira horizontal de uma linha faz o olho ler uma esteira, e não um
            conjunto — é o mesmo argumento do `SolutionClosing`. */}
        <Reveal stagger={false}>
          {/* OS FILETES SEPARAM AS CÉLULAS, e `divide-x` os põe em todo filho
              menos o primeiro — exatamente onde o desenho os mostra.

              ⚠️ `md:gap-x-0` ANDA JUNTO COM O `md:divide-x`, e esquecê-lo é o
              erro óbvio: com calha, a borda nasce colada à borda esquerda da
              célula e a calha inteira fica de um lado só dela. Sem calha, o
              respiro vem do `md:px-6` de cada célula e o traço cai no meio. É a
              mesma armadilha que o `SolutionPillars` documenta.

              ABAIXO DE `md` A TIRA EMPILHA E OS FILETES SOMEM, pelo motivo que o
              `SolutionPillars` já registra: fora de uma linha única o `divide-x`
              desenha um traço órfão no primeiro item de cada linha nova, onde
              não há vizinho à esquerda para separar.

              UMA COLUNA, e não duas. Eram duas enquanto a tira tinha QUATRO
              células (o rótulo mais três práticas), quando 2+2 fechava certo;
              com três, a mesma classe entrega 2+1 e deixa a última sozinha,
              torta. */}
          <ul className="grid grid-cols-1 gap-y-8 md:flex md:items-center md:gap-x-0 md:divide-x md:divide-line">
            {items.map((item) => {
              const Icon = PRACTICE_ICONS[item] ?? FALLBACK_ICON;
              return (
                <li
                  key={item}
                  /* `md:flex-1` DÁ ÀS TRÊS A MESMA LARGURA. No desenho elas não
                     têm — a terceira é bem mais larga —, mas as calhas entre os
                     filetes são regulares, e é isso que a divisão igual
                     preserva. Com colunas de conteúdo, "Habits" ficaria com um
                     terço da largura de "Moments that matter…" e os filetes
                     deixariam de marcar ritmo.

                     Antes de 21-09 o `flex-1` dividia o que SOBRAVA depois do
                     rótulo "A common outcome", que era `shrink-0` à esquerda.
                     Sem ele, as três dividem a faixa inteira — a classe é a
                     mesma, o resultado é simétrico em vez de deslocado. */
                  className="flex items-center gap-x-3 md:flex-1 md:justify-center md:px-6"
                >
                  {/* DECORATIVO: o rótulo ao lado diz a mesma coisa, então
                      anunciar o ícone repetiria o item duas vezes. */}
                  <Icon
                    aria-hidden
                    /* 22 e não a medida literal do desenho: o lucide compõe num
                       quadro de 24 com folga interna, então o traço desenhado
                       sai menor que o número pedido. É a mesma correção que o
                       `SolutionPillars` documenta para os 40 dele. */
                    size={22}
                    strokeWidth={1.5}
                    className="shrink-0 text-brand"
                  />
                  <span className="text-[12px] font-semibold uppercase leading-[1.35] tracking-[2px] text-ink md:max-w-[18ch]">
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
