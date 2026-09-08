"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { TickerEntry } from "@/lib/cms/map";

/**
 * O cartão de credencial que ALTERNA entre as entradas do ticker.
 *
 * POR QUE ISTO É UM ARQUIVO SEPARADO, contra a regra de duplicação que vale
 * entre as duas propostas. A regra existe para que apagar uma pasta não quebre
 * a outra — `app/page.tsx`, `home-v2` e `home-v3` são cópias por isso, e os
 * comentários de lá dizem que o preço é drift. Este componente não viola a
 * regra: ele é uma FOLHA que as duas importam, então apagar a V2 não encosta na
 * V3 e vice-versa. O que ele evita é justamente o preço — duplicar aqui seria
 * repetir uma timeline GSAP, um gate de preloader e um parse de texto do CMS em
 * dois arquivos, e a primeira correção feita num só já sairia errada no outro.
 *
 * A régua, para quando aparecer o próximo caso: cópia para o que é PROPOSTA
 * (layout, composição, o que está em disputa), arquivo compartilhado para o que
 * é MECANISMO (animação, parse, ciclo de vida). Layout é o que se compara;
 * mecanismo é o que se conserta.
 *
 * O gate vem junto com o mecanismo: a rotação começa quando o preloader abre, e
 * não na montagem. Se rodasse durante o preloader, o visitante chegaria no meio
 * de um cruzamento — ou já teria perdido a primeira credencial sem ver.
 */

/** Quanto cada credencial fica na tela antes de dar lugar à próxima. */
const CREDENTIAL_DWELL_MS = 5000;

/**
 * O par escrito à mão, para quando o CMS não responder. O canto vazio quebraria
 * a composição das duas propostas, que dependem de peso nas quinas.
 */
const FALLBACK = [
  {
    distinction: "Gold",
    year: "2024",
    title:
      "Brandon Hall Best Leadership Development for Talent Acceleration Programme for Asian Leaders",
  },
  {
    distinction: "Gold",
    year: "2023",
    title:
      "Brandon Hall DE&I Award for Best Advance in Leadership Development for Women",
  },
];

/**
 * O texto do ticker vem do CMS numa linha só — "GOLD - <prêmio> <ano>" — porque
 * o `RunningTicker` imprime a entrada inteira e nunca precisou separar as
 * partes. O cartão daqui precisa: ele tem coluna de ano, categoria e título.
 *
 * O parse é DELIBERADAMENTE frouxo e sempre devolve alguma coisa: se o formato
 * mudar no CMS, o pior caso é a linha inteira cair no título, que continua
 * legível. Um cartão feio é melhor que um canto vazio, e muito melhor que uma
 * exceção em componente de cliente.
 *
 * `category` e `date` existem na entrada e são o plano B — o `RunningTicker` não
 * imprime nenhum dos dois (ver o comentário lá), então aqui eles são fonte de
 * dado, não de texto.
 */
function toCredential(entry: TickerEntry) {
  const m = entry.text.match(/^\s*([A-Za-z]+)\s*[-–—]\s*(.+?)\s*(\d{4})\s*$/);
  if (m) return { distinction: m[1], year: m[3], title: m[2] };
  return {
    distinction: entry.category ?? "",
    year: entry.date?.slice(0, 4) ?? "",
    title: entry.text,
  };
}

