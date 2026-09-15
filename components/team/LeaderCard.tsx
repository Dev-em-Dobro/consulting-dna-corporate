"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Leader } from "@/lib/team";

/**
 * O card de uma pessoa da liderança — REFEITO EM 14-09 sobre o mockup que a
 * Maliha subiu no Drive durante a daily (`docs/mockup-team-maliha-14-09-2026.png`,
 * item 16 da transcrição).
 *
 * O QUE MUDOU. A citação SAI DE BAIXO DO NOME e vai para O LADO do retrato, num
 * cartão claro com aspas vermelhas grandes. Debaixo da foto ficam só nome, cargo
 * e região — mais o botão "+" que o mockup desenha ali.
 *
 * ⚠️ CONTINUA TRÊS POR LINHA. O "um card por linha" foi SUGESTÃO do Guli na call
 * ("do you want it maybe just one person in each line?"), não pedido dela: ela
 * respondeu apontando para o próprio mockup, que é 3 por linha, e o
 * `CDNA_04_Team.docx` escreve "portrait grid, three across". O que muda é a
 * posição da quote, e só.
 *
 * ================================================================
 * POR QUE ISTO É CLIENT COMPONENT
 * ================================================================
 * Só por causa do "+". Ele não é enfeite do mockup: as quotes reais do bloco 2
 * do Word variam de 140 a 271 caracteres, e na coluna estreita do cartão isso é
 * a diferença entre 5 e 10 linhas — a fileira inteira passaria a ter a altura da
 * quote mais longa, com as outras duas vazias pela metade. Com o corte em 8
 * linhas os três cartões da fileira nascem do mesmo tamanho e o "+" abre o resto.
 *
 * E ELE SÓ APARECE QUANDO HÁ RESTO, o que é a razão de haver medição em vez de
 * um `if` no comprimento do texto: o mesmo cartão é estreito a 1440 (≈222px de
 * caixa) e largo abaixo disso, quando a quote passa para debaixo da foto e ocupa
 * a coluna inteira. A mesma frase corta num caso e não corta no outro, e um
 * botão que não faz nada é pior que botão nenhum. `scrollHeight > clientHeight`
 * responde isso no tamanho real, em qualquer breakpoint.
 *
 * ⏳ O QUE O "+" DEVERIA ABRIR AINDA NÃO EXISTE. No mockup ele fica na coluna do
 * retrato, ao lado do cargo, que é onde mora um "saiba mais sobre esta pessoa" —
 * e a bio de cada um não está no `CDNA_04_Team.docx` nem no CMS para estes seis
 * (o `PersonModal` da home lê `person.bio`, que é outra fonte). Enquanto não se
 * conversa com ela sobre isso, ele abre o que temos, que é a própria quote. Se a
 * resposta vier com bio, o botão troca de alvo e o layout não muda.
 */
