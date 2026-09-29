import Image from "next/image";
import { Check } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { ServicePathway } from "@/lib/services";

/**
 * AS TRILHAS — os cartões horizontais de "What we do" no layout de Manager
 * Development (`docs/meetings/manager-development-24-09.jpeg`, 24-09).
 *
 * Cada cartão é foto à esquerda e conteúdo à direita, sobre um campo claro:
 * rótulo vermelho em caixa alta, título em serifa, uma linha de apoio e a lista
 * de itens com visto, em duas colunas.
 *
 * ============================================================================
 * ⚠️ ISTO NÃO É O `SolutionAudiences`, E A DIFERENÇA NÃO É SÓ DE FORMA
 * ============================================================================
 * Os cartões de público da Senior Leadership Development são TRÊS, verticais,
 * com a foto em cima e o nome do público sobreposto nela — eles respondem "a
 * quem o serviço se destina". Estes são DOIS, horizontais, e respondem "o que
 * você recebe": a lista de itens é o conteúdo da trilha, e ela não existe
 * naquele componente.
 *
 * Tentar servir os dois desenhos com um componente só daria um arquivo com dois
 * modos que não compartilham nem o eixo (vertical contra horizontal) nem as
 * peças (sobreposição na foto contra lista com visto). São dois.
 *
 * ⚠️ O FUNDO É `paper` SOBRE BRANCO, como os cartões de público. No layout o
 * campo dos cartões é um rosa muito claro, mais quente que o nosso `paper` — a
 * razão de não termos trocado o token por causa de um desenho está na caixa de
 * `tone`, em `SolutionSection`, e vale igual aqui.
 *
 * ⚠️ SEM PADDING NO TOPO: a emenda com o "What we do" é o `pb` daquele bloco, e
 * mais nada. Os cartões pertencem visivelmente ao bloco de cima, e é por isso
 * que dividem a faixa branca com ele em vez de ganharem fundo próprio.
 *
 * Lista vazia (ou ausente) não renderiza nada — a mesma guarda dos pilares e da
 * evidência.
 */
