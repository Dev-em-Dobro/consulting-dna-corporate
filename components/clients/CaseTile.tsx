import Image from "next/image";
import Link from "next/link";
import type { CaseListEntry } from "@/lib/cms/map";

/**
 * O card de case da grade "Case studies" — logo à esquerda, foto à direita,
 * e embaixo o cliente, a métrica e a frase do trabalho. É o desenho da imagem 1
 * do drive, onde os onze cases aparecem lado a lado em vez de empilhados.
 *
 * ⚠️ SUBSTITUI O `ClientBandCard` NESTA PÁGINA. A faixa larga servia a uma
 * lista de cinco em destaque; a grade serve a quinze. O componente antigo
 * continua onde está (a /cases), porque lá a lista é vertical e longa — este
 * não o apaga, escolhe outro formato para outro número de itens.
 *
 * A MÉTRICA LIDERA QUANDO EXISTE, e é a decisão que dá caráter ao card: o
 * mockup dela escreve "88% NPS" e "400+ alumni" em corpo grande sobre a frase
 * descritiva, porque é o número que faz alguém parar. Sem número — e há cases
 * sem, a Ma'aden por exemplo, cuja evidência é qualitativa — o card lidera pela
 * frase e não abre buraco onde o número estaria.
 */
export default function CaseTile({ entry }: { entry: CaseListEntry }) {
  // O que o card diz depois do número. `headline` é a frase de desfecho que a
  // cliente escreveu para o case; `challenge` é o começo da história, e só
  // aparece para os cases antigos, que não têm headline.
  //
  // ⚠️ AS TAGS SÃO O ÚLTIMO RECURSO, e ele é necessário: a Coca-Cola e a Aviva
  // não têm headline, não têm challenge estruturado e não têm métrica — o card
  // saía com o nome do cliente e três linhas de nada, que lê como card
  // quebrado. Os serviços prestados não contam a história, mas dizem algo
  // verdadeiro sobre o trabalho e devolvem peso ao card.
  const line = entry.headline ?? entry.challenge ?? entry.tags.slice(0, 3).join(" · ");

  return (
    <Link
      href={`/cases/${entry.slug}`}
      className="group flex h-full flex-col border border-line bg-white transition-colors duration-300 hover:border-ink"
    >
      <div className="flex items-stretch">
        {/* A COLUNA DO LOGO TEM LARGURA FIXA e a foto ocupa o resto. No desenho
            os dois dividem o topo do card; deixar as duas fluidas faria o logo
            encolher em cards de nome longo e a fileira perderia o alinhamento
            horizontal, que é o que faz onze cards lerem como uma grade. */}
        <div className="flex w-[46%] shrink-0 items-center justify-center px-4 py-5">
          {entry.logoUrl ? (
            <Image
              src={entry.logoUrl}
              alt={entry.client}
              width={140}
              height={56}
              className="h-7 w-auto object-contain md:h-8"
            />
          ) : (
            /* Sem PNG de logo, o nome do cliente em versalete faz o papel —
               continua sendo a identificação, só que tipográfica. */
            <span className="text-center text-[13px] font-semibold uppercase leading-tight tracking-[0.8px] text-ink">
              {entry.client}
            </span>
          )}
        </div>
        <div className="relative w-[54%] self-stretch overflow-hidden bg-paper">
          {entry.coverUrl ? (
            <Image
              src={entry.coverUrl}
              alt=""
              fill
              sizes="(min-width: 1280px) 15vw, (min-width: 768px) 25vw, 45vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            /* ⚠️ NENHUM DOS CASES TEM FOTO HOJE — `coverMediaId` está vazio nos
               quinze, e as imagens são dela (*"that's my job"*). O campo de cor
               segura a proporção do card para a grade não desalinhar quando
               algumas tiverem foto e outras não. */
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-ink text-[44px] font-bold leading-none text-white/[.08]"
            >
              {entry.client.charAt(0)}
            </span>
          )}
        </div>
      </div>

      <div className="flex grow flex-col border-t border-line px-4 pb-5 pt-4">
        <p className="text-[12px] font-semibold uppercase tracking-[1px] text-muted">
          {entry.client}
        </p>
        {entry.metricValue && (
          <p className="mt-2 text-[22px] font-bold leading-none tracking-[-0.6px] text-ink">
            {entry.metricValue}
            {/* O rótulo da métrica vem em corpo pequeno NA MESMA LINHA quando é
                curto ("NPS", "alumni"), como no desenho. Longo demais, quebra
                sozinho — não vale travar em uma linha e cortar. */}
            {entry.metricLabel && (
              <span className="ml-1.5 text-[13px] font-medium tracking-normal text-muted">
                {entry.metricLabel}
              </span>
            )}
          </p>
        )}
        {line && (
          <p className="mt-2.5 line-clamp-3 text-[13.5px] leading-[1.5] text-muted">
            {line}
          </p>
        )}
        <span className="mt-auto pt-4 text-[13px] font-semibold text-ink">
          <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-brand">
            Read the story
          </span>
          <span aria-hidden className="ml-1.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