export default function LeaderCard({ person }: { person: Leader }) {
  const [expanded, setExpanded] = useState(false);
  const [clipped, setClipped] = useState(false);
  const quoteRef = useRef<HTMLParagraphElement>(null);
  const quoteId = `quote-${person.name.toLowerCase().replace(/[^a-z]+/g, "-")}`;

  /* Só mede FECHADO: aberto não há `line-clamp`, então `scrollHeight` e
     `clientHeight` são iguais e a medição concluiria que não há corte —
     apagando o botão que acabou de ser usado. */
  const measure = useCallback(() => {
    const el = quoteRef.current;
    if (!el || expanded) return;
    setClipped(el.scrollHeight - el.clientHeight > 1);
  }, [expanded]);

  useEffect(() => {
    measure();
    const el = quoteRef.current;
    if (!el) return;

    /* DUAS FONTES DE REMEDIÇÃO, e as duas são necessárias:
       • O `ResizeObserver` pega a mudança de LARGURA — girar o telefone,
         arrastar a janela, e principalmente a virada em 1440, onde o cartão
         muda de coluna estreita para largura cheia.
       • `document.fonts.ready` pega a troca de ALTURA sem mudar largura, que é
         o que acontece quando a Source Serif substitui a fonte de sistema. O
         observer não dispara nesse caso (a caixa continua do mesmo tamanho) e o
         primeiro paint mediria a métrica errada. */
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [measure]);

  return (
    /* A VIRADA É EM 1440, e não num breakpoint do Tailwind, porque ela é de
       MEDIDA e não de dispositivo: em três colunas de uma página de 1440 cada
       card tem 432px, que partidos em retrato + quote dão ≈210 e ≈222 — o mínimo
       em que a quote ainda tem ~30 caracteres por linha. A 1280 a mesma conta dá
       ≈185px de caixa e a serifa passa a quebrar em 4 palavras por linha.

       Abaixo de 1440 o card volta a ser EMPILHADO (foto, nome, quote embaixo),
       que é o desenho que já estava no ar — só que a quote agora é o cartão
       claro em vez do filete à esquerda. O mockup é uma tela de 1440; é ali que
       ele se cumpre. */
    <article className="grid grid-cols-1 min-[1440px]:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
      <div className="flex flex-col">
        <div className="relative aspect-[4/5] overflow-hidden bg-paper">
          {person.portrait ? (
            <Image
              src={person.portrait}
              alt={`${person.name}, ${person.role}`}
              fill
              /* A coluna do retrato encolheu: era 1/3 da página e agora é ≈48%
                 de 1/3 acima de 1440. Os valores abaixo seguem a escada de
                 breakpoints deste card, não a da grade de antes. */
              sizes="(min-width: 1440px) 15vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              className={`object-cover ${person.portraitPosition ?? "object-center"}`}
            />
          ) : (
            /* Sem retrato — iniciais, e não um avatar genérico de silhueta: o
               card fica claramente à espera de uma foto em vez de fingir ter
               uma. */
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-serif text-[44px] font-semibold text-line">
                {person.name
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            </div>
          )}
        </div>

        {/* NOME, CARGO E REGIÃO EM TRÊS LINHAS, como o mockup — e não na linha
            única vermelha em caixa alta que estava aqui (`{role} · {region}`).
            Não é troca de gosto: "CEO, Founder, Author, Head of MENA · UAE" tem
            44 caracteres, e em caixa alta com `tracking-[1.3px]` isso ocupa três
            linhas numa coluna de 210px. Empilhado em caixa baixa ocupa duas e
            lê como ficha, que é o que o mockup mostra.

            `justify-between` põe o "+" na borda direita DA COLUNA DO RETRATO,
            que é onde o mockup o desenha — alinhado com o cargo, não com o
            nome. */}
        <div className="flex items-center justify-between gap-4 pt-5">
          <div className="min-w-0">
            <h3 className="font-serif text-[20px] font-semibold leading-[1.2] tracking-[-0.2px] text-ink">
              {person.name}
            </h3>
            <p className="mt-1.5 text-[14px] leading-[1.45] text-muted">
              {person.role}
            </p>
            <p className="text-[14px] leading-[1.45] text-muted">
              {person.region}
            </p>
          </div>

          {clipped && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls={quoteId}
              /* O rótulo acessível diz DE QUEM é a quote: numa página com seis
                 botões idênticos, "Expand" seis vezes não navega. */
              aria-label={
                expanded
                  ? `Collapse ${person.name}’s quote`
                  : `Read ${person.name}’s full quote`
              }
              className="flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full border border-brand text-[18px] leading-none text-brand transition-colors hover:bg-brand hover:text-white"
            >
              {/* `aria-hidden` no glifo: quem lê o botão já recebeu o
                  `aria-label`, e "+" lido em voz alta não acrescenta nada. */}
              <span aria-hidden>{expanded ? "−" : "+"}</span>
            </button>
          )}
        </div>
      </div>

      {/* O CARTÃO DA QUOTE. `#fcf2f0` é o `brand` a ~6% sobre branco — o rosa
          pálido do mockup. Não virou token do tema de propósito: é a única
          superfície do site com essa cor, e um `--color-*` novo convida a
          espalhá-la antes de alguém decidir que ela é do sistema.

          `mt-6` até 1440 (o card está empilhado, e este é o vão entre a ficha e
          a quote) e `mt-0` acima, onde ele passa a ser a coluna vizinha e o topo
          tem de bater com o topo do retrato. A altura cheia vem do `stretch` que
          a grade já dá — é o que faz os três cartões da fileira terminarem na
          mesma linha, mesmo com quotes de tamanhos diferentes. */}
      <div className="mt-6 bg-[#fcf2f0] px-6 py-7 min-[1440px]:mt-0 min-[1440px]:px-7">
        {/* AS ASPAS SÃO DECORAÇÃO, não pontuação — daí `aria-hidden`. Se elas
            fossem texto, o leitor de tela anunciaria uma abertura de citação que
            nunca fecha. O `blockquote` abaixo é quem diz que aquilo é uma
            citação, e ele faz isso sem glifo nenhum. */}
        <span
          aria-hidden
          className="font-serif block text-[46px] font-semibold leading-[0.6] text-brand"
        >
          &ldquo;
        </span>
        <blockquote className="mt-4">
          <p
            ref={quoteRef}
            id={quoteId}
            className={`font-serif text-[15px] leading-[1.6] text-ink ${
              expanded ? "" : "line-clamp-[8]"
            }`}
          >
            {person.quote}
          </p>
        </blockquote>
      </div>
    </article>
  );
}