export default function SolutionPathways({ items }: { items?: ServicePathway[] }) {
  const pathways = (items ?? []).filter((p) => p.label.trim() && p.title.trim());
  if (pathways.length === 0) return null;

  return (
    <section className="bg-white">
      {/* ⚠️ O `pb` ENCOLHEU EM 24-09, a pedido: *"o espaço da secao The manager
          moments that matter e da de cima ficou muito grande"*. Era `pb-20
          md:pb-24`, e SOMAVA com o `pt` da faixa de momentos logo abaixo — as
          duas são brancas, então o leitor via um vão de 144 a 176px entre o
          último cartão e o rótulo seguinte, contra os ~40px do layout.

          ⚠️ O CONSERTO É NOS DOIS LADOS: aqui o `pb` caiu e lá o `pt` sumiu.
          Mexer só num deles deixaria o vão pela metade do erro. */}
      <div className="mx-auto max-w-[1440px] px-6 pb-12 md:px-10 md:pb-16">
        <Reveal className="flex flex-col gap-6">
          {pathways.map((p) => {
            /* A DIVISÃO EM DUAS COLUNAS É DO COMPONENTE, e não do dado: o
               layout quebra a lista pela metade, com a sobra na primeira
               coluna (cinco itens saem 3 + 2). `Math.ceil` é exatamente isso.
               Guardar a divisão no dado obrigaria quem editasse a lista a
               reequilibrar as colunas à mão. */
            const corte = Math.ceil(p.items.length / 2);
            const colunas = [p.items.slice(0, corte), p.items.slice(corte)].filter(
              (c) => c.length > 0,
            );
            return (
              <article
                key={p.label}
                /* ⚠️ 40% / 60%, a pedido de 24-09 — antes a foto era uma coluna
                   FIXA de 320px, o que a 1440 dava 22% e a 900 dava 36%: a
                   proporção mudava com a janela. `2fr_3fr` é 40% em qualquer
                   largura, que é o que foi pedido. */
                className="grid grid-cols-1 overflow-hidden bg-paper md:grid-cols-[2fr_3fr]"
              >
                {p.image ? (
                  /* `aspect` SÓ ABAIXO DE `md`: empilhada, a foto precisa de uma
                     altura própria ou colapsa; ao lado do texto ela deve ter a
                     altura da COLUNA DE TEXTO, que muda com o número de itens —
                     daí `md:h-full` com `fill`, que é o que o layout mostra
                     (as duas fotos têm alturas diferentes, acompanhando os
                     cartões). */
                  <div className="relative aspect-[4/3] w-full bg-ink md:aspect-auto md:h-full">
                    <Image
                      src={p.image}
                      alt=""
                      /* `alt=""` porque a foto é ATMOSFERA: o que identifica o
                         cartão é o rótulo ao lado, em texto. Mesma regra do
                         `ServiceCard` e do `SolutionAudiences`. */
                      fill
                      sizes="(min-width: 768px) 40vw, 100vw"
                      className="object-cover object-center"
                    />
                  </div>
                ) : (
                  /* CAMPO DE COR PARA QUEM NÃO TEM FOTO, o mesmo recurso do
                     `ServiceCard` desde 12-09: não fica brega, não depende de
                     arquivo que não existe, e é diferente em cada cartão de
                     graça, porque o que preenche o quadro é o rótulo. */
                  <div
                    aria-hidden
                    className="relative flex aspect-[4/3] w-full items-end bg-ink p-6 font-serif text-[26px] font-semibold uppercase leading-[1.05] text-white/15 md:aspect-auto md:h-full"
                  >
                    {p.label}
                  </div>
                )}

                <div className="p-7 md:p-9">
                  <p className="text-[13px] font-bold uppercase tracking-[1.3px] text-brand">
                    {p.label}
                  </p>
                  {/* `h3` SOB O `h2` do "What we do": os cartões pertencem
                      àquele bloco, e a escada de cabeçalhos segue inteira. */}
                  <h3 className="mt-3 font-serif text-[22px] font-semibold leading-[1.2] tracking-[-0.2px] text-ink md:text-[26px]">
                    {p.title}
                  </h3>
                  <p className="mt-3 font-serif text-[16px] leading-[1.55] text-ink/75 md:text-[17px]">
                    {p.body}
                  </p>

                  {p.items.length > 0 && (
                    /* O FILETE ENTRE AS COLUNAS É `divide-x`, e o `md:gap-x-0`
                       anda junto com ele pela mesma razão do `SolutionPillars`:
                       com calha, a borda nasce colada à borda esquerda da
                       segunda coluna e a calha inteira fica de um lado só — o
                       traço deixa de estar ENTRE as duas. O respiro vem do
                       `md:px-6` de cada coluna. */
                    <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-0 sm:grid-cols-2 md:gap-x-0 md:divide-x md:divide-line">
                      {colunas.map((coluna, i) => (
                        <ul key={i} className={`space-y-3 ${i > 0 ? "md:pl-6" : "md:pr-6"}`}>
                          {coluna.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                              {/* O VISTO É UM DISCO VERMELHO COM O GLIFO BRANCO
                                  DENTRO, e não o `CircleCheck` do lucide: aquele
                                  desenha o círculo em TRAÇO, e o layout mostra o
                                  círculo CHEIO. Disco em `bg-brand` mais um
                                  `Check` branco é o que reproduz o desenho, e de
                                  quebra o glifo fica mais legível a 12px do que
                                  ficaria dentro de um círculo traçado.

                                  `shrink-0` porque o rótulo quebra em duas
                                  linhas em vários itens ("Accountability without
                                  micromanagement") e sem ele o disco achata.

                                  `mt-[3px]` alinha o disco à primeira LINHA do
                                  texto, e não ao centro do bloco: com
                                  `items-start` e alturas diferentes, centrar
                                  faria o disco descer em uns itens e não em
                                  outros. */}
                              <span
                                aria-hidden
                                className="mt-[3px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand"
                              >
                                <Check size={12} strokeWidth={3} className="text-white" />
                              </span>
                              <span className="font-serif text-[15px] leading-[1.45] text-ink md:text-[16px]">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