export default function CyclingCredential({
  entries = [],
  className = "",
}: {
  entries?: TickerEntry[];
  /** Posicionamento fica com quem chama: a V2 e a V3 põem o cartão em lugares
   *  diferentes, e essa diferença é proposta, não mecanismo. */
  className?: string;
}) {
  const scope = useRef<HTMLUListElement>(null);
  const credentials = entries.length ? entries.map(toCredential) : FALLBACK;

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-credential]");
      // Com um item só não há o que alternar — é o caso de um segmento com uma
      // entrada, e o cartão fica estático sem precisar de exceção.
      if (cards.length < 2) return;

      // Anima OPACIDADE e mais nada. Sem deslocamento, sem escala: o cartão mora
      // numa quina, e movimento em quina puxa o olho para longe do título, que é
      // onde as duas composições querem que ele fique. Também é o que a torna
      // aceitável para quem pediu menos movimento — é fade, não deslocamento.
      //
      // O cruzamento é simultâneo (`"<"`), não um fade-out seguido de fade-in:
      // com sequência haveria um instante de caixa VAZIA, e uma moldura de vidro
      // vazia piscando na quina lê como defeito.
      const rotation = gsap.timeline({ repeat: -1, paused: true });
      cards.forEach((card, i) => {
        const next = cards[(i + 1) % cards.length];
        rotation
          .to(
            card,
            { opacity: 0, duration: 0.5, ease: "power2.inOut" },
            `+=${CREDENTIAL_DWELL_MS / 1000}`
          )
          .to(next, { opacity: 1, duration: 0.5, ease: "power2.inOut" }, "<");
      });
      // A última volta apaga o último cartão e acende o primeiro, ou seja o fim
      // da timeline é idêntico ao começo. É isso que faz o `repeat: -1` emendar
      // sem salto.

      let begun = false;
      const begin = () => {
        if (begun) return;
        begun = true;
        window.clearTimeout(gate);
        window.removeEventListener("app:ready", begin);
        rotation.play();
      };
      // Mesmo teto de 10s que os heróis usam: se o evento do preloader não vier
      // por qualquer motivo, a rotação começa sozinha em vez de nunca começar.
      const gate = window.setTimeout(begin, 10000);
      if (window.__appReady) {
        begin();
      } else {
        window.addEventListener("app:ready", begin, { once: true });
      }

      return () => {
        window.clearTimeout(gate);
        window.removeEventListener("app:ready", begin);
        rotation.kill();
      };
    },
    { scope }
  );

  return (
    /* AS CREDENCIAIS FICAM TODAS NO DOM, EMPILHADAS, e a rotação só troca qual
       está opaca. Podia ser estado de React trocando o item renderizado; não é,
       por três motivos:

       1. ALTURA. Os títulos têm comprimentos bem diferentes, e trocar o conteúdo
          faria a caixa pular de altura a cada 5 segundos. Empilhadas na mesma
          célula de grid, ela nasce da altura do MAIOR e não se mexe mais.
       2. LEITOR DE TELA. Com todas presentes, quem usa leitor recebe a lista
          inteira de uma vez e ninguém precisa esperar o carrossel dar a volta.
          Por isso também não há `aria-live`: não é conteúdo que chega, é
          conteúdo que já está.
       3. A animação roda no GSAP em vez de re-renderizar o React a cada 5s.

       `grid` + tudo em `col-start-1 row-start-1` é o empilhamento sem
       `absolute`: com posicionamento absoluto os itens sairiam do fluxo e a
       caixa perderia a altura, que é justamente o que se quer preservar. */
    <ul
      ref={scope}
      className={`grid border border-white/15 bg-black/45 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.10)] backdrop-blur-md ${className}`}
    >
      {credentials.map((c, i) => (
        <li
          key={`${c.year}-${c.title}`}
          data-credential={i}
          className="col-start-1 row-start-1 flex items-stretch"
          // Só a primeira nasce visível. As outras entram pela timeline; sem JS
          // a primeira fica, que é o comportamento certo sem animação.
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          {/* A COLUNA ESTREITA CARREGA O ANO, E SÓ ELE.
              Ela nasceu com distinção em cima e ano embaixo, e isso funcionava
              enquanto a distinção era escrita à mão e dizia sempre "Gold".
              Ligada ao ticker, ela passou a receber a CATEGORIA do CMS — "New
              partnerships", "New regions", "New offices" — e aí quebrou,
              medido: a coluna tinha 84px, menos `px-4` dos dois lados sobravam
              52px úteis, e "partnerships" sozinha ocupa 104px a 11px com
              tracking de 2px. É UMA PALAVRA SÓ: não tem onde quebrar linha,
              então vazava para fora da coluna. "New regions" (62px) e "New
              offices" (58px) também não cabiam, mas por serem duas palavras
              quebravam em duas linhas e disfarçavam o problema.

              Encolher a fonte não resolve: para "partnerships" caber em 52px
              seria preciso ~5,5px de corpo. Alargar a coluna também não —
              qualquer largura escolhida hoje é refém da próxima categoria que o
              cliente cadastrar.

              Então o conteúdo trocou de lado. O ANO tem quatro dígitos hoje,
              amanhã e sempre: é o único campo com largura garantida, e é ele que
              merece a coluna fixa. A categoria foi para o lado largo, onde
              cabe. */}
          <div className="flex w-[72px] shrink-0 flex-col justify-center border-r border-white/10 px-4 py-4">
            <span className="text-[12px] tabular-nums text-white/55">
              {c.year}
            </span>
          </div>
          <div className="self-center px-4 py-4">
            {/* A categoria só aparece se existir: no caminho de fallback do
                parse ela pode vir vazia, e um eyebrow vazio deixaria um buraco
                de linha em cima do título. */}
            {c.distinction ? (
              <span className="block text-[11px] font-semibold uppercase tracking-[2px] text-[#f4796d]">
                {c.distinction}
              </span>
            ) : null}
            <p
              className={`line-clamp-3 text-[12px] leading-[1.5] text-white/80 ${c.distinction ? "mt-1.5" : ""}`}
            >
              {c.title}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
